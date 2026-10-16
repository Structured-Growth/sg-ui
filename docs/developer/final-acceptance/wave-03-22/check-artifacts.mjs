import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
const evidence = dirname(fileURLToPath(import.meta.url));
const repo = resolve(evidence, "../../../..");
const require = createRequire(resolve(repo, "packages/ui/package.json"));
const ts = require("typescript");
for (const name of ["@testing-library/react", "react-dom/server", "vitest"]) assert(existsSync(require.resolve(name)));
for (const path of ["literal-labels.test.tsx", "vitest.candidate.config.ts", "proposed-files/packages/ui/src/components/InstructorClassCard/InstructorClassCard.tsx", "proposed-files/packages/ui/src/components/InstructorClassCard/InstructorClassCard.literal-labels.test.tsx"]) {
  const text = readFileSync(resolve(evidence, path), "utf8");
  const result = ts.transpileModule(text, { fileName: path, reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } });
  assert.deepEqual(result.diagnostics?.filter(item => item.category === ts.DiagnosticCategory.Error), []);
  console.log(`Syntax transpile passed: ${path}`);
}
console.log(`Node ${process.version}; TypeScript ${ts.version}. Syntax/dependency resolution only, not typecheck or behavioral execution.`);
