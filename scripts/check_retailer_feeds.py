"""Regression checks for currency, exact variants, units and source access."""
import unittest
import urllib.error
from pathlib import Path
import nightly_catalogues as catalogues
from nightly_products import shopify, refresh_item, offer_price
from nightly_update import ReviewQueue


class FakeReader:
    def __init__(self, variants=None):
        source = {'allowedHosts': ['retailer.example'], 'productBase': 'https://retailer.example/'}
        product = {'title': 'PLA Basic', 'variants': variants or [{'id': 11, 'title': 'Black / 1kg', 'price': '14.95', 'available': True}],
                   'images': [{'src': 'https://retailer.example/black.png', 'variant_ids': [11]}]}
        self.catalogues = [{'source': source, 'complete': True, 'currency': 'GBP',
            'byVariant': {str(v['id']): (product, v, 'https://retailer.example/products/new-handle') for v in product['variants']},
            'byUrl': {'https://retailer.example/products/new-handle': product}}]

    def json(self, url):
        raise AssertionError('An indexed variant must not download another product/cart')


class FeedChecks(unittest.TestCase):
    def test_native_gbp_required(self):
        self.assertEqual(catalogues.storefront_currency('Shopify.currency = {"active":"GBP","rate":"1.0"};'), 'GBP')
        for html in ['Shopify.currency={"active":"USD","rate":"1.0"};',
                     'Shopify.currency={"active":"GBP","rate":"0.75"};', '<p>£14.95</p>']:
            with self.assertRaises(ValueError):
                catalogues.storefront_currency(html)

    def test_bulk_prices_are_gbp_not_pence(self):
        record = shopify(FakeReader(), 'https://retailer.example/products/old-handle', 11)
        self.assertEqual(record['price'], 14.95)
        self.assertEqual(record['variantId'], 11)
        self.assertEqual(record['image'], 'https://retailer.example/black.png')

    def test_default_variant_is_rejected(self):
        reader = FakeReader([{'id': 11, 'price': '14.95'}, {'id': 12, 'price': '29.90'}])
        with self.assertRaises(ValueError):
            shopify(reader, 'https://retailer.example/products/new-handle')

    def test_printer_bundle_offer_needs_exact_sku(self):
        product = {'offers': [
            {'@type': 'Offer', 'priceCurrency': 'GBP', 'price': 449, 'sku': 'combo'},
            {'@type': 'Offer', 'priceCurrency': 'GBP', 'price': 339, 'sku': 'printer'}]}
        with self.assertRaises(ValueError):
            offer_price(product)
        self.assertEqual(offer_price(product, 'printer')[0], 339)
        with self.assertRaises(ValueError):
            offer_price(product, 'unknown')

    def test_missing_variant_and_other_store_are_rejected(self):
        with self.assertRaises(ValueError):
            shopify(FakeReader(), 'https://retailer.example/products/old-handle', 99)
        self.assertIsNone(catalogues.record(FakeReader(), 'https://other.example/products/new-handle', 11))

    def test_changed_title_retains_previous_price(self):
        item = {'id': 'one', 'name': 'PLA', 'retailer': 'Retailer', 'url': 'https://retailer.example/products/old-handle', 'price': 20}
        loc = {'priceUrl': item['url'], 'variantId': 11, 'expectedProductTitle': 'PETG', 'expectedVariantTitle': 'Black / 1kg'}
        config = {'productLocators': {'one': loc}, 'retailers': {'r': {'name': 'Retailer', 'allowedHosts': ['retailer.example']}}, 'reviewDecisions': {}, 'skipImages': True}
        report = {'issues': [], 'priceChanges': [], 'imageChanges': []}
        refresh_item(item, config, FakeReader(), Path.cwd(), '2026-10-13', ReviewQueue([], {}, 'now'), report)
        self.assertEqual(item['price'], 20)
        self.assertEqual(item['lastCheckStatus'], 'retained-unverified')

    def test_variant_id_survives_handle_change(self):
        item = {'id': 'one', 'name': 'PLA', 'retailer': 'Retailer', 'url': 'https://retailer.example/products/old-handle', 'price': 20, 'weightGrams': 1000}
        loc = {'priceUrl': item['url'], 'variantId': 11, 'expectedProductTitle': 'PLA Basic', 'expectedVariantTitle': 'Black / 1kg'}
        config = {'productLocators': {'one': loc}, 'retailers': {'r': {'name': 'Retailer', 'allowedHosts': ['retailer.example']}}, 'reviewDecisions': {}, 'skipImages': True}
        report = {'issues': [], 'priceChanges': [], 'imageChanges': []}
        refresh_item(item, config, FakeReader(), Path.cwd(), '2026-10-13', ReviewQueue([], {}, 'now'), report)
        self.assertEqual(item['price'], 14.95)
        self.assertEqual(item['url'], 'https://retailer.example/products/new-handle')
        self.assertEqual(item['lastCheckStatus'], 'ok')

    def test_removed_offer_keeps_history_but_leaves_current_results(self):
        class MissingReader(FakeReader):
            def text(self, url):
                raise urllib.error.HTTPError(url, 404, 'Not Found', {}, None)
        item = {'id': 'one', 'name': 'PLA', 'retailer': 'Retailer', 'url': 'https://retailer.example/products/old-handle', 'price': 20,
                'priceHistory': [{'date': '2026-10-12', 'price': 20}]}
        config = {'productLocators': {'one': {'priceUrl': item['url'], 'variantId': 99}},
                  'retailers': {'r': {'name': 'Retailer', 'allowedHosts': ['retailer.example']}}, 'reviewDecisions': {}, 'skipImages': True}
        report = {'issues': [], 'priceChanges': [], 'imageChanges': []}
        refresh_item(item, config, MissingReader(), Path.cwd(), '2026-10-13', ReviewQueue([], {}, 'now'), report)
        self.assertTrue(item['sourceUnavailable'])
        self.assertEqual(item['priceHistory'], [{'date': '2026-10-12', 'price': 20}])
        from build_compare_catalogue import build_catalogue
        summary, history = build_catalogue({'products': [item]})
        self.assertEqual(summary['products'], [])


if __name__ == '__main__':
    unittest.main()
