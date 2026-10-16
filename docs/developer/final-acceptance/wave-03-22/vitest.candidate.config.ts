import { defineConfig } from "../../../../packages/ui/node_modules/vitest/dist/config.js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
const repo = resolve(import.meta.dirname, "../../../..");
const evidence = import.meta.dirname;
const require = createRequire(resolve(repo, "packages/ui/package.json"));
const source = "packages/ui/src/components/InstructorClassCard/InstructorClassCard.tsx";
export default defineConfig({
  root: resolve(repo, "packages/ui"),
  resolve: { alias: ["@testing-library/react", "react-dom/server", "vitest"].map(name => ({
    find: name, replacement: name === "vitest" ? resolve(repo, "packages/ui/node_modules/vitest/dist/index.js") : require.resolve(name),
  })) },
  plugins: [{ name: "wave22-candidate", enforce: "pre", transform(code, id) {
    if (process.env.WAVE22_CANDIDATE === "1" && id === resolve(repo, source))
      return readFileSync(resolve(evidence, "proposed-files", source), "utf8");
  } }],
  test: { environment: "node", include: [resolve(evidence, "literal-labels.test.tsx")],
    setupFiles: [resolve(repo, "packages/ui/scripts/vitest.setup.ts")],
    execArgv: ["--no-experimental-webstorage"],
    cache: false,
  },
});
