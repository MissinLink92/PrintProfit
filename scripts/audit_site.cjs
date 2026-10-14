/* Read-only public-site checks. Uses fresh browser contexts; no accounts or cloud writes. */
const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const { PNG } = require('pngjs');
const base = process.env.PP_AUDIT_URL || 'https://printprofit.co.uk/';
const output = path.resolve(process.env.PP_AUDIT_OUTPUT || '.audit-output');
const languages = ['en', 'pl', 'de', 'fr', 'es', 'it'];
const pages = ['index.html', 'price-finder.html', 'guide.html', 'privacy.html', 'terms.html'];
const report = { checkedAt: new Date().toISOString(), base, pages: [], contrastChecks: [], failures: [], warnings: [] };
const check = (condition, message) => { if (!condition) throw Error(message); };

// Sample the rendered surface behind the text, including gradients and pseudo-elements.
async function checkCompareContrast(page, viewport, dark) {
 const hero = page.locator('.hero');
 await hero.scrollIntoViewIfNeeded();
 const samples = await hero.evaluate(element => {
  const heroRect = element.getBoundingClientRect();
  return ['.kicker', 'h1', 'h1 strong', '.lead'].map(selector => {
   const text = element.querySelector(selector);
   const rect = text.getBoundingClientRect();
   const style = getComputedStyle(text);
   let opacity = 1;
   for (let node = text; node; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
   const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700);
   return { selector, color: style.color, opacity, threshold: large ? 3 : 4.5,
    x: rect.left - heroRect.left, y: rect.top - heroRect.top, width: rect.width, height: rect.height };
  });
 });
 const pixels = PNG.sync.read(await hero.screenshot({ scale: 'css',
  style: '.hero * { visibility: hidden !important; }' }));
 const luminance = rgb => rgb.map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
  .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
 for (const sample of samples) {
  const color = sample.color.match(/[\d.]+/g).map(Number);
  const alpha = (color[3] ?? 1) * sample.opacity;
  let minimum = Infinity;
  for (const across of [.05, .5, .95]) for (const down of [.1, .5, .9]) {
   const x = Math.max(0, Math.min(pixels.width - 1, Math.floor(sample.x + sample.width * across)));
   const y = Math.max(0, Math.min(pixels.height - 1, Math.floor(sample.y + sample.height * down)));
   const offset = (y * pixels.width + x) * 4;
   const background = [...pixels.data.subarray(offset, offset + 3)];
   const foreground = color.slice(0, 3).map((value, index) => value * alpha + background[index] * (1 - alpha));
   const values = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
   minimum = Math.min(minimum, (values[1] + .05) / (values[0] + .05));
  }
  const result = { viewport: viewport.width, theme: dark ? 'dark' : 'light', selector: sample.selector,
   ratio: Number(minimum.toFixed(2)), required: sample.threshold };
  report.contrastChecks.push(result);
  check(minimum >= sample.threshold, `Compare ${result.theme} ${sample.selector} contrast ${result.ratio}:1; requires ${sample.threshold}:1`);
 }
 await hero.screenshot({ path: path.join(output, `compare-hero-${viewport.width}-${dark ? 'dark' : 'light'}.png`) });
}

