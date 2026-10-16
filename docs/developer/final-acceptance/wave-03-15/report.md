# Wave 03-15 — icon presentation and catalog successors

**A-I-05 partial; A-I-08 partial.** No acceptance counts or central ledgers changed.
Only this directory was authored. Production/source/tests/docs outside it were
read only. The patch is ready for review and still requires integration.

## Substantive result

The current existing distributable passes four isolated production esbuild
pruning probes. Granular AddIcon and Button+AddIcon each retain **one** Lucide
vector, DataToolbar retains **12**, and SideNavigation retains **seven**. Required
vectors remain; Paintbrush, FlaskConical and GraduationCap are absent in each.
Explicit stylesheet imports emit 235,435 CSS bytes per probe. Complete module
maps, entry files, input hashes and output hashes are saved. This directly
advances I-S1 without editing imports speculatively. No pruning defect was found.

The probe resolves public package routes through the existing docs workspace
link, bundles existing dist with esbuild 0.28.2, externalizes React/ReactDOM, and
writes no shared output. It is **Node 26.5.0 / esbuild evidence**, not a fresh
supported Node22/24, clean packed tarball, React18, Vite or browser result.
All bundled library input hashes equal the coordinator-integration build receipt.
134 referenced maintained source files have saved source hashes: zero changed
from the prior icon evidence where previously captured. Source maps have no
sourcesContent; they are explicitly recorded as unavailable for embedded-source
comparison, not treated as proof of source/output equivalence.

`icon-acceptance.patch` contains two ready-to-apply changes:

- Maintained icon guidance gains the eight default mirrors, nearest/nested HTML
  direction policy, logical navigation/editing versus physical alignment rules,
  shared size/weight guidance, host naming/color ownership and optical-review limits.
- A production docs spec checks all 96 icons, Brush search, no-match generated
  source, meaningful/decorative transitions, size/stroke changes, quoted labels,
  source compilation, clipboard success/failure and independent sibling source/state.

`prepare-native.mjs` and `icons-native.spec.ts` provide a runnable static SSR
fixture of the **actual public compiled exports and stylesheet**, with all 96
icons at 16/20/24px × compact/comfortable × LTR/RTL (1,152 geometry samples).
Two focused native cases cover centerline geometry, viewBox, stroke, default,
forced, disabled and nested mirroring, role naming, and named foreground/surface
ratios across 20 identity/appearance/contrast combinations plus one forced-color
case. The runner saves numerical receipts and twelve optical screenshots per
engine. Its static SSR scope does not establish hydrated event behavior.
Screenshot review is necessary for optical weight/alignment/antialias/stroke
clipping; passing getBBox assertions would not settle that review.

## Reused evidence and unchanged attribution

The exact wave-02-15 report/results hashes match assignment.json. The parallel-12
input comparison was reused rather than recapturing the export inventory. All 96
implementation hashes remain unchanged, and current mapping metadata agrees with
all saved vector selections. Only two of the 215 prior relevant inputs changed:
react-aria-icons.md and icon-map.json, the accepted Brush correction. Do not
reapply the obsolete missing-Brush proposal. Coordinator-integration evidence
was read and hashed; its builds are reused only for matching inputs, not as new
icon/browser acceptance.

Both notices still match byte for byte and retain the installed Lucide license
verbatim, including the retained ISC/Feather MIT text. Notice SHA-256:
`12155ccd08a9dee4f769c6d30d8ccf8b536a99be1d990863c010fb74d91cac56`.
No vector, attribution or notice was changed. Retention is not legal-owner final
provenance approval.

## Checks actually performed

From repository root:

1. `node docs/developer/final-acceptance/wave-03-15/bundle-probe.mjs` — four probes pass; input/output hashes and module maps retained.
2. `node docs/developer/final-acceptance/wave-03-15/prepare-native.mjs` — static fixture generation succeeds; no browser execution.
3. `node docs/developer/final-acceptance/wave-03-15/check-artifacts.cjs` — strict noEmit TypeScript 5.9.3, zero diagnostics for both native files and proposed docs spec at its integration path. The isolated harness supplies installed Node types and resolves Playwright's pnpm declaration reexport explicitly.
4. `node packages/ui/node_modules/@playwright/test/cli.js test --config docs/developer/final-acceptance/wave-03-15/playwright.config.ts --list` — loader discovers six executions (two cases × three engines). **Listing only; zero tests executed.**
5. `git apply --check docs/developer/final-acceptance/wave-03-15/icon-acceptance.patch` — passes; patch not applied.
6. `python3 docs/developer/final-acceptance/wave-03-15/reconcile.py` — unchanged implementations, corrected mapping parity, exact assigned prior report hashes and notice retention pass.

All executed Node commands use v26.5.0. Initial probe resolution/extension,
TypeScript harness resolution and Playwright CJS loader failures are retained as
separate logs. They were harness errors, corrected without shared file changes.
Final receipts are green only for the checks listed above. No unit/native/browser,
install, shared build, package/catalog generation, server, Git mutation, release,
remote CI, physical-device, spoken AT or legal approval was performed.

## Per-leaf decisions

### A-I-05 — partial

Original: “Establish consistent optical size, weight, alignment, RTL mirroring
policy, and theme contrast.”

Delivered the concrete usage-direction documentation patch and native matrix
with precise assertions and capture artifacts. No specific production defect
was reproduced. **Remaining:** integrate/review policy; execute prepared native
checks on matching built output; inspect screenshots for optical criteria;
record computed named pairs and direction results. Real OS forced-color or
spoken AT results must be recorded separately if requested by broader gates.

### A-I-08 — partial

Original: “Add icon catalog, accessibility, and bundle checks; update notices for
all shipped vector assets.”

Brush parity is reused as fixed; bundle/module-map successor has bounded current
output evidence. Added executable native role/naming and production catalog
interaction/source/copy/isolation tests; retained asset notices. **Remaining:**
apply proposed docs spec and guidance; run I-S4 production docs test and I-S2
native checks; complete rendered optical review. Reconcile final asset provenance
with legal owner separately. No patch-only change is counted as runtime closure.

Exact coordinator commands, preconditions, expected assertions and host limits
are in validation-plan.json. Both assigned A leaves remain open.
