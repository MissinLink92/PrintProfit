from pathlib import Path
import re

p=Path('index.html')
t=p.read_text(encoding='utf-8')
marker='/* PrintProfit delivery rates V1 */'
if marker in t:
    raise SystemExit('Delivery rates V1 is already installed.')

required=['delivery','deliveryCharge','calc','reset']
for i in required:
    if f'id="{i}"' not in t:
        raise SystemExit(f'Missing required control: {i}')

# Replace only the existing Delivery merge-block, located by its heading.
heading='<h2>Delivery</h2>'
h=t.find(heading)
if h<0: raise SystemExit('Delivery heading not found.')
start=t.rfind('<div class="merge-block">',0,h)
end=t.find('</div></div></div></section></div>',h)
if start<0 or end<0: raise SystemExit('Could not locate Delivery block boundaries.')
end += len('</div></div></div></section></div>')
new_delivery='''<div class="merge-block"><div class="head"><div class="icon">⇩</div><div><h2>Delivery</h2><p>Choose a courier and service rate, then override the cost when needed.</p></div></div><div class="delivery-tools"><div class="two"><div><label>Courier / delivery firm</label><select id="deliveryCourier"><option value="">Select a courier...</option><option value="royalmail">Royal Mail</option><option value="evri">Evri</option><option value="inpost">InPost</option><option value="dpd">DPD Online</option><option value="dhl">DHL eCommerce UK</option><option value="parcelforce">Parcelforce</option><option value="ups">UPS</option><option value="fedex">FedEx</option><option value="custom">Custom / Other</option></select></div><div><label>Service / rate</label><select id="deliveryRate"><option value="">Choose a courier first...</option></select></div></div><div class="two delivery-rate-row"><div><label>Automatic rate</label><input id="deliveryRateOut" type="text" value="£0.00" readonly></div><div class="small" id="deliveryRateNote">Choose a courier and service. The cost below can still be edited manually.</div></div><div class="small delivery-note">Published UK reference rates. Final quotes can vary by parcel size, dimensions, destination, account type, surcharges and promotions. Check the courier before dispatch.</div></div><div class="two"><div><label>Cost to you (£)</label><input id="delivery" type="number" value="0" step=".01"></div><div><label>Charged to customer (£)</label><input id="deliveryCharge" type="number" value="0" step=".01"></div></div></div>'''
t=t[:start]+new_delivery+t[end:]

css='''\n/* PrintProfit delivery rates V1 */\n.delivery-tools{margin-bottom:10px}.delivery-note{margin-top:7px;line-height:1.35}.delivery-rate-row{margin-top:7px}.delivery-rate-row .small{align-self:end;padding-bottom:7px}.delivery-rate-row select{font-size:12.5px}#deliveryRateOut{font-weight:700;color:var(--accent)}@media(max-width:650px){.delivery-rate-row .small{padding-bottom:0}}\n'''
t=t.replace('</style>',css+'</style>',1)

