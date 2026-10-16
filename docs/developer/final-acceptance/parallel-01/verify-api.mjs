import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const out = dirname(fileURLToPath(import.meta.url)), root = resolve(out, '../../../..');
const read = p => readFileSync(resolve(root, p), 'utf8');
const hash = s => createHash('sha256').update(s).digest('hex');
const snapshot = JSON.parse(readFileSync(resolve(out, 'api-snapshot.json'), 'utf8'));
const fa02 = JSON.parse(read('docs/developer/final-acceptance/2026-10-16-source-inventory.json'));
assert.deepEqual(snapshot.receipt.changedBuiltDeclarationInputs, []);
assert.deepEqual(snapshot.receipt.changedSourceInputs, []);
for (const [file, value] of Object.entries(snapshot.declarations)) assert.equal(hash(read(file)), value.sha256, file);
for (const [file, value] of Object.entries(snapshot.sources)) assert.equal(hash(read(file)), value.sha256, file);
const refPaths = [
 'packages/ui/src/theme/AppThemeProvider.test.tsx',
 'packages/ui/src/experimental/Typography/Typography.test.tsx',
 'packages/ui/src/components/primitives/primitives.test.tsx',
 'packages/ui/src/components/AppModal/AppModal.test.tsx',
 'packages/ui/src/components/AppDataGrid/AppDataGrid.test.tsx',
 'packages/ui/src/components/AppDataGrid/ownedGridColumns.test.ts',
 'packages/ui/src/components/AppDataGrid/createDataGridColumns.test.tsx',
 'packages/ui/src/components/AppDataGrid/ownedGridController.test.ts',
 'packages/ui/src/components/AppDataGrid/ownedGridState.test.ts',
 'packages/ui/src/components/CardPaginationFooter/CardPaginationFooter.test.tsx',
 'docs/migration.md', 'docs/developer/react-aria-theme.md', 'docs/developer/react-aria-primitives.md',
 'docs/developer/react-aria-modal-shells.md', 'docs/developer/react-aria-catalog-grid.md',
 'docs/developer/react-aria-grid-contracts.md', 'docs/developer/react-aria-card-pagination.md',
 'docs/developer/react-aria-button.md', 'docs/developer/react-aria-final-acceptance.md',
 'docs/developer/react-aria-hardening-tasks.md', 'docs/developer/react-aria-scope-ledger.md',
 'docs/developer/final-acceptance/fa04-original-check.txt',
 'docs/developer/final-acceptance/fa04-calendar-rerun.txt',
 'docs/developer/final-acceptance/fa04-library-input-delta.json',
 'docs/developer/final-acceptance/fa04-package.txt',
];
const references = Object.fromEntries(refPaths.map(p => [p, { sha256: hash(read(p)), matchesFA02: fa02.inputHashes[p] === hash(read(p)) }]));
const tests = refPaths.filter(p => /\.test\.tsx?$/.test(p));
for (const test of tests) assert.equal(references[test].matchesFA02, true, `Changed retained test input ${test}`);
const aliases = new Map(Object.values(snapshot.routes).flat().map(e => [e.name, e.contract]));
for (const name of ['Provider', 'ThemeScope', 'AppThemeProvider', 'TypographyProps', 'ButtonProps', 'AppModalProps', 'AppModalAction',
 'AppDataGridProps', 'AppDataGridColumn', 'AppGridRowSelectionModel', 'AppGridPaginationModel', 'LearnerClass', 'AppPaginationFooterProps']) assert(aliases.has(name), name);
for (const name of ['AppButton', 'MuiLink', 'FormControlLabel', 'SelectChangeEvent', 'AppGridSortModel', 'lightTheme', 'darkTheme']) assert(!aliases.has(name), `Removed export unexpectedly present ${name}`);
const declaredDeprecated = Object.entries(snapshot.contracts).flatMap(([key, c]) => [
 ...c.tags.filter(t => t.name === 'deprecated').map(t => ({ key, tag: t })),
 ...c.ownedProperties.flatMap(p => p.tags.filter(t => t.name === 'deprecated').map(t => ({ key, property: p.name, tag: t }))),
]);
const result = { capturedAt: new Date().toISOString(), status: 'pass',
 checks: ['All captured declaration and production-source bytes still match capture',
 'All declaration and included production-source inputs match FA-01',
 'Ten cited retained test files match FA-02 inputs', 'Fourteen key public contracts resolve through reused routes',
 'Seven removed export names absent from reused public routes', 'Declaration and owned-property deprecation tags inspected'],
 declaredDeprecated, sourceDeprecated: snapshot.deprecated, references,
 limits: 'Static evidence verification only. No behavioral suite, package import, browser, build, device or AT rerun.' };
writeFileSync(resolve(out, 'verification.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ status: result.status, checks: result.checks, declaredDeprecated: declaredDeprecated.length, references: refPaths.length }, null, 2));
