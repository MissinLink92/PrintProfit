const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'legacy-index.html'), 'utf8');
const values = [...html.matchAll(/<option(?:\s+[^>]*)?\svalue="(custom\|[^"]+)"[^>]*>/g)].map(match => match[1]);
assert.ok(values.length >= 35, 'Expected verified named model choices');
assert.equal(new Set(values).size, values.length, 'Named choices need unique values');

const start = html.indexOf('function printerData()');
const end = html.indexOf('function updatePrinterMaterialMode()', start);
assert.ok(start > 0 && end > start);
const printer = { value: 'custom|qidi:q2', selectedIndex: 0, options: [{}] };
const inputs = { customPrinterPower: 145, customPrinterPrice: 427, customPrinterLife: 3900 };
const context = { $: () => printer, n: id => inputs[id] || 0 };
vm.createContext(context);
vm.runInContext(html.slice(start, end), context);
assert.deepEqual(JSON.parse(JSON.stringify(context.printerData())), { watts: 145, price: 427, lifetime: 3900 });
printer.value = '150|220|3000';
assert.deepEqual(JSON.parse(JSON.stringify(context.printerData())), { watts: 150, price: 220, lifetime: 3000 });

const option = { textContent: 'A1', value: '130|320|3000', dataset: {} };
const select = { options: [option], dispatchEvent() {} };
const page = { PRINTPROFIT_PRINTER_PRICES: { A1: 259 } };
const document = { readyState: 'complete', getElementById: id => id === 'printer' ? select : null };
vm.runInNewContext(fs.readFileSync(path.join(root, 'printer-price-sync.js'), 'utf8'), { window: page, document, Event: class {} });
assert.equal(option.value, '130|320|3000', 'Retail changes must not alter cost profiles');
assert.equal(option.dataset.retailPrice, '259');
console.log(`Printer profiles verified: ${values.length} named choices, manual values and separate retail reference.`);
