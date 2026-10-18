# Retained tooling findings

These were audit-authoring failures, not product/browser results:

- The first reconciliation treated `src/` replacement metadata as root-relative. Its manifest assertion failed. The workspace resolver now applies `packages/ui` to destinations and replacements, as required by AGENTS.md; all201rows resolve.
- The first AST test exposed that TypeScript export declarations have no export modifier. It omitted an alias. Named export declarations now run before the modifier guard; the alias-loss negative test passes.
- The first package-command scan incorrectly parsed ordinary prose (`pnpm10.29.3`, “pnpm commands”, etc.) as commands. It now scans explicit code spans/fences only. The regression test preserves actual invalid inline commands while rejecting prose false positives.
- Forward patch checking first passed, then failed after the coordinator concurrently applied the exact table to shared docs/migration.md. The observed file hash matches proposedSha256 and reverse applicability passes. This worker did not apply the shared patch. The original forward-check failure is an integration-state observation, not a documentation defect or product failure.
- Strict history currently exits1 with16named early grid scenarios. That result remains a failure in the strict receipt; structural mode is explicitly narrower. No assertion or original scenario was removed to make strict mode green.

Node tooling ran on26.5.0. These lightweight results are not supported Node22/24 product compatibility evidence. No shared browser/build/install/simulator execution occurred.
