// Read-only reconciliation; stdout is captured only in this conversation's directory.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const root = cp.execFileSync('git', ['rev-parse', '--show-toplevel'], {encoding:'utf8'}).trim();
const ts = require(path.join(root, 'packages/ui/node_modules/typescript'));
const read = p => fs.readFileSync(path.join(root,p), 'utf8');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const baselinePath = 'docs/developer/migration-baseline/public-api.json';
const baseline = JSON.parse(read(baselinePath));
const oldPackage = JSON.parse(read('docs/developer/migration-baseline/package.json'));
const inventoryPath = 'docs/developer/final-acceptance/2026-10-16-inventory.json';
const inventory = JSON.parse(read(inventoryPath));
const unresolved = new Set();
function baselineNames(file, seen=new Set()) {
  if (seen.has(file)) return new Set();
  seen.add(file);
  if (!baseline[file]) {unresolved.add(file);return new Set();}
  const result = new Set();
  const ast = ts.createSourceFile(file,baseline[file],ts.ScriptTarget.Latest,true);
  for (const node of ast.statements) {
    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (const el of node.exportClause.elements) result.add(el.name.text);
      } else if (!node.exportClause && node.moduleSpecifier) {
        const spec = node.moduleSpecifier.text;
        if (spec.startsWith('.')) {
          const target = path.posix.normalize(path.posix.join(path.posix.dirname(file),spec)).replace(/\.js$/,'.d.ts');
          for(const n of baselineNames(target,seen))result.add(n);
        } else unresolved.add(spec);
      }
    } else if (node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)) {
      if (node.name) result.add(node.name.text);
      if (ts.isVariableStatement(node)) for(const d of node.declarationList.declarations) if(ts.isIdentifier(d.name))result.add(d.name.text);
    }
  }
  return result;
}
const categories = {
  app:n=>/^App[A-Z]/.test(n),
  classCompatibility:n=>/Class|CLASS/.test(n),
  retiredBrand:n=>/mui|emotion|material.?ui/i.test(n),
  sg:n=>/^SG[A-Z]/.test(n),
  course:n=>/Course/.test(n),
};
const routeComparisons=[];
for(const [subpath,conditions] of Object.entries(oldPackage.exports)) {
  if (!conditions.types) continue;
  const oldNames = baselineNames(conditions.types.replace('./dist/',''));
  const entry = inventory.entries.find(e=>e.subpath===subpath);
  const newNames = new Set(entry?.declaredExports.map(e=>e.name) || []);
  const groups={};
  for (const [group,predicate]of Object.entries(categories)) groups[group]={
    baseline:[...oldNames].filter(predicate).sort(),
    retained:[...oldNames].filter(n=>predicate(n)&&newNames.has(n)).sort(),
    removed:[...oldNames].filter(n=>predicate(n)&&!newNames.has(n)).sort(),
    added:[...newNames].filter(n=>predicate(n)&&!oldNames.has(n)).sort(),
  };
  routeComparisons.push({subpath,groups});
}
const assert = require('node:assert/strict');
const rootGroups = routeComparisons.find(e=>e.subpath==='.').groups;
assert.deepEqual(rootGroups.app.removed,['AppButton','AppButtonProps','AppGridSortModel']);
assert.deepEqual(rootGroups.classCompatibility.removed,[]);
assert.deepEqual(rootGroups.retiredBrand.removed,['MuiLink','MuiLinkProps']);
assert.deepEqual(rootGroups.sg.added,[]);
assert.deepEqual(rootGroups.classCompatibility.added,['ClassCardFrameProps','LearnerClassCardProps','LearnerClassesDataGridProps']);
assert.deepEqual(rootGroups.course.added,['adminCourseStatuses','createAdminCourseGridOptions','createInstructorCourseGridOptions','createInstructorCourseLearnersGridOptions','instructorCourseLearnerStatuses','instructorCourseStatuses']);
for (const e of routeComparisons) {
  assert.deepEqual(e.groups.classCompatibility.removed,[]);
  assert(e.groups.app.removed.every(n=>['AppButton','AppButtonProps','AppGridSortModel'].includes(n)));
}
for (const entry of inventory.entries) {
  assert(!entry.declaredExports.some(n=>['AppButton','AppButtonProps'].includes(n.name)));
}
for (const route of ['.','./components','./primitives','./experimental','./components/Button']) {
  const entry=inventory.entries.find(e=>e.subpath===route);
  assert(entry.declaredExports.some(n=>n.name==='Button'&&n.value));
  assert(entry.declaredExports.some(n=>n.name==='ButtonProps'&&n.type));
}
for (const route of ['.','./components','./primitives','./experimental']) {
  const entry=inventory.entries.find(e=>e.subpath===route);
  assert(entry.declaredExports.some(n=>n.name==='Link'&&n.value));
  assert(entry.declaredExports.some(n=>n.name==='LinkProps'&&n.type));
}
const currentBrandMatches=inventory.entries.flatMap(e=>e.declaredExports.filter(n=>categories.retiredBrand(n.name)).map(n=>({subpath:e.subpath,...n})));
const sourceDelta=[];
for(const [file,expected]of Object.entries(inventory.sourceHashes)) {
  if(!file.startsWith('packages/ui/src/') && file!=='packages/ui/package.json')continue;
  const actual=fs.existsSync(path.join(root,file))?hash(file):null;
  if(actual!==expected)sourceDelta.push({file,expected,actual});
}
const builtDelta=[];
for(const [file,expected]of Object.entries(inventory.builtHashes)) {
  const p='packages/ui/'+file;
  const actual=fs.existsSync(path.join(root,p))?hash(p):null;
  if(actual!==expected)builtDelta.push({file,expected,actual});
}
const refs=[baselinePath,'docs/developer/migration-baseline/package.json',inventoryPath,
'docs/developer/final-acceptance/2026-10-16-source-inventory.json',
'docs/developer/final-acceptance/fa01-package.txt','docs/developer/final-acceptance/fa04-package.txt',
'docs/developer/final-acceptance/fa04-original-check.txt','docs/developer/final-acceptance/fa04-library-input-delta.json',
'packages/ui/src/index.ts','packages/ui/src/components/index.ts','packages/ui/src/components/primitives/index.ts',
'packages/ui/src/models.ts','packages/ui/src/components/AdminDataGridOptions.ts','packages/ui/src/components/InstructorDataGridOptions.ts',
'packages/ui/src/components/AdminDataGridOptions.test.tsx','packages/ui/src/experimental/Link/Link.tsx',
'packages/ui/src/experimental/Link/Link.test.tsx','packages/ui/src/adapters/navigation.test.tsx',
'packages/ui/scripts/check-package.mjs','docs/migration.md','docs/developer/react-aria-primitives.md',
'docs/developer/react-aria-button.md','docs/developer/react-aria-grid-presets.md','docs/developer/react-aria-catalog-grid.md',
'docs/developer/react-aria-architecture.md','docs/developer/react-aria-hardening-tasks.md'];
const report={capturedAt:new Date().toISOString(),head:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
branch:cp.execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),
inventoryCapturedAt:inventory.capturedAt,checks:{assertions:"passed: route-specific App/Class retention, authorized removals, SG stability, Course additions, Button and Link public replacement routes",routeComparisons,currentBrandMatches,unresolvedBaselineStars:[...unresolved],
sourceDelta,builtHashCount:Object.keys(inventory.builtHashes).length,builtDelta},referenceHashes:Object.fromEntries(refs.map(p=>[p,hash(p)]))};
console.log(JSON.stringify(report,null,2));
if(currentBrandMatches.length||builtDelta.length||unresolved.size)process.exitCode=1;
