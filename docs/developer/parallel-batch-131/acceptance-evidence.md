# Batch 131: W-11–W-14 acceptance evidence

Reviewed source head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (assigned codex/dev baseline).
Read-only inspection date: 2026-10-07, America/Chicago.
Isolated managed checkout: `/Users/thomashall/.codex/worktrees/batch-131-evidence/sg-ui`.
Only this report is changed. Root coordinator owns acceptance updates and integration.
No parent checkbox or ledger is changed. This assesses the four unchecked W criteria,
not M-row completion, an implementation-removal inventory or whole migration acceptance.

## Per-criterion matrix

“Supported” below means the precise **documentation criterion** is supported by
retained Git content at the reviewed head. It does not mean that documented runtime
behavior passed at that head or that root has accepted/closed the criterion.

| ID | Finding | Concrete retained evidence | Remaining gate / limits |
| --- | --- | --- | --- |
| W-11 | Fully supported as a repository documentation criterion | [README installation and root/granular examples](../../../README.md#use-in-an-application) give `pnpm add`, exactly React/React DOM `^18.3.1 \|\| ^19.0.0`, one `/styles.css` import, root AppButton/Provider and declared `/components/AppButton` plus `/theme` alternatives. [package.json](../../../package.json) has exactly those two peers and matching exports; interaction/date/grid/icon/editor packages are dependencies. [theme barrel](../../../src/theme/index.ts), Provider and Button source inspected below support the named scope/variant/onPress examples. | No missing documentation requirement found. Examples were source-inspected, not compiled or executed in this assignment. Published package availability, commercial authorization, exact tarball and current-head packed runtime acceptance remain independent owner/release/R/Z gates. |
| W-12 | Fully supported as a repository documentation criterion | [Architecture styling/scope/accessibility](../component-architecture.md#styling-scope-and-accessibility) and [adoption styling review](../react-aria-adoption-checklist.md#styling-and-acceptance-review) document generated tokens, `sgui.tokens` then `sgui.components`, native class/style and documented `data-sgui-part` hooks, host override precedence and private-class avoidance. [Theme](../react-aria-theme.md) covers themes, density, nested scopes, portal inheritance and locale versus visual direction. [Primitives](../react-aria-primitives.md), [layout/actions](../react-aria-layout-actions.md) and adoption form checklist cover names, value callbacks, explicit submit/reset, disabled/read-only and controlled/native reset. [Icons](../react-aria-icons.md) covers named/decorative SVGs, size and RTL. [Calendar](../react-aria-calendar-contracts.md) documents serializable date/time/range values, explicit timezone/DST conversion, draft/form semantics, host responsibilities and AT/device limits. | No missing topic found in this bounded review. Documentation does not establish full parts/slots behavior for every control, spoken AT output, physical devices/IME, calendar locale matrix or zoom acceptance. Host labels, supported locales, validation, fonts/resets and timezone policy remain host-owned. |
| W-13 | Fully supported as a repository documentation criterion | [Published repository consumer mapping](../../migration.md#consumer-migration-mappings), linked from README, maps aliases/root/subpaths, CSS/scopes, removed theme objects/augmentation, `sx`/callbacks/slots/polymorphism, Typography `as`/variant/bodyAlt2, icons, grid engine types/sort/IDs/selection, shell pagination ownership, explicit persistence, row reorder, editor, modal and date contracts. It links component-specific breaking mappings and lists changed defaults such as explicit submit/reset and opt-in persistence. README/theme/primitives document light/comfortable defaults and generic Menu scope inheritance versus compact catalog menus. | Repository publication is evidenced by tracked documentation; no npm release or external site publication is claimed. No documentation gap found for the enumerated mapping categories. Actual host migration, accepted breaking-release marker and production adoption remain separately authorized owner work; preserved App/Class names do not imply upstream prop compatibility. |
| W-14 | Fully supported as a repository documentation criterion | [Adoption Vite composition](../react-aria-adoption-checklist.md#vite-host-composition) provides an entry/createRoot, CSS, granular AppButton and scope example. Its [Next App Router composition](../react-aria-adoption-checklist.md#nextjs-app-router-host-composition) supplies root-layout CSS, host Client Component providers, next/navigation adapter and client save callback with serialization caveat. [Server boundaries](../react-aria-server-components.md) documents source directives, eligible presentation imports, provider/client boundaries and CSS maps. [Navigation adapter](../../../src/adapters/navigation.tsx) matches pathname/navigate/replace. Source search found no `next/`, Next import or Next require in `src`; package.json has no Next dependency in any dependency section. Retained fixture scripts generate Vite SSR/hydration and Next server/client consumers from packed imports. | Examples are representative source patterns, not a newly executed host. No framework API leak or missing example was found. Current-head Vite/Next/Flight production validation is UNRUN here and belongs to root's serialized window; historical fixture results do not certify this head, every control/framework or device/AT. |

## Checks actually performed

- Confirmed original and isolated checkout HEAD equal the assigned 40-character baseline;
  original status was clean. Created the managed worktree before the sole report edit.
- Read README, migration and architecture guidance, then the cited adoption/theme/
  primitive/icon/layout/calendar/server/runtime/browser documents. Read Provider,
  ThemeScope, AppButton, owned Button, Button CSS and the navigation adapter; inspected
  generated consumer sections of both packed fixture scripts without executing them.
- Parsed `package.json` using Python standard library: checked the exact peer set,
  declared `.`, `./components/AppButton`, `./theme`, `./styles.css`, `./adapters`,
  `./i18n`, `./tokens` exports, and absence of `next` in dependencies, peerDependencies,
  devDependencies and optionalDependencies. These are static manifest checks, not
  emitted artifact checks.
- Python local Markdown target-path check across the 12 documentation files in the
  blob table below: **105 links checked; zero missing local target paths**. Anchor
  semantics and remote URL availability were not checked. A speculative host-examples
  filename and scope CSS filename did not exist; the actual adoption checklist and
  `ThemeScope.module.css` were located/read. Neither nonexistent path is a cited proof.
- `rg` source search for `next/`, `from` Next and `require` Next patterns returned
  no matches (exit 1); manifest inspection independently found no Next dependency.
  This bounded search is not a complete emitted/transitive dependency audit.
- Obtained every cited Git blob with `git rev-parse HEAD:<path>`. No install, unit
  tests, build, pack, browser, performance, global lease or CI command was run.
  **Runtime tested head: none in this assignment.** Read-only inspected head is above.

## Historical artifacts and evidence retention

The tracked [runtime evidence](../react-aria-runtime-ci.md) reports historical CI
run [37562921075](https://github.com/Structured-Growth/sg-ui/actions/runs/37562921075)
for exact head `b63ec58becedd246052c3a1e81acf590a97940d1`: Node minimum/24 checks,
packed consumers and three-engine Vite/Next production results, browser artifact
`11458031025`, downloaded path `/tmp/sgui-ci-b63-browser`. It also reports run
[37563448002](https://github.com/Structured-Growth/sg-ui/actions/runs/37563448002)
for exact head `d59653ec848d22a97104441ac068c77530610537`, artifact `11457514859`,
path `/tmp/sgui-ci-calendar-browser`. These are **retained documentation claims**,
not independently downloaded or reverified remote/local artifacts in this assignment.
No filesystem availability, bytes, expiration status or run conclusion was newly
verified. Artifact loss/expiry would prevent recovering their raw evidence; the Git
blob still retains the claim, not the original results. The documentation explicitly
limits results to those historical heads and records later failures. It must not be
read as a current-head full matrix.

Historical Chromium/Firefox/WebKit assertions and local engine subsets remain
bounded to their recorded workloads; native/manual/device/assistive-technology and
host-owner acceptance cannot be inferred from DOM/axe/source inspection. This report
adds no browser artifact and no pass count.

## Handoff

No actual missing behavior was identified for these documentation criteria, so no
optional `acceptance-pack-131.spec.ts` is proposed. Adding a native test to prove
that prose exists would be busywork. Root can assess the four narrow documentation
findings against the exact blobs, while leaving broad acceptance and historical
artifact availability separate. If root requires executable current-head host
proof, use its existing serialized packed Vite/Next window rather than parallel
new fixtures. No production source change or exclusive source allowlist is needed
from this review. There is no pending test request created by this batch.

## Exact retained Git blobs

All blobs below belong to the reviewed baseline; use `git show <head>:<path>` to
retrieve exact evidence. Report commit itself will only add this report.

| Source / document | Git blob |
| --- | --- |
| `README.md` | `0af615ed0dc6984d08b57aed8eea8ecb8ddce9a4` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `docs/migration.md` | `c16a7ab44e0533329f80d69c3c0c43db766e877f` |
| `docs/developer/component-architecture.md` | `802b8086c11e2c28460596214775653f75ac886d` |
| `docs/developer/react-aria-adoption-checklist.md` | `366a8e935fd912aedc1b98f60169821c086bf000` |
| `docs/developer/react-aria-theme.md` | `f4c013be5314931ed051863eeb1ead6501594772` |
| `docs/developer/react-aria-primitives.md` | `e3d7832c63d99f33f312935b69d7447dc6268d6b` |
| `docs/developer/react-aria-icons.md` | `f2524b342566b5727f41267a9990eb405c0a6f32` |
| `docs/developer/react-aria-calendar-contracts.md` | `3a3c1a7efbad904f16155e9977768c375f4d2c94` |
| `docs/developer/react-aria-layout-actions.md` | `d5bb37391920da442d64ed16979bb97ed8e34159` |
| `docs/developer/react-aria-server-components.md` | `52750245160e7a0618483639eaefce58973e900c` |
| `docs/developer/react-aria-runtime-ci.md` | `9319d05492e47bcd15f751d3db7e042aa604fe0e` |
| `docs/developer/react-aria-browser-acceptance.md` | `41db9ad1186ddccbb84fabcd2a23237e05300c56` |
| `src/theme/index.ts` | `32e4e1d82d1af0a7f10c51ed29d95ca4680ff444` |
| `src/experimental/Provider/Provider.tsx` | `cb3e3de6f89932418f05fd793a4899bd8ff548ed` |
| `src/foundation/ThemeScope.tsx` | `ec330a71f6ee1f32ad10b717efe5a285094ca953` |
| `src/experimental/Button/Button.tsx` | `4969d84ac106e7346c8e054974d7d6a38a5d0cfc` |
| `src/experimental/Button/Button.module.css` | `cccf005e0bdee43ac22d8f8830523938ce5167f6` |
| `src/adapters/navigation.tsx` | `e18b09cd0755f37192e8a91af6f961a62189e2c0` |
| `scripts/test-next-consumer.mjs` | `5f45613658f5d40d8f5da4d76fb3de6babe529e3` |
| `scripts/test-foundation-consumer.mjs` | `ff994cb7c9eaae3fbab58461c98ab0269a276c9c` |
