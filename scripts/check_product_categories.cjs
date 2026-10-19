/* Regression checks for materials versus hardware and shared nightly rules. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
global.window = {};
require(path.join(root, 'product-categories.js'));
const catalogue = window.PRINTPROFIT_CATEGORIES;
const source = JSON.parse(fs.readFileSync(path.join(root, 'config/product-categories.json'), 'utf8'));
assert.deepEqual(catalogue.categories, source.categories);
const samples = [
 ['8BitDo SN30 PRO Controller for Switch, PC', 'PC', 'filament', 'game-controllers'],
 ['HDMI To USB Video Capture Box for PC', 'PC', 'filament', 'computer-peripherals'],
 ['Polymaker PolyLite PC Filament', 'PC', 'filament', 'pc-filament'],
 ['Nylon PA6 Filament 1kg', 'NYLON', 'filament', 'nylon-filament'],
 ['eSun ePLA-Matte Filament', 'PLA', 'filament', 'matte-pla'],
 ['ELEGOO ABS-like', 'ABS', 'filament', 'tough-resin'],
 ['Water Washable Resin 1kg', 'RESIN', 'filament', 'water-washable-resin'],
 ['ELEGOO Saturn 4 Resin 3D Printer', 'RESIN', 'printer', 'resin-printers'],
 ['Filament Dryer Box', 'PLA', 'filament', 'filament-dryers'],
 ['SUNLU Fila Dryer S1+', 'PLA', 'filament', 'filament-dryers'],
 ['123-3D PETG Pellets 1kg', 'PETG', 'filament', 'material-pellets'],
 ['PTFE Tube', 'Accessories', 'printer', 'filament-handling'],
 ['Wireless Mouse Creative Kit', 'Creative Kits', 'printer', 'creative-kits'],
 ['SUNLU 3D Printer Enclosure', 'Filament', 'printer', 'printer-enclosures'],
 ['Creality Ender 3 V3 SE', '3D Printer', 'printer', 'fdm-printers'],
];
for (const [name, type, category, expected] of samples) {
 assert.equal(catalogue.classify({name,type,category}).id, expected, name);
}
console.log(`Shared category config and ${samples.length} classification regressions passed.`);
