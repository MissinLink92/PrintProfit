"""Read-only check of the currently configured Bambu feed; no price changes."""
import json
from pathlib import Path
from urllib.parse import urlparse
from nightly_network import Reader
from nightly_catalogues import storefront_currency

root=Path(__file__).resolve().parents[1]
source=json.loads((root/'config/nightly-sources.json').read_text())['retailers']['bambu-uk']
reader=Reader(deadline_seconds=120)
result={'retailer':source['name'],'url':source['catalogUrl'],'status':'unverified'}
try:
    html,final_url=reader.text(source.get('currencyUrl') or source['productBase'])
    if urlparse(final_url).hostname not in source['allowedHosts']:
        raise ValueError('Storefront redirected outside configured UK retailer')
    result['currency']=storefront_currency(html)
    endpoint=source['catalogUrl']+('&' if '?' in source['catalogUrl'] else '?')+'limit=1&page=1'
    payload=reader.json(endpoint)
    if not isinstance(payload.get('products'),list) or not payload['products']:
        raise ValueError('No readable catalogue products')
    result.update(status='reachable',note='First catalogue page is reachable in GBP; exact variant prices still require a refresh.')
except Exception as error:
    result['error']=str(error)
output=root/'.audit-output';output.mkdir(exist_ok=True)
(output/'bambu-feed.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