js=r'''

  const deliveryProfiles={
    royalmail:{source:'Royal Mail online prices (current 2026)',rates:[
      {label:'Tracked 48 — Large Letter — up to 1kg — £2.85',price:2.85,note:'Online price; max 35.3 × 25 × 2.5cm.'},
      {label:'Tracked 48 — Small Parcel — up to 2kg — £3.65',price:3.65,note:'Online price; max 45 × 35 × 16cm.'},
      {label:'Tracked 48 — Medium Parcel — up to 2kg — £5.55',price:5.55,note:'Online price; max 61 × 46 × 46cm.'},
      {label:'Tracked 48 — Medium Parcel — up to 10kg — £7.35',price:7.35,note:'Online price.'},
      {label:'Tracked 48 — Medium Parcel — up to 20kg — £11.85',price:11.85,note:'Online price.'},
      {label:'Tracked 24 — Large Letter — up to 1kg — £3.80',price:3.80,note:'Online starting price.'},
      {label:'Tracked 24 — Small Parcel — up to 2kg — £4.65',price:4.65,note:'Online price.'},
      {label:'Tracked 24 — Medium Parcel — up to 20kg — £6.55',price:6.55,note:'Online starting price.'},
      {label:'express48 — from £11.95',price:11.95,note:'Parcelforce service; up to 30kg.'},
      {label:'express24 — from £12.50',price:12.50,note:'Parcelforce service; up to 30kg.'}
    ]},
    evri:{source:'Evri online prices (September 2026)',rates:[
      {label:'Standard — Postable under 1kg — £2.70',price:2.70,note:'Drop-off; max 23 × 35 × 3cm.'},
      {label:'Standard — Small 0–1kg — £3.04',price:3.04,note:'Drop-off; small parcel.'},
      {label:'Standard — Standard 0–1kg — £3.29',price:3.29,note:'Drop-off.'},
      {label:'Standard — Small 1–2kg — £3.52',price:3.52,note:'Drop-off.'},
      {label:'Standard — 1–2kg — £4.79',price:4.79,note:'Drop-off.'},
      {label:'Standard — 2–5kg — £6.59',price:6.59,note:'Drop-off.'},
      {label:'Standard — 5–10kg — £6.68',price:6.68,note:'Drop-off.'},
      {label:'Standard — 10–15kg — £10.28',price:10.28,note:'Drop-off.'},
      {label:'Next Day — Postable under 1kg — £3.49',price:3.49,note:'Drop-off; availability varies.'},
      {label:'Next Day — Small 0–1kg — £3.90',price:3.90,note:'Drop-off; availability varies.'},
      {label:'Next Day — Standard 0–1kg — £4.12',price:4.12,note:'Drop-off; availability varies.'},
      {label:'Next Day — Small 1–2kg — £4.60',price:4.60,note:'Drop-off; availability varies.'},
      {label:'Next Day — Standard 1–2kg — £5.48',price:5.48,note:'Drop-off; availability varies.'},
      {label:'Next Day — 2–5kg — £7.55',price:7.55,note:'Drop-off; availability varies.'},
      {label:'Next Day — 5–10kg — £7.72',price:7.72,note:'Drop-off; availability varies.'},
      {label:'Next Day — 10–15kg — £12.35',price:12.35,note:'Drop-off; availability varies.'},
      {label:'ParcelShop — up to 5kg — £2.62',price:2.62,note:'Prebooked ParcelShop delivery.'},
      {label:'ParcelShop Next Day — up to 5kg — £3.20',price:3.20,note:'Prebooked ParcelShop delivery.'},
      {label:'Standard collection — 0–1kg Small — £4.04',price:4.04,note:'Collection price; location charges may apply.'},
      {label:'Standard collection — 0–1kg Standard — £4.30',price:4.30,note:'Collection price; location charges may apply.'},
      {label:'Standard collection — 1–2kg Small — £4.52',price:4.52,note:'Collection price; location charges may apply.'},
      {label:'Standard collection — 1–2kg Standard — £5.78',price:5.78,note:'Collection price; location charges may apply.'},
      {label:'Standard collection — 2–5kg — £7.58',price:7.58,note:'Collection price; location charges may apply.'},
      {label:'Standard collection — 5–10kg — £7.68',price:7.68,note:'Collection price; location charges may apply.'},
      {label:'Standard collection — 10–15kg — £11.29',price:11.29,note:'Collection price; location charges may apply.'}
    ]},
    inpost:{source:'InPost parcel price list (current)',rates:[
      {label:'Locker / Shop — Small — £1.99',price:1.99,note:'Up to 15kg; 8 × 38 × 64cm.'},
      {label:'Locker / Shop — Medium — £2.59',price:2.59,note:'Up to 15kg; 19 × 38 × 64cm.'},
      {label:'Locker / Shop — Large — £3.99',price:3.99,note:'Up to 15kg; 41 × 38 × 64cm.'},
      {label:'Home address — Small — £2.89',price:2.89,note:'Up to 15kg; 8 × 38 × 64cm.'},
      {label:'Home address — Medium — £3.99',price:3.99,note:'Up to 15kg; 19 × 38 × 64cm.'},
      {label:'Home address — Large — £5.99',price:5.99,note:'Up to 15kg; 41 × 38 × 64cm.'}
    ]},
    dpd:{source:'DPD Online published UK starting prices',rates:[
      {label:'UK drop-off — from £2.99',price:2.99,note:'Starting price; exact quote depends on parcel details.'},
      {label:'UK collection — from £5.81',price:5.81,note:'Starting price; exact quote depends on parcel details.'}
    ]},
    dhl:{source:'DHL eCommerce UK published price',rates:[
      {label:'UK delivery — from £2.79',price:2.79,note:'Includes VAT; mainland depot drop-off/collection basis.'}
    ]},
    parcelforce:{source:'Parcelforce UK retail prices from 7 April 2026',rates:[
      {label:'express48 — from £11.95',price:11.95,note:'Up to 30kg; tracked.'},
      {label:'express24 — from £12.50',price:12.50,note:'Up to 30kg; tracked.'},
      {label:'expressAM — from £16.50',price:16.50,note:'Up to 30kg; next working day by noon.'},
      {label:'express10 — from £28.10',price:28.10,note:'Up to 30kg; next working day by 10am.'},
      {label:'express48large — from £51.65',price:51.65,note:'Large parcel service.'}
    ]},
    ups:{source:'UPS UK public rate guidance',rates:[
      {label:'Domestic UK — quote required',price:0,note:'Enter your quoted UPS rate in Cost to you.'}
    ]},
    fedex:{source:'FedEx UK rates effective 5 January 2026',rates:[
      {label:'Domestic UK — quote required',price:0,note:'Enter your quoted FedEx rate in Cost to you.'}
    ]},
    custom:{source:'Manual entry',rates:[
      {label:'Manual rate — enter below',price:0,note:'Use your own business, account or negotiated shipping rate.'}
    ]}
  };

  function updateDeliveryRates(){
    const courier=$('deliveryCourier'),rate=$('deliveryRate');
    if(!courier||!rate)return;
    const key=courier.value;
    if(!key){rate.innerHTML='<option value="">Choose a courier first...</option>';setValue('deliveryRateOut',money(0));setText('deliveryRateNote','Choose a courier and service. The cost below can still be edited manually.');calc();return;}
    const profile=deliveryProfiles[key]||deliveryProfiles.custom;
    rate.innerHTML=profile.rates.map((r,i)=>'<option value="'+i+'">'+r.label+'</option>').join('');
    updateDeliveryRate(true);
  }

  function updateDeliveryRate(autoApply=true){
    const courier=$('deliveryCourier'),rate=$('deliveryRate');
    if(!courier||!rate||!courier.value)return;
    const profile=deliveryProfiles[courier.value]||deliveryProfiles.custom;
    const item=profile.rates[Number(rate.value)]||profile.rates[0];
    setValue('deliveryRateOut',money(item.price));
    setText('deliveryRateNote',profile.source+' • '+item.note);
    if(autoApply&&item.price>0)setValue('delivery',item.price);
    calc();
  }
'''
anchor="  function setText(id,text){const el=$(id);if(el)el.textContent=text;}"
if anchor not in t: raise SystemExit('JS setText anchor not found.')
t=t.replace(anchor,js+'\n'+anchor,1)

