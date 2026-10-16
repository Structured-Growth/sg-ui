import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const slash = path => path.replaceAll('\\', '/');
export const isProductionModule = path => /\.[cm]?[jt]sx?$/.test(path)
  && !/(?:^|\/)(?:__tests__|__fixtures__)(?:\/|$)|\.(?:test|spec|stories)(?:\.|$)|\.native-fixture/.test(slash(path));

/** Explicit type syntax is erased; unmarked imports conservatively remain runtime edges. */
export function moduleReferences(file, code, compilerOptions = {}) {
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true);
  const references = [];
  function visit(node) {
    let literal, kind, typeOnly = false;
    if (ts.isImportDeclaration(node)) {
      literal = node.moduleSpecifier; kind = 'import';
      const clause = node.importClause;
      typeOnly = Boolean(clause?.isTypeOnly || (!compilerOptions.verbatimModuleSyntax && !clause?.name && clause?.namedBindings
        && ts.isNamedImports(clause.namedBindings) && clause.namedBindings.elements.length
        && clause.namedBindings.elements.every(element => element.isTypeOnly)));
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      literal = node.moduleSpecifier; kind = 'reexport';
      typeOnly = Boolean(node.isTypeOnly || (!compilerOptions.verbatimModuleSyntax && node.exportClause && ts.isNamedExports(node.exportClause)
        && node.exportClause.elements.length && node.exportClause.elements.every(element => element.isTypeOnly)));
    } else if (ts.isImportTypeNode(node)) {
      literal = ts.isLiteralTypeNode(node.argument) ? node.argument.literal : node.argument;
      kind = 'import-type'; typeOnly = true;
    } else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
      literal = node.moduleReference.expression; kind = 'import-equals'; typeOnly = node.isTypeOnly;
    } else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword
      || (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) {
      literal = node.arguments[0]; kind = node.expression.kind === ts.SyntaxKind.ImportKeyword ? 'dynamic-import' : 'require';
    }
    if (kind) references.push({ kind, typeOnly, specifier: literal && ts.isStringLiteralLike(literal) ? literal.text : null,
      line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1 });
    ts.forEachChild(node, visit);
  }
  visit(source);
  return references;
}

export function stronglyConnectedComponents(files, edges) {
  const adjacent = new Map(files.map(file => [file, []]));
  for (const edge of edges) adjacent.get(edge.file)?.push(edge.target);
  let next = 0;
  const indices = new Map(), low = new Map(), stack = [], active = new Set(), cycles = [];
  function visit(file) {
    indices.set(file, next); low.set(file, next++); stack.push(file); active.add(file);
    for (const target of adjacent.get(file) ?? []) {
      if (!indices.has(target)) { visit(target); low.set(file, Math.min(low.get(file), low.get(target))); }
      else if (active.has(target)) low.set(file, Math.min(low.get(file), indices.get(target)));
    }
    if (low.get(file) === indices.get(file)) {
      const members = []; let member;
      do { member = stack.pop(); active.delete(member); members.push(member); } while (member !== file);
      if (members.length > 1 || adjacent.get(file)?.includes(file)) cycles.push(members.sort());
    }
  }
  for (const file of files) if (!indices.has(file)) visit(file);
  return cycles.sort((a, b) => a[0].localeCompare(b[0]));
}

/** overlays are a read-only test seam: keys are absolute source paths, values are proposed text. */
export function inspectSourceGraph(root = process.cwd(), { overlays = new Map(), compilerOptions } = {}) {
  root = resolve(root);
  const sourceRoot = resolve(root, 'src');
  const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile);
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  assert.equal(parsed.errors.length, 0, 'Invalid source graph compiler configuration');
  const options = compilerOptions ?? parsed.options;
  const host = { ...ts.sys, fileExists: file => overlays.has(resolve(file)) || ts.sys.fileExists(file),
    readFile: file => overlays.get(resolve(file)) ?? ts.sys.readFile(file) };
  const files = [...new Set([...ts.sys.readDirectory(sourceRoot, ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs']),
    ...overlays.keys()].filter(file => file.startsWith(sourceRoot + '/') && isProductionModule(file)))].sort();
  const production = new Set(files);
  const rootBarrel = resolve(sourceRoot, 'index.ts');
  const edges = [], violations = [], contents = {};
  const name = file => slash(relative(root, file));
  for (const file of files) {
    const code = host.readFile(file); assert.notEqual(code, undefined, `Missing module ${file}`);
    contents[name(file)] = code;
    for (const ref of moduleReferences(file, code, options)) {
      const entry = { file: name(file), ...ref };
      if (ref.specifier === null) { violations.push({ ...entry, reason: 'Nonliteral module reference cannot be audited' }); continue; }
      const target = ts.resolveModuleName(ref.specifier, file, options, host).resolvedModule?.resolvedFileName;
      const rootReference = ref.specifier === '@structured-growth/sg-ui' || (target && resolve(target) === rootBarrel);
      if (rootReference) violations.push({ ...entry, reason: 'Internal reference to package root barrel' });
      if (target && production.has(resolve(target))) edges.push({ ...entry, target: name(resolve(target)) });
      else if (ref.specifier.startsWith('.') && !/\.(?:css|json|svg|png|jpe?g|gif|webp)$/.test(ref.specifier)) {
        violations.push({ ...entry, reason: target ? 'Production reference resolves outside production graph' : 'Unresolved local module' });
      }
    }
  }
  const names = files.map(name);
  const runtimeCycles = stronglyConnectedComponents(names, edges.filter(edge => !edge.typeOnly));
  const allCycles = stronglyConnectedComponents(names, edges);
  // A mixed SCC may contain a runtime subcycle: keep the full SCC and its runtime SCCs separate.
  const typeInvolvingCycles = allCycles.filter(members => edges.some(edge => edge.typeOnly
    && members.includes(edge.file) && members.includes(edge.target)));
  return { files: names, edges, violations, runtimeCycles, typeInvolvingCycles, allCycles, contents };
}

export function assertSourceGraph(graph) {
  const problems = graph.violations.map(item => `${item.file}:${item.line}: ${item.reason} (${item.specifier})`);
  problems.push(...graph.runtimeCycles.map(cycle => `Runtime cycle: ${cycle.join(' -> ')}`));
  problems.push(...graph.typeInvolvingCycles.map(cycle => `Type-involving cycle (also forbidden): ${cycle.join(' -> ')}`));
  assert.equal(problems.length, 0, problems.join('\n'));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const graph = inspectSourceGraph();
  assertSourceGraph(graph);
  console.log(`Source dependency graph passes: ${graph.files.length} production modules; ${graph.edges.length} local edges; no runtime or type-involving cycles.`);
}
