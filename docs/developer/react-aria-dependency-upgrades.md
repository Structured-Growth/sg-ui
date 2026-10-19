# Dependency support, security handling and upgrades

Tasks: A-A-19 (dependency placement/version/upgrade policy), L-09 (operational policy).
This guide defines the repository review procedure and records the
additional operating commitments that have not been adopted. It does not appoint
an owner, promise a response time, certify dependency security or validate an
upgrade. The original L-09 documentary obligation is accepted in the
[closure record](final-acceptance/wave-04/coordinator/accepted-closures.json); that
decision does not establish a service commitment or an executed future upgrade.

## Current pre-release maintenance policy

Development integrates the latest work into `dev`; `main` is reserved for a
separately human-approved major/minor production promotion. Required production
validation remains mandatory. The package manifest currently uses
`0.0.0-development`; that value is a development label, not publication history
or a support-window promise. See the [release procedure](../troubleshooting/release.md).

The [master task list](react-aria-execution-policy.md) sequences functionality,
regression and hardening. The [development validation policy](react-aria-development-validation.md)
requires affected behavior/types/import/token checks and focused native or packed
consumer evidence when needed; full production and exact-candidate evidence stay
separate. Existing tests and failures are retained. The dependency/asset change
author prepares graph, contract, notice, validation and rollback evidence;
repository maintainers review changes before integration. These are roles,
not newly appointed individuals or a support service.

No published-version backport window, routine service-review interval, response
SLA or confidential support channel is specified by this repository. The absence
of those commitments is the current documented boundary, not a promise to refuse
support or an EOL decision. Any commercial support terms belong in the actual
written agreement; they cannot be inferred from public npm availability or a
passing test. The planning record below is retained for additional commitments
if the owner chooses to offer them; it is not an unclosed L-09 requirement.

## Supported inputs and maintenance expectations

[Library package.json](../../packages/ui/package.json) is authoritative for distributed
runtime dependencies, peer ranges, development dependencies and public exports;
[pnpm-lock.yaml](../../pnpm-lock.yaml) records resolved versions and peer contexts.
Review both direct and transitive changes, including fixture-only dependencies and
tools that build, test or publish the package. The [root manifest](../../package.json)
owns workspace tooling and forwarding commands; the [docs manifest](../../apps/docs/package.json)
owns the private website host, not the distributed library dependency contract.
A compatible semver range is not
evidence that a newly resolved version preserves SGUI behavior.

