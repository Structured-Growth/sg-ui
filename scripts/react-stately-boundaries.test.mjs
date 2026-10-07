import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { assertInteractionBoundary } from './check-foundations.mjs';
import { assertOwnedDeclaration, checkOwnedDeclarations } from './check-package.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dateField = 'src/experimental/DateField/DateField.tsx';
const references = [
  "import { useDateFieldState } from 'react-stately';",
  "import { useDateFieldState } from 'react-stately/useDateFieldState';",
  "export { useDateFieldState } from 'react-stately';",
  "export type { DateFieldState } from 'react-stately';",
  "type State = import('react-stately').DateFieldState;",
  "import 'react-stately';",
  "const state = import('react-stately/useDateFieldState');",
  "import Stately = require('react-stately');",
  "const Stately = require('react-stately');",
  "import { useDateFieldState } from '@react-stately/datepicker';",
];

test('registered DateField may use public lower-level state hooks internally', () => {
  for (const code of references) assert.doesNotThrow(() => assertInteractionBoundary(dateField, code, root));
  assert.doesNotThrow(() => assertInteractionBoundary(join(root, dateField), references[0], root));
});

test('ordinary owned modules and public contracts reject every state reference form', () => {
  for (const path of ['src/foundation/dateHelper.ts', 'src/experimental/DateField/state.ts',
    'src/experimental/DateField/index.ts', 'src/components/AppDataGrid/ownedGridModel.ts', 'src/models.ts']) {
    for (const code of references) assert.throws(() => assertInteractionBoundary(path, code, root), /Interaction dependency outside/);
  }
  for (const module of ['react-aria', 'react-aria-components/DateField', '@react-aria/datepicker']) {
    assert.throws(() => assertInteractionBoundary('src/foundation/helper.ts', `import { hook } from '${module}';`, root), /Interaction dependency outside/);
  }
  assert.doesNotThrow(() => assertInteractionBoundary('src/foundation/helper.ts',
    "// import { state } from 'react-stately';\nexport const label = 'react-stately';", root));
});

test('actual source checker permits DateField but rejects visited and transitive helpers', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'sgui-stately-source-'));
  try {
    await cp(join(root, 'src'), join(fixture, 'src'), { recursive: true });
    const fieldPath = join(fixture, dateField);
    await writeFile(fieldPath, `${await readFile(fieldPath, 'utf8')}\n${references[0]}\n`);
    const run = () => spawnSync(process.execPath, [join(root, 'scripts/check-foundations.mjs')], {
      cwd: fixture, encoding: 'utf8', timeout: 30000,
    });
    const allowed = run();
    assert.equal(allowed.status, 0, allowed.stderr);
    const helper = join(fixture, 'src/foundation/statelyHelper.ts');
    await writeFile(helper, references[1]);
    const denied = run();
    assert.notEqual(denied.status, 0);
    assert.match(denied.stderr, /Interaction dependency outside.*statelyHelper/);
    await rm(helper);
    // utils is outside visit's directory allowlist, but reachable from the public barrel.
    await writeFile(join(fixture, 'src/utils/statelyEscape.ts'), "export type State = import('./statelyNested').State;");
    await writeFile(join(fixture, 'src/utils/statelyNested.ts'), references[4]);
    const barrel = join(fixture, 'src/index.ts');
    await writeFile(barrel, `${await readFile(barrel, 'utf8')}\nexport * from './utils/statelyEscape';\n`);
    const transitive = run();
    assert.notEqual(transitive.status, 0);
    assert.match(transitive.stderr, /Interaction dependency outside.*statelyNested/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

const escapedDeclarations = [
  "export type { DateFieldState } from 'react-stately';",
  "import type { DateFieldState } from 'react-stately/useDateFieldState'; export interface Props { state: DateFieldState; }",
  "export interface Props { state: import('react-stately').DateFieldState; }",
  "export type { DateFieldState } from '@react-stately/datepicker';",
];
const ownedDeclaration = 'export interface DateFieldProps { value?: string; onChange?: (value: string | null) => void; }';

test('root, granular and grid declaration checks reject upstream escapes and retain owned contracts', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'sgui-stately-declarations-'));
  try {
    for (const path of ['dist/index.d.ts', 'dist/components/DateField/index.d.ts',
      'dist/experimental/DateField/DateField.d.ts', 'dist/components/AppDataGrid/ownedGridModel.d.ts']) {
      const target = join(fixture, path);
      await mkdir(dirname(target), { recursive: true });
      for (const declaration of escapedDeclarations) {
        await writeFile(target, declaration);
        // The standalone root/grid routes and recursive granular route use these actual checks.
        assert.throws(() => assertOwnedDeclaration(path, declaration), /Upstream type escaped/);
        await assert.rejects(checkOwnedDeclarations(join(fixture, 'dist')), /Upstream type escaped/);
      }
      await writeFile(target, ownedDeclaration);
      assert.doesNotThrow(() => assertOwnedDeclaration(path, ownedDeclaration));
      await checkOwnedDeclarations(join(fixture, 'dist'));
    }
    for (const module of ['react-aria', '@react-types/datepicker', '@tanstack/react-table', '@mui/material', '@emotion/react', 'lucide-react']) {
      assert.throws(() => assertOwnedDeclaration('dist/index.d.ts', `export * from '${module}';`), /Upstream type escaped/);
    }
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
