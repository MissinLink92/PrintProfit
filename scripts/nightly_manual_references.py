"""Dated checks of official guidance, retained separately from automatic fetch status."""
import copy
import json
from datetime import date
from pathlib import Path

def apply(ref, root, today):
    path = Path(root) / 'config/reference-verifications.json'
    if not path.exists():
        return
    for entry in json.loads(path.read_text(encoding='utf-8'))['entries']:
        checked = date.fromisoformat(entry['checkedAt'])
        review = date.fromisoformat(entry['reviewAfter'])
        current = date.fromisoformat(today)
        if not checked <= current <= review:
            continue
        if (review - checked).days > 7 or not entry.get('sourceUrls') or not all(url.startswith('https://') for url in entry['sourceUrls']):
            raise ValueError('Manual references require HTTPS evidence and a review interval of at most seven days')
        group, key = entry['group'], entry['id']
        if group not in ('platformProfiles', 'deliveryProfiles'):
            raise ValueError('Unsupported reference profile')
        statuses = [ref.get('sourceStatus', {}).get(s, {}) for s in entry['sourceIds']]
        if statuses and all(s.get('status') == 'verified' and s.get('lastVerified', '') >= entry['checkedAt'] for s in statuses):
            continue
        value = copy.deepcopy(entry['value'])
        if group == 'platformProfiles':
            if any(not 0 <= float(value[n]) <= 100 for n in ('platform', 'pay', 'fixed')):
                raise ValueError('Invalid manually verified platform fee')
            value['note'] += ' Manually checked ' + entry['checkedAt'] + '; review by ' + entry['reviewAfter'] + '.'
        elif not value.get('rates') or any(not 0 < float(r['price']) < 1000 for r in value['rates']):
            raise ValueError('Invalid manually verified delivery rate')
        value.update(checkedAt=entry['checkedAt'], reviewAfter=entry['reviewAfter'], verificationMethod='manual', sourceUrls=entry['sourceUrls'])
        ref[group][key] = {**ref[group].get(key, {}), **value}
        for source_id in entry['sourceIds']:
            status = ref.setdefault('sourceStatus', {}).setdefault(source_id, {})
            if status.get('status') != 'manual-verified':
                status['automaticStatus'] = status.get('status', 'unverified')
            status.update(status='manual-verified', lastVerified=entry['checkedAt'], reviewAfter=entry['reviewAfter'], verificationMethod='manual', sourceUrls=entry['sourceUrls'])