| Input | Current contract and upgrade review boundary |
| --- | --- |
| React / React DOM | The only library peers are React and React DOM; `^18.3.1 || ^19.0.0`. Keep matching versions in consumers and test both supported majors. Repository development uses 19.2.3; packed fixtures select 18.3.1 or 19.2.3. A fixture pass does not certify every patch allowed by the peer range. |
| React Aria / state / date | Library `dependencies` (not peers or dev-only): exact runtime declarations react-aria-components 1.21.1, react-aria 3.52.1, react-stately 3.50.0, @internationalized/date 3.12.4. Review their compatible dependency/peer graph together, deduplication and date identity; do not force unrelated versions into one instance. Keep upstream objects/types private to interaction implementations. |
| Grid / icons | Exact runtime declarations: @tanstack/react-table 8.21.3 and lucide-react 1.52.0. Preserve owned grid state/column contracts, icon names, granular module graphs and notices. |
| Editor | lexical and declared @lexical/* packages use `^0.41.0`, currently resolved to 0.41.0. Review the family together and align packed editor fixture versions deliberately. Preserve saved document nodes, rich children, editing/undo and read-only/reset/upload lifetimes. |
| Tooling / fixtures | Node/pnpm configure the toolchain; TypeScript, Vite, Playwright/axe, PostCSS/CSS Modules and release/test tools are library development inputs and can change emitted output or evidence. React/React DOM 19.2.3 also appear in library `devDependencies` for local tests. Next.js 16.4.0 is a private docs-app dependency and a disposable packed-consumer fixture input; the Flight renderer is fixture-only. Neither is an SGUI runtime dependency or peer. Storybook runtime, dependencies and original story files have been removed. |

The maintained target is the reviewed manifest/lockfile combination and owned
consumer contracts, not every upstream release or historical SGUI version.
No previous-release backport window is established here. Continue preserving
React 18.3/19 support unless an explicitly reviewed breaking migration changes it.
No wider TypeScript, bundler, framework or physical-device promise follows from
representative fixtures; see [package acceptance](react-aria-package-acceptance.md)
and [server boundaries](react-aria-server-components.md).

An upstream advisory, published end-of-support/deprecation notice, relevant regression,
incompatible peer/engine change or proposed dependency/lockfile/toolchain change
triggers review. Review upstream release notes, support status and advisory evidence
when that review is authorized; record source, date and affected versions rather
than asserting that this guide checked current upstream status. Routine review
cadence and the responsible person are pending in the decision record below.

If a required dependency is unsupported or EOL, record the affected resolved graph,
reachable behavior and supported runtime constraints. Propose a maintained upgrade,
replacement or removal with migration cost and validation, or an explicit temporary
retention decision with mitigation, responsible owner and next review date. Do not
silently retain it or claim that an upstream version bump alone resolves the risk.
An unresolved exception must be visible in production acceptance review; this guide
does not approve it or promise indefinite support.

## Consumer resolution and deduplication

Consumers install SGUI with matching React/React DOM versions in the declared peer
range. They do not install React Aria, React Stately or date utilities as extra
SGUI peers. SGUI keeps their objects and types behind owned contracts; hosts own
locale/timezone policy, reference dates, availability, authorization and persistence.
Changing an internal date engine does not transfer those responsibilities.

The repository lockfile pins this workspace graph; it does not pin an application's
transitive resolutions. Each consumer must regenerate/review its own lockfile when
adopting an upgrade, install reproducibly using its package manager's frozen/immutable
mode, and validate its actual React peer context, build/SSR/hydration and affected
interaction flows. Do not copy the workspace lockfile into a host as a substitute.
A broader host graph or another installed SGUI version can introduce duplicates.

For each authorized upgrade, inspect declared ranges, lockfile snapshots and the
installed paths/peer contexts for react-aria-components, react-aria, react-stately,
@internationalized/date and relevant transitive @react-aria/*, @react-stately/* and
@internationalized/* packages. Use `pnpm -r list --depth Infinity --json` plus focused
`pnpm --filter @structured-growth/sg-ui why <package>` from the root as graph inputs;
inspect actual resolved paths/peer snapshots when name/version output is insufficient.
Record why duplicates exist, whether compatible resolutions can be deduplicated by
the package manager, and whether date conversion/state/provider behavior is affected.
Upgrade the compatible interaction/state/date family together where its constraints
require it. Prefer compatible deduplication, while retaining genuinely incompatible
versions until their owning graph is deliberately migrated; never coerce them with
an incompatible override. Recheck the resulting graph and affected behavior.

The dated [FA-02 inventory](archive/2026-10-18-task-lists/react-aria-final-acceptance.md#fa-02-dependency-source-and-generated-output-inventory)
and [parallel-07 receipt](final-acceptance/parallel-07/input-receipt.json) retain one
name/version observation for each direct interaction/date input and date edges
resolving to 3.12.4. They do not certify one physical instance, identical peer
contexts, consumer singleton behavior, security or a new frozen installation.
An upgrade receipt must inspect its own candidate graph; old inventory is context,
not current-head upgrade validation.

## Reporting and security triage

The checked-in [GitHub setup guide](../github-setup.md#manual-ai-task-and-draft-review)
routes ordinary UI requests through the [UI issue form](../../.github/ISSUE_TEMPLATE/ui-change.yml)
for triage; it does not define a confidential security reporting route. At the
reviewed source head there is no tracked SECURITY.md, SUPPORT.md, CODEOWNERS,
Dependabot or Renovate configuration. That says nothing about external practices
or repository settings. Do not direct confidential vulnerability details into
the public UI form, invent an email/team, or assert that private reporting is enabled.
The repository owner must confirm a reporting channel and accountable recipient
before this becomes an operational security reporting policy.

For a received advisory or report, the assigned human triage owner should:

1. Record the advisory/report identifier, source/date, package, affected/fixed
   versions, resolved dependency path, reviewed SGUI head and reproduction evidence.
   Distinguish distributed runtime code, development/CI/release tooling and fixtures.
   Keep sensitive reproduction details in the owner-confirmed confidential channel.
2. Assess reachability and impact in SGUI and host contexts, including browser/SSR,
   saved/pasted content and build/publication paths. Record uncertainty. A scanner
   severity or absence of an audit finding does not establish exploitability or safety.
   Host upload authorization, data, credentials and network cleanup remain host-owned.
3. Prioritize confirmed reachable exploitation or compromised distribution/tooling
   ahead of routine refresh work. Record the human urgency decision, mitigation and
   whether production progression needs to wait. Response/remediation deadlines and
   emergency authority remain owner decisions, not promised service levels.
4. Select an upgrade, removal, scoped mitigation or explicit temporary retention;
   follow the upgrade checks below. Record unresolved risks, responsible follow-up
   and a review date. Preserve failed checks and do not bypass release validation.
5. Have the owner decide affected supported releases/backports, reporter/upstream
   coordination and disclosure/customer communication. Communication and publication
   require their own authorization; receiving a report does not authorize them.

There is no automatic advisory monitoring or scheduled scan introduced by this
documentation. Commercial support terms remain in [commercial licensing](../commercial-licensing.md)
and [LICENSE](../../LICENSE); neither they nor third-party notices are rewritten here.

## Deliberate upgrade procedure

1. Bound the request: identify trigger, current/target declared and resolved versions,
   affected modules/public exports/fixtures, upstream API/behavior/support/advisory
   evidence and expected consumer benefit. Separate unrelated upgrades. Identify the
   human reviewer and any pending security/legal/support decisions before acceptance.
2. Base an isolated development branch on `dev`; change the intended manifest
   inputs and regenerate the
   lockfile with the repository pnpm version. Inspect the complete resolution diff,
   integrity/peer/engine changes, duplicate interaction/date packages and transitive
   additions/removals. Never hand-edit resolutions or use an override merely to hide
   incompatibility. Verify reproducibility with `pnpm install --frozen-lockfile`.
   This is a future upgrade step, not authorization to update dependencies now.
3. Retain before/after [dependency/license inventories](react-aria-license-inventory.md)
   at the current and candidate dependency graphs, with exact manifest/lock/legal hashes.
   Run the bounded [source policy guard](react-aria-governance-check.md); classify
   its findings separately from license/provenance review.
   Review license/notice and distributed asset changes, preserving commercial terms
   and attribution. Follow the [architecture dependency policy](react-aria-architecture.md#dependency-and-license-policy)
   and [removal audit](react-aria-removal-audit.md). Package byte preservation is not
   proof of license completeness; unresolved inventory/legal decisions remain explicit.
4. Map upstream changes into owned implementations. Check emitted declarations,
   explicit exports, source client directives, server imports, compiled CSS/token
   output and granular dependency graphs. Do not expose upstream public types or
   add retired foundation/runtime styling packages. Update affected docs playgrounds
   and source-backed examples,
   colocated source-context unit fixtures and docs-owned native scenarios, plus
   consumer/migration docs; deliberate breaking changes need a breaking release marker.
5. Execute and record affected checks at one frozen candidate head using the matrix
   below. A failed or incomplete check remains visible with its cause and follow-up.
   An upgrade labeled patch/security still needs behavioral regression evidence.
6. Provide review evidence: exact head, manifest/lockfile identities, commands,
   runtime/React/browser versions, outcomes/raw artifacts, resolved graph/license
   review, remaining decisions and rollback plan. Rollback should identify the prior
   reviewed dependency combination and assess saved document/data compatibility;
   reverting a manifest alone is insufficient when an upgrade changes persisted data.
   AI changes remain draft PRs; human review decides integration. Use the
   [Actions release flow](../github-setup.md#automatic-versioning-and-release-flow),
   with no manual version edits, local publication or automatic merge. Integrate
   reviewed development work into `dev`. Only explicitly human-approved major/minor
   releases may promote reviewed, fully validated work to `main`; ordinary upgrades
   do not authorize a production push/merge, tag or publish. Conventional Commits and
   semantic-release determine version impact. Assess owned API/behavior, peer/engine
   minimums, styling and persisted editor content for breaking changes rather than
   assuming the upstream version label determines the SGUI release impact.

## Validation by affected contract

| Concern | Required evidence for the affected upgrade |
| --- | --- |
| Owned behavior / styles | Meaningful colocated/composed regression tests, typecheck and relevant `foundations:check` / `tokens:check`; affected website examples and native scenarios in production scopes. Review light/dark, both densities, enlarged text, locale/direction and loading/disabled/read-only states where changed. |
| Emission / declarations / imports | Fresh `pnpm build`, `pnpm test:package` and affected foundation tests. Review owned declaration/client-boundary guards and CSS/module graphs. Packed foundation API fixtures typecheck installed declarations with matching React types; their `skipLibCheck` limit is documented in package acceptance. |
| Packed React consumers / SSR | Against the fresh build, run foundation and editor scripts in [CI](../../.github/workflows/ci.yml) for both `--react18` and default React 19 when their graphs are affected. Foundation covers SSR/API/CSS and React 19 Flight; editor covers SSR and hydration-entry build. Keep React/React DOM/Flight fixture versions matched. A hydration-entry build alone is not executed hydration. |
| Hydration / framework boundaries | For affected contexts, foundation `--browser` checks execute built hydration; `node scripts/test-next-consumer.mjs` exercises packed Next production SSR/hydration and interactions. These are representative host proofs, not universal framework certification. |
| Native interaction | Focus, keyboard/form timing, overlays/placement, scrolling, grid reorder, date selection, clipboard/editor behavior need affected `pnpm test:browser` specs against the fresh docs-owned static native fixture host (`apps/docs/native-fixtures` → `packages/ui/browser-docs-static`). Keep axe/runtime diagnostic failures enforced. Physical devices, IME and spoken assistive-technology results need their separate evidence; DOM assertions do not replace them. |
| Build / release tooling | Exercise affected build, package and release-policy checks; workflow edits also need syntax/event/selection review. Node minimum and publishing-runtime requirements must be reviewed independently. |

Root pnpm commands forward library checks to `packages/ui`. Before an authorized
native check, run root `pnpm build:browser-docs` (fresh library build, native-fixture
typecheck and static host build), then a bounded selection such as
`pnpm test:browser --project=chromium tests/browser/reorder.spec.ts` for a reorder
change; select the actual affected spec(s) for each upgrade. For direct `node scripts/...` consumer/fixture commands in the table,
use `packages/ui` as cwd; CI uses that same default. The native Playwright config
starts `scripts/serve-browser-docs.mjs` for the static host. The production Next.js
catalog is separate: root `pnpm build:docs` and docs `test:e2e` validate its rendered
routes, examples/source and host behavior when affected; a native-fixture build
does not validate that website.

Acquire the shared heavy-validation/browser lock and coordinate build/fixture
leases before running these commands. Serialize packed fixtures and keep `dist`
stable while they pack; Vite SSR also shares a port. Never rebuild library outputs
or the static fixture tree during a browser suite or attested frozen snapshot.
Use [development validation](react-aria-development-validation.md) for the current
checkpoint/lease discipline. These are upgrade instructions, not checks run by this
documentation correction.

During the authorized pre-production `dev` migration, choose meaningful
affected checks rather than a full suite per task. Focused Chromium native evidence
permits reviewed provisional dev integration; Firefox/WebKit remain pending until
the affected checkpoint runs. Accumulate those checks after ten integrated native
slices or the daily checkpoint, whichever comes first. Automatic dev PR CI/title
runs are user-paused; dev pushes do not trigger CI. Missing remote runs are not passes.
Restore dev automation only on user request. Occasional full checkpoints retain
their exact heads and unresolved failures.

Before production acceptance, retain complete validation: `pnpm check`, fresh
docs-owned native fixtures, production docs checks and the CI packed/runtime/browser
matrix, plus outstanding manual/device/AT
gates. CI tests Node **22.12.0** and **24**; the declared consumer engine is
`>=22.12.0`, and development/AI/title/release use Node 24 from [`.nvmrc`](../../.nvmrc),
pnpm 10.29.3. Publishing-tool engine requirements are distinct from the consumer
minimum; see [runtime policy](react-aria-runtime-ci.md). Node 24 runs all three
browser engines, foundation browser hydration and Next production/browser checks.
Production-bound PRs, main pushes and reusable release CI retain these checks.
A targeted dev pass or older CI result cannot certify a new upgrade head.

<a id="human-decision-record-required-for-operational-acceptance"></a>

## Decision record for additional operating commitments

The fields below retain the earlier unapproved planning record. They are
**awaiting owner decision if these additional commitments are requested or
offered**. Record the approver, date and retained reference when adopting one;
this guide supplies no approval. Named appointments, confidential intake and a
published-release support window are not prerequisites for the already accepted
L-09 documentation or W-18's factual account of current policy.

| Field | Decision to record |
| --- | --- |
| Maintenance accountability | Named dependency review owner and backup; approver for upgrade/retention decisions. |
| Routine review | Review interval, advisory/support-status sources and responsibility for carrying out review; whether any monitoring should be configured in a separately authorized task. |
| Security intake | Confirmed confidential reporting channel, recipient/access and fallback route. No inferred email, team or enabled GitHub private-reporting setting. |
| Urgency / escalation | Triage and remediation targets, emergency decision authority and escalation route. No SLA is established. |
| Supported releases | Backport/support window, unsupported/EOL retention authority, exception expiry/review and consumer communication responsibility. |
| Disclosure / acceptance | Authority for reporter/upstream coordination and disclosure; owner acceptance of remaining risks and separate legal/commercial prerequisites. |

Use a per-review receipt containing dependency/advisory, affected head/graph,
assigned owner, urgency/rationale, chosen action, validation scope/results,
exceptions/expiry, next review date and human approval reference. Until decisions
are adopted, use the role-based repository procedure above without claiming an
SLA, adopted additional service policy or a future upgrade execution has passed.
