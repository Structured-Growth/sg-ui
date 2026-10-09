# Post100 Button and TextArea native fixtures

Reservation: `post100-button-textarea-native-fixture`. This change contains story
fixtures and two focused native cases only. It changes no component implementation.

The coordinator must compose these fixtures with the independently reviewed Button
repair at `d2bd5208f8f9ff0fd17cae0bcf51941f8bb5f2ed` and TextArea repair at
`7834090f7e6c322495acca80de94d7568041d773`, plus the separate correction for the
inherited TextArea test import guard failure. Original regression histories remain
separate and must be preserved during integration.

- `Migration proofs/Button / OwnedPressArguments` reports the host-observed rest
  argument count for an ordinary Button. One native case checks pointer click,
  Enter and Space, exactly one callback per activation and zero callback arguments.
- `Migration proofs/TextArea / FormReassociation` preserves mounted uncontrolled
  and controlled fields while the host moves their `form` prop between two forms.
  One native case checks that the old owner's reset leaves the draft intact,
  current reset uses the latest multiline default silently, delegated cancellation
  preserves edits, and a rejecting controlled host remains authoritative before
  and after a host value replacement and reset.

Run once at the exact composed candidate, after the coordinator's fresh Storybook
build and type checks:

```sh
pnpm exec playwright test tests/browser/post100-button-textarea-sourcefix.spec.ts --project=chromium --workers=1 --retries=0
```

The worker did not install dependencies or run units, types, guards, Storybook,
Playwright or a full check. Only diff/ownership checks were performed here. Native
outcomes remain pending coordinator execution; no acceptance item is closed by
fixture authorship. This slice does not establish other browser engines, actual
IME, physical touch, assistive technology or a complete regression matrix.
