import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import ts from 'typescript';
import { assertSourceGraph, inspectSourceGraph, moduleReferences } from './check-source-graph.mjs';

export function runSourceGraphRegression(root = process.cwd(), overlays = new Map()) {
  const baseline = inspectSourceGraph(root, { overlays });
  assertSourceGraph(baseline);
  const inspect = (changes, compilerOptions) => inspectSourceGraph(root, {
    overlays: new Map([...overlays, ...Object.entries(changes).map(([file, code]) => [resolve(root, file), code])]), compilerOptions,
  });
  const a = 'src/__cycle_guard_a.ts', b = 'src/__cycle_guard_b.ts', c = 'src/__cycle_guard_c.ts';
  const cycle = inspect({ [a]: 'import "./__cycle_guard_b";', [b]: 'import "./__cycle_guard_a";' });
  assert.deepEqual(cycle.runtimeCycles, [[a, b]]);
  assert.throws(() => assertSourceGraph(cycle), /Runtime cycle/);
  const three = inspect({ [a]: 'export * from "./__cycle_guard_b";', [b]: 'void import("./__cycle_guard_c");', [c]: 'require("./__cycle_guard_a");' });
  assert.deepEqual(three.runtimeCycles, [[a, b, c]]);
  const erased = inspect({ [a]: 'export type A = import("./__cycle_guard_b").B;', [b]: 'import type { A } from "./__cycle_guard_a"; export type B = A;' });
  assert.deepEqual(erased.runtimeCycles, []);
  assert.deepEqual(erased.typeInvolvingCycles, [[a, b]]);
  assert.throws(() => assertSourceGraph(erased), /Type-involving cycle/);
  const mixed = inspect({ [a]: 'import {type B} from "./__cycle_guard_b"; export type A = B;', [b]: 'export * from "./__cycle_guard_a";' });
  assert.deepEqual(mixed.runtimeCycles, []);
  assert.deepEqual(mixed.allCycles, [[a, b]]);
  const acyclic = inspect({ [a]: 'export * from "./__cycle_guard_b";', [b]: 'export type { C } from "./__cycle_guard_c";', [c]: 'export type C = string;' });
  assertSourceGraph(acyclic);
  const self = inspect({ [a]: 'import "./__cycle_guard_a";' });
  assert.deepEqual(self.runtimeCycles, [[a]]);
  // Resolve real deep implementation paths, explicit .js suffix, import type, side effect, reexport and dynamic syntax.
  const deep = 'src/components/PageRichTextEditorSection/lexical/__cycle_guard.ts';
  for (const code of ['import type { ButtonProps as Renamed } from "../../../index";',
    'type T = import("../../../index.js").ButtonProps;', 'import "../../../index";',
    'export * from "../../../index";', 'import "../../../";', 'void import("../../../index");',
    'import Root = require("../../../index");', 'import type { ButtonProps } from "@structured-growth/sg-ui";']) {
    const graph = inspect({ [deep]: code });
    assert(graph.violations.some(item => item.file === deep && item.reason.includes('root barrel')), code);
    assert.throws(() => assertSourceGraph(graph), /root barrel/);
  }
  // A renamed module alias is resolved through compiler options, rather than matched as text.
  const aliased = inspect({ [deep]: 'import type { ButtonProps } from "renamed-root";' }, {
    moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext, baseUrl: resolve(root), paths: { 'renamed-root': ['src/index.ts'] },
  });
  assert(aliased.violations.some(item => item.reason.includes('root barrel')));
  assert(inspect({ [a]: 'void import(someComputedPath);' }).violations.some(item => item.reason.includes('Nonliteral')));
  assert(inspect({ [a]: 'import "./does-not-exist";' }).violations.some(item => item.reason.includes('Unresolved')));
  // Restore each original return edge in the REAL current graph. All three must fail as type-involving only.
  for (const [file, before, after, pair] of [
    ['src/experimental/DateField/TextDateField.tsx', './DateField.types', './DateField', ['src/experimental/DateField/DateField.tsx', 'src/experimental/DateField/TextDateField.tsx']],
    ['src/experimental/TimeField/TextTimeField.tsx', './TimeField.types', './TimeField', ['src/experimental/TimeField/TextTimeField.tsx', 'src/experimental/TimeField/TimeField.tsx']],
    ['src/adapters/navigationContext.ts', './navigation.types', './navigation', ['src/adapters/navigation.tsx', 'src/adapters/navigationContext.ts']],
  ]) {
    assert(baseline.contents[file].includes(before));
    const graph = inspect({ [file]: baseline.contents[file].replace(before, after) });
    assert.deepEqual(graph.runtimeCycles, []);
    assert(graph.typeInvolvingCycles.some(cycle => JSON.stringify(cycle) === JSON.stringify(pair.sort())));
    assert.throws(() => assertSourceGraph(graph), /Type-involving cycle/);
  }
  const field = 'src/experimental/DateField/TextDateField.tsx';
  const runtime = inspect({ [field]: baseline.contents[field] + '\nimport "./DateField";\n' });
  assert(runtime.runtimeCycles.some(cycle => cycle.includes(field) && cycle.includes('src/experimental/DateField/DateField.tsx')));
  // Fixtures cannot leak into production even when newly added to src.
  const excluded = inspect({ 'src/__cycle_guard.test.ts': 'import "./index";', 'src/__cycle_guard.native-fixture.tsx': 'import "./index";', 'src/__cycle_guard.native-fixtures.ts': 'import "./index";' });
  assertSourceGraph(excluded);
  const refs = moduleReferences('src/kinds.ts', 'import { type A } from "a"; export { type B } from "b"; import {} from "c"; export {} from "d"; import type X = require("e");');
  assert.deepEqual(refs.map(ref => ref.typeOnly), [true, true, false, false, true]);
  assert.deepEqual(moduleReferences('src/inline-types.ts', 'import { type A } from "a"; export { type B } from "b";',
    { verbatimModuleSyntax: true }).map(ref => ref.typeOnly), [false, false]);
  return { modules: baseline.files.length, edges: baseline.edges.length, checks: 'cycles, resolved roots, import forms, real source mutations and fixture exclusion' };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  test('production dependency graph policy and real-source regressions', () => runSourceGraphRegression());
}
