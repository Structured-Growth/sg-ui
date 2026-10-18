// Private Xcode/Safari/VoiceOver acceptance driver; never part of the package.
import {spawn, execFileSync} from 'node:child_process';
import {openSync, closeSync} from 'node:fs';
import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve, join} from 'node:path';
import {acquireLease, releaseLease, HEAVY_LOCK, LEGACY_LOCK} from '../../scripts/browser-validation-pool.mjs';
import {startServer} from '../../scripts/serve-browser-docs.mjs';

const ui = fileURLToPath(new URL('../../', import.meta.url));
const repo = resolve(ui, '../..');
const args = process.argv.slice(2);
const option = key => { const i = args.indexOf(key); return i < 0 ? undefined : args[i + 1]; };
if (process.platform !== 'darwin') throw Error('Requires macOS, Xcode27+ and an installed iOS27+ Simulator runtime.');
const port = Number(option('--port') ?? 6183);
if (!Number.isInteger(port) || port < 1024 || port > 65535 || port === 3000) throw Error('Use a dedicated loopback test port, never user server3000.');
const only = option('--only') ?? 'testSafariSelectAndVoiceOverSpeech';
if (only && !/^test[A-Za-z0-9_]+$/.test(only)) throw Error('Use one XCTest method name for --only');
const fixtureDir = resolve(option('--fixture-dir') ?? join(ui, 'browser-docs-static'));
const output = resolve(option('--output') ?? join(ui, 'artifacts', 'apple-simulator-'+Date.now()));
await mkdir(output); // Refuse to overwrite prior evidence.
const owner = 'apple-simulator:'+process.pid;
const leases = [];
let server, device, startedDevice = false;
const receipt = {startedAt:new Date().toISOString(), status:'started', runs:[], limits:['Simulator execution is not physical-device evidence.', 'Automated VoiceOver speech does not close manual six-family usability acceptance.', 'Native XCTest taps and typing are interaction setup, not VoiceOver activation gestures.']};
const hash = async path => createHash('sha256').update(await readFile(path)).digest('hex');
async function inventory(dir, prefix = '') {
 const result = {};
 for (const entry of await readdir(join(dir,prefix),{withFileTypes:true})) {
  const path=join(prefix,entry.name);
  if(entry.isDirectory()) Object.assign(result,await inventory(dir,path));
  else if(entry.isFile()) result[path]=await hash(join(dir,path));
 }
 return result;
}
async function run(name, command, argv, timeoutMs=180000) {
 const fd=openSync(join(output,name+'.log'),'wx');
 const start=new Date().toISOString();
 const child=spawn(command,argv,{cwd:repo,env:process.env,stdio:['ignore',fd,fd]});
 let timedOut=false,force;
 const timer=setTimeout(()=>{timedOut=true;child.kill('SIGTERM');force=setTimeout(()=>child.kill('SIGKILL'),10000);},timeoutMs);
 let result;
 try { result=await new Promise((done,reject)=>{child.once('error',reject);child.once('exit',(code,signal)=>done({code,signal}));}); }
 finally {clearTimeout(timer);clearTimeout(force);closeSync(fd);}
 receipt.runs.push({name,command,arguments:argv,startedAt:start,completedAt:new Date().toISOString(),...result,timedOut});
 if(result.code!==0) throw Error(name+' failed; see '+join(output,name+'.log'));
}
try {
 leases.push(await acquireLease(LEGACY_LOCK,owner));
 leases.push(await acquireLease(HEAVY_LOCK,owner));
 receipt.xcode=execFileSync('xcodebuild',['-version'],{encoding:'utf8'}).trim();
 receipt.head=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();
 const available=JSON.parse(execFileSync('xcrun',['simctl','list','devices','available','--json'],{encoding:'utf8'})).devices;
 const devices=Object.entries(available).filter(([runtime])=>/\.iOS-(?:2[7-9]|[3-9]\d)-/.test(runtime)).flatMap(([runtime,entries])=>entries.map(d=>({...d,runtime})));
 device=devices.find(d=>option('--device') ? d.udid===option('--device') : d.name.startsWith('iPhone'));
 if(!device)throw Error('No matching installed iOS27+ iPhone simulator. No runtime is downloaded automatically.');
 receipt.device={name:device.name,id:device.udid,runtime:device.runtime,originalState:device.state};
 receipt.source=await inventory(join(ui,'tests/apple'));
 receipt.fixture=await inventory(fixtureDir);
 receipt.selectedTest=only ?? 'all integrated XCTest methods';
 receipt.interactionMode='XCTest setup; actual VoiceOver enable/currentSpeech/moveBackward/moveForward for speech';
 receipt.baseURL='http://127.0.0.1:'+port;
 await run('build','xcodebuild',['build-for-testing','-project',join(ui,'tests/apple/SimulatorAcceptance.xcodeproj'),'-scheme','SimulatorAcceptance','-destination','platform=iOS Simulator,id='+device.udid,'-derivedDataPath',join(output,'derived')]);
 const products=join(output,'derived/Build/Products');
 const xctestruns=(await readdir(products)).filter(p=>p.endsWith('.xctestrun'));
 if(xctestruns.length!==1)throw Error('Expected exactly one generated test run configuration.');
 const xctestrun=join(products,xctestruns[0]);
 // The scheme leaves this environment value for the driver to set explicitly.
 execFileSync('python3',['-c',`import plistlib,sys
p=sys.argv[1]
with open(p,'rb') as f:d=plistlib.load(f)
def walk(v):
 if isinstance(v,dict):
  for k in v:
   if k=='SGUI_APPLE_BASE_URL':v[k]=sys.argv[2]
   else:walk(v[k])
 elif isinstance(v,list):
  for e in v:walk(e)
walk(d)
with open(p,'wb') as f:plistlib.dump(d,f)
`,xctestrun,receipt.baseURL]);
 receipt.xctestrunSha256=await hash(xctestrun);
 server=await startServer({...process.env,SGUI_BROWSER_PORT:String(port),SGUI_BROWSER_BASE_URL:receipt.baseURL,SGUI_BROWSER_DOCS_DIR:fixtureDir,SGUI_BROWSER_IMMUTABLE:'1'});
 startedDevice=device.state!=='Booted';
 await run('boot','xcrun',['simctl','bootstatus',device.udid,'-b'],120000);
 await run('test','xcodebuild',['test-without-building','-xctestrun',xctestrun,'-destination','platform=iOS Simulator,id='+device.udid,'-parallel-testing-enabled','NO','-collect-test-diagnostics','never','-test-timeouts-enabled','YES','-maximum-test-execution-time-allowance','120',...(only ? ['-only-testing:SimulatorAcceptance/SimulatorAcceptance/'+only] : []),'-resultBundlePath',join(output,'result.xcresult')],150000);
 await run('summary','xcrun',['xcresulttool','get','test-results','summary','--path',join(output,'result.xcresult'),'--compact']);
 receipt.status='passed';
} catch(error) { receipt.status='failed';receipt.error=String(error);process.exitCode=1; }
finally {
 try {
  if(server){server.closeAllConnections();await new Promise(done=>server.close(done));}
  if(startedDevice)await run('shutdown','xcrun',['simctl','shutdown',device.udid],30000);
 } catch(error) { receipt.cleanupError=String(error);process.exitCode=1; }
 finally {
  try {
   if ((await readdir(output)).includes('result.xcresult')) await run('attachments','xcrun',['xcresulttool','export','attachments','--path',join(output,'result.xcresult'),'--output-path',join(output,'attachments')],60000);
  } catch(error) { receipt.attachmentError=String(error); receipt.status='failed-evidence';process.exitCode=1; }
  try {
   receipt.sourceAfter=await inventory(join(ui,'tests/apple'));
   receipt.fixtureAfter=await inventory(fixtureDir);
   receipt.inputsUnchanged=JSON.stringify(receipt.source)===JSON.stringify(receipt.sourceAfter) && JSON.stringify(receipt.fixture)===JSON.stringify(receipt.fixtureAfter);
   if (!receipt.inputsUnchanged) { receipt.status='failed-input-drift'; process.exitCode=1; }
  } catch(error) { receipt.hashError=String(error);receipt.status='failed-evidence';process.exitCode=1; }
  receipt.completedAt=new Date().toISOString();
  await writeFile(join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  for(const lease of leases.reverse())await releaseLease(lease);
 }
}
console.log(output,receipt.status);