async function auditPage(browser, name, viewport) {
 const context = await browser.newContext({ viewport });
 const page = await context.newPage();
 const failures = [], network = [];
 page.on('pageerror', error => failures.push(error.message));
 page.on('response', response => {
  const url = new URL(response.url());
  if (url.origin === new URL(base).origin) {
   network.push({ url: url.pathname, status: response.status() });
   if (response.status() >= 400) failures.push(`HTTP ${response.status()} ${url.pathname}`);
  }
 });
 const started = Date.now();
 try {
  const response = await page.goto(new URL(name, base).href, { waitUntil: 'domcontentloaded', timeout: 30000 });
  check(response?.ok(), `${name} did not load successfully`);
  let scope = page;
  if (name === 'index.html') {
   await page.locator('body[data-pp-ready="true"]').waitFor({ timeout: 30000 });
   scope = page.frameLocator('#app');
  }
  await scope.locator('#pvmLanguage').waitFor({ state: 'visible', timeout: 15000 });
  const readyMs = Date.now() - started;
  check(await scope.locator('#pvmLanguage option').count() === 6, 'Language menu must have six choices');
  check(await scope.locator('.pvm-dark input').count() === 1, 'Shared theme switch missing');
  if (name === 'index.html') {
   await scope.locator('.pvm-nav button[data-a="account"]').waitFor({ state: 'visible', timeout: 5000 });
   await scope.locator('.pvm-nav button[data-a="account"]').click();
   await scope.locator('#ppAccountEmail').waitFor({ state: 'visible', timeout: 15000 });
   await scope.locator('#ppMaterialsPanel button[data-material-close]').click();
  }
  if (name === 'price-finder.html') {
   const count = await page.locator('#rows > tr').count();
   check(count > 0 && count <= 20, `Compare rendered ${count} rows; expected 1–20`);
   await page.locator('#nextResults').click();
   check(await page.locator('#rows > tr').count() <= 20, 'Compare pagination exceeded 20 rows');
  }
  if (name === 'guide.html') {
   await page.locator('#calculator-basics summary').click();
   check(await page.locator('#calculator-basics').getAttribute('open') !== null, 'Guide overview did not expand');
  }
  for (const lang of languages) {
   await scope.locator('#pvmLanguage').selectOption(lang);
   const langRoot = name === 'index.html' ? scope.locator('html') : page.locator('html');
   await scope.locator(`html[lang="${lang}"]`).waitFor({ state: 'attached', timeout: 15000 });
   check(await langRoot.getAttribute('lang') === lang, `Language did not change to ${lang}`);
  }
  for (const dark of [false, true]) {
   if (await scope.locator('.pvm-dark input').isChecked() !== dark) await scope.locator('.pvm-dark').click();
   check(await scope.locator('.pvm-dark input').isChecked() === dark, 'Theme switch did not change');
   await page.waitForTimeout(150);
   const layout = await scope.locator('body').evaluate(body => ({
    width: body.ownerDocument.defaultView.innerWidth,
    contentWidth: body.ownerDocument.documentElement.scrollWidth
   }));
   check(layout.contentWidth <= layout.width + 2, `Horizontal page overflow: ${layout.contentWidth}/${layout.width}`);
   if (name === 'price-finder.html') await checkCompareContrast(page, viewport, dark);
  }
  const timing = await page.evaluate(() => ({
   navigation: performance.getEntriesByType('navigation').map(n => ({ ttfbMs: Math.round(n.responseStart), loadMs: Math.round(n.loadEventEnd) }))[0],
   resources: performance.getEntriesByType('resource').length,
   transferredBytes: performance.getEntriesByType('resource').reduce((sum, r) => sum + r.transferSize, 0)
  }));
  for (const frame of page.frames().filter(frame => frame !== page.mainFrame())) {
   const extra = await frame.evaluate(() => ({
    resources: performance.getEntriesByType('resource').length,
    bytes: performance.getEntriesByType('resource').reduce((sum, r) => sum + r.transferSize, 0)
   }));
   timing.resources += extra.resources;
   timing.transferredBytes += extra.bytes;
  }
  if (readyMs > 10000) report.warnings.push(`${name} at ${viewport.width}px took ${readyMs}ms to become usable`);
  if (timing.transferredBytes > (name === 'price-finder.html' ? 6000000 : 25000000)) report.warnings.push(`${name} at ${viewport.width}px exceeded its download budget`);
  await page.screenshot({ path: path.join(output, name.replace('.html', '') + '-' + viewport.width + '.png') });
  report.pages.push({ name, viewport: viewport.width, readyMs, ...timing, requests: network.length });
 } catch (error) {
  failures.push(error.message);
  await page.screenshot({ path: path.join(output, 'failure-' + name + '-' + viewport.width + '.png') }).catch(() => {});
 } finally {
  report.failures.push(...failures.map(message => `${name} (${viewport.width}px): ${message}`));
  await context.close();
 }
}

(async () => {
 await fs.mkdir(output, { recursive: true });
 const browser = await chromium.launch({ headless: true });
 try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
   for (const name of pages) await auditPage(browser, name, viewport);
  }
  const data = JSON.parse(await fs.readFile('data/price-finder.json', 'utf8'));
  const date = data.lastRefreshSummary?.checkedAt;
  if (!date || Date.now() - Date.parse(date) > 36 * 3600000) report.failures.push('Price refresh is older than 36 hours or missing');
  const verified = data.lastRefreshSummary?.verifiedProducts || 0;
  const listed = data.products.filter(p => !p.sourceUnavailable).length;
  const retained = listed - verified;
  report.pricing = { listed, verified, retained, archived: data.products.length - listed, lastRefresh: date };
  if (retained) report.warnings.push(`${retained} listed prices were not verified in the latest refresh`);
 } finally {
  await browser.close();
  await fs.writeFile(path.join(output, 'audit.json'), JSON.stringify(report, null, 2) + '\n');
  const lines = ['# PrintProfit site audit', '', `Checked: ${report.checkedAt}`, '',
   '| Page | Width | Ready time | Download bytes |', '|---|---:|---:|---:|',
   ...report.pages.map(p => `| ${p.name} | ${p.viewport} | ${p.readyMs}ms | ${p.transferredBytes} |`),
   '', '## Problems', '', ...(report.failures.length ? report.failures.map(x => '- ' + x) : ['No functional failures found.']),
   '', '## Warnings', '', ...(report.warnings.length ? report.warnings.map(x => '- ' + x) : ['No warnings.'])];
  await fs.writeFile(path.join(output, 'audit.md'), lines.join('\n') + '\n');
  console.log(JSON.stringify(report, null, 2));
  if (report.failures.length) process.exitCode = 1;
 }
})().catch(error => { console.error(error); process.exitCode = 1; });
