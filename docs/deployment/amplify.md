# AWS Amplify documentation deployment

The owner selected `https://ui.structured-growth.com`. Development lives at
`/dev/`; published releases live at `/releases/<exact-semver>/`. `/latest/` is a
moving redirect to the newest published release. There is no published release
yet, so the development build does not fabricate a latest destination.

## Static hosting preparation

The docs app retains Next.js 16.4.2 and supports a separate static export. This
avoids assuming managed SSR support for this version. The normal development and
CI build keeps its server configuration and permanent redirects. Static output
exports to `.next-static`; navigation uses the existing SGUI routing adapter
with Next Link, including actual prefixed hrefs for new tabs and native links.

From the repository root, after a frozen install and a fresh library build:

```sh
SGUI_DOCS_STATIC_EXPORT=1 NEXT_PUBLIC_DOCS_BASE_PATH=/dev pnpm --filter @structured-growth/docs build
NEXT_PUBLIC_DOCS_BASE_PATH=/dev node apps/docs/scripts/stage-static-export.mjs /absolute/new/staging-directory
```

The staging command verifies all route HTML files and their asset prefix. It
refuses to replace an existing output directory. The export belongs under its
build-time prefix; copying an unprefixed build into a subdirectory is insufficient.
Immutable release builds use `/releases/1.2.3`, for example, with the matching
approved source and package artifact. `/latest` must redirect rather than copy a
release whose client bundles contain a different prefix.

[Development build settings](amplify-development.yml) are a console template, not
a deployed application. Use a supported Node24 build image. Set
`AMPLIFY_MONOREPO_APP_ROOT=apps/docs`; keep its appRoot and root buildPath aligned.
The template configures the hoisted pnpm linker in the disposable build checkout,
then performs the frozen install. This is a development preview. Official release
builds and immutable artifacts remain Actions-owned.

## Configure the host

The staged `amplify-redirects.json` is an operator input, not a special file that
Amplify automatically imports. Configure these rules in the console/API. They
preserve old general-page and Button URLs and provide a documentation-page 404
fallback to the overview. Do not install an all-path SPA rewrite: missing assets
must fail, and the export contains independent HTML routes. Verify trailing-slash
and legacy redirects, missing-page notices, asset requests, hard refreshes and
client navigation on the actual deployed domain.

A single dev-only staging directory does not retain published releases. Before
release deployment, assemble the new approved snapshot with every retained older
snapshot, reject changes to existing release trees, and deploy them together.
Then update `/latest` redirects for the overview and nested routes; nested missing
pages resolve through that target's own route manifest and fallback. Publishing
an ordinary dev build over that combined artifact would remove old releases.
The version selector must read verified release manifests; it currently lists
only development. These release assembly and live host checks remain DOCS-007.

## Assistance still needed

Connect the Amplify application to the repository, select its AWS region, configure
the domain/DNS and provide its deployable target. No AWS account is connected to
this session. No hosting, DNS, release publication or production change occurred.

References: [Next static exports](https://nextjs.org/docs/app/guides/static-exports),
[Next basePath](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath),
[AWS monorepo configuration](https://docs.aws.amazon.com/amplify/latest/userguide/monorepo-configuration.html).

## Assemble retained releases and latest

After validating each version's staged export, create a new combined host artifact:

```sh
node apps/docs/scripts/assemble-static-host.mjs /absolute/new/host-artifact /absolute/dev-stage /absolute/release-1-stage /absolute/release-2-stage
```

Supply the complete authenticated release archive, including every earlier release.
The assembler copies snapshots without rebuilding them, records every file hash,
rejects duplicate prefixes, symlinks and incomplete route manifests, and refuses
to replace its destination. Its generated rules redirect `/latest` and nested
`/latest/*` paths to the highest stable semantic version; prereleases do not replace
latest stable. With no stable release it emits no latest alias. These tests use
synthetic releases only; no publication is implied. A caller omitting or replacing
an archive is outside this preservation guarantee, so retain and authenticate the
previous host receipt before deployment.

Next's export still uses `.next` for intermediate build data even when the export
destination is `.next-static`. Serialize builds and browser suites; rebuild the
normal docs host before using `next start` again.