bind="    const clear=$('clear');"
ins="""    const deliveryCourier=$('deliveryCourier');
    if(deliveryCourier)deliveryCourier.addEventListener('change',updateDeliveryRates);
    const deliveryRate=$('deliveryRate');
    if(deliveryRate)deliveryRate.addEventListener('change',()=>updateDeliveryRate(true));

    const clear=$('clear');"""
if bind not in t: raise SystemExit('JS bind anchor not found.')
t=t.replace(bind,ins,1)

init="    try{applyPlatformProfile();}catch(err){console.error('Platform profile error:',err);runCalc();}"
if init not in t: raise SystemExit('JS init anchor not found.')
t=t.replace(init,init+"\n    try{updateDeliveryRates();}catch(err){console.error('Delivery rate error:',err);runCalc();}",1)

# Verify the existing secondary shortcut script did not change and key controls remain.
post=t
for i in ['deliveryCourier','deliveryRate','deliveryRateOut','deliveryRateNote','delivery','deliveryCharge']:
    if f'id="{i}"' not in post: raise SystemExit('Missing new control: '+i)
scripts=re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',post,flags=re.S|re.I)
if len(scripts)<2: raise SystemExit('Expected two calculator scripts.')
if 'function calc(){' not in post or "id=\"printer\"" not in post: raise SystemExit('Existing calculator content missing.')

p.write_text(post,encoding='utf-8')
print('Delivery rates feature patched successfully.')
