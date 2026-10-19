"""Build a dated source-health report; unavailable sources must remain visible."""
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
import re

root=Path(__file__).resolve().parents[1]
ref=json.loads((root/'data/reference-data.json').read_text())
data=json.loads((root/'data/price-finder.json').read_text())
report={'checkedAt':datetime.now(timezone.utc).isoformat(),'warnings':[], 'retailers':[], 'manualVerifications':[]}
for name,status in ref.get('sourceStatus',{}).items():
 if status.get('status') not in ('verified','manual-verified'):report['warnings'].append(name+': '+status.get('status','unverified')+'; last verified '+str(status.get('lastVerified','never')))
for name,status in ref.get('sourceStatus',{}).items():
 if status.get('status')=='manual-verified':
  report['manualVerifications'].append({'source':name,'checkedAt':status.get('lastVerified'),'reviewAfter':status.get('reviewAfter'),'automaticStatus':status.get('automaticStatus'),'automaticError':status.get('error')})
  if str(status.get('reviewAfter',''))<datetime.now(timezone.utc).date().isoformat():report['warnings'].append(name+': manual verification expired; review official guidance')
fx=ref.get('exchangeRates',{})
report['exchangeRates']={k:fx.get(k) for k in ['date','status','sourceUrl']}
if fx.get('status')!='verified':report['warnings'].append('Exchange-rate refresh unavailable; retained/preset values need review.')
for name,status in ref.get('sourceStatus',{}).items():
 if status.get('lastVerified') and (datetime.now(timezone.utc).date()-datetime.fromisoformat(status['lastVerified']).date()).days>7:
  report['warnings'].append(name+': verification is older than seven days')
for source in data['sources']:
 ps=[p for p in data['products'] if p.get('retailer')==source['name'] and not p.get('sourceUnavailable')]
 report['retailers'].append({'name':source['name'],'listed':len(ps),'verified':sum(p.get('lastCheckStatus')=='ok' for p in ps),'categories':dict(Counter(p.get('productGroup') or p.get('category') for p in ps))})
 if not ps:report['warnings'].append(source['name']+': no active listings')
if len({p['id'] for p in data['products']})!=len(data['products']):raise ValueError('Duplicate product IDs in catalogue')
text=(root/'data/product-offers.js').read_text();match=re.search(r'window\.PRINTPROFIT_OFFERS\s*=\s*(\[[\s\S]*\])\s*;',text)
if not match:raise ValueError('Offer data must be a JSON array')
offers=json.loads(match[1]);ids={str(p['id']) for p in data['products']};now=datetime.now(timezone.utc);active=0
for i,o in enumerate(offers):
 for key in ['retailer','productIds','title','terms','expiresAt','lastChecked','url']:
  if not o.get(key):raise ValueError(f'Offer {i}: missing {key}')
 if not o['url'].startswith('https://'):raise ValueError(f'Offer {i}: HTTPS URL required')
 if not all(str(p) in ids for p in o['productIds']):raise ValueError(f'Offer {i}: unknown product ID')
 expiry=datetime.fromisoformat(o['expiresAt'].replace('Z','+00:00'))
 if expiry.tzinfo is None:raise ValueError(f'Offer {i}: expiry timezone required')
 checked=datetime.fromisoformat(o['lastChecked'].replace('Z','+00:00'))
 if (now.date()-checked.date()).days>7:report['warnings'].append(f'Offer {i}: last checked over seven days ago; retailer confirmation needed')
 start=datetime.fromisoformat(o.get('startsAt',o['lastChecked']).replace('Z','+00:00'))
 if checked.tzinfo is None or start.tzinfo is None:raise ValueError(f'Offer {i}: checked/start timezone required')
 if checked>now:raise ValueError(f'Offer {i}: lastChecked cannot be in the future')
 if start>expiry:raise ValueError(f'Offer {i}: start date follows expiry')
 if not isinstance(o.get('approved'),bool):raise ValueError(f'Offer {i}: explicit approval status required')
 if expiry>now>=start and o.get('approved') is True:active+=1
report['offers']={'configured':len(offers),'activeApproved':active,'checkoutVerified':False}
if not offers:report['offers']['note']='No approved offers configured. Coupon coverage is not advertised.'
(root/'reports').mkdir(exist_ok=True)
(root/'reports/data-health.json').write_text(json.dumps(report,indent=2)+'\n')
lines=['# PrintProfit data health','',report['checkedAt'],'','## Attention needed']+['- '+w for w in report['warnings']]
lines+=['','## Retailer coverage','', '| Retailer | Listings | Verified |','|---|---:|---:|']+[f"| {r['name']} | {r['listed']} | {r['verified']} |" for r in report['retailers']]
(root/'reports/data-health.md').write_text('\n'.join(lines)+'\n');print(f"Data-health audit: {len(report['warnings'])} warnings; {active} approved active offers")
