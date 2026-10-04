"""Read visible tables, links and Product structured data without executing scripts."""
import json
import re
from html import unescape
from html.parser import HTMLParser

def norm(value):
    return re.sub(r'[^a-z0-9]+', ' ', str(value).lower().replace('grey', 'gray')).strip()

def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.tables, self.table_contexts, self.links, self.text_parts, self.products = [], [], [], [], []
        self.table = self.row = self.cell = self.link = None
        self.hidden = 0
        self.feed(html)
        self.text = re.sub(r'\s+', ' ', ' '.join(self.text_parts)).strip()
        for raw in re.findall(r'<script[^>]*type=[\"\']application/ld\+json[\"\'][^>]*>(.*?)</script>', html, re.I | re.S):
            try:
                objects = walk(json.loads(unescape(raw)))
                self.products.extend(o for o in objects if 'Product' in ([o.get('@type')] if isinstance(o.get('@type'), str) else (o.get('@type') or [])))
            except (ValueError, TypeError):
                continue

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style', 'noscript'):
            self.hidden += 1
        if self.hidden:
            return
        if tag == 'table':
            self.table = []
            self.table_contexts.append(' '.join(self.text_parts)[-300:])
        elif tag == 'tr' and self.table is not None:
            self.row = []
        elif tag in ('td', 'th') and self.row is not None:
            self.cell = []
        elif tag == 'a':
            self.link = [attrs.get('href', ''), []]

    def handle_data(self, data):
        if self.hidden:
            return
        self.text_parts.append(data)
        if self.cell is not None:
            self.cell.append(data)
        if self.link is not None:
            self.link[1].append(data)

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'noscript'):
            self.hidden = max(0, self.hidden - 1)
        if self.hidden:
            return
        if tag in ('td', 'th') and self.cell is not None:
            self.row.append(re.sub(r'\s+', ' ', ' '.join(self.cell)).strip())
            self.cell = None
        elif tag == 'tr' and self.row is not None:
            self.table.append(self.row)
            self.row = None
        elif tag == 'table' and self.table is not None:
            self.tables.append(self.table)
            self.table = None
        elif tag == 'a' and self.link is not None:
            self.links.append((self.link[0], ' '.join(self.link[1]).strip()))
            self.link = None

def single_number(pattern, text):
    values = {float(value) for value in re.findall(pattern, text, re.I)}
    if len(values) != 1:
        raise ValueError('Expected one unambiguous rate; found ' + str(len(values)))
    return values.pop()

def table_row(page, label):
    rows = [row for table in page.tables for row in table if row and norm(row[0]) == norm(label)]
    if len(rows) != 1:
        raise ValueError('Expected one table row for ' + label)
    return rows[0]
