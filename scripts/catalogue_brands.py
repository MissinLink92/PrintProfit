"""Normalise known manufacturer aliases without guessing reseller product brands."""
import json
from pathlib import Path
ALIASES = json.loads((Path(__file__).resolve().parents[1] / 'config/brand-aliases.json').read_text())

def normalise_brand(value):
    name = str(value or '').strip()
    return ALIASES.get(name.casefold(), name)
