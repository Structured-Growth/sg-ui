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
  selectors fail even under local scope. The existing broader source retired-name
  and dependency guards remain unchanged.
- `font`, `font-family`, `font-size`, `font-weight` and `line-height` must use a
  known owned variable directly, variable-based `calc/min/max/clamp` with numeric
  arithmetic, or deliberate `inherit/unset/revert/revert-layer`. Literal values,
  shorthand literals, host variables, literal fallbacks and appended font stacks
  fail. Math with unit-bearing literal offsets fails. Unknown tokens still fail.

Comments are inert. Keyframe steps are exempt from selector ownership checks,
while their layer and declaration checks still apply. Forced-color system colors
and local scoped element/global descendants remain valid. All CSS findings are
collected before failure; the command does not silently allowlist current source.

Run inert fixtures separately with Node 24:

```sh
node --test scripts/check-component-css.test.mjs
node scripts/check-foundations.mjs
```

The fixture file is not yet listed in the package's explicit `test:foundations`
command; this bounded task cannot edit `package.json`. Coordinator follow-up must
register it before claiming continuous fixture coverage.

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

[Batch 169 evidence](parallel-batch-169/css-lint-guards.md) records the current
three production findings. C-18 stays open until current audited source passes
independent validation, and broader acceptance remains open. Follow the
[development validation policy](react-aria-development-validation.md).
