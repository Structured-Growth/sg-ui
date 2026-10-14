import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { performance } from 'node:perf_hooks';
import { cpus, arch, platform } from 'node:os';
import { gzipSync } from 'node:zlib';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { Provider } from '../dist/experimental/Provider/Provider.js';
import { Button } from '../dist/experimental/Button/Button.js';
import { TextField } from '../dist/experimental/TextField/TextField.js';
import { AsyncMultiSelect } from '../dist/experimental/AsyncMultiSelect/AsyncMultiSelect.js';
import { DataGrid } from '../dist/experimental/DataGrid/DataGrid.js';
import { DateRangeSelector } from '../dist/experimental/DateRangeSelector/DateRangeSelector.js';
import { AppButton } from '../dist/components/AppButton/AppButton.js';
const h = createElement;
const rows = Array.from({length:1000}, (_,index) => ({ id:String(index), name:`Course ${index}`, count:index }));
const subjects = {
  extractedButtons100: () => h('div', null, ...rows.slice(0,100).map(row => h(AppButton,{key:row.id},row.name))),
  ownedButtons100: () => h('div', null, ...rows.slice(0,100).map(row => h(Button,{key:row.id},row.name))),
  ownedFields40: () => h('div', null, ...rows.slice(0,40).map(row => h(TextField,{key:row.id,label:row.name,defaultValue:row.name}))),
  asyncOptions200: () => h(AsyncMultiSelect,{label:'Courses',query:'',onQueryChange:()=>{},options:rows.slice(0,200).map(row=>({id:row.id,label:row.name}))}),
  gridRows1000Page50: () => h(DataGrid,{label:'Courses',rows,columns:[{id:'name',label:'Name',getValue:row=>row.name},{id:'count',label:'Count',getValue:row=>row.count}],getRowId:row=>row.id,getRowLabel:row=>row.name,defaultState:{pageSize:50}}),
  rangeTwoMonths: () => h(DateRangeSelector,{label:'Reporting dates',defaultValue:{start:'2024-02-28',end:'2024-02-29'},months:2}),
};
const results = {};
for (const [name,subject] of Object.entries(subjects)) {
  const render = () => renderToString(h(Provider,null,subject()));
  for(let index=0;index<3;index++) render();
  const samples=[]; let html='';
  for(let index=0;index<9;index++) {const start=performance.now(); html=render(); samples.push(performance.now()-start);}
  samples.sort((a,b)=>a-b);
  results[name]={medianMs:Number(samples[4].toFixed(2)),p90Ms:Number(samples[8].toFixed(2)),htmlBytes:Buffer.byteLength(html)};
}
const consumers={};
for(const fixture of process.argv.slice(2).filter(arg => arg !== '--record')) {
  const assets=fixture+'/dist/assets'; const files=await readdir(assets); const sizes={};
  for(const extension of ['js','css']) {const chunks=await Promise.all(files.filter(file=>file.endsWith('.'+extension)).map(file=>readFile(assets+'/'+file))); sizes[extension]={bytes:chunks.reduce((sum,chunk)=>sum+chunk.length,0),gzipBytes:chunks.reduce((sum,chunk)=>sum+gzipSync(chunk).length,0)};}
  const metadata=JSON.parse(await readFile(fixture+'/package.json','utf8'));consumers[metadata.dependencies.react]=sizes;
}
const record={measuredAt:new Date().toISOString(),runtime:process.version,platform:platform(),architecture:arch(),cpu:cpus()[0]?.model,
  methodology:'Server render: 3 warm-ups, 9 samples, median and maximum (p90). Built modules, one Provider, no browser or network. Production consumer asset sizes include React and all proof controls; gzip level defaults. These are local reference measurements, not client interaction or framework rankings.',results,consumers};
await mkdir('docs/developer/migration-baseline',{recursive:true});
if (process.argv.includes('--record')) await writeFile('docs/developer/migration-baseline/proof-measurements.json',JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify(record,null,2));
