import {dirname,resolve} from 'node:path';
import LoaderModule from 'postcss-modules/build/FileSystemLoader.js';
const FileSystemLoader=LoaderModule.default??LoaderModule;
/** Record every dependency edge, including cache hits, before asynchronous IO.
 * The upstream loader otherwise omits a trace when a shared dependency was
 * already loaded, making diamond-composition CSS order depend on read timing.
 */
export class DeterministicCSSLoader extends FileSystemLoader {
 async fetch(request,relativeTo,trace){
  const path=resolve(dirname(relativeTo),request.replace(/^["']|["']$/g,''));
  const requestTrace=trace??String.fromCharCode(this.importNr++);
  this.traces[requestTrace]=path;
  return super.fetch(request,relativeTo,requestTrace);
 }
}
