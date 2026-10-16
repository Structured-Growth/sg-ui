const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const out = __dirname;
const root = path.resolve(out, '../../../..');
const req = createRequire(path.join(root,'packages/ui/package.json'));
const ts = req('typescript');
const inputs=JSON.parse(fs.readFileSync(path.join(out,'input-hashes.json')));
const previous=JSON.parse(fs.readFileSync(path.join(root,'docs/developer/final-acceptance/wave-02-15/input-receipt.json'))).inputHashes;
const integration=JSON.parse(fs.readFileSync(path.join(root,'docs/developer/final-acceptance/coordinator-integration/evidence.json')));
const sha=p=>fs.existsSync(p)?crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'):null;
const extra=[
 'packages/ui/src/experimental/SplitAction/SplitAction.tsx',
 'packages/ui/src/experimental/IconButton/IconButton.tsx',
 'packages/ui/src/components/AppModal/AppModal.tsx',
 'packages/ui/src/components/AppPageHeader/AppPageHeader.tsx',
 'packages/ui/src/components/DocumentEditorToolbar/DocumentEditorToolbar.tsx',
 'packages/ui/src/components/AppDataGrid/ownedGridColumns.ts',
 'packages/ui/src/components/AppDataGridRowDnd/DataGridDragHandle.tsx',
 'packages/ui/src/components/SideNavigation/SideNavigation.organization-lifetime.test.tsx',
 'packages/ui/src/components/Button/Button.test.tsx',
 'packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.test.tsx',
 'packages/ui/tests/browser/batch13-control-button.spec.ts',
 'packages/ui/tests/browser/post100-button-textarea-sourcefix.spec.ts',
 'packages/ui/src/components/TextStyleMenuControl/TextStyleMenuControl.tsx',
 'packages/ui/src/components/AppDataGrid/ownedGridCells.tsx',
 'packages/ui/src/adapters/Link.tsx',
 'packages/ui/src/experimental/Link/Link.tsx',
];
const supplemental=Object.fromEntries(extra.map(p=>[p,sha(path.join(root,p))]));
fs.writeFileSync(path.join(out,'supplemental-hashes.json'),JSON.stringify(supplemental,null,2)+'\n');
const deltas=Object.entries({...inputs,...supplemental}).map(([p,hash])=>({path:p,captured:hash,current:sha(path.join(root,p)),unchangedSinceCapture:hash===sha(path.join(root,p)),wave02:previous[p]?{sha256:previous[p],equal:previous[p]===hash}:null,coordinatorIntegration:integration.inputHashes[p]?{sha256:integration.inputHashes[p],equal:integration.inputHashes[p]===hash}:null}));
fs.writeFileSync(path.join(out,'hash-comparison.json'),JSON.stringify(deltas,null,2)+'\n');
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.tsx?$/.test(e.name))files.push(p);}}
walk(path.join(out,'proposed-files'));
const checks=files.map(p=>{const result=ts.transpileModule(fs.readFileSync(p,'utf8'),{fileName:p,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX},reportDiagnostics:true});return {path:path.relative(root,p),sha256:sha(p),diagnostics:(result.diagnostics||[]).map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n'))};});
const result={runtime:process.version,typescript:ts.version,scope:'TS transpilation syntax only; no public type or behavior proof',checks};
fs.writeFileSync(path.join(out,'syntax-check.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({syntaxFiles:checks.length,syntaxDiagnostics:checks.reduce((n,c)=>n+c.diagnostics.length,0),inputChanges:deltas.filter(d=>!d.unchangedSinceCapture)}));
process.exitCode=checks.some(c=>c.diagnostics.length)?1:0;
