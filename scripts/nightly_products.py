"""Exact product/variant prices, locally hosted photos and discovery for review."""
import copy
import hashlib
import io
import json
import re
import xml.etree.ElementTree as ET
from urllib.parse import urlparse, urljoin, urlencode, urlunparse, parse_qs
from PIL import Image, ImageOps
from nightly_html import Page, norm, walk

def canonical(url):
    parts = urlparse(url)
    return urlunparse((parts.scheme, parts.netloc.lower().removeprefix('www.'), parts.path.rstrip('/'), '', '', ''))

def origin(url):
    p = urlparse(url)
    return p.scheme + '://' + p.netloc

def image_url(value, page_url):
    if isinstance(value, list):
        value = value[0] if value else None
    if isinstance(value, dict):
        value = value.get('src') or value.get('url') or value.get('contentUrl')
    return urljoin(page_url, value) if isinstance(value, str) else None

def exact_product(item, product):
    # A title match must include the same colour, quantity and model.
    target, actual = norm(item['name']), norm(product.get('name', ''))
    if target == actual:
        return True
    sku = item.get('sku')
    return bool(sku and str(sku) == str(product.get('sku')))

def offer_price(product):
    offers = product.get('offers', [])
    offers = offers if isinstance(offers, list) else [offers]
    options = []
    for offer in offers:
        if not isinstance(offer, dict) or offer.get('priceCurrency') != 'GBP':
            continue
        # Never substitute the low price of a group of different variants.
        if 'price' not in offer or offer.get('@type') == 'AggregateOffer':
            continue
        try:
            price = float(offer['price'])
        except (ValueError, TypeError):
            continue
        if price > 0:
            options.append((price, offer.get('availability', '')))
    if len(set(options)) != 1:
        raise ValueError('No single GBP offer for the exact product')
    return options[0]

def shopify(reader, url, variant_id=None, check_currency=True):
    endpoint = canonical(url) + '.js'
    product = reader.json(endpoint)
    if not isinstance(product, dict) or not product.get('variants'):
        raise ValueError('No Shopify product variants')
    currency = product.get('currency')
    if currency is None and check_currency:
        base = origin(url)
        locale = re.match(r'^/([a-z]{2}(?:-[a-z]{2})?)/products/', urlparse(url).path, re.I)
        cart_url = base + ('/' + locale[1] if locale else '') + '/cart.js'
        currency = reader.json(cart_url).get('currency')
    variants = product['variants']
    matches = [v for v in variants if str(v['id']) == str(variant_id)] if variant_id else variants
    if len(matches) != 1:
        raise ValueError('Exact Shopify variant ID required; refusing a default variant price')
    variant = matches[0]
    cents = variant.get('price')
    if isinstance(cents, bool) or not isinstance(cents, int):
        raise ValueError('Shopify AJAX price unit is not integer pence')
    photo = image_url(variant.get('featured_image') or (product.get('featured_image') if len(variants) == 1 else None), url)
    return {'name': product['title'], 'variantTitle': variant.get('title'), 'variantId': variant['id'],
            'price': cents/100, 'currency': currency, 'available': variant.get('available'), 'image': photo,
            'url': url, 'sku': variant.get('sku'), 'grams': variant.get('grams'), 'brand': product.get('vendor'),
            'type': product.get('type'), 'description': product.get('description', ''),
            'options': product.get('options', []), 'variantOptions': [variant.get('option1'),variant.get('option2'),variant.get('option3')]}

def refresh_photo(item, url, source_url, reader, root):
    if not url:
        raise ValueError('No verified product image URL')
    raw = reader.get(url, limit=12000000)[0]
    with Image.open(io.BytesIO(raw)) as image:
        if image.width < 80 or image.height < 80 or image.width*image.height > 50000000:
            raise ValueError('Image is too small or exceeds the pixel limit')
        image = ImageOps.exif_transpose(image)
        image.thumbnail((1000, 1000))
        image = image.convert('RGBA')
        output = io.BytesIO()
        image.save(output, 'WEBP', quality=90, method=4)
    content = output.getvalue()
    digest = hashlib.sha256(content).hexdigest()
    identifier = re.sub(r'[^a-zA-Z0-9_-]', '-', item['id'])
    relative = 'assets/products/' + identifier + '-' + digest[:12] + '.webp'
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_bytes(content)
    changed = item.get('image') != relative
    item.update(image=relative, imageOriginalUrl=url, imageSourceUrl=source_url,
                imageSha256=digest, imageStatus='available', imageAutoRefresh=False)
    return changed

