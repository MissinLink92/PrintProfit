from pathlib import Path

path = Path('index.html')
s = path.read_text(encoding='utf-8')
old = "['materialPack','materialPackCost','materialUsed','printHours','labourRate','pack','other','electricityRate','electricityProvider','delivery','deliveryCharge','qty','discount','pay','fixedFee']"
new = "['materialPack','materialPackCost','materialUsed','printHours','labourRate','pack','other','electricityRate','electricityProvider','platform','pay','fixedFee','delivery','deliveryCharge','qty','discount']"
if old not in s:
    raise SystemExit('Platform listener list not found')
path.write_text(s.replace(old, new, 1), encoding='utf-8')
print('Platform listener fixed')
