import fs from 'node:fs';
import crypto from 'node:crypto';
import {extractIcuVariables} from '../../../../packages/ui/dist/i18n/icu.js';
const dir='docs/developer/final-acceptance/parallel-14';
const snapshot=JSON.parse(fs.readFileSync('docs/developer/final-acceptance/2026-10-16-source-inventory.json'));
const audit=JSON.parse(fs.readFileSync(`${dir}/source-audit.json`));
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const files=['packages/ui/src/i18n/index.tsx','packages/ui/src/i18n/index.test.tsx','packages/ui/src/i18n/icu.ts','packages/ui/src/i18n/icu.test.ts','packages/ui/src/i18n/ICUFormatting.next100-regression.test.tsx','packages/ui/src/experimental/Provider/Provider.tsx','packages/ui/src/experimental/Provider/Provider.test.tsx','packages/ui/src/foundation/ThemeScope.tsx','packages/ui/src/foundation/ThemeScope.test.tsx','packages/ui/src/components/AppDataGrid/ownedGridCells.tsx','packages/ui/src/components/LearnerClassCard/LearnerClassCard.tsx','packages/ui/src/utils/formatDueDateLabel.ts','apps/docs/native-fixtures/scenarios/i18n/Translations.fixture.tsx','packages/ui/vitest.config.ts','packages/ui/scripts/vitest.setup.ts','packages/ui/package.json','pnpm-lock.yaml','docs/developer/final-acceptance/fa04-original-check.txt','docs/developer/final-acceptance/fa04-library-input-delta.json','docs/developer/final-acceptance/fa04-fixtures.txt'];
const inputs=files.map(file=>({file,sha256:hash(file),fa02:snapshot.inputHashes[file]??null,unchangedFromFA02:snapshot.inputHashes[file]===hash(file)}));
const inspected=audit.calls.filter(c=>c.defaultLiteral!==null).map(c=>{
 try { const variables=extractIcuVariables(c.defaultLiteral);return {file:c.file,line:c.line,key:c.literalKey,variables,valuesKeys:c.valuesKeys,missingLiteralValues:c.valuesKeys?variables.filter(v=>!c.valuesKeys.includes(v)):null}; }
 catch(error){return {file:c.file,line:c.line,key:c.literalKey,error:String(error)};}
});
const built='packages/ui/dist/i18n/icu.js';
const inv=JSON.parse(fs.readFileSync('docs/developer/final-acceptance/2026-10-16-inventory.json'));
const evidence={capturedAt:new Date().toISOString(),head:audit.head,inputs,formatter:{file:built,sha256:hash(built),fa01:inv.builtHashes['dist/i18n/icu.js'],unchangedFromFA01:hash(built)===inv.builtHashes['dist/i18n/icu.js']},literalDefaults:inspected,parseErrors:inspected.filter(x=>x.error),missingLiteralValues:inspected.filter(x=>x.missingLiteralValues?.length)};
fs.writeFileSync(`${dir}/reconciliation.json`,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({inputsChangedSinceFA02:inputs.filter(x=>x.fa02&&!x.unchangedFromFA02),defaults:inspected.length,parseErrors:evidence.parseErrors,missingLiteralValues:evidence.missingLiteralValues,inventoryKeys:Object.keys(inv)},null,2));
