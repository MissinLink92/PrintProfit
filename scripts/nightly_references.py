"""Official UK reference adapters. Ambiguous values are retained for review."""
import calendar
import hashlib
import io
import re
from datetime import date
from urllib.parse import urljoin
from nightly_html import Page, norm, single_number, table_row

MONTHS = {name.lower(): index for index, name in enumerate(calendar.month_name) if name}

def ofgem(page):
    results = []
    for table in page.tables:
        headers = next((row for row in table if sum('Energy price cap' in c for c in row) >= 1), [])
        electricity = next((row for row in table if row and norm(row[0]) == 'electricity'), [])
        if not headers or len(headers) != len(electricity):
            continue
        for header, cell in zip(headers[1:], electricity[1:]):
            dates = re.search(r'(\d{1,2})\s+(\w+)\s+(?:to|–|-)\s+(\d{1,2})\s+(\w+)\s+(\d{4})', header)
            if not dates:
                raise ValueError('Ofgem quarter dates were not found')
            day1, month1, day2, month2, year = dates.groups()
            start = date(int(year), MONTHS[month1.lower()], int(day1)).isoformat()
            end = date(int(year), MONTHS[month2.lower()], int(day2)).isoformat()
            rate = single_number(r'([\d.]+)\s*pence per kWh', cell) / 100
            standing = single_number(r'([\d.]+)\s*pence daily standing charge', cell) / 100
            if not 0.01 < rate < 2 or not 0 < standing < 3:
                raise ValueError('Ofgem value outside expected units')
            results.append({'id': 'ofgem-' + start, 'label': 'Ofgem reference: ' + start + ' to ' + end,
                            'validFrom': start, 'validTo': end, 'rate': rate, 'standing': standing})
    if not results:
        raise ValueError('Ofgem electricity table was not found')
    return results

def evri(page):
    rates = []
    for table in page.tables:
        if not table or not table[0] or 'weight' not in norm(table[0][0]):
            continue
        headers = table[0]
        home = any('collection' in h.lower() for h in headers)
        for row in table[1:]:
            if len(row) != len(headers) or not re.search(r'kg', row[0], re.I):
                continue
            for service, cell in zip(headers[1:], row[1:]):
                if not re.fullmatch(r'£\s*\d+(?:\.\d{2})?', cell):
                    continue
                price = single_number(r'£\s*([\d.]+)', cell)
                rates.append({'label': ('Home/work — ' if home else 'To ParcelShop — ') + row[0] + ' — ' + service,
                              'price': price, 'note': 'VAT included. Size rules, postcode surcharges and service availability apply.'})
    if len(rates) < 10:
        raise ValueError('Evri published weight/service tables incomplete')
    return rates

def inpost(page):
    text = page.text
    rates = []
    for size, dims in [('Small', '8 × 38 × 64cm'), ('Medium', '19 × 38 × 64cm'), ('Large', '41 × 38 × 64cm')]:
        chunks = re.findall(r'\b' + size + r'\b(.{0,900}?)(?=\b(?:Small|Medium|Large)\b|$)', text, re.I)
        candidates = []
        for chunk in chunks:
            values = re.findall(r'£\s*(\d+\.\d{2})', chunk)
            if len(values) == 2 and ('locker' in chunk.lower() or 'home' in chunk.lower()):
                candidates.append(values)
        if len(candidates) != 1:
            raise ValueError('InPost size and destination prices require review')
        # The adapter only accepts cards explicitly listing Locker/Shop before Home.
        chunk = next(c for c in chunks if len(re.findall(r'£\s*(\d+\.\d{2})', c)) == 2)
        if not re.search(r'(?:locker|shop).*?£\s*\d+\.\d{2}.*?home.*?£\s*\d+\.\d{2}', chunk, re.I):
            raise ValueError('InPost destination order changed')
        for destination, value in zip(['Locker / Shop', 'Home address'], candidates[0]):
            rates.append({'label': destination + ' — ' + size, 'price': float(value), 'note': 'Up to 15kg; ' + dims + '. Check the selected service.'})
    return rates

