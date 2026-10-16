import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
const root = process.cwd();
const directory = 'docs/developer/final-acceptance/wave-03-03';
const hash = path => existsSync(path) ? createHash('sha256').update(readFileSync(path)).digest('hex') : null;
const receipts = ['docs/developer/final-acceptance/coordinator-integration/evidence.json', 'docs/developer/final-acceptance/coordinator-fixes/evidence.json'];
const result = { capturedAt: new Date().toISOString(), runtime: process.version, scope: 'Read existing saved hash inventories only; no new export/source scan and no behavioral run', receipts: [] };
for (const receipt of receipts) {
  const evidence = JSON.parse(readFileSync(receipt));
  const item = { path: receipt, sha256: hash(receipt), collections: {} };
  for (const name of ['inputHashes','builtLibraryHashes','privateFixtureOutputHashes','builtHashes']) {
    if (!evidence[name]) continue;
    const matches = [], deltas = [];
    for (const [path, expected] of Object.entries(evidence[name])) {
      const actual = hash(path);
      if (actual === expected) matches.push(path); else deltas.push({path, expected, actual});
    }
    item.collections[name] = { compared: matches.length + deltas.length, unchanged: matches.length, deltas };
  }
  result.receipts.push(item);
}
const paths = [
 'packages/ui/src/experimental/TextField/TextField.tsx', 'packages/ui/src/experimental/TextField/TextField.module.css',
 'packages/ui/src/experimental/TextArea/TextArea.tsx','packages/ui/src/experimental/TextArea/TextArea.module.css',
 'packages/ui/src/experimental/Checkbox/Checkbox.tsx','packages/ui/src/experimental/Switch/Switch.tsx',
 'packages/ui/src/experimental/Calendar/Calendar.tsx','packages/ui/src/experimental/Calendar/Calendar.test.tsx',
 'packages/ui/src/experimental/Menu/Menu.tsx','packages/ui/src/experimental/IconButton/IconButton.tsx',
 'packages/ui/src/experimental/Select/Select.tsx','packages/ui/src/experimental/TagGroup/TagGroup.tsx',
 'packages/ui/src/experimental/Tabs/Tabs.tsx','packages/ui/src/experimental/RadioGroup/RadioGroup.tsx',
 'packages/ui/src/components/Button/Button.tsx','packages/ui/src/components/AppPageTabs/AppPageTabs.tsx',
 'packages/ui/src/components/AppDataGrid/AppDataGrid.tsx','packages/ui/src/components/AppDataGrid/types.ts',
 'packages/ui/src/components/AppDataGrid/ownedGridController.ts','packages/ui/src/components/AppDataGrid/ownedGridState.ts',
 'packages/ui/src/components/AppDataGrid/ownedGridCells.tsx','packages/ui/src/components/AppDataGrid/createActionMenuColumn.ts',
 'packages/ui/src/components/SideNavigation/SideNavigation.tsx','packages/ui/src/components/AppShell/AppShell.tsx',
 'packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.tsx',
 'packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx',
 'docs/developer/react-aria-adoption-checklist.md','packages/ui/vitest.config.ts','packages/ui/scripts/vitest.setup.ts',
 'docs/developer/final-acceptance/wave-02-15/report.md', 'docs/developer/final-acceptance/wave-02-15/results.json',
 'docs/developer/final-acceptance/coordinator-integration/library-build.txt',
 'docs/developer/final-acceptance/coordinator-integration/browsers-full.txt',
 'docs/developer/final-acceptance/coordinator-integration/package.txt',
 'docs/developer/final-acceptance/coordinator-fixes/evidence.json'
];
result.inspectedInputHashes = Object.fromEntries(paths.map(path => [path, hash(resolve(root,path))]));
writeFileSync(`${directory}/input-reconciliation.json`, JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.receipts.map(r=>({receipt:r.path,collections:Object.fromEntries(Object.entries(r.collections).map(([k,v])=>[k,{compared:v.compared,unchanged:v.unchanged,deltas:v.deltas}]))})),null,2));
