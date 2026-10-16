"""Regression checks for currency, exact variants, units and source access."""
import unittest
import urllib.error
from unittest.mock import patch
from pathlib import Path
import nightly_catalogues as catalogues
from nightly_html import Page
from nightly_references import folksy_commission, stripe_standard_uk
from nightly_products import shopify, refresh_item, offer_price, add_approved, discovery, fair_discovery_entries, automatic_details, relevant, material_weight
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
    def test_material_families_before_more_colours(self):
        entries = [{'kind':'new-product','status':'pending','proposal':{'sourceId':'one','name':name,'url':url}}
                   for name,url in [('PLA Black 1kg','https://example.com/pla'),('PLA White 1kg','https://example.com/pla'),('Resin Grey 1kg','https://example.com/resin')]]
        names = [e['proposal']['name'] for e in fair_discovery_entries(entries)]
        self.assertEqual(names[:2], ['PLA Black 1kg','Resin Grey 1kg'])

    def test_engineering_materials_and_resin_identity(self):
        for title,kind in [('PC-FR Filament 1kg','PC-FR'),('PCTG 1kg','PCTG'),('PVA 500g','PVA'),('ABS-Like Resin 1kg','RESIN')]:
            self.assertTrue(relevant(title))
            candidate = {}
            automatic_details(candidate, {'name':title,'variantTitle':'Grey','type':'Filament','options':[],'variantOptions':[]})
            self.assertEqual(candidate['type'],kind)
        for title in ['Resin tank 1kg','PLA Filament dryer','PETG nozzle replacement']:
            self.assertFalse(relevant(title))

    def test_material_for_3d_printers_is_not_a_printer(self):
        candidate = {}
        automatic_details(candidate, {'name':'PLA 3D Printer Filament 1kg','variantTitle':'Red','type':'Filament','options':[],'variantOptions':[]})
        self.assertEqual(candidate['category'],'filament')
        self.assertEqual(candidate['weightGrams'],1000)
        bundled = {}
        automatic_details(bundled, {'name':'Neptune 4 3D Printer with PLA Filament','variantTitle':'Black','type':'3D Printers','options':[],'variantOptions':[]})
        self.assertEqual(bundled['category'],'printer')

    def test_net_material_weight_ignores_empty_spool_and_shipping_mass(self):
        self.assertEqual(material_weight('Grey', 'PLA', 'Filament weight: 1 kg/spool. Empty spool weight: 154 g. Shipping weight: 1.3 kg.'), 1000)
        self.assertEqual(material_weight('5 rolls Net weight: 1 kg/spool. Empty spool: 154 g.'), 5000)
        self.assertEqual(material_weight('1 kg / Grey','Net weight: 2kg'), 1000)
        with self.assertRaises(ValueError):
            material_weight('Net weight: 1 kg or Net weight: 2 kg')
        with self.assertRaises(ValueError):
            material_weight('Shipping weight: 1.3 kg. Empty spool: 154 g.')

    def test_known_pack_sizes_precede_ambiguous_bundles(self):
        entries = [{'kind':'new-product','status':'pending','proposal':{'sourceId':'one','name':n}}
                   for n in ['Clearance Resin Bundle','PLA Black 1kg']]
        self.assertEqual(next(fair_discovery_entries(entries))['proposal']['name'], 'PLA Black 1kg')

    def test_absent_variant_archives_without_parent_page_probe(self):
        item = {'id':'gone','name':'PLA','retailer':'Retailer','url':'https://retailer.example/products/pla','price':20}
        config = {'productLocators':{'gone':{'variantId':99}}, 'retailers':{'r':{'name':'Retailer','allowedHosts':['retailer.example']}},'reviewDecisions':{},'skipImages':True}
        report = {'issues':[], 'priceChanges':[], 'imageChanges':[]}
        refresh_item(item, config, FakeReader(), Path.cwd(), '2026-10-16', ReviewQueue([], {}, 'now'), report)
        self.assertTrue(item['sourceUnavailable'])
        self.assertEqual(item['price'],20)

    def test_failed_catalogue_does_not_retry_every_product(self):
        reader = FakeReader()
        reader.catalogues[0]['error'] = 'Store no longer quotes GBP'
        with self.assertRaisesRegex(ValueError, 'Retailer catalogue unavailable'):
            shopify(reader, 'https://retailer.example/products/pla', 11)

    def test_accessories_are_not_imported_as_printers(self):
        with self.assertRaisesRegex(ValueError, 'Accessories'):
            automatic_details({}, {'name':'Build Plate for 3D Printer', 'type':'3D Printer Accessories'})

    def test_material_title_weight_with_null_description(self):
        candidate = {}
        automatic_details(candidate, {'name':'PLA Filament 10 kg','variantTitle':'Black','type':'3D Filaments','description':None,'options':[]})
        self.assertEqual(candidate['weightGrams'], 10000)

    def test_official_fee_scope_and_ambiguity(self):
        self.assertEqual(folksy_commission(Page('<p>We charge 6% + VAT sales commission on the selling price.</p>')), 6)
        self.assertEqual(stripe_standard_uk(Page('<p>1.5% + 20p for standard UK cards</p><p>2.8% + 20p for premium UK cards</p>')), (1.5, .2))
        for text in ['2.8% + 20p for premium UK cards', '1.5% + 20p for standard UK cards; 2% + 20p for standard UK cards']:
            with self.assertRaises(ValueError):
                stripe_standard_uk(Page(text))
        with self.assertRaises(ValueError):
            folksy_commission(Page('<p>Example: 6% commission. VAT may apply.</p>'))

    def test_discovery_checks_missing_variants_on_known_product_url(self):
        url = 'https://retailer.example/products/pla'
        source = {'id':'test', 'name':'Test'}
        config = {'retailers':{'test':{'catalogUrl':'https://retailer.example/products.json',
                  'productBase':'https://retailer.example/'}}, 'productLocators':{'existing':{'variantId':11}},
                  'maxCatalogPages':2}
        data = {'sources':[source], 'products':[{'id':'existing','retailer':'Test','url':url}]}
        product = {'title':'PLA filament 1kg','handle':'pla','variants':[
                   {'id':11,'title':'Black'}, {'id':12,'title':'White'}]}
        class Reader:
            def json(self, endpoint):
                return {'products':[product] if 'page=1' in endpoint else []}
        queued = []
        report = {'checkedAt':'2026-10-16','issues':[], 'retailers':[]}
        with patch('nightly_catalogues.feed_for', return_value=None):
            discovery(data,config,Reader(),report,lambda *args:queued.append(args))
        self.assertEqual([entry[2]['variantId'] for entry in queued],[12])

    def test_discovery_budget_is_shared_between_retailers(self):
        entries = [{'kind':'new-product','status':'pending','proposal':{'sourceId':source}}
                   for source in ['large']*20+['small','third']]
        self.assertEqual([e['proposal']['sourceId'] for e in fair_discovery_entries(entries)][:3],
                         ['large','small','third'])

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

    def test_new_product_queue_is_bounded_and_rotates(self):
        queue = ReviewQueue([], {}, 'now')
        for i in range(5):
            queue('new-product', str(i), {'id': str(i), 'sourceId': 'r', 'url': 'https://retailer.example/products/' + str(i), 'variantId': i+1})
        config = {'newProducts': 'automatic-verified', 'maxNewProductChecks': 2, 'retailers': {'r': {'allowedHosts': ['retailer.example']}}}
        data = {'products': []}
        for stamp in ['2026-10-13T23:00:00+01:00', '2026-10-14T00:00:00+01:00']:
            report = {'checkedAt': stamp, 'issues': [], 'addedProducts': []}
            with patch('nightly_products.shopify', side_effect=ValueError('Pack unavailable')) as read:
                add_approved(data, config, queue, FakeReader(), Path.cwd(), report)
                self.assertEqual(read.call_count, 2)
        self.assertEqual(sum(bool(entry.get('lastPriceAttempt')) for entry in queue.entries.values()), 4)

    def test_rate_limited_host_is_not_hammered(self):
        from nightly_network import Reader
        reader = Reader()
        reader.rate_limited.add('retailer.example')
        with patch.object(reader, '_read', side_effect=AssertionError('Must not request a rate-limited host')):
            with self.assertRaisesRegex(ValueError, 'rate limited'):
                reader.get('https://retailer.example/products/another')


if __name__ == '__main__':
    unittest.main()
