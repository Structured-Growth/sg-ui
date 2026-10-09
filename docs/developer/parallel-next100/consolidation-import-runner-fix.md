# Reviewed next100 test import and runner correction

Reservation: `consolidation-test-import-runner-fix`. No production source, public barrel, token, guard, workflow or acceptance changes.

Thirteen reviewed experimental regression files were reconstructed from exact final Git blobs, then only their forbidden `../index` import declarations were replaced with direct imports of the same owned exports. All remaining test bytes and assertions are preserved. The external receipt records original/corrected SHA-256 and Git blob IDs.

## Integration

The coordinator must full-history merge each original authored branch first, then apply corrective commit `c3ac7c6d245b1523eb8c81b02d15d57c13ffa9b3`. Reconstruction commit `70676ebe4a22a1d1efb8394b300ee0ae940fe248` is a local preparation artifact; do not integrate it instead of the original histories.

| Test path | Original reviewed final head |
| --- | --- |
| src/experimental/Calendar/Calendar.next100-regression.test.tsx | 73b27bdba36dfe8fe597e1310c3276382a88d633 |
| src/experimental/DateRangeSelector/DateRangeSelector.next100-regression.test.tsx | 1652aad3b78ecd65ca8f9fbd48c8093e4eae4ca1 |
| src/experimental/DataGrid/DataGrid.next100-regression.test.tsx | 8e9b3f3e6c250519341f532bcdf1f8db7dda6439 |
| src/experimental/Checkbox/Checkbox.next100-regression.test.tsx | 958c25d096449414b4efe50cffec48d3f8c4e5ef |
| src/experimental/RadioGroup/RadioGroup.next100-regression.test.tsx | 104304a06e1890ab67a44f826dbc7469467c3640 |
| src/experimental/Menu/Menu.next100-regression.test.tsx | 9b54103528024f5d306b871319868cc5b0332761 |
| src/experimental/Surface/Surface.next100-regression.test.tsx | 87fe4c645aab1b304f61bf661488f11b34132dff |
| src/experimental/Card/Card.next100-regression.test.tsx | e2f9a4d2592e2976039cbbe9bee54c77c792561d |
| src/experimental/DateField/DateField.next100-regression.test.tsx | 4993770feab5ab40a54961b7d60da9b5360077af |
| src/experimental/Divider/Divider.next100-regression.test.tsx | f331ffb2bd8e36bc84651d54dd4e493e051efacb |
| src/experimental/Button/Button.next100-regression.test.tsx | 3b770558511d58764c1990b34284575132be84fd |
| src/experimental/IconButton/IconButton.next100-regression.test.tsx | 3b770558511d58764c1990b34284575132be84fd |
| src/experimental/SplitAction/SplitAction.next100-regression.test.tsx | f0023c145acfbb78475fc95ab6f53d7e3ccb0d89 |

`test:foundations` explicitly registers `src/foundation/Tokens.next100-regression.test.mjs`, `scripts/CSSPipeline.next100-regression.test.mjs`, and `scripts/check-component-css.test.mjs`. The first two files await integration from their reviewed original histories (`7fac9383f9147224a362d1d4fc3f787c7744c872` and `b5b0eab3ff9907561f7c397dd9498143d86e1807`). Token compiler imports are CLI guarded; generated token TypeScript is data-only; CSS pipeline imports expose functions without compiling at import time; CSS guard imports expose pure validation. CSS fixtures write only owned temporary directories and clean them up.

## Targeted evidence and limits

At corrective head, Node 24.21.0 frozen installation passed. All 13 corrected files passed (17 tests, one Vitest worker); `foundations:check` passed; the existing CSS guard suite passed (9 tests). Canonical two-install/four-light lease helpers admitted commands and released only owned claims after settlement. No retries, browser run, Storybook build, full check or typecheck occurred.

The complete registered Node command must be verified on the coordinator's composed candidate after the token/CSS pipeline histories are present. This local evidence does not establish that combined invocation, phase closure, native/browser or broader acceptance. `src/components/GridPresets.next100-regression.test.tsx` at `33d588c785a844f4f1ec4f8f462e3c25c64a3700` also imports `../index`; it is outside the experimental reservation and was left for coordinator review. Separate public-export/packed-consumer coverage remains authoritative for barrel exposure; these behavior tests consume the exact same underlying owned exports.
