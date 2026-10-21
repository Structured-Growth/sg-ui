# Fresh current-source host preparation — 2026-10-21

The [validation log](validation.log) records fresh library, static and normal
Next.js production builds at source `fbc08a12a501aaf6982b1d090582c23d09900095`.
The staged `/dev/` snapshot checks all 104 canonical HTML routes and assets.
Static smoke passes eleven checks, including learner-grid navigation with no
unexpected demo-destination prefetch, hydration, hard refresh, route identity,
manifest/notices/editor assets, 404-to-overview fallback and no runtime/request
errors. Snapshot assembly preserves the supplied development export byte-for-byte;
no latest-release alias is manufactured while no published stable release exists.

The normal host passes all eleven focused grouped-navigation, version fallback,
content-integration and canonical general-route cases. Both builds regenerate and
check the catalog/API and retain example isolation. The current client legal audit
is retained separately; it does not resolve the transitive client-only publisher
notice gap.

`deployment-receipt.json` and `host-receipt.json` identify local staged/assembled
output. This is local Node 26/Chromium preparation, separate from the accepted
supported-runtime CI checkpoint. DOCS-007 remains open for the owner's Amplify
application/Git connection/DNS, authentic immutable release snapshots and live
host verification. No AWS deployment, DNS change or release was performed.
