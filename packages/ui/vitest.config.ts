import { defineConfig } from "vitest/config";
export default defineConfig({ test: {
  environment: "node", include: ["src/**/*.test.{ts,tsx}"], setupFiles: ["scripts/vitest.setup.ts"],
  // Node's server-side Web Storage must not replace jsdom's browser Storage APIs.
  execArgv: ["--no-experimental-webstorage"],
} });
