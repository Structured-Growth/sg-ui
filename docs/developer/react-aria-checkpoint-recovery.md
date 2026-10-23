# Coordinator checkpoint runner and recovery

Task references: R-01/Z-11, assignment 173. Follow the
[development validation policy](react-aria-development-validation.md),
[pool ownership contract](react-aria-parallel-browser-validation.md) and
actual abort/recovery record.
This tooling preparation does not authorize a checkpoint or close acceptance.

## One pool authority

`scripts/run-development-checkpoint.mjs` imports the existing exported
`runFrozenSnapshot`, lease, source attestation and `runOwnedCommand` APIs.
It supplies no alternate scheduler, wave configuration or browser command path.
The imported pool's SHA must match the frozen target's pool implementation.
The browser stage calls the pool directly in the coordinator process. During this
stage there is no outer resource monitor, child supervisor, process-group killer,
AbortController, timeout or outer bridge/slot claim. The pool alone monitors the
reviewed resource budget, source/build integrity and queue, handles SIGINT/SIGTERM,
settles its commands and releases or retains its own leases. A resource abort must
be allowed to finish that path; killing a nested supervisor after three seconds
prevented detached server cleanup in the October 8 attempt.

Use Node 24 with its bin directory first in PATH. Configuration is JSON:

```json
{
  "plan": {
    "mode": "snapshot",
    "worktree": "/absolute/clean/frozen/sg-ui",
    "head": "<reviewed 40-character committed head>",
    "shards": [
      { "id": "forms", "specs": ["tests/browser/batch01-forms.spec.ts"], "project": ["chromium", "firefox", "webkit"] }
    ]
  },
  "poolOptions": {
    "queueOwner": "<authorized first-entry chat UUID>",
    "max": 2,
    "firstPort": 6273,
    "output": "artifacts/checkpoint-browser",
    "budget": { "maxLoad1": 24, "maxSystemRSSBytes": 29360128000 }
  },
  "output": "artifacts/checkpoint",
  "timeoutMs": 3600000,
  "install": false
}
```

Those example budgets are operational ceilings from the abort record, not calibrated
hardware recommendations. A full checkpoint needs the complete reviewed disjoint
spec plan; the small example only runs its selected browser coverage. The runner
always runs `pnpm check`, the fresh-build pool, foundation/editor React 18/19 and
Next.js consumers in order. Optional installation uses `pnpm install --frozen-lockfile`.
No dependencies are installed automatically. Set `install: true` when authorized
and needed. The plan and both outputs pass the pool's clean-source, exact-file and
ignored-directory guards. The queue remains read-only and canonical.

```sh
node scripts/run-development-checkpoint.mjs run /absolute/checkpoint-config.json
```

Non-pool stages use the existing bridge/heavy leases and canonical two-install-slot
helper when installing or running consumers. Their resource/source/queue monitor
and positive command deadline abort only the owned command through `runOwnedCommand`.
Its bounded settlement and exact owner checks govern lease release. Unknown group
settlement or owner mismatch retains claims and stops later admission. A red stage
stops subsequent stages, which are recorded as unrun with the reason. A non-pool
command's resource receipt establishes group settlement, not arbitrary separately
detached host processes. The runner creates no cleanup authority over foreign work.

Evidence records running/terminal/unrun stages, executable/argv, Node version/path,
exact source head and digest, runner/pool SHA256, log/resource paths, exit/signal,
owner-token lease receipts and unresolved holds. Pool evidence is retained whole,
including source/build hashes, sessions, raw outcomes and ownership token. Missing
or ambiguous final pool evidence fails closed. Final success requires all stages
green with no recorded hold. It does not certify manual/device/AT acceptance.

## Read-only continuation manifest

```json
{
  "planPath": "/absolute/original-plan.json",
  "dailyPath": "/absolute/daily/evidence.json",
  "poolPath": "/absolute/original-pool-run/evidence.json",
  "auditPath": "/absolute/owned-cleanup-audit.json"
}
```

```sh
node scripts/run-development-checkpoint.mjs manifest /absolute/recovery-inputs.json
```

**Resume is unsupported.** The exported pool always builds a new Storybook tree.
The manifest is review data, not an executable plan. `resume`, `reuse`, arbitrary
pool overrides and fixture substitutions are rejected for execution. Supporting
original-build continuation needs a separately reviewed pool API; do not invoke its
fixture command seam to skip setup or disguise a rebuilt artifact as the original.

## Inert validation

Run under an owned canonical light slot:

```sh
node --test scripts/run-development-checkpoint.test.mjs
```

Fixtures use temporary files/Git/leases and real inert Node subprocesses. They cover
resource abort, a supervisor cleaning a separately detached child after more than
three seconds, deadline escalation, error propagation, unverifiable settlement with
retained owner receipts, stage persistence, unsupported resume and report/build
attestation. No Storybook build, product browser or consumer execution is performed.
