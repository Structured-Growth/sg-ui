import { readFile, writeFile, symlink, lstat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const directory = dirname(fileURLToPath(import.meta.url));
const root = resolve(directory, '../../../..');
const target = 'packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx';
const proposed = await readFile(resolve(directory, 'proposed-files', target), 'utf8');
const adapted = proposed.replace(/from "(\.[^"]+)"/g, (_, path) => `from ${JSON.stringify(resolve(root, dirname(target), path))}`);
await writeFile(resolve(directory, 'probe.test.tsx'), adapted);
try { await lstat(resolve(directory, 'node_modules')); }
catch (error) { if (error.code !== 'ENOENT') throw error; await symlink(resolve(root, 'packages/ui/node_modules'), resolve(directory, 'node_modules'), 'dir'); }
console.log('Prepared evidence-only copy; all relative source imports point at the shared source without changing it.');
