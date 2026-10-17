import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile,mkdtemp,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const packageJson=process.env.SGUI_TYPESCRIPT_PACKAGE_JSON||resolve(process.cwd(),'packages/ui/package.json');
const compiler=createRequire(packageJson).resolve('typescript');
const tool=join(here,'public-contract-inventory.mjs');
async function fixture(t,text){const dir=await mkdtemp(join(here,'inventory-test-'));t.after(()=>rm(dir,{recursive:true,force:true}));const pkg=join(dir,'package');await mkdir(join(pkg,'dist'),{recursive:true});await writeFile(join(pkg,'package.json'),JSON.stringify({name:'contract-proof',version:'0',exports:{'.':{types:'./dist/index.d.ts'},'./alias':{types:'./dist/alias.d.ts'},'./icons/*Icon':{types:'./dist/*Icon.d.ts'},'./styles.css':'./dist/styles.css'}}));await writeFile(join(pkg,'dist/index.d.ts'),text);await writeFile(join(pkg,'dist/alias.d.ts'),"export { Control as RenamedControl } from './index.js';");await writeFile(join(pkg,'dist/AddIcon.d.ts'),'export declare const AddIcon: (props: {label?: string}) => string;');const output=join(dir,'receipt');const result=spawnSync(process.execPath,[tool,'--package',pkg,'--typescript',compiler,'--output',output],{encoding:'utf8'});return {result,receipt:JSON.parse(await readFile(join(output,'public-contracts.json'),'utf8')),text:await readFile(join(pkg,'dist/index.d.ts'),'utf8')};}
test('resolves generics, inherited properties, aliases, union naming and wildcard routes',async t=>{const text=`interface Base<T> { onChange?: (value: T) => void; ref?: {current: T}; }
export interface Props<T> extends Base<T> { value: T; }
export declare function Control<T>(props: Props<T> & ({label: string} | {'aria-label': string})): T;
`;const {result,receipt,text:after}=await fixture(t,text);assert.equal(result.status,0,result.stderr);assert.equal(after,text);assert.ok(receipt.routes['./icons/AddIcon']);assert.equal(receipt.routes['.'].find(x=>x.name==='Control').contract,receipt.routes['./alias'][0].contract);const control=Object.values(receipt.contracts).find(c=>c.name==='Control');assert.deepEqual(control.typeParameters,['T']);const props=control.parameters[0][0];assert.equal(props.alternatives.length,2);assert.ok(props.properties.find(p=>p.name==='ref'));assert.equal(props.properties.find(p=>p.name==='onChange').callbacks.length,1);assert.equal(receipt.issues.length,0);assert.ok(receipt.assets.some(a=>a.route==='./styles.css'));});
test('fails rather than silently accepting top-level any declarations',async t=>{const {result,receipt}=await fixture(t,'export declare const Control: any;');assert.equal(result.status,1);assert.ok(receipt.issues.some(i=>i.name==='Control'&&i.type==='any'));});
