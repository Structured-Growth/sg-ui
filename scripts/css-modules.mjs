import { createHash } from 'node:crypto';
import { relative, resolve } from 'node:path';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import postcss from 'postcss';
import modules from 'postcss-modules';

export function scopedName(name, filename) {
  const path = relative(resolve('src'), filename).replaceAll('\\', '/');
  return `sgui_${name}_${createHash('sha256').update(path).digest('hex').slice(0, 8)}`;
}

export async function compileStyles() {
  const chunks = [await readFile('src/foundation/tokens.css', 'utf8')];
  async function visit(dir) {
    for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) await visit(path);
      else if (path.endsWith('.module.css')) {
        let classes;
        const output = await postcss([modules({ generateScopedName: scopedName, getJSON: (_file, json) => { classes = json; } })])
          .process(await readFile(path, 'utf8'), { from: resolve(path), map: false });
        chunks.push(output.css);
        const target = path.replace(/^src\//, 'dist/');
        await mkdir(target.slice(0, target.lastIndexOf('/')), { recursive: true });
        await writeFile(`${target}.js`, `export default ${JSON.stringify(classes)};\n`);
      }
    }
  }
  await visit('src');
  await writeFile('dist/styles.css', `${chunks.join('\n')}\n`);
}
