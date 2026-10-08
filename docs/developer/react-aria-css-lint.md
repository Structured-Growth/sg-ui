# Component CSS guard scope (C-18 partial)

`validateComponentCss` in `scripts/check-component-css.mjs` parses CSS with
PostCSS and returns source-located diagnostics without modifying it. The existing
`foundations:check` invokes it for every `.module.css` in its audited directories:
foundation, experimental, migrated catalog directories, icons, primitives and theme.
The directory registry remains in `scripts/check-foundations.mjs`; this is not an
all-repository stylesheet audit. Generated token CSS is not a component module.

The check retains the nearest `@layer sgui.components` requirement and known
`--sgui-*` variable validation, and adds:

- Each comma-separated selector branch must have a positive local class outside
  functional pseudos, or a nested `&` whose ancestor has local branches. Explicit
  `:local(.class)` qualifies. Global descendants under a local class are allowed;
  global-only rules, bare element/universal/attribute rules and classes occurring
  only in `:is`, `:not` or `:has` do not establish ownership.
- Host `body`, `html` and `:root` selectors fail, including global wrappers and
  functional pseudos. Retired `Mui` selectors, `.css-*`, `.jss-*` and `data-emotion`
  selectors fail even under local scope. Quoted attribute data such as
  `[title=".MuiButton-root"]` is inert; attribute names and classes outside
  quotes remain checked, including `[data-emotion="cache"]`. The existing broader source retired-name
  and dependency guards remain unchanged.
- `font`, `font-family`, `font-size`, `font-weight` and `line-height` must use a
  known owned variable directly, variable-based `calc/min/max/clamp` with numeric
  arithmetic, or deliberate `inherit/unset/revert/revert-layer`. Literal values,
  shorthand literals, host variables, literal fallbacks and appended font stacks
  fail. Math with unit-bearing literal offsets, including percentages, fails. Unknown tokens still fail.

Comments are inert. Keyframe steps are exempt from selector ownership checks,
while their layer and declaration checks still apply. Forced-color system colors
and local scoped element/global descendants remain valid. All CSS findings are
collected before failure. The only literal typography contract is the exact
shared rich-document mapping below; no whole-file exclusion applies.

Run inert fixtures separately with Node 24:

```sh
node --test scripts/check-component-css.test.mjs
node scripts/check-foundations.mjs
```

The fixture file is not yet listed in the package's explicit `test:foundations`
command; this bounded task cannot edit `package.json`. Coordinator follow-up must
register it before claiming continuous fixture coverage.

## Shared semantic rich-document styles

AGENTS.md permits Typography variants, owned typography tokens **or shared
component-level styles**. The existing PageRichTextEditorSection stylesheet is
shared editable/read-only document presentation; `lexical/editorConfig.ts` maps
saved Lexical formatting to these classes. This C-18 candidate contract preserves
that formatting without changing CSS or generated tokens:

| Exact selector | Property | Value | Semantic reason |
| --- | --- | --- | --- |
| `.document :global(.editor-text-bold)` | `font-weight` | `700` | Existing bold text formatting, independent of heading/body role |
| `.document :global(.editor-text-subscript)` | `font-size` | `0.75em` | Existing size relative to surrounding text, with `vertical-align: sub` |
| `.document :global(.editor-text-superscript)` | `font-size` | `0.75em` | Existing size relative to surrounding text, with `vertical-align: super` |

The guard matches only
`src/components/PageRichTextEditorSection/PageRichTextEditorSection.module.css`
relative to the audited working directory (also accepting its resolved absolute
path), the entire trimmed rule selector, the exact property and comment-stripped
value. Extra selector branches, different scopes/properties/values and other files
are rejected by the usual typography policy. Layer, token, ownership and retired
selector checks run for these rules too; other declarations have no exemption.

Existing heading tokens happen to weigh 700 but are heading roles, not bold
semantics; they are customizable by consumers. Caption/overline size is `0.75rem`,
not the lossless `0.75em` relative size required here. No appropriate existing
semantic token mapping exists. Future semantic tokens can replace these three
entries in a separately owned migration preserving presentation. This contract
requires coordinator review and is not an exception for arbitrary literal styles.
Positive and negative PostCSS fixtures cover its exact boundaries.

## Limits and acceptance

This is a bounded PostCSS rule/declaration guard with a conservative selector
scanner, not a complete selector/value grammar or CSS semantic evaluator. Unusual
escaped names, complex local functions and nesting can require future fixtures.
An anchor is a module ownership check, not proof that every selected descendant
belongs to the library; sibling combinators and host-inserted children still need
review. Token existence does not prove the token has the correct typography role,
and custom properties can hide literal values. Inline React styles, non-module CSS,
emitted artifacts, specificity, visual output, browser support and accessibility
are outside this validator. No native cases are needed or prepared for this
build-time guard. Source exceptions need narrow explicit review, not blanket skips.

[Batch 169 evidence](parallel-batch-169/css-lint-guards.md) records the prerequisite’s
three source-red findings under its unconditional literal policy.
[Batch 172 corrections](parallel-batch-172/css-guard-corrections.md) records the
new exact-head outcome under this candidate shared-semantic contract. C-18 remains
open pending independent review and package fixture registration, and broader acceptance remains open. Follow the
[development validation policy](react-aria-development-validation.md).
