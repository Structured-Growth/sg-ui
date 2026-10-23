import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import * as root from "./index";
import * as catalog from "./components";
import * as granular from "./components/Button";

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

    expect(root.Button).toBe(granular.Button);
    expect(catalog.Button).toBe(granular.Button);
    expect(repeatedRoot.Button).toBe(root.Button);
    expect(root).not.toHaveProperty('AppButton');
    expect(catalog).not.toHaveProperty('AppButton');
    const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    expect(Object.keys(manifest.exports)).toContain('./components/Button');
    expect(Object.keys(manifest.exports)).not.toContain('./components/AppButton');
    for (const name of ['AppThemeProvider', 'ClassCardFrame', 'InstructorClassCard', 'LearnerClassCard', 'LearnerClassesDataGrid', 'ClassIcon', 'adminClassesColumnOptions', 'adminPeopleColumnOptions', 'instructorClassesColumnOptions']) {
      expect(root).not.toHaveProperty(name);
    }
    for (const name of ['CourseCardFrame', 'InstructorCourseCard', 'LearnerCourseCard', 'CourseIcon']) {
      expect(root).toHaveProperty(name);
      expect(catalog).toHaveProperty(name);
    }
    for (const path of ['./components/ClassCardFrame', './components/InstructorClassCard', './components/LearnerClassCard', './components/LearnerClassesDataGrid']) {
      expect(manifest.exports).not.toHaveProperty(path);
    }
    expect(repeatedRoot.Provider).toBe(root.Provider);
  });
});
