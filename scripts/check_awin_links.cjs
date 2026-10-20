const assert=require('node:assert/strict');
const fs=require('node:fs');
global.window={};
const {link,programmes}=require('../affiliate-tracking.js');
const html=fs.readFileSync('price-finder.html','utf8');
const listing='https://www.3djake.uk/esun/pla-basic-black-1?variant=123';

assert.equal(link(listing,'3DJake UK'),null,'Awin links must be inactive before advertiser approval');
assert.equal(link(listing,'Bambu Lab UK'),null,'A retailer cannot borrow another programme');
assert.match(html,/affiliate-tracking\.js/,'The comparison page must load the Awin resolver');
assert.match(html,/retailerLink\(x\.url,'Check live ↗','link',x\.retailer\)/,'Listing links must pass the retailer');

programmes['3DJake UK'].approved=true;
programmes['3DJake UK'].advertiserId='12345';
const url=new URL(link(listing,'3DJake UK'));
assert.equal(url.hostname,'www.awin1.com');
assert.equal(url.searchParams.get('awinmid'),'12345');
assert.equal(url.searchParams.get('awinaffid'),'3128307');
assert.equal(url.searchParams.get('ued'),listing,'The exact product and variant must survive');
assert.equal(link('https://example.com/other-product','3DJake UK'),null,'Unapproved destinations must stay untracked');
assert.equal(link('http://www.3djake.uk/esun/pla-basic-black-1','3DJake UK'),null,'Tracking must require HTTPS');
console.log('Awin link checks passed.');
