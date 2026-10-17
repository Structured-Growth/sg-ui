// Read-only verification of operator-downloaded CI data; no fetch/extract/publish.
import { readFile, lstat, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
const hash = value => createHash('sha256').update(value).digest('hex');
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };
async function file(path) {
  requireThat((await lstat(path)).isFile(), `Not a regular file: ${path}`);
  return readFile(path);
}
async function tree(root) {
  const result = {};
  async function visit(path) {
    const stat=await lstat(path);
    requireThat(!stat.isSymbolicLink(), `Symlink rejected: ${path}`);
    if(stat.isDirectory()) for(const name of (await readdir(path)).sort()) await visit(resolve(path,name));
    else { requireThat(stat.isFile(),`Not a regular file: ${path}`);result[relative(root,path).split(sep).join('/')]=hash(await file(path)); }
  }
  await visit(root);return result;
}
export async function verifyCI(download) {
  const { expectedHead, runtime, run, job, artifacts, receiptPath, tarballPath, nativeDirectory, packageDirectory }=download;
  requireThat(/^[a-f0-9]{40}$/.test(expectedHead),'Expected immutable head is required');
  requireThat(['22.12.0','24'].includes(runtime),'Unsupported CI matrix runtime');
  requireThat(run?.head_sha===expectedHead && run.status==='completed' && run.conclusion==='success','Run failed, incomplete, or wrong head');
  requireThat(job?.head_sha===expectedHead && job.status==='completed' && job.conclusion==='success' && job.name===`Validate Node ${runtime}`,'Runtime job failed, incomplete, or wrong head/name');
  requireThat(new URL(run.html_url).origin==='https://github.com' && run.html_url===`https://github.com/Structured-Growth/sg-ui/actions/runs/${run.id}`,'Wrong producing run URL');
  requireThat(job.run_id===run.id && job.run_attempt===run.run_attempt,'Job belongs to another run/attempt');
  for(const name of ['Package and behavior checks','Build native docs fixtures','Packed React 18.3 foundation consumer','Packed React 19 foundation and Flight consumer','Packed React 18.3 editor consumer','Packed React 19 editor consumer','Pack validated package','Bind fresh outputs and tarball to validated inputs',...(runtime==='24'?['Browser interactions, accessibility and performance smoke','Packed Next.js production and browser consumer']:[])]) {
    const matches=job.steps?.filter(step=>step.name===name)??[];
    requireThat(matches.length===1 && matches[0].status==='completed' && matches[0].conclusion==='success',`Missing/unsuccessful required step: ${name}`);
  }
  for(const name of [`sgui-package-node-${runtime}`,`sgui-browser-docs-node-${runtime}`,`sgui-validation-node-${runtime}`,...(runtime==='24'?['sgui-browser-node-24']:[])]) {
    const matches=artifacts?.filter(a=>a.name===name)??[];
    requireThat(matches.length===1,`Missing/ambiguous artifact: ${name}`);
    const artifact=matches[0];
    requireThat(artifact.expired===false && Date.parse(artifact.expires_at)>Date.now(),'Artifact expired/unknown expiry');
    requireThat(artifact.workflow_run?.id===run.id && artifact.workflow_run?.head_sha===expectedHead,'Artifact belongs to another run/head');
    requireThat(artifact.digest===`sha256:${hash(await file(artifact.archivePath))}`,`Archive digest mismatch: ${name}`);
  }
  const receipt=JSON.parse(await file(receiptPath));
  requireThat(receipt.schemaVersion===1 && receipt.head===expectedHead && receipt.runURL===run.html_url && String(receipt.runAttempt)===String(run.run_attempt),'Receipt identity mismatch');
  requireThat(runtime==='24'?/^v24\./.test(receipt.node):receipt.node==='v22.12.0','Receipt runtime mismatch');
  requireThat(receipt.inputHash===hash(JSON.stringify(receipt.inputs)),'Input inventory digest mismatch');
  requireThat(Object.keys(receipt.inputs??{}).length>0 && Object.values(receipt.inputs).every(value=>/^[a-f0-9]{64}$/.test(value)),'Missing/invalid input inventory');
  requireThat(receipt.tarball?.sha256===hash(await file(tarballPath)),'Tarball digest mismatch');
  const actual={};
  for(const [path,digest] of Object.entries(await tree(nativeDirectory))) actual[`packages/ui/browser-docs-static/${path}`]=digest;
  for(const [path,digest] of Object.entries(await tree(resolve(packageDirectory,'dist')))) actual[`packages/ui/dist/${path}`]=digest;
  const sort=object=>Object.fromEntries(Object.entries(object).sort(([a],[b])=>a.localeCompare(b,'en')));
  requireThat(JSON.stringify(sort(actual))===JSON.stringify(sort(receipt.outputs??{})),'Extracted native/package output inventory mismatch');
  for(const key of ['packages/ui/dist/index.js','packages/ui/dist/index.d.ts','packages/ui/dist/styles.css','packages/ui/browser-docs-static/index.html'])requireThat(actual[key] && actual[key]!==hash(''),`Required output missing/empty: ${key}`);
  requireThat(Object.entries(actual).some(([path,digest])=>path.startsWith('packages/ui/browser-docs-static/') && path.endsWith('.css') && digest!==hash('')),'Native CSS missing/empty');
  for(const name of ['LICENSE','THIRD_PARTY_NOTICES.md']) requireThat(receipt.inputs[`packages/ui/${name}`]===hash(await file(resolve(packageDirectory,name))),`Packaged legal-file digest mismatch: ${name}`);
  return {status:'consistent-downloaded-ci-evidence',head:expectedHead,runtime,runURL:run.html_url,outputs:Object.keys(actual).length,limitations:'Operator must independently bind extracted files/receipt to verified archives and inspect browser results/skips. This checks supplied metadata consistency, not API authenticity, behavior, effective branch protection, licensing, npm control, provenance or release approval.'};
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(await verifyCI(JSON.parse(await readFile(process.argv[2],'utf8'))),null,2)); }
  catch(error) { console.error(error.message);process.exitCode=1; }
}
