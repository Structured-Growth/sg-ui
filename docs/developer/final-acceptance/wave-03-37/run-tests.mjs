// Run source-context tests on mirrored proposals without touching the shared checkout.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const own = new URL('./', import.meta.url);
const file = new URL('proposed-files/packages/ui/scripts/ai-component-scope.test.mjs', own);
const source = readFileSync(file, 'utf8').replace("new URL('../../../.github/workflows/ai-code.yml', import.meta.url)", JSON.stringify(new URL('proposed-files/.github/workflows/ai-code.yml', own).pathname));
// Node --test does not accept stdin across supported versions: execute in eval mode;
// node:test still emits TAP and a failing test sets process.exitCode.
const result = spawnSync(process.execPath, ['--input-type=module', '--eval', source], { encoding: 'utf8' });
process.stdout.write(result.stdout); process.stderr.write(result.stderr); process.exitCode = result.status ?? 1;
