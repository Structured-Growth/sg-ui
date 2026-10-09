# TextArea form owner source repair — post100

Bounded functionality repair following retained T-P12-91 product failure. No F/T/V leaf or parent acceptance is marked here. Coordinator owns native proof and integration.

## Scope and source diagnosis

Only production file changed: `src/experimental/TextArea/TextArea.tsx`. Report is this file. Baseline head `b298f20796540224daac1eb1ef71f63423d6b533`; source commit `9e8b6ebfc63d3b0300dbd2d34d1c8d9c31a5fe20`; source SHA256 `63a39270d486c587798b1a499c412c9a3d41cb1d530a3d28441aa3dd496141ed`. No public API removal or breaking change, so commit is `fix:` without a breaking marker.

Read latest AGENTS, development validation and required architecture entry documents; reconciled state.post100SourceSuccessors and retained independent review `/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/next100-primary-regression-blockers-review.json`. Independent review confirms React Aria's reset listener captures its original owner with effect[ref]; owned listener rebinds with effect[form], but upstream reset callback was treated as typing after reassociation. Original source SHA256 `e9d62e85e9afcb81fc57b2179fcd9c49855d211a170ccd0baa6ee9377ff7a483`.

The fix handles changes on native AriaTextArea onChange, using the native currentTarget.value, following the existing TextField implementation. It removes AriaTextField onChange as a path into owned/host state. The owned current-form listener still applies the latest uncontrolled default asynchronously, honors delegated reset cancellation, and cancels pending timers on form changes/unmount. Controlled host values remain authoritative and accepted resets remain silent. No value comparisons filter typing/default values; the obsolete reset-in-progress edit suppressor is removed. Native refs, DOM identity, React Aria input/composition handlers, disabled/readOnly flags, labeling and validation props are retained. No shared hook/TextField/node_modules source edits or dependency changes.

## Reused history and validation

Source checkout `/Users/thomashall/.codex/worktrees/8332/sg-ui` stays source/report only. Testing-only checkout `/tmp/sgui-post100-textarea-proof` composes source fix with immutable p12 committed history `6e4c0c65e8cdbf112fb16da0f1c0ab62e124d18a` and `50a3a266847c6de99257635a10bd016536253c84` by cherry-pick. Composed heads `8f0a149` then tested head `a4620db082c8b9d7f44d69f528fe778bb3c1dbe0`. No copied/duplicated/edited assertions. Inherited test SHA256 `a38ca4400727a92d70e99e03e618943c1218d3b9504a71feecac8cdbe2858542` matches retained review. Testing worktree clean after setup. Existing NativeReset story already represents latest default, canceled reset and controlled host behavior; no story write authorized or needed to demonstrate this internal ownership repair.

Node executable `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`, runtime `v24.21.0`; pnpm executable `/opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs`. Frozen install in proof checkout passed. Source-only guard briefly reused installed proof dependencies via node_modules symlink, removed after validation; no dependency-source mutation.

Unit/composed run: 3 files, 27 cases pass (TextArea existing 8, inherited 3, ImageUploadModal 16). Old-owner reset retains Draft; new-owner reset restores Saved silently; instance isolation and queued-reset unmount/remount pass. Existing latest default, delegated canceled reset, controlled external form, multiline callbacks/FormData/ref/readOnly/disabled/required behavior pass. Typecheck and token guard pass on composed head. Source-only foundation guard passes on source commit.

| Attempt | Exact tested head | Outcome | Atomic owned lease and alias | Processes settled / lease released |
| --- | --- | --- | --- | --- |
| `install` | `a4620db082c8b9d7f44d69f528fe778bb3c1dbe0` | `passed` | `/tmp/sgui-install-slots/slot0` + `/tmp/sgui-install-slots/slot-0`; `post100-textarea-86472` | `True` / `True` |
| `units` | `a4620db082c8b9d7f44d69f528fe778bb3c1dbe0` | `passed` | `/tmp/sgui-light-validation-slots/slot2` + `/tmp/sgui-light-validation-slots/slot-2`; `post100-textarea-87249` | `True` / `True` |
| `types` | `a4620db082c8b9d7f44d69f528fe778bb3c1dbe0` | `passed` | `/tmp/sgui-light-validation-slots/slot1` + `/tmp/sgui-light-validation-slots/slot-1`; `post100-textarea-87379` | `True` / `True` |
| `guard` | `a4620db082c8b9d7f44d69f528fe778bb3c1dbe0` | `failed` | `/tmp/sgui-light-validation-slots/slot3` + `/tmp/sgui-light-validation-slots/slot-3`; `post100-textarea-88053` | `True` / `True` |
| `tokens` | `a4620db082c8b9d7f44d69f528fe778bb3c1dbe0` | `passed` | `/tmp/sgui-light-validation-slots/slot1` + `/tmp/sgui-light-validation-slots/slot-1`; `post100-textarea-88206` | `True` / `True` |
| `sourceguard` | `9e8b6ebfc63d3b0300dbd2d34d1c8d9c31a5fe20` | `passed` | `/tmp/sgui-light-validation-slots/slot1` + `/tmp/sgui-light-validation-slots/slot-1`; `post100-textarea-88482` | `True` / `True` |

