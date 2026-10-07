# Batch 107 — current H-04–H-07 evidence assessment

Reviewed head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev` baseline).
Review date: 2026-10-07. Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-107-host-evidence/sg-ui`.
Branch: `codex/batch107-host-acceptance-evidence`.

This is a fresh read-only assessment of the four unchecked parent criteria in the
[master task list](../react-aria-master-task-list.md), not a migration inventory,
source-removal audit or new runtime validation. Only this report changes. The
coordinator owns acceptance decisions, integration and validation scheduling.
No parent checkbox is closed. No missing runtime behavior was established in this
bounded inspection; no optional spec was added merely to repeat existing cases.

## Per-ID matrix

| Criterion | Disposition at reviewed head | Concrete supported boundary | Precise remaining gate |
| --- | --- | --- | --- |
| H-04 account/organization/logout ownership | **Partial parent; source-supported account boundary** | `accounts.tsx` exposes presentation records and supplied getters/setters/markers/logout callbacks; absent provider supplies disabled no-ops. No token/password field, endpoint, session-refresh implementation or eager getter call occurs in the adapter. SideNavigation invokes supplied callbacks; its `refreshStoredSessions` reads host presentation getters, not a network session refresh. Organization success commits only under its current operation token. Retained historical Chromium evidence has identical relevant blobs (A below). | Full application adapter/service integration remains host-owned and unverified here. Organization ID persistence and existing login/account route requests are deliberate shell behavior, not credentials. The network/abort/asset effects of an already invoked host callback remain host-owned. Same-commit settlement before passive-effect cleanup is unverified. No whole-tree credential/fetch audit or full host integration pass is asserted. |
| H-05 async pending/error and duplicate requests | **Partial parent; source-supported composed policy plus retained bounded native proof** | SideNavigation's shared `accountOperation` ref blocks overlapping switch/logout requests; menu entries are disabled while pending. Operation tokens reject obsolete completions. Current failures keep useful translated operation/retry messages and permit retry; failed logout does not navigate. The adapter itself passes exact promises/rejection reasons through, deliberately allowing independent consumers to issue independent requests. Existing tests inspect this ownership and out-of-order error identity; A establishes six native organization-lifetime cases. | Shell catches render generic operation-specific retry messages; raw diagnostic errors are not surfaced or reported by the shell. The host must diagnose before rejection; this does not prove host logging or diagnostic preservation in an application. Existing adapter/demo pending browser spec is not evidence of every shell action. Fresh logout/all-account native evidence, other engines, and the passive-cleanup timing limit remain unverified by this review. |
| H-06 unified host locale/direction | **Partial parent; source-supported bridge and retained narrow locale proof** | Production Provider reads `useTranslation().locale`, supplies React Aria `I18nProvider`, and derives native `lang`/default `dir` from React Aria `useLocale`. Explicit visual `dir` remains independent of locale-based interaction semantics. ThemeScope/portal bridge preserves visual direction. LearnerClassCard reads the same translation adapter locale for due formatting. Calendar/DateRangeSelector use the translation adapter for owned strings and React Aria for date interactions; B proves selected Arabic RTL/Hebrew calendar cases. | Hosts must nest production Provider under the intended translation adapter and coordinate nested replacements; ThemeScope alone is a visual scope, not a locale bridge. Intentional per-string English fallback need not change interaction locale. Arbitrary host engines/catalogs, malformed locale through React Aria, complete live locale replacement across composed controls, all popup placements and Firefox/WebKit remain outside this retained slice. Locale does not establish timezone; host SSR/reference clock/timezone coordination and manual/device/AT remain open. |
| H-07 keys/defaultMessage/values/namespaces/fallback | **Partial parent; adapter contract fully source-supported** | `SGTranslationOptions` requires `defaultMessage`; `SGTranslationProvider` forwards the original key/options/values and method receiver. Namespace loading is forwarded without eager fetch/caching/deduplication, and its errors propagate. Missing key/marker/non-string/throw yields one English `en-US` fallback; intentional empty strings and already formatted results survive. ICU locale validation uses deterministic English fallback. Exact source blobs still match the historical translation implementation. | Source inspection does not establish that every library-owned call site/catalog obeys the contract or that every host catalog supports required variables. Historical unit/full-check prose lacks reverified local raw artifacts/exact full-check tested head in this review. Current-head targeted execution, catalog integration, engine-specific ICU formatting, visual/native/AT coverage remain separate. No historical test count is promoted to a current-head pass. |

