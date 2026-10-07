import { execFileSync } from 'node:child_process';
import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { generateTokens } from './tokens.mjs';
import { compileStyles } from './css-modules.mjs';
await generateTokens({ check: true });
await rm('dist', { recursive: true, force: true });
execFileSync('pnpm', ['exec', 'tsc', '-p', 'tsconfig.build.json'], { stdio: 'inherit' });
// Native ESM needs explicit extensions. Preserve client directives and per-file modules.
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await visit(path);
    else if (path.endsWith('.js') || path.endsWith('.d.ts')) {
      let code = await readFile(path, 'utf8');
      const { existsSync } = await import('node:fs');
      code = code.replace(/(from\s+|import\s*)(["'])(\.[^"']+)\2/g, (match, prefix, quote, specifier) => {
        const parent = path.slice(0, path.lastIndexOf('/'));
        const suffix = specifier.endsWith('.module.css') ? '.js' : existsSync(`${parent}/${specifier}.js`) ? '.js' : existsSync(`${parent}/${specifier}/index.js`) ? '/index.js' : '';
        return `${prefix}${quote}${specifier}${suffix}${quote}`;
      });
      await writeFile(path, code);
    }
  }
}
await visit('dist');
await compileStyles();
