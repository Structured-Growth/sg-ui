# Models dependency boundary: T-S18-03

Ready for independent coordinator review. The named criterion is presentation-only data independent of HTTP contracts, depending on accepted F-S18-03. Historical scope A-14/E-09/E-10 remains separate.

The current `src/models.ts` retains `LearnerClass` and `courseName`, with no imports or runtime code. Existing source/compiler/package evidence established compliance but did not execute the dependency prohibition. The prior remaining-T review therefore held this leaf; its original raw evidence and historical executed heads have not been recovered.

[The focused test](../../../src/models.remaining-T-boundary.test.ts) adds two executed cases. The first reads the actual model, walks its AST dependency graph with repository TypeScript resolution, and checks compiler diagnostics. The second uses bounded in-memory fixtures to reject direct type imports, reexports, import types, a transitive owned-source dependency on a host contract, an unresolved application alias and a host reference path. A resolved public React declaration type is accepted. The explicitly reviewed source/type allowlist must be reviewed when future presentation dependencies are added; this does not invent HTTP payload schemas or rename compatibility APIs.

Node v24.21.0 / Vitest v4.1.11: **1 file, 2 cases passed; zero failures, skips or retries**. Exact tested head: `bc05c799105f07610b4e70b30f7de9fbcc836733`. Frozen installation used one canonical install2 admission; targeted Vitest used one canonical light4 admission with one worker. Both owned process groups settled, with no remaining owned processes, and both leases were released.

The external `remaining-T-model-boundary.json` report under the coordinator's 2026/10/07 evidence directory retains exact command receipts, input SHA256s, raw log/resource SHA256s, case IDs and settlement. The raw unit log SHA256 is `0863166e4b45f274db63e7f7878464f1b8edf0b86ecd1e49be63da915043d628`. Product source, existing tests/stories, guards, configuration, tokens, barrels and lockfile are unchanged.

This is a bounded compiler-source dependency regression. It does not validate runtime network behavior or semantic payload provenance, close historical parents, or claim browser/device/assistive-technology/hardening acceptance. Central backlog/state acceptance and integration remain coordinator-owned.
