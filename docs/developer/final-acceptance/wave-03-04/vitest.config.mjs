import { defineConfig } from "../../../../packages/ui/node_modules/vitest/dist/config.js";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const root = fileURLToPath(new URL("../../../../", import.meta.url));
const require = createRequire(new URL("../../../../packages/ui/package.json", import.meta.url));
const alias = Object.fromEntries(["react-aria-components/Button", "react-aria-components/ToggleButton", "react-aria-components/ToggleButtonGroup", "react/jsx-dev-runtime", "react/jsx-runtime", "react", "@testing-library/react", "@testing-library/user-event", "vitest"].map(name => [name, name === "vitest" ? require.resolve("vitest/package.json").replace("package.json", "dist/index.js") : name.startsWith("react-aria-components/") ? require.resolve(name).replace(".cjs", ".mjs") : require.resolve(name)]));
if (process.env.SGUI_PROPOSED_ACTIONS === "1") {
 for (const [directory, name] of [["experimental/ToggleButton", "ToggleButton"], ["components/AppDataGridRowDnd", "DataGridDragHandle"]]) {
  alias[`${root}packages/ui/src/${directory}/${name}`] = fileURLToPath(new URL(`./runnable/${name}.tsx`, import.meta.url));
 }
}
export default defineConfig({ root, cacheDir: fileURLToPath(new URL("./cache", import.meta.url)), esbuild: { jsx: "automatic" }, resolve: { alias }, test: {
 environment: "node", include: ["docs/developer/final-acceptance/wave-03-04/runnable/*.test.tsx"],
 setupFiles: ["packages/ui/scripts/vitest.setup.ts"], execArgv: ["--no-experimental-webstorage"],
 maxWorkers: 1,
} });
