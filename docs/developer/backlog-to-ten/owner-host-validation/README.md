# Local host preparation checks — 2026-10-21

DOCS-007-b | complete static build, prefixed navigation and host-artifact preparation |
[validation log](validation.log) | working changes following `2b611c2e` |
Next16.4 webpack production exports, all104 canonical HTML routes checked,
Chromium static smoke and11 normal-host browser cases | local Node26/macOS,
not a live Amplify deployment | DOCS-007 remains open for AWS/DNS and live verification.

The static smoke validates native prefixed hrefs, component hydration, canonical
sidebar identity, client navigation, hard refresh,404 fallback to the actual
overview URL with a plain-text notice, route manifest, served notices and the
prefixed editor image. It reports no unexpected failed requests or runtime errors.
The normal build passes grouped navigation, version fallback, content integrations
and general-route redirects. Both builds regenerate the public catalog/API.

The [client audit](docs-license-audit.json) inventories1580 file-backed client
modules,39 dependency packages and40 legal files, including the generated Webpack
runtime notice; no missing legal-file evidence is found in this emitted scope.
Generated loader/runtime and copied-asset review still retain the audit's stated
limits. This does not resolve the library's transitive client-only package evidence.

The initial staging attempt looked in `out`; Next's configured export destination
is `.next-static`. The expanded static smoke then found trailing-slash catalog
identity mismatch. Both were corrected and the final log above passes. Neither
initial failure is described as a passing check. Release assembly's synthetic
fixtures verify numeric latest-stable selection, unchanged older snapshots,
no invented latest, duplicate/symlink rejection and missing-page rejection.
No actual published release was created or deployed.
