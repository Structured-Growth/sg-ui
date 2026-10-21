import {mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {currentSiteRoutes} from '../../../packages/ui/scripts/check-maintained-documentation.mjs';
const root=resolve(fileURLToPath(new URL('../../..',import.meta.url)));
const {routes}=currentSiteRoutes(root);
mkdirSync(new URL('../public/',import.meta.url),{recursive:true});
writeFileSync(new URL('../public/documentation-routes.json',import.meta.url),JSON.stringify({schemaVersion:1,routes},null,2)+'\n');
console.log(`${routes.length} documentation routes exported`);
