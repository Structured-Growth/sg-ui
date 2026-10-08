# Dependency support, security handling and upgrades

Task: L-09. This guide defines the repository review procedure and records the
human decisions still needed to operate it. It does not appoint an owner, promise
a response time, certify dependency security or validate an upgrade. L-09 acceptance
remains with the coordinator after independent review and human policy decisions.

## Supported inputs and maintenance expectations

[package.json](../../package.json) is authoritative for declared ranges and placement;
[pnpm-lock.yaml](../../pnpm-lock.yaml) records resolved versions and peer contexts.
Review both direct and transitive changes, including fixture-only dependencies and
tools that build, test or publish the package. A compatible semver range is not
evidence that a newly resolved version preserves SGUI behavior.

| Input | Current contract and upgrade review boundary |
| --- | --- |
| React / React DOM | Only package peers; `^18.3.1 || ^19.0.0`. Keep matching versions in consumers and test both supported majors. Repository development uses 19.2.3; packed fixtures select 18.3.1 or 19.2.3. A fixture pass does not certify every patch allowed by the peer range. |
| React Aria / state / date | Exact runtime declarations: react-aria-components 1.21.1, react-aria 3.52.1, react-stately 3.50.0, @internationalized/date 3.12.4. Review their compatible dependency/peer graph together, deduplication and date identity; do not force unrelated versions into one instance. Keep upstream objects/types private to interaction implementations. |
| Grid / icons | Exact runtime declarations: @tanstack/react-table 8.21.3 and lucide-react 1.52.0. Preserve owned grid state/column contracts, icon names, granular module graphs and notices. |
| Editor | lexical and declared @lexical/* packages use `^0.41.0`, currently resolved to 0.41.0. Review the family together and align packed editor fixture versions deliberately. Preserve saved document nodes, rich children, editing/undo and read-only/reset/upload lifetimes. |
| Tooling / fixtures | Node, pnpm, TypeScript, Vite, Storybook, Playwright/axe, PostCSS/CSS Modules and release tools can change emitted output or evidence. Next.js and the Flight renderer are disposable fixture dependencies, not new SGUI runtime dependencies or peers. |

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
2. In an isolated branch, change the intended manifest inputs and regenerate the
   lockfile with the repository pnpm version. Inspect the complete resolution diff,
   integrity/peer/engine changes, duplicate interaction/date packages and transitive
   additions/removals. Never hand-edit resolutions or use an override merely to hide
   incompatibility. Verify reproducibility with `pnpm install --frozen-lockfile`.
   This is a future upgrade step, not authorization to update dependencies now.
3. Review license/notice and distributed asset changes, preserving commercial terms
   and attribution. Follow the [architecture dependency policy](react-aria-architecture.md#dependency-and-license-policy)
   and [removal audit](react-aria-removal-audit.md). Package byte preservation is not
   proof of license completeness; unresolved inventory/legal decisions remain explicit.
4. Map upstream changes into owned implementations. Check emitted declarations,
   explicit exports, source client directives, server imports, compiled CSS/token
   output and granular dependency graphs. Do not expose upstream public types or
   add retired foundation/runtime styling packages. Update affected stories and
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
   with no manual version edits, local publication or automatic merge.

## Validation by affected contract

| Concern | Required evidence for the affected upgrade |
| --- | --- |
| Owned behavior / styles | Meaningful colocated/composed regression tests, typecheck and relevant `foundations:check` / `tokens:check`; affected stories in production scopes. Review light/dark, both densities, enlarged text, locale/direction and loading/disabled/read-only states where changed. |
| Emission / declarations / imports | Fresh `pnpm build`, `pnpm test:package` and affected foundation tests. Review owned declaration/client-boundary guards and CSS/module graphs. Packed foundation API fixtures typecheck installed declarations with matching React types; their `skipLibCheck` limit is documented in package acceptance. |
| Packed React consumers / SSR | Against the fresh build, run foundation and editor scripts in [CI](../../.github/workflows/ci.yml) for both `--react18` and default React 19 when their graphs are affected. Foundation covers SSR/API/CSS and React 19 Flight; editor covers SSR and hydration-entry build. Keep React/React DOM/Flight fixture versions matched. A hydration-entry build alone is not executed hydration. |
| Hydration / framework boundaries | For affected contexts, foundation `--browser` checks execute built hydration; `node scripts/test-next-consumer.mjs` exercises packed Next production SSR/hydration and interactions. These are representative host proofs, not universal framework certification. |
| Native interaction | Focus, keyboard/form timing, overlays/placement, scrolling, grid reorder, date selection, clipboard/editor behavior need affected `pnpm test:browser` specs against fresh static Storybook. Keep axe/runtime diagnostic failures enforced. Physical devices, IME and spoken assistive-technology results need their separate evidence; DOM assertions do not replace them. |
| Build / release tooling | Exercise affected build, package and release-policy checks; workflow edits also need syntax/event/selection review. Node minimum and publishing-runtime requirements must be reviewed independently. |

Serialize packed fixtures and keep `dist` stable while they pack; Vite SSR also
shares a port. Build Storybook before browser execution and never rebuild it during
a suite. Use the shared heavy-validation discipline described in
[development validation](react-aria-development-validation.md).

During the authorized pre-production `codex/dev` migration, choose meaningful
affected checks rather than a full suite per task. Focused Chromium native evidence
permits reviewed provisional dev integration; Firefox/WebKit remain pending until
the affected checkpoint runs. Accumulate those checks after ten integrated native
slices or the daily checkpoint, whichever comes first. Automatic dev PR CI/title
runs are user-paused; dev pushes do not trigger CI. Missing remote runs are not passes.
Restore dev automation only on user request. Occasional full checkpoints retain
their exact heads and unresolved failures.

Before production acceptance, retain complete validation: `pnpm check`, fresh
Storybook and the CI packed/runtime/browser matrix, plus outstanding manual/device/AT
gates. CI tests Node **22.12.0** and **24**; the declared consumer engine is
`>=22.12.0`, and development/AI/title/release use Node 24 from [`.nvmrc`](../../.nvmrc),
pnpm 10.29.3. Publishing-tool engine requirements are distinct from the consumer
minimum; see [runtime policy](react-aria-runtime-ci.md). Node 24 runs all three
browser engines, foundation browser hydration and Next production/browser checks.
Production-bound PRs, main pushes and reusable release CI retain these checks.
A targeted dev pass or older CI result cannot certify a new upgrade head.

## Human decision record required for operational acceptance

All fields below are **awaiting human decision**. Record the approver, decision date
and retained approval reference when filling them; this guide supplies no approval.

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
are recorded, this is a concrete review contract with unresolved governance,
not evidence that security handling or future upgrade execution has passed.