def royalmail(page, service):
    rates = []
    for context, table in zip(page.table_contexts, page.tables):
        context = norm(context)
        formats = [value for value in ['large letter', 'small parcel', 'medium parcel'] if value in context]
        if not formats and 'letter' in context:
            formats = ['letter']
        if len(formats) != 1 or not table:
            continue
        header = table[0]
        online = [i for i, cell in enumerate(header) if 'online' in cell.lower()]
        if not online:
            # Letter stamps have the same online/retail cost only when expressly stated.
            continue
        for row in table[1:]:
            if len(row) <= online[0] or not re.search(r'\d.*?(?:g|kg)\b', row[0]):
                continue
            cell = row[online[0]]
            values = re.findall(r'£\s*(\d+(?:\.\d{2})?)', cell)
            if not values:
                values = [str(float(v)/100) for v in re.findall(r'(\d+)p\b', cell)]
            if len(values) != 1:
                raise ValueError('Royal Mail weight row has ambiguous online price')
            rates.append({'label': service + ' — ' + formats[0].title() + ' — ' + row[0],
                          'price': float(values[0]), 'note': 'Online purchase price. Packaging dimensions and compensation rules apply.'})
    if not rates:
        raise ValueError('Royal Mail online price table unavailable; previous values retained')
    return rates

def starting_rates(page, source):
    if source == 'dpd':
        specs = [('UK drop-off', r'(?:drop.?off|drop off).{0,80}?from\s*£\s*(\d+\.\d{2})'),
                 ('UK collection', r'collection.{0,80}?from\s*£\s*(\d+\.\d{2})')]
    elif source == 'dhl':
        specs = [('UK delivery', r'(?:UK|United Kingdom).{0,100}?(?:from|prices start at)\s*£\s*(\d+\.\d{2})')]
    else:
        specs = [(name, re.escape(name) + r'.{0,150}?(?:from|prices start at)\s*£\s*(\d+\.\d{2})')
                 for name in ['express48', 'express24', 'expressAM', 'express10', 'express48large']]
    return [{'label': label + ' — starting price', 'price': single_number(pattern, page.text),
             'note': 'Published starting price only; get a quote for parcel size, weight, destination, VAT and account discounts.'}
            for label, pattern in specs]

