"""Dated ECB reference rates, expressed as units of currency per GBP."""
import math
import xml.etree.ElementTree as ET
from datetime import date

SOURCE = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml'
SUPPORTED = 'GBP EUR USD PLN CAD AUD CHF SEK NOK DKK CZK JPY CNY INR NZD SGD BRL MXN ZAR'.split()

def parse(raw, today):
    root = ET.fromstring(raw)
    dated = [e for e in root.iter() if 'time' in e.attrib]
    if len(dated) != 1:
        raise ValueError('Exchange-rate observation date is ambiguous')
    observed = date.fromisoformat(dated[0].attrib['time'])
    age = (date.fromisoformat(today) - observed).days
    if not 0 <= age <= 7:
        raise ValueError('Exchange-rate observation is stale or in the future')
    eur = {'EUR': 1.0}
    for e in dated[0].iter():
        if 'currency' in e.attrib:
            code, value = e.attrib['currency'], float(e.attrib['rate'])
            if code in eur or not math.isfinite(value) or value <= 0:
                raise ValueError('Invalid or duplicate exchange rate')
            eur[code] = value
    if not all(code in eur for code in SUPPORTED):
        raise ValueError('Exchange-rate feed is missing supported currencies')
    return {'base':'GBP', 'date':observed.isoformat(), 'sourceUrl':SOURCE,
            'rates':{code:round(eur[code]/eur['GBP'], 8) for code in SUPPORTED},
            'note':'ECB reference rates, not a bank or payment-provider quote.'}

def refresh(ref, reader, report):
    try:
        fx = parse(reader.get(SOURCE)[0], report['checkedAt'][:10])
        fx.update(lastAttempt=report['checkedAt'], status='verified')
        ref['exchangeRates'] = fx
    except Exception as exc:
        old = ref.setdefault('exchangeRates', {})
        old.update(lastAttempt=report['checkedAt'], status='retained-unverified', error=str(exc))
        report['issues'].append({'area':'exchange-rates', 'id':'ecb', 'message':str(exc)})
