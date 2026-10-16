import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { dirname, resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const own = dirname(fileURLToPath(import.meta.url));
const repo = resolve(own, '../../../..');
const source = resolve(repo, 'packages/ui');
const dirs = ['src/foundation', 'src/i18n', 'src/components/Button', ...['Provider','Popover','Menu','TextArea','TextField','PeriodPicker','DateTimeRangePicker','DateRangeComparisonPicker','DateRangeSelector','DateRangePicker','DatePicker','DateField','TimeField','Select','Stack'].map(name => 'src/experimental/' + name)];
const files = [join(source, 'package.json'),join(repo, 'pnpm-lock.yaml'),join(own, 'vitest.proposal.config.mjs')];
async function visit(dir, tests = false) {
 for (const entry of await readdir(dir, {withFileTypes:true})) {
  const path = join(dir, entry.name);
  if (entry.isDirectory()) await visit(path, tests);
  else if (/\.(tsx?|css)$/.test(path) && (tests || !/\.(test|native-fixture)\./.test(path))) files.push(path);
 }
}
for (const dir of dirs) await visit(join(source, dir));
await visit(join(own, 'proposed-files/packages/ui/src'), true);
const hash = async () => Object.fromEntries(await Promise.all(files.sort().map(async path => [relative(repo,path),createHash('sha256').update(await readFile(path)).digest('hex')])));
const before = await hash();
const command = [process.execPath, 'node_modules/vitest/vitest.mjs', 'run', '--config', relative(source, join(own, 'vitest.proposal.config.mjs'))];
const startedAt = new Date().toISOString();
const result = spawnSync(command[0], command.slice(1), {cwd:source, encoding:'utf8'});
await writeFile(join(own, 'units-final.txt'), (result.stdout ?? '') + (result.stderr ?? ''));
const after = await hash();
const changed = Object.keys(before).filter(path => before[path] !== after[path]);
await writeFile(join(own, 'unit-evidence.json'), JSON.stringify({startedAt,finishedAt:new Date().toISOString(),runtime:process.version,nodeExecutable:process.execPath,command,cwd:source,exitCode:result.status,inputsBefore:before,inputsAfter:after,changedDuringRun:changed,status:result.status===0&&!changed.length?'passed':'failed',limits:'Source-backed Node/jsdom only. No native computed CSS or packed hydration execution.'},null,2));
process.exitCode = result.status || (changed.length ? 1 : 0);