def refresh(ref, config, reader, report, queue):
    pages = {}
    today = report['checkedAt'][:10]
    for source_id, url in config['referenceSources'].items():
        try:
            html, final_url = reader.text(url)
            page = Page(html)
            if len(page.text) < 500 or re.search(r'access denied|verify you are human|enable javascript to continue', page.text[:1000], re.I):
                raise ValueError('Source did not provide readable pricing guidance')
            pages[source_id] = page
            digest = hashlib.sha256(page.text.encode()).hexdigest()
            old = ref['sourceStatus'].get(source_id, {})
            ref['sourceStatus'][source_id] = {**old, 'url': final_url, 'lastAttempt': today, 'status': 'read-only-monitor', 'contentHash': digest}
            if source_id in config['monitorOnly'] and old.get('contentHash') and old['contentHash'] != digest:
                queue('reference-page-change', source_id, {'url': final_url, 'message': 'Published guidance changed; check account, category and plan rules before changing defaults.', 'contentHash': digest})
        except Exception as exc:
            old = ref['sourceStatus'].get(source_id, {})
            ref['sourceStatus'][source_id] = {**old, 'url': url, 'lastAttempt': today, 'status': 'failed', 'error': str(exc)}
            report['issues'].append({'area': 'reference', 'id': source_id, 'message': str(exc)})

    def verified(ids, action):
        try:
            for key in ids:
                if key not in pages:
                    raise ValueError('Official source could not be read: ' + key)
            action()
            for key in ids:
                ref['sourceStatus'][key].update(status='verified', lastVerified=today)
        except Exception as exc:
            for key in ids:
                if key in pages:
                    ref['sourceStatus'][key].update(status='review-required', error=str(exc))
            report['issues'].append({'area': 'reference-parser', 'id': ', '.join(ids), 'message': str(exc)})

    def electricity():
        benchmarks = ofgem(pages['ofgem'])
        known = {b['validFrom']: b for b in ref['electricity']['benchmarks']}
        for value in benchmarks:
            value.update(sourceUrl=config['referenceSources']['ofgem'], checkedAt=today)
            known[value['validFrom']] = value
        ref['electricity']['benchmarks'] = sorted(known.values(), key=lambda b: b['validFrom'])[-12:]
    verified(['ofgem'], electricity)

    def suppliers():
        links = [urljoin(config['referenceSources']['ofgem-suppliers'], href) for href, label in pages['ofgem-suppliers'].links
                 if href.lower().endswith('.pdf') and 'electricity' in (href + label).lower() and 'licens' in (href + label).lower()]
        if len(set(links)) != 1:
            raise ValueError('Current Ofgem electricity license PDF is ambiguous')
        from pypdf import PdfReader
        raw = reader.get(links[0], limit=25000000)[0]
        text = ' '.join(page.extract_text() or '' for page in PdfReader(io.BytesIO(raw)).pages)
        if 'supply' not in text.lower():
            raise ValueError('Ofgem license PDF has no supply section')
        normalised = norm(text)
        missing = [legal for brand, legal in ref['electricity']['providers'] if legal and norm(legal) not in normalised]
        ref['electricity']['supplierAudit'] = {'sourceUrl': links[0], 'checkedAt': today, 'legalNamesNeedingReview': missing,
                                               'note': 'License register monitoring only. Brands can use different legal supply entities; no provider is automatically removed.'}
        for legal in missing:
            queue('supplier-identity', norm(legal), {'name': legal, 'url': links[0], 'message': 'Listed legal name was not found in the current register; confirm the brand/legal entity.'})
    verified(['ofgem-suppliers'], suppliers)

    def courier(key, ids, parser):
        rates = parser()
        if not rates or any(not 0 < r['price'] < 1000 for r in rates):
            raise ValueError('Invalid courier table')
        ref['deliveryProfiles'][key] = {'source': key.title() + ' official UK reference — checked ' + today,
                                       'rates': rates, 'checkedAt': today, 'sourceUrls': [config['referenceSources'][i] for i in ids]}
    for key, parser in [('evri', lambda: evri(pages['evri'])), ('inpost', lambda: inpost(pages['inpost']))]:
        verified([key], lambda key=key, parser=parser: courier(key, [key], parser))
    verified(['royalmail-first', 'royalmail-second'], lambda: courier('royalmail', ['royalmail-first', 'royalmail-second'],
             lambda: royalmail(pages['royalmail-first'], '1st Class') + royalmail(pages['royalmail-second'], '2nd Class')))
    for key in ['dpd', 'dhl', 'parcelforce']:
        verified([key], lambda key=key: courier(key, [key], lambda: starting_rates(pages[key], key)))

    def platform(key, ids, values):
        previous = ref['platformProfiles'][key]
        assumptions = {
            'etsy': 'Etsy UK. Optional ads, listing fees, VAT on seller fees and currency conversion are not included.',
            'depop': 'Depop UK. Boosted listings are not included.',
            'folksy': 'Folksy Basic including commission VAT; Stripe standard UK cards. Listing fees excluded.',
            'amazon': 'Amazon Handmade UK. Monthly plan costs are not allocated per sale.',
            'ebay': 'eBay UK business Home/Furniture & DIY, up to £500; order fee shown for orders over £10. Other categories, tiers, VAT and listing fees may differ.',
            'shopify': 'Shopify Payments Basic standard online UK cards. Monthly plan costs are not allocated per sale.',
            'tiktok': 'TikTok Shop UK standard commission. Category, programme and optional charges may differ.',
            'vinted': 'Vinted UK standard seller transaction fees; buyer protection and optional promotions excluded.',
            'gumtree': 'Gumtree UK seller payment fees; paid business listings and promotions excluded.'
        }
        clean_note = assumptions.get(key, previous['note'].split(' Reference value;')[0])
        updated = {**previous, **values}
        if any(not 0 <= float(updated[name]) <= 100 for name in ('platform', 'pay')) or not 0 <= float(updated['fixed']) <= 100:
            raise ValueError('Fee values outside the supported percentage/GBP ranges')
        ref['platformProfiles'][key] = {**previous, **values, 'checkedAt': today, 'sourceUrls': [config['referenceSources'][i] for i in ids],
                                       'note': clean_note + ' Platform ' + str(updated['platform']) + '%; payments ' + str(updated['pay']) + '% + £' + format(updated['fixed'], '.2f') + '. Checked ' + today + '.'}
    def etsy():
        trans = single_number(r'Transaction fees?\s*(\d+(?:\.\d+)?)\s*%', pages['etsy-transaction'].text)
        regulatory = single_number(r'([\d.]+)\s*%', ' '.join(table_row(pages['etsy-regulatory'], 'United Kingdom')[1:]))
        pay = ' '.join(table_row(pages['etsy-payments'], 'United Kingdom')[1:])
        percent = single_number(r'([\d.]+)\s*%', pay)
        fixed = single_number(r'([\d.]+)\s*GBP', pay)
        platform('etsy', ['etsy-transaction', 'etsy-regulatory', 'etsy-payments'], {'platform': trans+regulatory, 'pay': percent, 'fixed': fixed})
    verified(['etsy-transaction', 'etsy-regulatory', 'etsy-payments'], etsy)

    def depop():
        text = pages['depop'].text
        if not re.search(r'(?:no selling fee|no selling fees|No Depop Selling fees.{0,90}UK|selling fee.{0,80}UK.{0,80}(?:no fee|0%))', text, re.I):
            raise ValueError('Depop UK selling fee rule was not unambiguous')
        scope = ' '.join(row[0] + ' ' + ' '.join(row[1:]) for table in pages['depop'].tables for row in table
                         if row and 'UK' in row[0] and ('payment' in row[0].lower() or len(row) > 1))
        match = re.search(r'([\d.]+)%\s*\+\s*£\s*([\d.]+)', scope)
        if not match:
            raise ValueError('Depop UK payment processing row changed')
        platform('depop', ['depop'], {'platform': 0, 'pay': float(match[1]), 'fixed': float(match[2])})
    verified(['depop'], depop)

    def folksy():
        row = ' '.join(table_row(pages['folksy'], 'Commission on sales')[1:])
        commission = single_number(r'([\d.]+)\s*%\s*\+\s*VAT', row)
        stripe = pages['stripe'].text
        pay = single_number(r'([\d.]+)\s*%\s*\+\s*\d+p\s+for standard UK cards', stripe)
        fixed = single_number(r'[\d.]+\s*%\s*\+\s*(\d+)p\s+for standard UK cards', stripe)/100
        platform('folksy', ['folksy', 'stripe'], {'platform': round(commission*config['vatMultiplier'], 2), 'pay': pay, 'fixed': fixed})
    verified(['folksy', 'stripe'], folksy)

    # A single context-specific capture avoids interpreting plan or VAT percentages as commission.
    def amazon_checked():
        text = pages['amazon'].text
        values = {float(v) for v in re.findall(r'referral fee\s+of\s+([\d.]+)\s*%', text, re.I)}
        values.update(float(v) for v in re.findall(r'([\d.]+)\s*%\s+referral fee', text, re.I))
        if len(values) != 1:
            raise ValueError('Amazon Handmade referral fee needs review')
        platform('amazon', ['amazon'], {'platform': values.pop()})
    verified(['amazon'], amazon_checked)

    def ebay():
        rows = [row for table in pages['ebay'].tables for row in table if row and norm(row[0]).startswith('home furniture diy')]
        if len(rows) != 1:
            raise ValueError('eBay default category row was not unique')
        percent = single_number(r'([\d.]+)%\s+for the portion.{0,80}?up to £500', ' '.join(rows[0][1:]))
        regulatory = single_number(r'charge a regulatory operating fee of\s+([\d.]+)%', pages['ebay'].text)
        fixed = single_number(r'orders over £10\.00 the per-order fee is £(\d+(?:\.\d+)?)', pages['ebay'].text)
        platform('ebay', ['ebay'], {'platform': percent+regulatory, 'fixed': fixed})
    verified(['ebay'], ebay)

    def shopify():
        rows = [row for table in pages['shopify'].tables for row in table if row and norm(row[0]) == 'online standard card rates']
        # The full comparison table must identify Basic as the first plan.
        valid = [table for table in pages['shopify'].tables if any(norm(row[0]) == 'online standard card rates' for row in table if row)
                 and any('basic' in norm(' '.join(row)) and 'grow' in norm(' '.join(row)) for row in table)]
        if len(rows) != 1 or len(valid) != 1 or len(rows[0]) < 2:
            raise ValueError('Shopify Basic standard card rate table needs review')
        pay = single_number(r'([\d.]+)%', rows[0][1])
        fixed = single_number(r'(\d+)p\s*GBP', rows[0][1])/100
        platform('shopify', ['shopify'], {'pay': pay, 'fixed': fixed})
    verified(['shopify'], shopify)

    def tiktok():
        percent = single_number(r'(?:standard|commission)\s+(?:commission\s+)?(?:fee\s+)?(?:rate\s+)?(?:is\s+|of\s+)?([\d.]+)%', pages['tiktok'].text)
        if not re.search(r'UK|United Kingdom', pages['tiktok'].text):
            raise ValueError('TikTok guidance does not identify the UK market')
        platform('tiktok', ['tiktok'], {'platform': percent})
    verified(['tiktok'], tiktok)

    for key, pattern in [('vinted', r'(?:selling|sell).{0,60}(?:free|no fees)|no.{0,20}selling fees'),
                         ('gumtree', r'no seller fees or costs when using payments')]:
        def zero_selling(key=key, pattern=pattern):
            if not re.search(pattern, pages[key].text, re.I):
                raise ValueError('Zero seller fee guidance changed; keep the previous value for review')
            platform(key, [key], {'platform': 0, 'pay': 0, 'fixed': 0})
        verified([key], zero_selling)
    # Also monitor complete fee guidance for changes to eligibility and optional charges.
    for key in config['monitorOnly']:
        if key in pages:
            report['monitors'].append({'id': key, 'status': 'read-only-monitor', 'url': config['referenceSources'][key]})
