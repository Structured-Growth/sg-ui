# Post100 TextArea native checkbox driver correction

Reservation: `post100-textarea-native-driver-correction`.
Frozen starting head: `471201ec6ea67b1ca4e27145a56e2ec2b4ef0546`.

The original Chromium pool `bc114be3-de0d-4c1c-a83b-9697ad1e44b1`
passed the Button case (465 ms), then failed the TextArea case at the default
30-second timeout. Its `locator.check` log reports the owned indicator intercepting
pointer events over the native input. This is a driver correction, not a product
change. The original failed record and successful Button execution remain intact:

`/Users/thomashall/.codex/worktrees/consolidated-source-fix-proof/sg-ui/artifacts/consolidated-sourcefix-native/bc114be3-de0d-4c1c-a83b-9697ad1e44b1/evidence.json`

Only the TextArea cancellation checkbox driver changes: focus the checkbox,
assert native focus, press Space, and assert the resulting checked state. Both
transitions also assert their starting checked state. All TextArea values,
callback records, reset assertions and existing settling logic remain unchanged.
No force click, timeout change, timing sleep, source, story or guarded API edit was
introduced. The Button case and every byte outside the two driver replacements
are identical to the frozen original.

SHA-256 of `tests/browser/post100-button-textarea-sourcefix.spec.ts`:

- Original: `86e258b2808608b4f7c152054f9a338b9ef0ed13dc89a280b6ba60288f5e805c`
- Corrected: `a904045f5de0c7cea0171f2d8c2dbfa0986eaf534173c5382ce6faad17ca6e19`
- Unchanged Button case: `3df70ca21b52a70fb830298380850bdee6d3e6e09549c6b24176a27dc011f606`

Validation: exact two-replacement byte comparison and Button-case byte equality
passed; `git diff --check` passed. The managed worker worktree has no installed
node_modules or local Node 24 runtime, so native TypeScript validation was not
run. No installation, build, Storybook, browser, source proof or full check ran.

The coordinator owns the pending TextArea-only Chromium rerun on the retained
immutable fresh Storybook build. Select the case with `--grep '^TextArea reassociation'`; preserve the already-green Button evidence without rerunning it.
No acceptance or central-state entry is closed by this driver edit.