def locator_for(item, config):
    return config['productLocators'].get(item['id'], {'priceUrl': item['url'], 'imageUrl': item.get('imageOriginalUrl')})

def refresh_item(item, config, reader, root, today, queue, report):
    locator = locator_for(item, config)
    price_url = locator.get('priceUrl') or item['url']
    item['lastAttempt'] = today
    try:
        retailer = next((s for s in data_sources(config) if s['name'] == item.get('retailer')), None)
        if not retailer or urlparse(price_url).hostname not in retailer['allowedHosts']:
            raise ValueError('Price URL does not belong to the recorded UK retailer')
        if locator.get('variantId'):
            record = shopify(reader, price_url, locator['variantId'])
            if locator.get('expectedVariantTitle') and norm(record['variantTitle']) != norm(locator['expectedVariantTitle']):
                raise ValueError('Recorded variant title changed; review the colour/pack before updating')
            if locator.get('expectedProductTitle') and norm(record['name']) != norm(locator['expectedProductTitle']):
                raise ValueError('Recorded model title changed; product identity needs review')
            if record['currency'] != 'GBP':
                raise ValueError('Retailer did not return GBP for this exact variant')
            price, availability = record['price'], record['available']
            photo = record.get('image')
        else:
            html, final_url = reader.text(price_url)
            products = [product for product in Page(html).products if exact_product(item, product)]
            if len(products) != 1:
                raise ValueError('Exact model/colour/pack product offer unavailable on the recorded page')
            price, availability = offer_price(products[0])
            photo = image_url(products[0].get('image'), final_url)
        old = float(item['price']) if item.get('price') is not None else None
        if price <= 0 or price > 100000:
            raise ValueError('Price outside supported GBP range')
        proposal = {'productId': item['id'], 'oldPrice': old, 'price': price, 'url': price_url, 'currency': 'GBP'}
        review_key = queue.key('price-change', item['id'], proposal)
        approved = config['reviewDecisions'].get(review_key) == 'approve'
        if old and (price < old * 0.5 or price > old * 2) and not approved and config.get('newProducts') != 'automatic-verified':
            queue('price-change', item['id'], proposal)
            item['lastCheckStatus'] = 'price-change-review'
            report['issues'].append({'area': 'product', 'id': item['id'], 'message': 'Large price change held for review'})
        else:
            if old != round(price, 2):
                report['priceChanges'].append({'id': item['id'], 'old': old, 'new': round(price, 2)})
            history = item.setdefault('priceHistory', [])
            if not history or history[-1].get('date') != today or history[-1].get('price') != round(price, 2):
                history.append({'date': today, 'price': round(price, 2)})
                item['priceHistory'] = history[-90:]
            stock = 'In stock' if availability is True or str(availability).endswith('/InStock') else 'Out of stock' if availability is False or str(availability).endswith('/OutOfStock') else 'Check retailer'
            item.update(price=round(price, 2), updated=today, lastCheckStatus='ok', priceSourceUrl=price_url,
                        availability=stock)
            if item.get('weightGrams'):
                item['unit'] = round(price*1000/float(item['weightGrams']), 2)
        # A variant-specific product photo may refresh only when the price/identity was matched.
        if photo:
            locator['imageUrl'] = photo
            locator['imageSourceUrl'] = price_url
    except Exception as exc:
        item['lastCheckStatus'] = 'retained-unverified'
        report['issues'].append({'area': 'product', 'id': item['id'], 'message': str(exc)})
    try:
        # Selected source photos can still be checked when price sources are blocked.
        photo = locator.get('imageUrl') or item.get('imageOriginalUrl')
        if locator.get('imageVariantId') and locator.get('imageSourceUrl'):
            photo = shopify(reader, locator['imageSourceUrl'], locator['imageVariantId'], check_currency=False).get('image') or photo
        if not photo:
            raise ValueError('Exact product identity/photo needs review')
        if refresh_photo(item, photo, locator.get('imageSourceUrl') or item.get('imageSourceUrl') or price_url, reader, root):
            report['imageChanges'].append(item['id'])
        item['imageChecked'] = today
        item['imageSearchStatus'] = 'matched'
        item['lastImageCheckStatus'] = 'ok'
    except Exception as exc:
        item['lastImageCheckStatus'] = 'retained-unverified'
        report['issues'].append({'area': 'image', 'id': item['id'], 'message': str(exc)})

