import { defineConfig } from "../../../../packages/ui/node_modules/vitest/dist/config.js";
import { createRequire } from "node:module";
const require = createRequire(new URL("../../../../packages/ui/package.json", import.meta.url));
export default defineConfig({ root: new URL("../../../../", import.meta.url).pathname,
  cacheDir: "docs/developer/final-acceptance/wave-03-25/.vite",
  resolve: { alias: { vitest: new URL("../../../../packages/ui/node_modules/vitest/dist/index.js", import.meta.url).pathname, lexical: require.resolve("lexical") } },
  test: { environment: "node", include: ["docs/developer/final-acceptance/wave-03-25/editorConfig.acceptance-successors.test.ts"], setupFiles: ["packages/ui/scripts/vitest.setup.ts"], execArgv: ["--no-experimental-webstorage"] } });
