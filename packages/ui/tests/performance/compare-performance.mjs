// Offline only. Never launches a browser or changes a recorded baseline.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export function compare(baseline,candidate) {
  for(const value of [baseline,candidate]) {
    assert.equal(value.schemaVersion,2,'Needs the new overlapping-input protocol; historical SSR/browser data is incomparable');
    assert.match(value.sourceHead,/^[a-f0-9]{40}$/);
    assert.ok(Object.keys(value.assets).length,'Missing production asset receipt');
    for(const asset of Object.values(value.assets))assert.match(asset.sha256,/^[a-f0-9]{64}$/);
    const workloads=value.renderer==='catalog'?['small','wide','largePage']:['small','wide','largePage','selector'];
    assert.deepEqual([...new Set(value.results.map(row=>row.workload))].sort(),[...workloads].sort());
    assert.deepEqual(value.cleanupProbes.map(probe=>probe.workload).sort(),[...workloads].sort(),'Missing active-update cleanup probe');
    for(const probe of value.cleanupProbes) {
      assert.equal(probe.before.activeTimers,1);assert.equal(probe.before.updating,true);
      assert.deepEqual({mounted:probe.after.mounted,pendingFrames:probe.after.pendingFrames,activeTimers:probe.after.activeTimers,updating:probe.after.updating},{mounted:false,pendingFrames:0,activeTimers:0,updating:false});
      assert.equal(probe.after.sampleCount,probe.laterSampleCount,'Publication after disposal');
    }
    for(const workload of workloads) {
      const rows=value.results.filter(row=>row.workload===workload);
      assert.equal(rows.length,12,'Expected 3 warmup plus 9 recorded navigations');
      assert.deepEqual(rows.map(row=>row.iteration).sort((a,b)=>a-b),Array.from({length:12},(_,i)=>i));
      for(const row of rows) {
        assert.equal(row.warmup,row.iteration<3);
        assert.deepEqual({mounted:row.cleanup.mounted,pendingFrames:row.cleanup.pendingFrames,activeTimers:row.cleanup.activeTimers,updating:row.cleanup.updating},{mounted:false,pendingFrames:0,activeTimers:0,updating:false});
        assert.equal(row.cleanup.sampleCount,row.samples.length);

        assert.equal(row.samples.filter(sample=>sample.action==='update').length,50);
        for(const action of ['initial','input','selection'])assert.ok(row.samples.some(sample=>sample.action===action&&(action==='initial'||sample.duringUpdates)),`Missing ${action}`);
        for(const sample of row.samples)assert.ok(Number.isFinite(sample.ms)&&sample.ms>=0);
      }
    }
  }
  assert.equal(baseline.renderer,candidate.renderer,'Compare each renderer separately');
  assert.deepEqual(baseline.fixtureHashes,candidate.fixtureHashes,'Use identical fixture/runner bytes for both production builds');
  assert.deepEqual(baseline.viewport,candidate.viewport);
  for(const key of ['react','throttlePolicy','node','browser','os','release','arch','cpu','totalMemoryBytes'])assert.deepEqual(baseline.environment[key],candidate.environment[key],`Environment mismatch: ${key}`);
  assert.equal(baseline.method,candidate.method);
  function distributions(value) {
    const groups={};
    for(const row of value.results.filter(row=>!row.warmup))for(const sample of row.samples) {
      const key=`${row.workload}:${sample.action}:${sample.duringUpdates?'updating':'idle'}`;
      (groups[key]??=[]).push(sample.ms);
    }
    return Object.fromEntries(Object.entries(groups).map(([key,values])=>{values.sort((a,b)=>a-b);return [key,{count:values.length,medianMs:values[Math.ceil(values.length*.5)-1],p95Ms:values[Math.ceil(values.length*.95)-1],maxMs:values.at(-1)}];}));
  }
  const before=distributions(baseline),after=distributions(candidate);
  assert.deepEqual(Object.keys(before).sort(),Object.keys(after).sort(),'Different action distributions');
  const comparisons=Object.fromEntries(Object.keys(before).map(key=>[key,{baseline:before[key],candidate:after[key],medianDeltaMs:after[key].medianMs-before[key].medianMs,p95DeltaMs:after[key].p95Ms-before[key].p95Ms,medianRatio:before[key].medianMs?after[key].medianMs/before[key].medianMs:null}]));
  const bytes=value=>Object.values(value.assets).reduce((sum,asset)=>sum+asset.gzipLevel9Bytes,0);
  return {baselineHead:baseline.sourceHead,candidateHead:candidate.sourceHead,renderer:baseline.renderer,comparisons,gzipOutputBytes:{baseline:bytes(baseline),candidate:bytes(candidate)},loadAverage:{baseline:baseline.environment.loadAverage,candidate:candidate.environment.loadAverage},limits:['Descriptive comparison; owner evaluates contention and regressions. No approved timing threshold or acceptance pass is inferred.','Timing is event/timer to post-commit frame opportunities, not paint/INP or a physical device.','All output assets are conservative totals, not route-transfer or tree-shaking evidence.']};
}
if(process.argv[1]?.endsWith('/compare-performance.mjs')) {
  const [before,after,output]=process.argv.slice(2);assert.ok(before&&after&&output,'Usage: node compare-performance.mjs baseline.json candidate.json NEW-comparison.json');
  const read=path=>{const bytes=readFileSync(path);return {value:JSON.parse(bytes),sha256:createHash('sha256').update(bytes).digest('hex')};};
  const b=read(before),c=read(after);
  writeFileSync(output,JSON.stringify({...compare(b.value,c.value),receipts:{baseline:{path:before,sha256:b.sha256},candidate:{path:after,sha256:c.sha256}}},null,2)+'\n',{flag:'wx'});
}
