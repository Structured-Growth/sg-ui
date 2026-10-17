import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
const at=p=>fileURLToPath(new URL(p,import.meta.url));
export default defineConfig({root:at('./'),resolve:{alias:[
  {find:'@structured-growth/sg-ui/styles.css',replacement:at('../../dist/styles.css')},
  {find:'@structured-growth/sg-ui/experimental',replacement:at('../../dist/experimental/index.js')},
  {find:'@structured-growth/sg-ui',replacement:at('../../dist/index.js')},
]},build:{outDir:at('./dist'),emptyOutDir:true},preview:{host:'127.0.0.1',port:4179,strictPort:true}});
