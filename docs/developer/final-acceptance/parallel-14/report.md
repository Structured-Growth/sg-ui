# A-H-06–08 acceptance reconciliation

Reviewed 2026-10-16 on the shared modified `dev` checkout, HEAD
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`. Recommended dispositions:
**A-H-06 complete; A-H-07 complete; A-H-08 partial.** These are the full original
H-06/H-07 implementation contracts, not closure of browser, visual, device, editor
V or spoken-AT obligations. The coordinator owns shared ledger reconciliation.
Only this directory was written. No production promotion is authorized.

## Evidence attribution and actual checks

Read root AGENTS, the final acceptance execution ledger, the original A-H-06–08
text in `react-aria-hardening-tasks.md`, translation/theme contracts, batch107/108
assessments, implementation/tests, and the migrated translation fixture. Historical
checkboxes were not used as proof. Prior reports are attributed history, not fresh
execution or independently re-opened temporary artifacts.

New repeatable source checks, run from the repository root:

```sh
node docs/developer/final-acceptance/parallel-14/audit.mjs
node docs/developer/final-acceptance/parallel-14/reconcile.mjs
```

Both succeeded with Node 26.5.0 and the existing TypeScript 5.9.3 parser. These
are read-only source analyses apart from their reports here; no tests or builds
were rerun. The first root-level TypeScript resolution probe failed because the
root has no direct TypeScript dependency; the audit correctly resolves it from
`packages/ui/package.json`. No installation was needed.

[source-audit.json](source-audit.json) records SHA-256 for 423 maintained production
TS/TSX files and 288 syntactic `t(...)`/`.t(...)` calls. All 423 files match FA-02's
saved hashes. Tests, native fixtures and declarations are excluded from that scan.
It is a syntactic inventory, not symbol/dataflow analysis or proof that every
user-facing string is translated. Shorthand `defaultMessage` properties count.

Of those calls, 275 supply an object with `defaultMessage`; the other 13 are the
two exact adapter-forwarding calls and 11 due-formatter calls using its distinct
`(key, defaultMessage, values)` signature. Manual inspection confirms the learner
card/grid wrappers convert that signature to the owned options object with
namespace/values intact. No missing mandatory default was found in this scope.

[reconciliation.json](reconciliation.json) captures current hashes and FA-02
comparisons for the i18n tests, Provider/ThemeScope tests and source, representative
date consumers, native translation fixture, Vitest config/setup, manifest and
lockfile. Every input with a saved FA-02 hash matches. It also hashes the retained
FA-04 log/delta/fixture-build receipt. FA-04's ledger explicitly preserves passing
cases outside its four corrected calendar suites. The i18n, Provider and ThemeScope
suites are outside that failure set; reuse that evidence, with its original local
Node 24 and unit/DOM/SSR limits. The original combined command **failed** (four
calendar suites); this report does not recast it as a successful full command.
No new runtime test count, CI pass or current native result is claimed.

The new call-site check parsed all 254 literal English defaults with the existing
built ICU extractor: **zero syntax errors; zero missing variables where `values`
is a literal object**. The formatter artifact hash matches FA-01. Defaults held
in variables, dynamic keys/defaults/values and host catalogs need their own data
context; this check does not certify them or argument-type parity. It supplements
rather than repeats completed formatter unit cases.

## A-H-06 — complete, implementation criterion

Original obligation: connect host locale/direction to React Aria internationalization
and avoid different locales in controls, SGUI strings and date formatting.

- `packages/ui/src/experimental/Provider/Provider.tsx:11–17` reads the translation
  adapter locale and supplies React Aria `I18nProvider`. `LocaleScope` obtains the
  resolved locale/direction through React Aria and sets native `lang` and default
  `dir` on ThemeScope. The host remains the locale authority.
- `packages/ui/src/foundation/ThemeScope.tsx` inherits visual language/direction;
  `useOverlayScope` forwards them to portals and `useOverlayDirectionRef` restores
  the explicit visual override when an interaction engine replaces `dir`.
- Calendar and DateRangeSelector read the interaction locale via `useLocale` and
  their strings via `useTranslation`. DateField/TimeField pass that interaction
  locale into text parsing/display. CalendarNavigation takes formatted month/year
  items and accessible labels from the same React Aria calendar context.
- LearnerClassCard and LearnerClassesDataGrid pass the translation locale to the
  shared due formatter; AppDataGrid's `ownedGridCells.tsx:144` falls back to the
  translation locale unless the host intentionally provides a per-grid override.
  PeriodPicker uses the adapter locale for month formatting.
- `Provider.test.tsx` asserts Arabic host locale/RTL in server markup;
  `ThemeScope.test.tsx` covers native scope behavior. Reused FA-04 evidence applies
  to their unchanged inputs. Theme documentation explicitly requires Provider for
  the interaction bridge; ThemeScope alone is only a visual scope.

This satisfies the named connection/ownership contract. The optional visual
`dir` override is documented and intentionally independent from locale-driven
keyboard semantics. English fallback for a missing individual string intentionally
uses English grammar/number formatting without replacing the host interaction
locale. These are explicit contracts, not accidental competing locale authorities.

Limits: this is not malformed-host-locale certification, universal host-engine
integration, live locale replacement across every composition, timezone agreement,
portal-placement coverage, physical-device or AT validation. Historical batch107
calendar/portal browser evidence is dated scope-specific evidence; current changed
calendar implementations and migrated fixture host are not upgraded by it.
No implementation successor is required for this original leaf. Separate future
validation should use a host adapter replacement under Provider with a calendar,
field, translated status and open portal, checking their common locale and default
direction before/after replacement; retain engine/build/input attribution.

## A-H-07 — complete, translation contract

Original obligation: preserve keys, mandatory defaults, values, namespace awareness
and deterministic English fallback.

`packages/ui/src/i18n/index.tsx:5–34` requires `defaultMessage`, retains optional
namespace/values, forwards the exact original key/options/value object, and calls
methods on the original host receiver. Namespace calls remain lazy explicit host
requests without library caching/loading. Namespace errors propagate. A thrown,
non-string, unresolved-key or missing-marker lookup falls back once to English
`en-US`; intentional empty strings and already formatted host strings survive.
The adapter retains the host locale and does not retry or log interpolation data.

`index.test.tsx` covers each boundary, provider replacement/isolation, and English
SSR/no-provider fallback. `icu.test.ts` supplies invalid/unsupported locale and
formatter fallback checks. The original call-site audit above extends the earlier
adapter-only review: all inspected direct/wrapper calls retain required defaults,
and the manual learner/instructor/toolbar wrappers retain namespaces/values.
The FA-04 passing unit evidence is retained for unchanged inputs.

Two wording inconsistencies deserve a bounded cleanup decision, not a fabricated
failure of forwarding/fallback: `common.ui.selectNone` defaults to “None” in
`AppDataGrid/ownedGridInteraction.tsx:383` and “Select none” in experimental
`DataGrid.tsx:67`; `common.ui.invalidTime` defaults differ between segmented
`TimeField.tsx:93` and `TextTimeField.tsx:32`. A host catalog will supply one value
per key even though missing-catalog English differs. A successor should decide
whether these are intended contextual defaults or should use separate stable keys;
retain compatibility and assert the selected English/host wording. This is not
proof of missing keys or a broken English fallback.

Limits: syntactic `t` inventory does not find arbitrary aliases or every hard-coded
string. Host catalog quality, supported locales, catalog argument-type checks and
spoken announcements remain their own scopes. No required implementation gap was
found in the full named translation metadata/fallback contract.

## A-H-08 — partial, native translation coverage remains

Original obligation: validate ICU variables, pluralization, selection counts,
date/number formatting, long labels, RTL and pseudo-localized stories.

| Clause | Evidence and disposition |
| --- | --- |
| ICU variables | `icu.test.ts` tests recursive/inactive branches, missing/extra names, quoting, nested syntax and invalid inputs. New 254-default call-site parse adds current source evidence. Complete for the documented owned subset; no argument-type validation claim. |
| Pluralization/selection counts | Existing tests exercise 0/1/2/1234, Arabic categories, French fractional counts, ordinal/offset/exact/nested branches. `ICUFormatting.next100-regression.test.tsx` checks deterministic interleaved calls and unmodified caller state. Reused FA-04 unit evidence applies. |
| Number/date/time | `icu.test.ts` compares locale Intl results, deterministic invalid-locale fallback and invalid-date behavior. Date/time formatting uses runtime timezone by contract. Native browser ICU and host timezone consistency are not proven by Node comparisons. |
| Long/pseudo labels | `apps/docs/native-fixtures/scenarios/i18n/Translations.fixture.tsx` preserves a 320px pseudo-expanded composition and production public imports. Registered ID: `foundations-translations--pseudo-localized-long-labels`. FA-04 docs-owned fixture build receipt proves compilation; it does not prove reflow or native activation. **Native validation missing.** |
| RTL/Arabic status | Same fixture preserves `foundations-translations--arabic-plural-and-direction`, Arabic 0/1/2/few/many text and a polite live status with production Provider. **Dedicated native behavior/reflow and spoken-status validation missing.** |

Focused searches in `packages/ui/tests/browser` and `apps/docs/tests` found no
`Translations`/`foundations-translations` spec reference. Batch108 independently
records that the historical dedicated native story validation was unrun. Legacy
Storybook references in `react-aria-i18n-acceptance.md` are historical host evidence;
its runtime wording should be updated to the migrated fixture paths and retained
host dates by the coordinator. Do not restore Storybook. The 20 editor V leaves
remain independently open.

Required successor **H08-NATIVE**: add a focused docs-native-host spec using the
existing two registered IDs; execute pseudo labels at 320 CSS px, keyboard activate
increment/clear and verify complete text, wrapping/no horizontal content loss,
visible focus and independent state. For Arabic assert resolved `lang`/`dir`, exact
0/1/2/3/11 plural text/digits and native keyboard activation/reset. Include a fixed
locale/clock/timezone numeric/date composition only where existing browser receipts
lack equivalent attributable evidence. Use the built public package, record source
and output hashes, host/build identity, engine and raw transcript. Schedule only
missing/changed scopes; this assignment ran no browser suite or server.

Separate successor **H08-AT**: an operator records actual announced Arabic and
English count changes/clear with named AT version, browser, OS/device, language,
steps and spoken output. `aria-live="polite"`, DOM text, accessibility snapshots
and keyboard assertions cannot supply spoken-output evidence.

No native/AT obligation is closed on the strength of inspection, compilation or
unit tests. No tests, dependency changes, builds, server operations, Git writes,
release changes or other conversations' files were performed by this assignment.
