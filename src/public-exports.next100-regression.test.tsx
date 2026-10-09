import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import * as root from "./index";
import * as catalog from "./components";
import * as granular from "./components/AppButton";

describe("PublicExports package contract", () => {
  it("retains React 18.3/19 peers and the exported stylesheet side effect", async () => {
    const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

    expect(manifest.peerDependencies).toEqual({
      react: "^18.3.1 || ^19.0.0",
      "react-dom": "^18.3.1 || ^19.0.0",
    });
    expect(manifest.exports["./styles.css"]).toBe("./dist/styles.css");
    expect(manifest.sideEffects).toContain("./dist/**/*.css");
    expect(manifest.files).toContain("dist");
  });

  it("keeps the same owned exports across repeated root, catalog and granular imports", async () => {
    const repeatedRoot = await import("./index");

    expect(root.AppButton).toBe(granular.AppButton);
    expect(catalog.AppButton).toBe(granular.AppButton);
    expect(repeatedRoot.AppButton).toBe(root.AppButton);
    expect(repeatedRoot.Provider).toBe(root.Provider);
  });
});
