# Translation fallback and interpolation acceptance

Task references: H-07, H-08, H-09. This acceptance slice covers the translation
adapter and owned fallback formatter. It does not close every component's long-label,
RTL, native browser or assistive-technology acceptance gate.

## Host boundary

Import `SGTranslationProvider`, `useTranslation`, `formatIcuMessage`,
`extractIcuVariables`, `validateIcuVariables` and their owned types from
`@structured-growth/sg-ui/i18n`. Every lookup requires `defaultMessage` and may
carry `namespace` and `values`. The adapter receives the original key and options
object, including the original values object. Its `locale` remains available to
consumers and the production Provider; the adapter method receiver is preserved.
No locale is inserted into or removed from lookup options: hosts use their adapter
locale or their own engine context.

```tsx
import { SGTranslationProvider, formatIcuMessage } from "@structured-growth/sg-ui/i18n";

<SGTranslationProvider value={{
  locale: "fr-FR",
  t: (key, options) => {
    const message = hostCatalog[key];
    return message === undefined ? key : formatIcuMessage(message, "fr-FR", options.values);
  },
  useNamespace: namespace => hostLoadNamespace(namespace),
}}>{children}</SGTranslationProvider>;
```

Here `hostCatalog`, `hostLoadNamespace` and `children` belong to the application.
Hosts own supported locales, explicit catalog fallback order, namespace loading,
database overrides, caching/invalidation, audit metadata and diagnostics. SGUI
neither fetches catalogs nor caches/deduplicates namespace requests. Hosts should
diagnose lookup failures before returning an unresolved key or throwing. Namespace
loading errors remain host errors; the adapter does not hide them.

Without a provider, lookup formats the English `defaultMessage` with `en-US`.
A provided host result is already formatted and is returned verbatim, including
an intentional empty label. If lookup throws, returns a non-string, returns the
requested key, or returns a `[[missing_translation]]` marker (including marker
suffixes), SGUI formats the English default with `en-US`, once, without retrying
the host or logging values. The host locale remains unchanged for interactions
and document direction even when an individual string falls back to English.

## Owned ICU subset

The formatter supports `{name}`, dotted variable names, `{value, number}`,
`{value, date}`, `{value, time}`, `select`, cardinal `plural`, ordinal
`selectordinal`, nested branches, exact numeric selectors, nonnegative integer
plural offsets, `#` in plural branches, and ICU apostrophe escaping. Every branch
set requires `other`. Exact numeric selectors compare the original count;
plural categories and `#` use the count minus offset. Nested plural branches
use their own count; nested selects retain their enclosing plural count.

```ts
formatIcuMessage(
  "{n, plural, =0 {No rows selected} one {# row selected} other {# rows selected}}",
  "en-US", { n: 2 },
); // "2 rows selected"
```

Locale categories and number/date/time output use native Intl. Invalid or
unsupported locale identifiers resolve to `en-US`, rather than the machine's
default locale. Dates use the runtime time zone, preserving the existing
formatter contract; hosts own any explicit time zone/date-only policy. Invalid
date strings remain visible as supplied. Plain null/undefined values become empty
strings when a values object exists; without values the source message is retained.
Plural values must be finite numbers. Values are text: render them as React text,
never inject formatted strings as HTML.

Malformed/unsupported syntax or invalid plural values return the entire source
message without partial replacement or throwing during control render. This is
an error recovery behavior, not a substitute for catalog validation. ICU number
styles, date/time styles, skeletons, rich-text tags, and full MessageFormat support
remain host-engine responsibilities. Nesting is bounded to 50 branch levels.

`extractIcuVariables` parses all branches and returns unique names in deterministic
code-unit order; quoted literals and `#` are excluded. `validateIcuVariables` returns
sorted `missing` and `extra` names compared with an English baseline. Both throw
`SyntaxError` for invalid or unsupported syntax so catalog checks fail explicitly.
They validate variable identity and syntax; they do not enforce argument-type
parity, translation quality or a consumer's supported-language list.

```ts
const result = validateIcuVariables(
  "{n, plural, one {{name}: # row} other {{name}: # rows}}",
  "{name} : {n, plural, one {# ligne} other {# lignes}}",
); // { missing: [], extra: [] }
```

## Evidence and remaining work

Colocated `icu.test.ts` and `index.test.tsx` cover plural categories, selection
counts, nested/offset/ordinal branches, quoting, recursive variable parity,
number/date/time output, invalid input, locale fallback, English SSR, exact host
forwarding, namespace ownership, host failures and provider replacement/isolation.
`apps/docs/native-fixtures/scenarios/i18n/Translations.fixture.tsx` preserves
English fallback, pseudo-localized long labels and Arabic plural/direction scenarios
using public Provider and controls. Provider reads the translation adapter locale;
there is no public `locale` prop on Provider. Do not set only DOM `dir` when testing
locale-driven interaction. Fixture locales are representative test data, not a
consumer supported-locale policy; see [public theme contracts](react-aria-theme.md).

The focused `translations-locale-acceptance.spec.ts` checks counts 0/1/2/3/11/100,
clear, keyboard focus, complete pseudo labels and 320 CSS-pixel reflow. Date and
number output use the fixed instant 2026-10-16T12:00:00Z and a UTC browser context;
this pins the existing runtime-time-zone contract without adding a new formatter
API. Its DOM live-region assertions establish rendered updates only. An operator
must separately record actual English/Arabic spoken count and clear announcements
with AT, browser, OS, device and language versions. These specs need a freshly
built docs-native host after integration; adding a spec is not a passing receipt.

Batch validation on 2026-10-07: `pnpm check` passed (145 test files, 1,010 tests,
type checking, foundation/token guards, release-policy checks, package build and
public-entry smoke checks). `pnpm build-storybook` passed with all three new stories.
Both ran under the shared batch validation lock using Node 26.5.0 and pnpm 10.29.3;
supported Node 22.12/24 CI verification remains separate.

Current-input browser visual/RTL execution and assistive-technology review of
these migrated scenarios remain open. The dated Storybook build above is retained
only as historical evidence; Storybook has been removed. Broader component catalog coverage, host catalog integration and engine
specific ICU styles remain outside this slice. See the
[master task list](react-aria-master-task-list.md) for H-07–H-09 and broad acceptance.
