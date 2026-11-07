// Import only Blizzard game-data fields, not the reference site's UI or editorial comparisons.
import { readFile, writeFile } from 'node:fs/promises';

const source = 'https://www.mmoherald.com/wow-forever/tools/talents';
const input = process.argv[2];
let bundle;
if (input) bundle = await readFile(input, 'utf8');
else {
  const response = await fetch(source);
  if (!response.ok) throw new Error(`Source returned ${response.status}`);
  const html = await response.text();
  const paths = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1]);
  for (const path of paths) {
    const result = await fetch(new URL(path, source));
    if (!result.ok) throw new Error(`Script returned ${result.status}`);
    const text = await result.text();
    if (text.includes('"maxPoints":51')) { bundle = text; break; }
  }
}
if (!bundle) throw new Error('No client-data snapshot found. Source format may have changed.');
const snapshots = [];
for (const match of bundle.matchAll(/JSON\.parse\('((?:\\.|[^'\\])*)'\)/g)) {
  // Decode a JavaScript string literal without evaluating downloaded code.
  const json = match[1].replace(/\\(\\|'|"|n|r|t)/g, (_, char) => ({ n: '\n', r: '\r', t: '\t' }[char] ?? char));
  const data = JSON.parse(json);
  if (data.class?.slug && data.trees?.length === 3 && data.build === '1.60.1.69913') snapshots.push(data);
}
if (snapshots.length !== 9 || new Set(snapshots.map(data => data.class.slug)).size !== 9) throw new Error('Expected nine distinct classes.');
const output = {
  build: '1.60.1.69913',
  source,
  provenance: 'Blizzard beta client data, via MMO Herald / wago.tools. Community snapshot; not independently client-verified. Blizzard game text and icons belong to Blizzard Entertainment.',
  classes: Object.fromEntries(snapshots.map(data => [data.class.slug, data.trees.map(tree => ({
    name: tree.name,
    talents: tree.talents.map(talent => ({
      id: talent.id, name: talent.name, row: talent.row - 1, col: talent.col - 1,
      max: talent.maxRank, requires: talent.requires, counts: talent.counts || 'tree',
      prerequisites: talent.prereq ? [talent.prereq] : [],
      descriptions: talent.ranks, gaps: talent.gaps, icon: talent.icon,
    })),
  }))])),
};
await writeFile(new URL('../src/talents.json', import.meta.url), JSON.stringify(output, null, 2) + '\n');
console.log(`Imported ${snapshots.length} classes, ${snapshots.reduce((sum, data) => sum + data.trees.reduce((n, tree) => n + tree.talents.length, 0), 0)} talents.`);
