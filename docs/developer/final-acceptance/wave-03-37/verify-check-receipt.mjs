// Offline completeness check for operator-supplied observations; no network/settings writes.
// A passing synthetic test or receipt is not independent proof of remote enforcement.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
export function verify(receipt) {
  const failures = [];
  const expected = ['Validate Node 22.12.0', 'Validate Node 24', 'Next.js docs'];
  for (const path of ['production-pr', 'maintainer-infrastructure-pr', 'main', 'default-token-ai-draft']) {
    const run = receipt.paths?.[path];
    if (!run || !/^[a-f0-9]{40}$/.test(run.head ?? '') || !run.runUrl || !run.observedAt) { failures.push(`${path}: missing run identity`); continue; }
    for (const logical of [...expected, ...(path.endsWith('-pr') ? ['conventional-title'] : [])]) {
      // Operator maps logical names to observed context names, including caller prefixes.
      const context = run.contexts?.[logical];
      if (!context) { failures.push(`${path}: missing observed context for ${logical}`); continue; }
      const checks = run.checks?.filter(check => check.name === context && check.head === run.head) ?? [];
      if (checks.length !== 1 || checks[0].status !== 'completed' || checks[0].conclusion !== 'success' || !checks[0].url) failures.push(`${path}: ${context} absent, ambiguous, stale or not successful`);
      if (path.endsWith('-pr') && !receipt.protection?.effectiveRequiredContexts?.includes(context)) failures.push(`${path}: ${context} not recorded as required`);
    }
    if (path === 'default-token-ai-draft' && (run.tokenKind !== 'github.token' || run.draft !== true || run.explicitCallHead !== run.head)) failures.push(`${path}: default-token/draft/explicit-call identity missing`);
  }
  for (const scenario of ['failed-check', 'missing-check']) {
    const observed = receipt.protection?.blockingObservations?.[scenario];
    if (observed?.blocked !== true || !observed.url || !observed.head || !observed.observedAt) failures.push(`protection: missing actual ${scenario} blocking observation`);
  }
  if (!receipt.protection?.rawSettingsReceipt || !receipt.protection?.owner || !receipt.protection?.observedAt) failures.push('protection: missing settings/owner/date receipt');
  if (receipt.devExceptionPreserved !== true) failures.push('dev exception not recorded');
  if (!receipt.release?.runUrl || receipt.release?.validationSucceededBeforeRelease !== true || !receipt.release?.head) failures.push('missing release prerequisite observation (use an existing authorized run; never publish as a probe)');
  return failures;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const receipt = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  const failures = verify(receipt);
  console.log(JSON.stringify({ status: failures.length ? 'incomplete' : 'structurally-complete-operator-receipt', failures }, null, 2));
  process.exitCode = failures.length ? 1 : 0;
}