def relevant(name):
    lower = name.lower()
    return bool(re.search(r'filament|\b(?:pla|petg|abs|asa|tpu|resin)\b|3d.?printer', lower)) and not bool(re.search(r'nozzle|hotend|extruder|cover|plate|replacement|spare', lower))

def data_sources(config):
    return config['retailers'].values()

def candidate_id(source, url, variant=''):
    return 'candidate-' + hashlib.sha256((source + '|' + canonical(url) + '|' + str(variant)).encode()).hexdigest()[:20]

def discovery(data, config, reader, report, queue):
    known_urls = {canonical(item['url']) for item in data['products']}
    known_urls.update(canonical(l['priceUrl']) for l in config['productLocators'].values() if l.get('priceUrl'))
    known_urls.update(canonical(i['imageSourceUrl']) for i in data['products'] if i.get('imageSourceUrl'))
    for source in data['sources']:
        source_id = source['id']
        setup = config['retailers'][source_id]
        health = {'id': source_id, 'name': source['name'], 'checkedAt': report['checkedAt'], 'candidates': 0}
        try:
            if setup.get('catalogUrl'):
                completed = False
                for page in range(1, config['maxCatalogPages'] + 1):
                    records = reader.json(setup['catalogUrl'] + '?limit=250&page=' + str(page))['products']
                    if not records:
                        completed = True
                        break
                    for product in records:
                        if not relevant(product.get('title', '') + ' ' + product.get('product_type', '')):
                            continue
                        url = urljoin(setup['productBase'], 'products/' + product['handle'])
                        if canonical(url) in known_urls:
                            continue
                        # Discovery offers stay unverified until accepted and refreshed in GBP.
                        for variant in product.get('variants', []):
                            name = product['title'] + (' — ' + variant['title'] if variant.get('title') != 'Default Title' else '')
                            identifier = candidate_id(source_id, url, variant['id'])
                            category = 'filament' if re.search(r'filament|\b(?:pla|petg|abs|asa|tpu|resin)\b', product.get('product_type', '') + ' ' + name, re.I) else 'printer'
                            queue('new-product', identifier, {'id': identifier, 'sourceId': source_id, 'name': name, 'brand': product.get('vendor', ''),
                                  'retailer': source['name'], 'url': url, 'variantId': variant['id'], 'category': category,
                                  'type': product.get('product_type', ''), 'colour': variant.get('option1', ''),
                                  'image': image_url(variant.get('featured_image') or product.get('image'), url),
                                  'catalogPrice': variant.get('price'), 'currency': 'unverified',
                                  'shippingWeightGrams': variant.get('grams'), 'weightGrams': None, 'pack': variant.get('title', ''),
                                  'note': 'Review model, pack size, colour and relevance. Price must be confirmed in GBP before publication.'})
                            health['candidates'] += 1
                health['status'] = 'discovered' if completed else 'partial-catalog'
                if not completed:
                    report['issues'].append({'area': 'discovery', 'id': source_id, 'message': 'Catalog page limit reached; remaining products not scanned'})
            else:
                # Public sitemaps expose URLs without downloading every catalog page.
                sitemap = setup.get('sitemap') or origin(source['url']) + '/sitemap.xml'
                raw = reader.get(sitemap)[0]
                document = ET.fromstring(raw)
                urls = [node.text for node in document.iter() if node.tag.endswith('loc') and node.text]
                if document.tag.endswith('sitemapindex'):
                    children = [u for u in urls if re.search(r'product|shop|catalog', u, re.I)]
                    if not children:
                        raise ValueError('No product sitemap identified; source needs a discovery adapter')
                    urls = []
                    for child in children[:config['maxSitemaps']]:
                        child_document = ET.fromstring(reader.get(child)[0])
                        urls += [n.text for n in child_document.iter() if n.tag.endswith('loc') and n.text]
                    if len(children) > config['maxSitemaps']:
                        report['issues'].append({'area': 'discovery', 'id': source_id, 'message': 'Sitemap limit reached; partial scan'})
                for url in urls:
                    slug = urlparse(url).path.split('/')[-1]
                    if canonical(url) in known_urls or not relevant(slug.replace('-', ' ')):
                        continue
                    identifier = candidate_id(source_id, url)
                    queue('new-product', identifier, {'id': identifier, 'sourceId': source_id, 'url': url, 'name': slug.replace('-', ' '),
                          'retailer': source['name'], 'category': None, 'note': 'Discovered URL. Open the source and complete the exact model, category, colour and pack before approving.'})
                    health['candidates'] += 1
                health['status'] = 'url-discovery-only'
        except Exception as exc:
            health.update(status='failed', message=str(exc))
            report['issues'].append({'area': 'discovery', 'id': source_id, 'message': str(exc)})
        report['retailers'].append(health)

