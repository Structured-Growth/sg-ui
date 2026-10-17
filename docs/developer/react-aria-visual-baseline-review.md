# Deliberate visual baseline review

This procedure covers the existing eight-case, 48-image representative visual
acceptance matrix. It supplements the component-family hardening review receipts;
it does not replace those accepted observations or expand them to all states.

Run on the coordinator's frozen docs-native host after acquiring the existing
serial validation lease. Record package/fixture/source hashes, browser/OS versions,
fonts and the interaction result. Keep failures and unsupported environments.
The config starts no host. Set `SGUI_VISUAL_BASE_URL` to its loopback origin and
`SGUI_VISUAL_OUTPUT` to a new absolute directory. Use the same browser/OS/font
runtime for capture and comparison. No update-snapshot CLI flags are accepted.

From `packages/ui`, with Node22.12+ or24 and the installed pinned tools:

```sh
SGUI_VISUAL_MODE=capture pnpm exec playwright test --config playwright.visual-acceptance.config.ts
```

Capture mode writes only candidates under `$SGUI_VISUAL_OUTPUT/candidates`. They
are not approved baselines. A capture run must finish all eight cases with no
warnings/errors before review. Inspect every image at native size; examine focus,
clipping, selection, contrast, RTL flow and loading/error/empty content. A rejected
or deferred image needs a defect/follow-up and cannot participate in comparison.
A corrected capture needs a new directory; never update images to clear a failure.

After actual review, create a schemaVersion1 JSON receipt with:

- `reviewer`, ISO `reviewedAt`, `engineVersion`, `osVersion`, `fontEnvironment`,
  and `reason`, describing the actual review environment and decision.
- `source`, `host`, and `interaction`: each `{path, sha256}`. Paths are relative
  to the repository. `source` points to `{files: {repositoryRelativePath: sha256}}`
  containing the relevant complete source/fixture/assertion/style/token closure.
  `host` identifies the exact immutable served assets; `interaction` identifies
  the successful native run. Include the spec, config, review helper, fixture,
  package output and shared styles/tokens; a selective manifest is not a full
  host attestation. Retain every referenced artifact. The checker verifies bytes,
  not manifest completeness, runtime success or who performed the review.
- `images`: exactly48 entries from `visualBaselineNames`, exported by
  `scripts/visual-baseline-review.mjs`. Each entry contains `name`, `path`
  relative to the candidate baseline directory, `sha256`, `disposition` and
  a concrete `observation`. Only `accepted` is admissible. The image basename
  must match `name`; symlinks or paths escaping the baseline root are rejected.

Keep original/replacement/diff images and their hashes for later changes. Explain
each delta rather than copying observations from earlier reviews. This tool checks
record integrity; it cannot authenticate reviewer identity or perform visual review.
No generated template is an acceptance record.

Point `SGUI_VISUAL_BASELINES` to the reviewed candidate directory and
`SGUI_VISUAL_REVIEW` to the receipt, both absolute paths; choose a separate absolute
`SGUI_VISUAL_OUTPUT` for comparison logs/traces:

```sh
SGUI_VISUAL_MODE=compare pnpm exec playwright test --config playwright.visual-acceptance.config.ts
```

Comparison refuses missing/stale/unreviewed images, verifies the bound source
files, and sets `updateSnapshots: 'none'`. Never pass `--update-snapshots` or `-u`.
A stale source/host/runtime requires a fresh attributable candidate/review where
affected; do not rewrite the receipt to imply an observation that did not occur.
The coordinator must separately confirm that the running host matches the recorded
asset manifest. This gate does not inspect a remote process or prove speech,
physical touch, actual browser zoom, legal approval or release readiness.
