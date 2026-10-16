import { defineConfig } from "../../../../packages/ui/node_modules/vitest/dist/config.js";
import { fileURLToPath } from "node:url";
const repo = fileURLToPath(new URL("../../../../", import.meta.url));
const own = fileURLToPath(new URL("./", import.meta.url));
export default defineConfig({
  esbuild: { jsx: "automatic" },
  root: repo + "packages/ui",
  cacheDir: own + ".vite",
  plugins: [{ name: "proposal-relative-imports", enforce: "pre", resolveId(id, importer) {
    if (!importer?.endsWith("AppDataGrid.reorder-policy.test.tsx")) return;
    if (!id.startsWith(".")) return this.resolve(id, repo + "packages/ui/src/components/AppDataGrid/proposal.test.tsx", { skipSelf: true });
    if (id === "./AppDataGrid") return repo + "packages/ui/src/components/AppDataGrid/AppDataGrid.tsx";
    if (id === "../../experimental/Provider/Provider") return repo + "packages/ui/src/experimental/Provider/Provider.tsx";
  } }],
  test: { environment: "node", include: [own + "proposed-files/**/*.test.tsx"],
    setupFiles: [repo + "packages/ui/scripts/vitest.setup.ts"], execArgv: ["--no-experimental-webstorage"], maxWorkers: 1 },
});
