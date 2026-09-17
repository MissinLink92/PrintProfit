from pathlib import Path

path = Path('index.html')
s = path.read_text(encoding='utf-8')

old = "['materialPack','materialPackCost','materialUsed','printHours','labourRate','pack','other','electricityRate','electricityProvider','delivery','deliveryCharge','qty','discount','pay','fixedFee']"
new = "['materialPack','materialPackCost','materialUsed','printHours','labourRate','pack','other','electricityRate','electricityProvider','platform','pay','fixedFee','delivery','deliveryCharge','qty','discount']"

if old not in s:
    raise SystemExit('Could not locate platform input listener list')

s = s.replace(old, new, 1)
path.write_text(s, encoding='utf-8')
print('Fixed platform fee live recalculation')
