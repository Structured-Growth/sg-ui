import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../", import.meta.url));
const model = resolve(root, "src/models.ts");
const configPath = resolve(root, "tsconfig.json");
const config = ts.readConfigFile(configPath, ts.sys.readFile);
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root);

// Owned presentation sources are explicitly reviewed, rather than trusting a
// dependency merely because it lives in this repository. No host contracts are
// approved. React's public declaration package is an approved library type.
function inspectGraph(entry: string, approvedSources: Set<string>, virtual = new Map<string, string>()) {
  const host: ts.ModuleResolutionHost = {
    ...ts.sys,
    fileExists: path => virtual.has(resolve(path)) || ts.sys.fileExists(path),
    readFile: path => virtual.get(resolve(path)) ?? ts.sys.readFile(path),
  };
  const visited = new Set<string>();
  const violations: string[] = [];
  const visit = (path: string) => {
    path = resolve(path);
    if (visited.has(path)) return;
    visited.add(path);
    const text = host.readFile(path);
    if (text === undefined) { violations.push(`Missing source: ${path}`); return; }
    const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
    const dependency = (specifier: string) => {
      const result = ts.resolveModuleName(specifier, path, options, host).resolvedModule;
      if (!result) { violations.push(`Unresolved dependency: ${specifier}`); return; }
      const target = resolve(result.resolvedFileName);
      if (approvedSources.has(target)) { visit(target); return; }
      if (result.isExternalLibraryImport && result.packageId?.name === "@types/react" && result.extension === ts.Extension.Dts) return;
      violations.push(`Unapproved dependency: ${specifier} -> ${target}`);
    };
    const walk = (node: ts.Node) => {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) dependency(node.moduleSpecifier.text);
      if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference) && node.moduleReference.expression && ts.isStringLiteral(node.moduleReference.expression)) dependency(node.moduleReference.expression.text);
      if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) dependency(node.argument.literal.text);
      if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
        const argument = node.arguments[0];
        if (argument && ts.isStringLiteral(argument)) dependency(argument.text);
        else violations.push("Nonliteral module dependency");
      }
      ts.forEachChild(node, walk);
    };
    walk(source);
    for (const reference of source.referencedFiles) {
      const target = resolve(dirname(path), reference.fileName);
      if (approvedSources.has(target)) visit(target);
      else violations.push(`Unapproved reference: ${reference.fileName}`);
    }
    for (const reference of source.typeReferenceDirectives) violations.push(`Unapproved ambient dependency: ${reference.fileName}`);
    return source;
  };
  visit(entry);
  return { visited: [...visited], violations };
}

describe("Models presentation dependency boundary (T-S18-03)", () => {
  it("keeps the actual model import and type dependency graph independent of host contracts", () => {
    expect(config.error).toBeUndefined();
    const result = inspectGraph(model, new Set([model]));
    expect(result.violations).toEqual([]);
    expect(result.visited).toEqual([model]);
    const program = ts.createProgram([model], { ...options, types: [] });
    expect(ts.getPreEmitDiagnostics(program).map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))).toEqual([]);
    // Exercise the on-disk source, including erased type imports, not its JS output.
    expect(program.getSourceFile(model)?.text).toBe(readFileSync(model, "utf8"));
  });

  it("rejects resolved direct and transitive host types and aliases while accepting an approved library type", () => {
    const owned = resolve(root, "src/owned-presentation-fixture.ts");
    const contract = resolve(root, "host/http-contract-fixture.ts");
    const approved = new Set([model, owned]);
    const virtual = new Map([
      [model, 'import type { CSSProperties } from "react"; export type Presentation = { style: CSSProperties };'],
      [owned, 'export type HostData = import("../host/http-contract-fixture").Response;'],
      [contract, 'export type Response = { serverOnly: string };'],
    ]);
    expect(inspectGraph(model, approved, virtual).violations).toEqual([]);
    for (const source of [
      'import type { Response } from "../host/http-contract-fixture"; export type Presentation = Response;',
      'export type { Response } from "../host/http-contract-fixture";',
      'export type Presentation = import("../host/http-contract-fixture").Response;',
      'import type { HostData } from "./owned-presentation-fixture"; export type Presentation = HostData;',
      'import type { Response } from "@ui/app/contracts"; export type Presentation = Response;',
      '/// <reference path="../host/http-contract-fixture.ts" />\nexport type Presentation = string;',
    ]) {
      virtual.set(model, source);
      const result = inspectGraph(model, approved, virtual);
      expect(result.violations, source).toHaveLength(1);
      expect(result.violations[0], source).toMatch(/Unapproved (dependency|reference)|Unresolved dependency/);
    }
    virtual.set(model, 'export type { HostData } from "./owned-presentation-fixture";');
    expect(inspectGraph(model, approved, virtual).visited).toEqual([model, owned]);
  });
});
