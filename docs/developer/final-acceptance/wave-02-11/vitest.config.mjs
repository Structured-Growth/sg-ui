import { fileURLToPath } from 'node:url';
const path = relative => fileURLToPath(new URL(relative, import.meta.url));
export default {cacheDir:path('./cache'),esbuild:{jsx:'automatic',jsxImportSource:path('../../../../packages/ui/node_modules/react')},test:{
 environment:'node',include:[path('./acceptance.test.tsx')],setupFiles:[path('../../../../packages/ui/scripts/vitest.setup.ts')],
 execArgv:['--no-experimental-webstorage'],maxWorkers:1,cache:false,
}};
