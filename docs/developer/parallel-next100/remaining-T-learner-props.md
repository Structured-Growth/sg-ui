# Learner grid public props consuming proof

T-C19-05, dependency F-C19-05: ready for independent review. The functionality
baseline already exports `LearnerClassesDataGridProps`; the missing regression
evidence was an actual compiler program consuming that public export.

The [focused fixture](../../../tests/consumers/remaining-T-learner-props.tsx)
imports the component and props from the root, component barrel and granular
public route. It consumes owned row labels/reset-view callbacks, assigns props
through all three routes and renders each component in JSX under Provider.
The [dedicated config](../../../tests/consumers/remaining-T-learner-props.tsconfig.json)
explicitly includes this fixture and the CSS module declaration. Its three
package aliases map only to the public source barrels corresponding to the
declared package exports. No private implementation alias masks an export gap.

## Executed evidence

Tested HEAD: `1c8a4e4d2eb75479c5581c009eaacf5f3209aee4`, plus the new
fixture/config bytes recorded in the external report. Node `v24.21.0` at
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`
executed `node_modules/typescript/bin/tsc --project
tests/consumers/remaining-T-learner-props.tsconfig.json --listFiles --pretty false`.
Exit 0, `2026-10-09T01:28:11.298Z` to `2026-10-09T01:28:12.739Z`.
The actual program lists the consuming fixture among **781 files**. There is
**one compile case / one fixture / three public routes / three JSX consumers**;
these are compile assertions, not unit or browser test counts.

Canonical light slot 1 and paired transitional slot were owned by
`remaining-T-learner-props/types`; command settlement was confirmed before both
leases were released. Frozen dependency installation used canonical install
slot 0 and its paired claim, owned by `remaining-T-learner-props/install`; it also
settled before release. No foreign lease was removed. `git diff --check` passed.

External report and retained logs:
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/remaining-T-learner-props.json`.
The report hashes every actual compiler-program input, config/package/lock/runner
inputs and raw command/resource/receipt artifacts. Compiler log SHA256:
`607a5e3e3cec24385eba3ffa3c02c214454ed4a470267d87b39390761bf54483`.
Fixture SHA256:
`826636b7d956a18daacff131934b54dc7ad10fa276e6dd220fbe7324708cb63f`.

## Bounds

The prior package consumer fixture was excluded by root tsc, and historical
type-slot attempts launched no compiler. No historical compiler pass is borrowed;
missing historical raw/compiler-head proof stays unresolved. This fresh execution
establishes the source-resolved public contract only. Built declarations, packed
React 18/19 consumers, runtime/native/device/AT and hardening remain separate.
No production source, shared config, barrel, story or existing test was changed.
The root coordinator owns independent review, T checklist closure and integration.
