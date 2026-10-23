import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { relative, resolve } from 'node:path';
import manifest from './module-manifest.json';
import { generateNativeRegistry } from './generate-registry.mjs';
generateNativeRegistry();
const root=fileURLToPath(new URL('.',import.meta.url));
const dist=fileURLToPath(new URL('../../../packages/ui/dist/',import.meta.url));
/** Bounded compiled aliases are exclusively for preserved internal proof fixtures. */
const privateAliases=manifest.privateCompiledAliases.map(path=>({find:'@sgui-test-internals/'+path,replacement:resolve(dist,path+'.js')}));
export default {
 root,base:'/fixtures/',publicDir:resolve(root,'public'),
 resolve:{alias:privateAliases,dedupe:['react','react-dom','lexical','@lexical/react']},
 css:{modules:{generateScopedName:(name:string,filename:string)=>`sgui_${name}_${createHash('sha256').update(relative(resolve(root,'scenarios'),filename)).digest('hex').slice(0,8)}`}},
 build:{outDir:fileURLToPath(new URL('../../../packages/ui/browser-docs-static/',import.meta.url)),emptyOutDir:true},
};