## Exact source identity

All Git blob IDs below were resolved directly with `git rev-parse <reviewed-head>:<path>`.
The links point to current tracked sources; use the head and blob to identify exact
bytes independently of later changes.

| Source at reviewed head | Git blob |
| --- | --- |
| [Account adapter](../../../src/adapters/accounts.tsx) | `205182f0161946cca99c8022a0c4c09543c4cef5` |
| [Account boundary tests](../../../src/adapters/accounts.test.tsx) | `d875841639f8ffcf75cd004f0cb9c4251d42ba9b` |
| [SideNavigation](../../../src/components/SideNavigation/SideNavigation.tsx) | `87a78ab622b7ab31eed623af8a4ab529a1b2fb4b` |
| [Organization lifetime unit tests](../../../src/components/SideNavigation/SideNavigation.organization-lifetime.test.tsx) | `0272689d0d2d5cb06900cc101fb242043d811f06` |
| [Organization deterministic fixture](../../../src/components/SideNavigation/SideNavigation.organization-lifetime.stories.tsx) | `683390e25f8302f4ce7184fa122c9f350fc9f92c` |
| [Organization native spec](../../../tests/browser/batch70-organization-switch-lifetime.spec.ts) | `d18ccadb1d7cadc5317f64197b3d02241232fb48` |
| [Provider locale bridge](../../../src/experimental/Provider/Provider.tsx) | `cb3e3de6f89932418f05fd793a4899bd8ff548ed` |
| [ThemeScope/portal direction](../../../src/foundation/ThemeScope.tsx) | `ec330a71f6ee1f32ad10b717efe5a285094ca953` |
| [LearnerClassCard composition](../../../src/components/LearnerClassCard/LearnerClassCard.tsx) | `3e8d73e0e48d68c9dc324ad49e4507a2060b5417` |
| [Due formatter](../../../src/utils/formatDueDateLabel.ts) | `dfce16aa6abbed4fa0ea74f0257805b8a1b53431` |
| [Translation boundary](../../../src/i18n/index.tsx) | `3995019deab2fe0b5c1082320c06c73802a47ffb` |
| [Translation boundary tests](../../../src/i18n/index.test.tsx) | `3473d2b1a97cd5932d6322e3d4f1fee350da11d5` |
| [ICU formatter](../../../src/i18n/icu.ts) | `7a93dd490eb641b91bbfdcee6e6d9784b452cb49` |
| [ICU tests](../../../src/i18n/icu.test.ts) | `eebc4c3a65e1eddea07e9f24fac2b421e3fde932` |

The translation boundary and ICU formatter match historical implementation
`b12fef8c9f8d5e7d0bd931128c1f1f115735453f`; the due formatter matches
`4529de0ccefc11ebed799a8480477baf5e931324`. These comparisons attribute source,
not execution at the current head. Contract documents inspected:
[host adapters](../react-aria-host-adapter-acceptance.md),
[shells](../react-aria-modal-shells.md),
[translation fallback](../react-aria-i18n-acceptance.md).

## Retained native evidence inspected, not rerun

