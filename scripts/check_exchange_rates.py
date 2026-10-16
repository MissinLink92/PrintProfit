"""Check GBP cross-rates, completeness and stale-data fallback."""
import copy
from unittest.mock import Mock
import nightly_fx

def xml(gbp='.8', date='2026-10-16'):
 codes=[c for c in nightly_fx.SUPPORTED if c not in ('GBP','EUR')]
 return ('<root><Cube time="'+date+'"><Cube currency="GBP" rate="'+gbp+'"/>'+''.join('<Cube currency="'+c+'" rate="2"/>' for c in codes)+'</Cube></root>').encode()
r=nightly_fx.parse(xml(),'2026-10-16');assert r['rates']['GBP']==1 and r['rates']['EUR']==1.25 and r['rates']['USD']==2.5
for raw in [xml('0'),xml('nan'),xml(date='2026-09-01'),b'<root/>',xml().replace(b'currency="USD"',b'currency="EUR"')]:
 try:nightly_fx.parse(raw,'2026-10-16')
 except (ValueError,KeyError):pass
 else:raise AssertionError('Invalid FX data accepted')
ref={'exchangeRates':copy.deepcopy(r)};reader=Mock();reader.get.side_effect=ValueError('Unavailable');report={'checkedAt':'2026-10-16T12:00:00Z','issues':[]};nightly_fx.refresh(ref,reader,report);assert ref['exchangeRates']['rates']==r['rates'] and ref['exchangeRates']['status']=='retained-unverified' and report['issues']
print('PASS: GBP cross-rates, observation dates, completeness and retained-data fallback.')