def material_weight(*texts):
    """Read pack mass, never shipping mass. Prefer exact variant text."""
    for text in texts:
        clean = Page(str(text or '')).text
        matches = re.findall(r'(?<![\d.])(\d+(?:\.\d+)?)\s*(kg|g)\b', clean, re.I)
        if not matches:
            continue
        grams = {float(number)*(1000 if unit.lower() == 'kg' else 1) for number, unit in matches}
        if len(grams) != 1:
            raise ValueError('Pack weight is ambiguous; listing skipped')
        mass = grams.pop()
        multipliers = {int(n) for n in re.findall(r'\b(?:pack of|bundle of|set of)\s*(\d+)\b', clean, re.I)}
        multipliers.update(int(n) for n in re.findall(r'\b(\d+)\s*[x×*]\s*\d+(?:\.\d+)?\s*(?:kg|g)\b', clean, re.I))
        multipliers.update(int(n) for n in re.findall(r'\d+(?:\.\d+)?\s*(?:kg|g)\s*[x×*]\s*(\d+)\b', clean, re.I))
        multipliers.update(int(n) for n in re.findall(r'\b(\d+)\s*(?:rolls|spools|bottles|packs)\b', clean, re.I))
        if len(multipliers) > 1:
            raise ValueError('Pack quantity is ambiguous; listing skipped')
        mass *= next(iter(multipliers), 1)
        if not 0 < mass < 100000:
            raise ValueError('Pack weight outside the supported range')
        return mass
    raise ValueError('Source does not state the material pack weight; listing skipped')

def automatic_details(candidate, record):
    variant = record.get('variantTitle') or ''
    title = record['name']
    material = re.search(r'\b(PLA\+|PLA(?:[- ]?(?:CF|Plus))?|PETG(?:[- ]?CF)?|ABS|ASA|TPU|PET|Nylon|Resin)\b', title, re.I)
    printer = re.search(r'3d.?printer', title + ' ' + str(record.get('type') or ''), re.I)
    if not material and not printer:
        raise ValueError('Cannot confirm that the product is a material or printer')
    candidate['category'] = 'filament' if material and not printer else 'printer'
    candidate['name'] = title + (' — ' + variant if variant != 'Default Title' else '')
    candidate['brand'] = record.get('brand') or candidate.get('brand', '')
    candidate['type'] = material[1].upper() if candidate['category'] == 'filament' else record.get('type') or '3D Printer'
    for index, option in enumerate(record.get('options', [])):
        label = option.get('name', '') if isinstance(option, dict) else str(option)
        if norm(label) in ('colour', 'color') and index < len(record['variantOptions']):
            candidate['colour'] = record['variantOptions'][index] or ''
    if candidate['category'] == 'filament':
        candidate['weightGrams'] = material_weight(variant, variant+' '+title, variant+' '+record.get('description',''))
        candidate['pack'] = format(candidate['weightGrams']/1000, 'g') + ' kg'
    else:
        candidate['pack'] = variant if variant != 'Default Title' else 'See retailer specifications'