A — Organization lifetime. Actual tested candidate:
`1976be5e3776fe5e44065b02f359a17751ef7284`.
Root artifact:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/6c2eaada-de28-4a40-aef8-2668b3847a47/evidence.json`.
Read on this review date; SHA-256:
`e102f3ca233554947ef569f3482804bd54e6bc4b6fb36de74ef9264a3b2151ff`.
Root status is **failed** because the separate editor session failed; organization
session status is **passed**, six cases, Chromium only, Node 24.19.0, port 6733,
2026-10-07T18:35:06.371Z–18:35:11.092Z. Static build digest:
`2543b9cc0e24ff7ce9607fcd58da64e7ab2ffb1f7606aaa7b9d0de518ce96d5d`.

Read the retained `organization-switch-lifetime/browser.log` (six passing case
lines and `6 passed`), SHA-256
`39a3d65da10fc1b812192ba0c6d96405d225ec4fc453fd4a25198e693b738440`.
The session evidence, results JSON and HTML report also exist; their contents were
not all re-audited. Session evidence SHA-256:
`cd4681fdf3ddad3c3d85b8197c73169fe6737cc6fdc9603ac8ea76b82ab2bdbc`.
Direct Git comparison establishes all four organization implementation/unit/fixture/
spec blobs above match this tested candidate. The temporary wave32 attribution
JSON is absent; Git supplies the retained source comparison. Scope/timing limits
are preserved from [batch 70](../parallel-batch-70/organization-switch-lifetime.md).

B — Calendar locale behavior. Actual tested candidate:
`1a378accd909a471e653fe4e27fe9457c9531049`.
Retained root artifact:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/7c82140b-3a18-4b19-aca5-9a5f0720af5f/evidence.json`.
Read on this review date; SHA-256:
`5cb3d884baa20acc27afbaef230469ebabddf30d48f6c10a0dc32c69f5c1b59c`.
Root/session status passed; calendar session records ten cases, Chromium only,
Node 24.19.0, port 6676, 2026-10-07T18:31:57.692Z–18:32:03.420Z.
Build digest:
`ec6eca4336c63f839bde0508a026992dd9110b342f6072e714a5eaf6f14cde75`.
Relevant Arabic traversal/Hebrew display cases are listed independently in light
and dark themes. Git blobs match the reviewed head for Calendar implementation
`398c4d756b023c025d514a1b718d075ddec07c85`, native fixture
`099fd58d5d14510a6973da814a9e60eb0b0781f4`, and native spec
`dfb3d49cdb935658ecb2b8d3f70906b4ee27ef7a`. This is retained session metadata,
not a new current-head matrix. See [batch 74 limits](../parallel-batch-74/calendar-native-locales.md).

The [portal report](../parallel-batch-05/portal-direction.md) records historical
Chromium/WebKit passes and Firefox launch failures. Its named final temporary
browser log is absent now; this report does not upgrade that prose to reverified
raw evidence. Translation/unit and due-date historical counts likewise remain
reported history rather than newly run proof.

## Checks performed and coordinator handoff

Performed only managed-worktree creation at the exact pinned head; Git status/head,
blob resolution and historical blob comparisons; focused `rg` source searches;
source/test/contract inspection; retained JSON/log reads and SHA-256 calculations;
and report Markdown-link/allowlist/whitespace checks. A focused search for
`fetch(`, `XMLHttpRequest`, `axios`, `refreshSession`, token/password/credential
references in adapters and account shells found only an ownership comment and
AuthShell test/story presentation text. This lexical search is bounded evidence,
not proof against every possible network helper or data flow.

No install, unit/type/import/token command, build, pack, browser/performance suite,
CI job or lease acquisition ran in this assignment. No runtime pass at the
reviewed head is claimed. Existing tests and deterministic fixtures already cover
the meaningful inspected boundaries; inventing another native spec would not
resolve missing engine/manual/host-policy evidence.

Coordinator follow-up can reuse the existing account tests, SideNavigation tests,
Provider tests and i18n tests in a scheduled lightweight window, and existing
`batch70-organization-switch-lifetime.spec.ts`, `batch01-adapters.spec.ts`,
`batch05-portal-direction.spec.ts` and `calendar-native-locales.spec.ts` in a fresh
shared native window. Frozen-source attribution must include the locale provider
and all relevant dependencies before making a whole-current-head runtime claim.
No new exclusive production source allowlist is requested because no actual
missing implementation was demonstrated. Full host diagnostics/catalog integration,
physical devices and spoken AT require their respective owners and cannot be
closed by source inspection or DOM status assertions.