Log `/tmp/sgui-post100-textarea-install.log` SHA256 `03ccb82a559ef18f991af7c04242c5a5c355f44ed30124fd472779d4c07c5539`. Receipt `/tmp/sgui-post100-textarea-install.log.receipt.json`; resource/process settlement `/tmp/sgui-post100-textarea-install.log.resources.json`. Command: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node /opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs install --frozen-lockfile`.

Log `/tmp/sgui-post100-textarea-units.log` SHA256 `8757330a0de0de1a87ee17251aaa4db389c1f99d0c0522a8600ab34b700a2e6b`. Receipt `/tmp/sgui-post100-textarea-units.log.receipt.json`; resource/process settlement `/tmp/sgui-post100-textarea-units.log.resources.json`. Command: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node /opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs exec vitest run --maxWorkers 1 src/experimental/TextArea/TextArea.test.tsx src/experimental/TextArea/TextArea.next100-regression.test.tsx src/components/ImageUploadModal/ImageUploadModal.test.tsx`.

Log `/tmp/sgui-post100-textarea-types.log` SHA256 `262b3c8966a0dc5daafa68608283220d05f6e3681834a2ef6fc7b7ba7c7579ee`. Receipt `/tmp/sgui-post100-textarea-types.log.receipt.json`; resource/process settlement `/tmp/sgui-post100-textarea-types.log.resources.json`. Command: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node /opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs typecheck`.

Log `/tmp/sgui-post100-textarea-guard.log` SHA256 `989d578b426f76257e0402e859705befb6c936e81c63633564312050b1a9cd74`. Receipt `/tmp/sgui-post100-textarea-guard.log.receipt.json`; resource/process settlement `/tmp/sgui-post100-textarea-guard.log.resources.json`. Command: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node /opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs foundations:check`.

Log `/tmp/sgui-post100-textarea-tokens.log` SHA256 `4b5fcbef241308e33fbc4f446f99e5a4754ce12379d9c3d0439a91844a26876a`. Receipt `/tmp/sgui-post100-textarea-tokens.log.receipt.json`; resource/process settlement `/tmp/sgui-post100-textarea-tokens.log.resources.json`. Command: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node /opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs tokens:check`.

Log `/tmp/sgui-post100-textarea-sourceguard.log` SHA256 `a02ecf493ecaee3ff15eff68a1b8e685e8533151d671ea26938fde1fb32c206b`. Receipt `/tmp/sgui-post100-textarea-sourceguard.log.receipt.json`; resource/process settlement `/tmp/sgui-post100-textarea-sourceguard.log.resources.json`. Command: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node /opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs foundations:check`.

All validation acquired canonical light4/install2 leases including transitional aliases before commands. No no-slot attempts or unleased commands; all owned processes settled and leases released. No foreign lease touched. `git diff --check` passed.

## Retained failures and prerequisites

Inherited p12 red history remains unchanged: initial `/tmp/next100-p12-unit.log` 1 failed/9 passed; final `/tmp/next100-p12-unit-final.log` 1 failed/10 passed. The original failure is preserved in its author's history; these new green results do not rewrite it.

New composed foundations:check failed on `Internal root import in src/experimental/TextArea/TextArea.next100-regression.test.tsx` (the retained test imports `../index`). That is an immutable regression-history import/guard integration prerequisite, independent of corrected production bytes. No guard or assertion weakened. Root must reserve the test-owner/import-policy reconciliation before treating that composed guard as green. Source-only guard passes; this does not erase the composed failure.

Fresh focused native Chromium proof, Firefox/WebKit, physical device/IME and assistive technology acceptance remain pending with root. No Storybook build, browser/matrix/fullcheck, merge, push, publication, workflow changes or new agents. Primary image upload and integration checkout unchanged. No broader acceptance claims.
