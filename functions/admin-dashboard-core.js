'use strict';

function requireOwnerMfa(auth, owner, nowSeconds = Math.floor(Date.now() / 1000)) {
  const configured = String(owner || '').trim().toLowerCase();
  const email = String(auth?.token?.email || '').trim().toLowerCase();
  const signedInAt = Number(auth?.token?.auth_time);
  return Boolean(configured && email === configured && auth?.token?.email_verified === true &&
    auth?.token?.firebase?.sign_in_second_factor === 'totp' &&
    Number.isFinite(signedInAt) && signedInAt <= nowSeconds && signedInAt > nowSeconds - 12 * 3600);
}

function summarizeSubscriptions(items, prices, livemode) {
  const allowed = new Set([prices.monthly, prices.annual].filter(Boolean));
  const totals = {active:0, trialing:0, cancelling:0, pastDue:0, projectedMrrPence:0};
  for (const subscription of items) {
    if (subscription.livemode !== livemode) continue;
    const proItems = (subscription.items?.data || []).filter(item => allowed.has(item.price?.id) && item.price?.currency === 'gbp');
    if (!proItems.length) continue;
    const status = subscription.status;
    if (status === 'active') totals.active++;
    else if (status === 'trialing') totals.trialing++;
    else if (status === 'past_due') totals.pastDue++;
    else continue;
    if (subscription.cancel_at_period_end || subscription.cancel_at) totals.cancelling++;
    if (status !== 'active') continue;
    for (const item of proItems) {
      const price = item.price;
      const amount = Number(price.unit_amount);
      const quantity = Number(item.quantity || 1);
      const interval = price.recurring?.interval;
      const intervalCount = Number(price.recurring?.interval_count || 1);
      if (!Number.isFinite(amount) || !Number.isFinite(quantity) || intervalCount < 1) continue;
      if (interval === 'month') totals.projectedMrrPence += amount * quantity / intervalCount;
      if (interval === 'year') totals.projectedMrrPence += amount * quantity / (12 * intervalCount);
    }
  }
  totals.projectedMrrPence = Math.round(totals.projectedMrrPence);
  return totals;
}
module.exports = {requireOwnerMfa, summarizeSubscriptions};
