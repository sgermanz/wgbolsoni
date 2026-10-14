const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const original = fs.readFileSync(path.join(root, 'public/perfil-wilton-gerson-bolsoni.txt'), 'utf8');
const titles = [...original.matchAll(/^\d\. (.+?)(?: \(ISBN:| \(Manual| \(Livro|$)/gm)]
  .map(match => match[1]).filter(title => !/^[A-ZÁÉÍÓÚÇÊÃ ]+$/.test(title));
assert.equal(titles.length, 9);
const identifiers = [...original.matchAll(/ISBN: ([\d.-]+)/g)].map(match => match[1]);
const markers = {
  en: ['1. PROFILE SUMMARY', '6. PHILOSOPHICAL LEGACY', 'PROVENANCE NOTE', 'not been independently verified'],
  es: ['1. SÍNTESIS DEL PERFIL', '6. LEGADO FILOSÓFICO', 'NOTA DE PROCEDENCIA', 'verificados de forma independiente'],
  fr: ['1. SYNTHÈSE DU PROFIL', '6. HÉRITAGE PHILOSOPHIQUE', 'NOTE DE PROVENANCE', 'vérifiés de manière indépendante'],
  zh: ['1. 人物概况', '6. 哲学传承', '来源说明', '未经独立核实'],
};
for (const [locale, expected] of Object.entries(markers)) {
  const text = fs.readFileSync(path.join(root, `public/perfil-wilton-gerson-bolsoni.${locale}.txt`), 'utf8');
  assert.ok(text.length > 2500, locale);
  assert.ok(!text.includes('\uFFFD'), `${locale}: valid UTF-8`);
  for (const marker of expected) assert.ok(text.includes(marker), `${locale}: ${marker}`);
  for (const title of titles) assert.ok(text.includes(title), `${locale}: preserved title ${title}`);
  for (const id of identifiers) assert.ok(text.includes(id), `${locale}: preserved identifier ${id}`);
  for (const number of ['1976', '2026', '2006', '2011', '2010', '130', '-40ºC', '25']) {
    assert.ok(text.includes(number), `${locale}: preserved number ${number}`);
  }
  assert.match(text, /1[ ,.]700/, `${locale}: 1700 organizations`);
  assert.ok(text.includes('Krystallos Dock Logistic & 4PL S.A.'));
  assert.ok(text.includes('https://wgbolsoni.net/perfil-wilton-gerson-bolsoni.txt'));
  for (let section = 1; section <= 6; section++) {
    assert.ok(new RegExp(`^${section}\\. `, 'm').test(text), `${locale}: section ${section}`);
  }
  console.log(`${locale}: all six sections, nine original titles, identifiers, figures and provenance verified`);
}
console.log('Four full translations verified; Portuguese source remains separate.');
