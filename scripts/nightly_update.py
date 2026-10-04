#!/usr/bin/env python3
"""PrintProfit UK nightly refresh. Run from a checkout; outputs are staged atomically."""
import argparse
import copy
import hashlib
import json
import os
from datetime import datetime
from html import escape
from pathlib import Path
from tempfile import TemporaryDirectory
from zoneinfo import ZoneInfo
from nightly_network import Reader
from nightly_categories import ProductCategories
import nightly_references
import nightly_products

ROOT = Path(__file__).resolve().parents[1]

def load(path, default=None):
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else copy.deepcopy(default)

def serialise(value):
    return json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n'

def js_global(name, value):
    # Generated scripts must not allow a source string to end an HTML script element.
    return 'window.' + name + '=' + serialise(value).replace('<', '\\u003c').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029').rstrip() + ';\n'

class ReviewQueue:
    def __init__(self, values, decisions, now):
        self.entries = {entry['reviewId']: entry for entry in values}
        self.decisions, self.now = decisions, now

    @staticmethod
    def key(kind, identity, proposal):
        if kind == 'new-product':
            proposal = {k: v for k, v in proposal.items() if k not in ('catalogPrice', 'image', 'shippingWeightGrams', 'note')}
        content = json.dumps([kind, identity, proposal], sort_keys=True, ensure_ascii=False)
        return 'review-' + hashlib.sha256(content.encode()).hexdigest()[:24]

    def __call__(self, kind, identity, proposal):
        key = self.key(kind, identity, proposal)
        if key not in self.entries:
            # Retain earlier decisions, but replace pending duplicate discoveries.
            for entry in self.entries.values():
                if entry['kind'] == kind and entry.get('identity') == identity and entry['status'] == 'pending':
                    entry['status'] = 'superseded'
            self.entries[key] = {'reviewId': key, 'kind': kind, 'identity': identity, 'proposal': proposal,
                                 'firstSeen': self.now, 'lastSeen': self.now, 'status': 'pending'}
        entry = self.entries[key]
        entry['lastSeen'] = self.now
        decision = self.decisions.get(key)
        if decision == 'reject':
            entry['status'] = 'rejected'
        elif decision == 'approve' and kind != 'new-product':
            entry['status'] = 'reviewed'
        return key

def review_html(queue):
    entries = [e for e in queue.entries.values() if e['status'] == 'pending']
    rows = []
    for entry in entries:
        proposal = entry['proposal']
        title = proposal.get('name') or proposal.get('productId') or entry['identity']
        url = proposal.get('url', '')
        link = '<a target="_blank" rel="noopener noreferrer" href="' + escape(url, quote=True) + '">Open source ↗</a>' if url.startswith(('https://','http://')) else ''
        fields = ''
        if entry['kind'] == 'new-product':
            for field, label in [('name','Product name'), ('brand','Brand'), ('category','Category: printer or filament'), ('type','Material / printer type'), ('colour','Colour'), ('pack','Pack size / build size'), ('weightGrams','Filament or resin pack weight (grams)')]:
                value = queue.product_details.get(entry['reviewId'], {}).get(field, proposal.get(field))
                fields += '<label class="detail">' + label + '<input data-field="' + field + '" value="' + escape(str(value or ''), quote=True) + '"></label>'
        rows.append('<article data-item="' + entry['reviewId'] + '"><h2>' + escape(title) + '</h2><p>' + escape(entry['kind']) + '</p><p>' + escape(proposal.get('note') or proposal.get('message') or '') + '</p>'
                    + '<pre>' + escape(serialise(proposal)) + '</pre>' + link + fields + '<p><label>Decision <select data-review="' + entry['reviewId'] + '"><option value="">Keep pending</option><option value="approve">Approve</option><option value="reject">Reject</option></select></label></p></article>')
    return '''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>PrintProfit — products to review</title><style>body{background:#0b1820;color:#f5f7fa;font:16px system-ui;max-width:1000px;margin:30px auto;padding:20px}article{background:#122a36;border:1px solid #335260;border-radius:16px;padding:20px;margin:16px 0}h1,h2{color:#ff982c}a{color:#50d8ff}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px}button,select,input{padding:12px;border-radius:8px}.detail{display:block;margin:12px 0}.detail input{display:block;width:90%;margin-top:5px}button{background:#ff982c;font-weight:bold;border:0;cursor:pointer}</style>
<h1>Products and source changes to review</h1><p>New products stay off the website until approved. Check the exact model, colour, pack size and source. Missing details or an unverified GBP price will prevent publication.</p>
<p>Save your decisions below, then replace <strong>config/review-decisions.json</strong> in the repository with the downloaded file. New decisions are applied on the next run. Fee and supplier notices still require checking their reference data.</p>
<button id="download">Download review decisions</button>''' + ('\n'.join(rows) or '<p>No pending items.</p>') + '''
<script>const previous=SAVEDREVIEW;document.getElementById('download').onclick=()=>{const decisions={...previous.decisions},productDetails={...previous.productDetails};document.querySelectorAll('[data-review]').forEach(s=>{if(s.value)decisions[s.dataset.review]=s.value});document.querySelectorAll('[data-item]').forEach(a=>{const fields=a.querySelectorAll('[data-field]');if(!fields.length)return;const details={};fields.forEach(i=>{details[i.dataset.field]=i.dataset.field==='weightGrams'?Number(i.value)||null:i.value.trim()});productDetails[a.dataset.item]=details});const url=URL.createObjectURL(new Blob([JSON.stringify({decisions,productDetails},null,2)+'\\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='review-decisions.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};</script></html>'''.replace('SAVEDREVIEW', json.dumps({'decisions':queue.decisions,'productDetails':queue.product_details}).replace('<','\\u003c'))

