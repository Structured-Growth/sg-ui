import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const plan = JSON.parse(readFileSync(path.join(here, 'validation-plan.json')));
if (!process.argv.includes('--execute')) {
 console.log(JSON.stringify(plan.steps, null, 2));
} else {
 if (![22,24].includes(Number(process.versions.node.split('.')[0]))) throw new Error('Use supported Node22/24');
 const port = Number(process.env.SGUI_BROWSER_PORT ?? 6272);
 if (!Number.isInteger(port) || port < 1024 || port > 65535 || port === 3000) throw new Error('Choose a free non-user loopback port');
 const dest = path.join(here, `coordinator-run-${Date.now()}`); mkdirSync(dest);
 const results = [];
 for (const [i,step] of plan.steps.entries()) {
  const run = spawnSync(step.argv[0],step.argv.slice(1),{cwd:path.join(root,step.cwd),encoding:'utf8',env:{...process.env,SGUI_BROWSER_PORT:String(port),SGUI_BROWSER_BASE_URL:`http://127.0.0.1:${port}`,SGUI_BROWSER_REPORT_DIR:path.join(dest,'report'),SGUI_BROWSER_RESULTS_FILE:path.join(dest,'browser.json'),SGUI_BROWSER_OUTPUT_DIR:path.join(dest,'traces')}});
  writeFileSync(path.join(dest,`${i+1}.log`),(run.stdout??'')+(run.stderr??''));
  results.push({...step,status:run.status,error:run.error?.message});writeFileSync(path.join(dest,'results.json'),JSON.stringify(results,null,2)+'\n');
  if (run.status !== 0) {process.exitCode=1;break;}
 }
 console.log(dest);
}