def add_approved(data, config, queue, reader, root, report):
    automatic = config.get('newProducts') == 'automatic-verified'
    existing = {item['id'] for item in data['products']}
    for entry in list(queue.entries.values()):
        if entry['kind'] != 'new-product' or entry['status'] in ('published','superseded','rejected') or (not automatic and config['reviewDecisions'].get(entry['reviewId']) != 'approve'):
            continue
        candidate = copy.deepcopy(entry['proposal'])
        candidate.update(config.get('approvedProductDetails', {}).get(entry['reviewId'], {}))
        if candidate['id'] in existing:
            continue
        try:
            source = config['retailers'][candidate['sourceId']]
            if urlparse(candidate['url']).hostname not in source['allowedHosts']:
                raise ValueError('Approved URL is outside its recorded retailer')
            if candidate.get('variantId'):
                record = shopify(reader, candidate['url'], candidate['variantId'])
                if record['currency'] != 'GBP':
                    raise ValueError('Approved listing still has no verified GBP offer')
                price, photo = record['price'], record['image']
                if automatic:
                    automatic_details(candidate, record)
            else:
                html, final_url = reader.text(candidate['url'])
                if automatic:
                    products = Page(html).products
                    matches = [p for p in products if isinstance(p.get('url'), str) and canonical(urljoin(final_url,p['url'])) == canonical(final_url)]
                    if not matches and len(products) == 1 and '/products/' in final_url:
                        matches = products
                    if len(matches) != 1:
                        raise ValueError('Cannot confirm one product on the discovered URL')
                    product = matches[0]
                    brand = product.get('brand') or {}
                    automatic_details(candidate, {'name': product.get('name', ''), 'brand': brand.get('name') if isinstance(brand,dict) else brand,
                        'variantTitle':'Default Title', 'type':product.get('category', ''), 'description':product.get('description', ''), 'options':[], 'variantOptions':[]})
                    candidate['sku'] = product.get('sku')
                matches = [p for p in Page(html).products if exact_product(candidate, p)]
                if len(matches) != 1:
                    raise ValueError('Approved title does not match one exact structured product')
                price = offer_price(matches[0])[0]
                photo = image_url(matches[0].get('image'), final_url)
            if candidate.get('category') not in ('printer','filament'):
                raise ValueError('Product category is not confirmed')
            if candidate['category'] == 'filament' and not 0 < float(candidate.get('weightGrams') or 0) < 100000:
                raise ValueError('Exact material pack weight is not confirmed')
            if not 0 < price < 100000:
                raise ValueError('Invalid GBP product price')
            candidate.update(price=round(price, 2), updated=report['checkedAt'][:10], currency='GBP',
                             autoRefresh=True, lastCheckStatus='ok', lastAttempt=report['checkedAt'][:10], priceHistory=[{'date': report['checkedAt'][:10], 'price': round(price, 2)}])
            if candidate['category'] == 'filament':
                candidate['unit'] = round(price*1000/float(candidate['weightGrams']), 2)
            refresh_photo(candidate, photo, candidate['url'], reader, root)
            data['products'].append(candidate)
            config['productLocators'][candidate['id']] = {'priceUrl': candidate['url'], 'variantId': candidate.get('variantId'), 'imageUrl': photo,
                                                        'expectedProductTitle': record['name'] if candidate.get('variantId') else None,
                                                        'expectedVariantTitle': record['variantTitle'] if candidate.get('variantId') else None}
            existing.add(candidate['id'])
            entry['status'] = 'published'
            report['addedProducts'].append(candidate['id'])
        except Exception as exc:
            if automatic:
                entry['status'] = 'skipped-unverified'
            report['issues'].append({'area': 'new-product', 'id': candidate['id'], 'message': str(exc)})