def report_md(report):
    lines = ['# PrintProfit nightly update', '', 'Checked: ' + report['checkedAt'], '',
             '- Changed existing prices: ' + str(len(report['priceChanges'])),
             '- Refreshed image files: ' + str(len(report['imageChanges'])),
             '- Verified products added: ' + str(len(report['addedProducts'])),
             '- Unresolved source notices: ' + str(report['pendingReview']),
             '- Failed or incomplete checks: ' + str(len(report['issues'])), '',
             '## Source checks', '', '| Retailer | Status | Candidates |', '|---|---|---|']
    lines += ['| ' + r['name'].replace('|',' ') + ' | ' + r['status'] + ' | ' + str(r['candidates']) + ' |' for r in report['retailers']]
    lines += ['', '## Items needing attention', '']
    lines += ['- ' + issue['area'] + ' / ' + issue['id'] + ': ' + issue['message'].replace('\n',' ') for issue in report['issues']]
    return '\n'.join(lines) + '\n'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=ROOT, help='PrintProfit repository checkout')
    args = parser.parse_args()
    root = args.root.resolve()
    categories = ProductCategories(root)
    config = load(root / 'config/nightly-sources.json')
    if not isinstance(config, dict):
        raise ValueError('Missing nightly source configuration')
    automatic = config.get('newProducts') == 'automatic-verified'
    saved_review = {} if automatic else load(root / 'config/review-decisions.json', {})
    config['reviewDecisions'] = saved_review.get('decisions', saved_review)
    config['approvedProductDetails'].update(saved_review.get('productDetails', {}))
    if any(v not in ('approve', 'reject') for v in config['reviewDecisions'].values()):
        raise ValueError('Review decisions must be approve or reject')
    data = load(root / 'data/price-finder.json')
    ref = load(root / 'data/reference-data.json')
    if data.get('currency') != 'GBP' or ref.get('currency') != 'GBP':
        raise ValueError('The updater only supports the configured UK GBP data set')
    now = datetime.now(ZoneInfo('Europe/London')).isoformat(timespec='seconds')
    report = {'checkedAt': now, 'timezone': 'Europe/London', 'issues': [], 'priceChanges': [], 'imageChanges': [],
              'addedProducts': [], 'retailers': [], 'monitors': []}
    queue = ReviewQueue(load(root / 'data/review-queue.json', []), config['reviewDecisions'], now)
    queue.product_details = config['approvedProductDetails']
    reader = Reader(config['maxRunSeconds'])
    nightly_references.refresh(ref, config, reader, report, queue)
    for index, item in enumerate(data['products'], 1):
        print('Checking product', index, 'of', len(data['products']), item['id'], flush=True)
        nightly_products.refresh_item(item, config, reader, root, now[:10], queue, report)
    nightly_products.discovery(data, config, reader, report, queue)
    nightly_products.add_approved(data, config, queue, reader, root, report)
    report['pendingReview'] = sum(e['status'] == 'pending' for e in queue.entries.values())
    report['requests'] = reader.count
    report['verifiedProducts'] = sum(i.get('lastCheckStatus') == 'ok' and i.get('lastAttempt') == now[:10] for i in data['products'])
    data['refreshPolicy'] = {'frequency': 'nightly at 00:00', 'timezone': 'Europe/London', 'newProducts': 'automatic when verified' if automatic else 'review first',
                             'note': 'Checked prices are snapshots. Failed or ambiguous sources retain their last verified values.'}
    data['lastRefreshSummary'] = {'checkedAt': now, 'changedProducts': len(report['priceChanges']), 'changedImages': len(report['imageChanges']),
                                  'warnings': len(report['issues']), 'verifiedProducts': report['verifiedProducts'], 'pendingReview': report['pendingReview']}
    if report['verifiedProducts']:
        data['updatedAt'] = now[:10]
    ref['lastAttempt'] = now
    for source in data['sources']:
        source['refreshPolicy'] = 'nightly; verified exact offers only'
        health = next((r for r in report['retailers'] if r['id'] == source['id']), None)
        if health:
            source['lastDiscoveryStatus'] = health['status']
    printers = {}
    for item in data['products']:
        category = categories.classify(item)
        item['productGroup'] = category['group']
        item['productCategory'] = category['id']
        if category['group'] == 'printer' and item.get('price'):
            name = item['name']
            for prefix in ('Bambu Lab ', 'ELEGOO ', 'Creality ', 'Flashforge '):
                if name.startswith(prefix):
                    name = name[len(prefix):]
                    break
            printers[name] = float(item['price'])
    queue_values = sorted(queue.entries.values(), key=lambda e: (e['status'] != 'pending', e['firstSeen']))
    # Write complete documents before replacing their repository copies.
    config.pop('reviewDecisions')
    audit_html = '<!doctype html><html lang="en"><meta charset="utf-8"><title>PrintProfit automatic updates</title><h1>Automatic updates</h1><p>Verified new products publish automatically. Incomplete listings are skipped and retried; no product approval is required.</p><pre>' + escape(report_md(report)) + '</pre></html>'
    documents = {'data/price-finder.json': serialise(data), 'data/price-finder.js': js_global('PRINTPROFIT_PRICE_DATA', data),
                 'data/reference-data.json': serialise(ref), 'data/reference-data.js': js_global('PRINTPROFIT_REFERENCE_DATA', ref),
                 'printer-price-data.js': js_global('PRINTPROFIT_PRINTER_PRICES', printers), 'data/review-queue.json': serialise(queue_values),
                 'data/nightly-report.json': serialise(report), 'reports/nightly-report.md': report_md(report),
                 'reports/review-products.html': audit_html if automatic else review_html(queue), 'config/nightly-sources.json': serialise(config)}
    with TemporaryDirectory(prefix='printprofit-') as temporary:
        staging = Path(temporary)
        for relative, content in documents.items():
            file = staging / relative
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text(content, encoding='utf-8')
        for relative in documents:
            destination = root / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            # os.replace needs the same filesystem; a sibling temporary file supplies this.
            sibling = destination.with_name(destination.name + '.tmp')
            sibling.write_bytes((staging / relative).read_bytes())
            os.replace(sibling, destination)
    print(report_md(report))
    # Source failures are partial results, not a reason to discard verified updates.
    # Complete loss of coverage should stop publication and visibly fail the workflow.
    if not report['verifiedProducts'] and not any(s.get('status') == 'verified' and s.get('lastVerified') == now[:10] for s in ref['sourceStatus'].values()):
        raise SystemExit('No prices or reference rates verified; deployment stopped. See the report artifact.')

if __name__ == '__main__':
    main()
