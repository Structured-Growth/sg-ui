import { defineConfig } from "../../../../packages/ui/node_modules/vitest/dist/config.js";
export default defineConfig({
  root: new URL("../../../../packages/ui", import.meta.url).pathname,
  cacheDir: new URL("./.vite-cache", import.meta.url).pathname,
  test: { environment: "node", include: [new URL("./probe.test.tsx", import.meta.url).pathname], setupFiles: ["scripts/vitest.setup.ts"], execArgv: ["--no-experimental-webstorage"] }
});
