from pathlib import Path

path = Path('index.html')
s = path.read_text(encoding='utf-8')

old = '''<section class="panel"><div class="head"><div class="icon">%</div><div><h2>6. Platform Fees</h2><p>Marketplace and payment fees.</p></div></div><label>Platform</label><select id="platform"><option value="0">Own website</option><option value="6.5">Etsy</option><option value="12">eBay</option><option value="0">Other / custom</option></select><div class="two" style="margin-top:9px"><div><label>Payment fee (%)</label><input id="pay" type="number" value="0" step=".01"></div><div><label>Fixed fee (£)</label><input id="fixedFee" type="number" value="0" step=".01"></div></div></section>'''

new = '''<section class="panel"><div class="head"><div class="icon">%</div><div><h2>6. Platform Fees</h2><p>Choose where you sell and preload the current UK fee structure.</p></div></div><label>Platform</label><select id="platformSelect"><option value="own">Own website / direct sale</option><option value="etsy">Etsy UK</option><option value="ebay">eBay UK Business</option><option value="amazon">Amazon Handmade UK</option><option value="depop">Depop UK</option><option value="vinted">Vinted UK</option><option value="tiktok">TikTok Shop UK</option><option value="facebook">Facebook Marketplace</option><option value="gumtree">Gumtree</option><option value="folksy">Folksy</option><option value="shopify">Shopify Payments (Basic)</option><option value="custom">Other / custom</option></select><div class="two" style="margin-top:9px"><div><label>Platform fee (%)</label><input id="platform" type="number" value="0" min="0" step=".01"></div><div><label>Payment fee (%)</label><input id="pay" type="number" value="0" min="0" step=".01"></div></div><div class="two" style="margin-top:9px"><div><label>Fixed fee (£)</label><input id="fixedFee" type="number" value="0" min="0" step=".01"></div><div class="small" style="display:flex;align-items:flex-end;padding-bottom:10px" id="platformStatus">Select a platform to load its default fee assumptions.</div></div></section>'''

if old not in s:
    raise SystemExit('Could not locate Box 6 platform block')
s = s.replace(old, new, 1)

old_bind = "$('platform').onchange=()=>{calc()};"
new_bind = '''const platformProfiles={
  own:{platform:0,pay:0,fixed:0,note:'Direct sale / own website: no marketplace fee preloaded.'},
  etsy:{platform:6.98,pay:4,fixed:0.20,note:'Etsy UK: 6.5% transaction + 0.48% UK regulatory fee; Etsy Payments 4% + £0.20.'},
  ebay:{platform:12.25,pay:0,fixed:0.40,note:'eBay UK Business default: 11.9% Home/Furniture & DIY + 0.35% regulatory fee; £0.40 per order over £10.'},
  amazon:{platform:12.24,pay:0,fixed:0,note:'Amazon Handmade UK: 12.24% referral fee. Monthly selling-plan cost is not allocated per sale here.'},
  depop:{platform:0,pay:2.9,fixed:0.30,note:'Depop UK: no selling fee; Depop Payments 2.9% + £0.30. Boosted Listings are not included.'},
  vinted:{platform:0,pay:0,fixed:0,note:'Vinted UK: standard seller transaction fee is £0; buyer protection is charged to the buyer.'},
  tiktok:{platform:9,pay:0,fixed:0,note:'TikTok Shop UK: standard commission 9%; category/programme reductions or extra fees may apply.'},
  facebook:{platform:0,pay:0,fixed:0,note:'Facebook Marketplace: £0 transaction fee assumed for direct/local selling; checkout or promotional charges may vary.'},
  gumtree:{platform:0,pay:0,fixed:0,note:'Gumtree: no per-sale fee preloaded; paid listing or promotion options may apply.'},
  folksy:{platform:7.2,pay:1.5,fixed:0.20,note:'Folksy Basic: 6% commission + VAT = 7.2%; Stripe standard UK card rate shown as 1.5% + £0.20.'},
  shopify:{platform:0,pay:2,fixed:0.25,note:'Shopify Payments Basic: 2% + £0.25 standard online card rate. Monthly plan cost is not allocated per sale.'},
  custom:{platform:0,pay:0,fixed:0,note:'Enter your own platform and payment fees.'}
};
function applyPlatformProfile(){
  const key=$('platformSelect').value;
  const p=platformProfiles[key]||platformProfiles.custom;
  $('platform').value=p.platform;
  $('pay').value=p.pay;
  $('fixedFee').value=p.fixed;
  $('platformStatus').textContent=p.note;
  calc();
}
$('platformSelect').onchange=applyPlatformProfile;'''

if old_bind not in s:
    raise SystemExit('Could not locate platform binding')
s = s.replace(old_bind, new_bind, 1)

if 'applyPlatformProfile();' not in s:
    s = s.replace('updateMaterialUI();\ncalc();', 'updateMaterialUI();\napplyPlatformProfile();', 1)

path.write_text(s, encoding='utf-8')
print('Patched platform database')
