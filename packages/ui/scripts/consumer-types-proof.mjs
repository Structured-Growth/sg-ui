import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.resolve('@structured-growth/sg-ui/package.json')));
const declarations = {};
// Same forbidden ownership patterns as check-package, applied to installed bytes.
async function visit(path) {
  for (const entry of await readdir(path, {withFileTypes:true})) {
    const file = join(path, entry.name);
    if (entry.isDirectory()) await visit(file);
    else if (entry.name.endsWith('.d.ts')) {
      const content = await readFile(file, 'utf8');
      assert(!/react-aria|react-stately|@react-types|@react-stately|@mui|@emotion|lucide-react|@tanstack/.test(content), `Upstream declaration reference: ${file}`);
      declarations[relative(root, file)] = createHash('sha256').update(content).digest('hex');
    }
  }
}
await visit(join(root, 'dist'));
const versions = {};
for (const name of ['react', 'react-dom', 'typescript', '@types/react', '@types/react-dom']) {
  versions[name] = JSON.parse(await readFile(fileURLToPath(import.meta.resolve(name + '/package.json')), 'utf8')).version;
}
await writeFile('installed-types.json', JSON.stringify({versions, declarations, compilerOptions:{strict:true,skipLibCheck:true,moduleResolution:'Bundler',jsx:'react-jsx'},
  limits:['The API fixture compiles positive and ts-expect-error cases; skipLibCheck does not validate all upstream declaration internals.', 'Only TypeScript5.9.3 is pinned; broader TS support is undecided.']}, null, 2));
console.log('Installed declaration scan passed; matched runtime and type versions retained.');
