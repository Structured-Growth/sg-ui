# Wave 03-26: editor image metadata and trust

A-E-06 and A-E-07 remain **partial**. This delivery contains a concrete six-file patch, matching proposed-file mirrors and executed regression evidence. No production/source/test/central-ledger file was modified. No acceptance count was changed.

## Substantive patch

`image-runtime-shapes.patch` adds a small private runtime shape guard shared by the image factory and host-upload completion. It rejects non-string source/description/asset IDs and non-finite/non-numeric dimensions before creating an image node. Existing optional null/default behavior, source syntax policy, valid metadata and decorative alt survive. Current malformed upload output leaves the dialog/file/description available, reports translated retry feedback and cannot insert a node. Stale results are ignored before validation, and no host URL is revoked.

The patch extends the existing integrated retry test with malformed metadata and adds a real Lexical factory/import regression plus React escaped-attribute/JSON-fidelity assertions. Consumer documentation explicitly states that rejecting malformed image fields does not implement atomic document validation, version migration or recovery; the existing silent Lexical error handler remains a separate whole-document concern.

## Evidence

- Patched read-only source overlay: **27 passed in 2 suites**, Node **24.19.0**, Vitest **4.1.11**, jsdom, `unit-overlay.txt`.
- Same proposed tests with original implementations: **2 expected failures / 25 passes**, `unit-baseline.txt`. Malformed metadata is accepted on the original paths; the new regression assertions detect it.
- The first overlay attempt failed to resolve the new helper from `./lexical/`; `unit-overlay-first-failure.txt` is retained. Only the evidence overlay resolver was corrected, then both suites passed.
- `git apply --check docs/developer/final-acceptance/wave-03-26/image-runtime-shapes.patch` passed. The patch has **not been applied**.
- `evidence.json` records exact inspected input/proposed artifact hashes and current dev HEAD. All **55/55** overlapping wave-02-03 inputs are unchanged; accepted URL, file metadata and stale-upload evidence is reused with its original limits. Coordinator integration evidence is retained for its own named fixes; it has no overlapping editor input hashes and supplies no new editor closure.

Reproduce overlay from repository root through the inspected validation lease:

```sh
/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /tmp/sgui-calendar-validate.mjs /Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node packages/ui/node_modules/vitest/vitest.mjs run --config docs/developer/final-acceptance/wave-03-26/vitest.overlay.mjs
```

The overlay uses mirrors for six files, the existing installed dependency graph and an evidence-owned cache; all other source dependencies remain in the shared checkout. This is executed source/jsdom evidence, not a compiled-package/native-browser result. No install/build/server was started. Exact integration/check/build/native commands and assertions are in `validation-plan.json`.

## A-E-06 — partial

**Original requirement:** - [ ] A-E-06 Reconcile original `E-06`: Define safe URL/protocol handling, image metadata/alt text, host upload callbacks, file validation, cancellation, and object-URL cleanup. Shared saved/pasted link policy and activation: [partial contract](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial). Saved image sources and upload-result retry: [partial image contract](react-aria-editor-section.md#image-source-policy-e-06e-07-partial); [upload lifetime matrix](react-aria-editor-section.md#host-upload-lifetime-e-06-partial) covers stale results after cancellation/reset/read-only/unmount; [file presentation validation](react-aria-editor-dialogs.md#file-presentation-validation-e-06-partial) covers empty files and MIME/extension metadata; wider image/upload acceptance remains open. Historical status: open.

The runtime-metadata and retry gap now has a tested patch. Retained object-URL and late-promise ownership cases are unchanged. Remaining: integration and browser verification of the new metadata case, owner-approved encoded/redirect/resource policy, and real host byte/type/size/dimension/authorization/abort/stale-asset cleanup evidence. No host adapter/service or owner attestation was supplied; the UI cannot safely invent those policies or delete host assets.

## A-E-07 — partial

**Original requirement:** - [ ] A-E-07 Reconcile original `E-07`: Review rich-content rendering and trust boundaries; do not render arbitrary HTML or unsafe links merely because they arrived in a presentation model. Saved/pasted link destinations are governed by the [owned policy](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial), and image decoration by the [image source policy](react-aria-editor-section.md#image-source-policy-e-06e-07-partial); broader rich-content acceptance remains open. Historical status: open.

The patch provides bounded rejection/fidelity at the image boundary without broadening URL policy. `trust-review.md` specifies exact remaining decisions for author CSS, unknown/malformed nodes/versions, document-level failure recovery, remote/data/blob requests and downstream JSON renderers. Valid author styling is intentionally not purged without a policy. A rejected factory call is not evidence that a whole document is atomically rejected; the host must retain originals and avoid overwriting them from partial parsing. Native hostile-style/request observations and owner approval remain absent.

## Delivery

Review `image-runtime-shapes.patch`, `proposed-files/`, `validation-plan.json`, `trust-review.md`, `results.json` and `evidence.json`. `prepare.py` recreates the patch from current production inputs; `capture.py` records hashes; `write-results.py` writes this report and structured results. The coordinator should check input hashes before applying because the checkout is shared and dirty. No browser, real-device/AT, host-service, packed-consumer or production acceptance is claimed.
