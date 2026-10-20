const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const iconFile = path.join(root, 'assets/printprofit-icon-master.svg');
const symbols = new Set([...fs.readFileSync(iconFile, 'utf8').matchAll(/<symbol\s+id="(pp-[a-z-]+)"/g)].map(match => match[1]));
const pages = ['guide.html', 'price-finder.html', 'privacy.html', 'terms.html'];
const sources = [...pages, 'my-projects.js', 'my-materials.js', 'site-header.js', 'site-unified.js', 'ui-modals.js'];

for (const file of sources) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of content.matchAll(/printprofit-icon-master\.svg#(pp-[a-z-]+)/g)) {
    assert(symbols.has(match[1]), `${file}: missing ${match[1]} symbol`);
  }
  for (const match of content.matchAll(/data-pp-icon="([a-z-]+)"/g)) {
    assert(symbols.has(`pp-${match[1]}`), `${file}: missing pp-${match[1]} symbol`);
  }
}
for (const file of pages) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  assert(content.includes('site-unified.css'), `${file}: shared styling is missing`);
  assert(content.includes('site-unified.js'), `${file}: icon rendering is missing`);
}
assert(fs.readFileSync(path.join(root, 'legacy-index.html'), 'utf8').includes('workspace-unified.css'));
console.log(`Shared site icons resolve to ${symbols.size} master symbols across ${sources.length} sources.`);
