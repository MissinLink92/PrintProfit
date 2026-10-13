"""Share verified public Shopify catalogues between price checks and discovery."""
import json
import re
from decimal import Decimal, InvalidOperation
from urllib.parse import urljoin, urlparse, urlunparse


class VariantMissing(ValueError):
    """A complete current catalogue no longer contains a recorded exact variant."""


def canonical(url):
    p = urlparse(url)
    return urlunparse((p.scheme, p.netloc.lower().removeprefix('www.'), p.path.rstrip('/'), '', '', ''))


def storefront_currency(html):
    matches = re.findall(r'Shopify\.currency\s*=\s*(\{[^;]+\})\s*;', html)
    values = [json.loads(value) for value in matches]
    currencies = {(v.get('active'), str(v.get('rate'))) for v in values}
    if len(currencies) != 1:
        raise ValueError('Public storefront currency is missing or ambiguous')
    currency, rate = currencies.pop()
    if currency != 'GBP' or Decimal(rate) != 1:
        raise ValueError('Public catalogue does not quote native GBP prices')
    return currency


def prepare(config, reader, report):
    reader.catalogues = []
    for key, source in config['retailers'].items():
        if not source.get('catalogUrl') or source.get('monitorOnly'):
            continue
        feed = {'id': key, 'source': source, 'products': [], 'byVariant': {}, 'byUrl': {}, 'complete': False}
        reader.catalogues.append(feed)
        try:
            html, final_url = reader.text(source.get('currencyUrl') or source['productBase'])
            if urlparse(final_url).hostname not in source['allowedHosts']:
                raise ValueError('Storefront redirected outside the recorded retailer')
            feed['currency'] = storefront_currency(html)
            for page in range(1, config['maxCatalogPages'] + 1):
                separator = '&' if '?' in source['catalogUrl'] else '?'
                endpoint = source['catalogUrl'] + separator + 'limit=250&page=' + str(page)
                document = reader.json(endpoint)
                if urlparse(reader.get(endpoint)[2]).hostname not in source['allowedHosts']:
                    raise ValueError('Catalogue redirected outside the recorded retailer')
                products = document.get('products') if isinstance(document, dict) else None
                if not isinstance(products, list):
                    raise ValueError('Public catalogue did not return a product list')
                if not products:
                    feed['complete'] = True
                    break
                for product in products:
                    url = urljoin(source['productBase'], 'products/' + product['handle'])
                    feed['products'].append(product)
                    feed['byUrl'][canonical(url)] = product
                    for variant in product.get('variants', []):
                        variant_id = str(variant['id'])
                        if variant_id in feed['byVariant']:
                            raise ValueError('Duplicate variant ID in retailer feed')
                        feed['byVariant'][variant_id] = (product, variant, url)
            if not feed['complete']:
                report['issues'].append({'area': 'discovery', 'id': key, 'message': 'Catalogue page limit reached; partial scan'})
        except Exception as exc:
            feed['error'] = str(exc)
            report['issues'].append({'area': 'catalogue', 'id': key, 'message': str(exc)})


def feed_for(reader, url):
    host = urlparse(url).hostname
    return next((feed for feed in getattr(reader, 'catalogues', [])
                 if host in feed['source']['allowedHosts']), None)


def record(reader, url, variant_id=None):
    feed = feed_for(reader, url)
    if feed is None or feed.get('error'):
        return None
    if variant_id:
        match = feed['byVariant'].get(str(variant_id))
        if match is None:
            if feed['complete']:
                raise VariantMissing('Exact variant no longer appears in the retailer catalogue')
            return None
        product, variant, current_url = match
    else:
        product = feed['byUrl'].get(canonical(url))
        if product is None:
            return None
        variants = product.get('variants', [])
        if len(variants) != 1:
            raise ValueError('Exact Shopify variant ID required; refusing a default variant price')
        variant, current_url = variants[0], url
    try:
        price = Decimal(str(variant['price']))
        if not price.is_finite() or not 0 < price <= 100000:
            raise ValueError('Catalogue GBP price outside supported range')
    except (InvalidOperation, KeyError) as exc:
        raise ValueError('Invalid catalogue price') from exc
    images = product.get('images', [])
    exact_images = [image for image in images if str(variant['id']) in [str(v) for v in image.get('variant_ids', [])]]
    photo = exact_images[0].get('src') if exact_images else None
    if not photo and len(product.get('variants', [])) == 1:
        photo = (product.get('image') or (images[0] if images else {})).get('src')
    return {'name': product['title'], 'variantTitle': variant.get('title'), 'variantId': variant['id'],
            'price': float(price), 'currency': feed['currency'], 'available': variant.get('available'),
            'image': photo, 'url': current_url, 'sku': variant.get('sku'), 'grams': variant.get('grams'),
            'brand': product.get('vendor'), 'type': product.get('product_type'),
            'description': product.get('body_html', ''), 'options': product.get('options', []),
            'variantOptions': [variant.get('option1'), variant.get('option2'), variant.get('option3')]}
