"""Use the same product category rules as the public comparison page."""
import json
import re

class ProductCategories:
    def __init__(self, root):
        catalogue = json.loads((root / 'config/product-categories.json').read_text(encoding='utf-8'))
        self.categories = catalogue['categories']
        self.rules = [(category, [[(condition['field'], re.compile(condition['pattern'], re.I))
                       for condition in rule['all']] for rule in category['rules']]) for category in self.categories]

    def classify(self, product):
        name = str(product.get('name') or '')
        base = name.split(' — ')[0]
        kind = str(product.get('type') or '')
        fields = {'name': name, 'nameBase': base, 'type': kind,
                  'legacyCategory': str(product.get('category') or ''), 'materialText': kind + ' ' + base}
        for category, rules in self.rules:
            if any(all(pattern.search(fields.get(field, '')) for field, pattern in rule) for rule in rules):
                return category
        raise ValueError('Product categories require a final fallback rule')
