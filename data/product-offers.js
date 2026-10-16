// Only retailer/programme-approved offers. Empty until real offers are supplied.
// Each record requires: approved:true, retailer (exact catalogue name), productIds
// (explicit applicable catalogue IDs), title, terms (all exclusions/minimum spend),
// expiresAt (ISO timestamp with timezone), lastChecked, url (official HTTPS link).
// Optional: startsAt (ISO timestamp), code (omit for automatic deals), affiliate:true.
// Never insert sample offers in production. Copying codes must not track a click.
window.PRINTPROFIT_OFFERS=[];
