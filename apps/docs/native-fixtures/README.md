# Native documentation fixtures

This directory is the test-only React host for the library's native browser scenarios.
It is separate from the public Next.js routes and is not deployed with the product
website. The normal documentation pages remain ordinary, source-backed playgrounds
under `apps/docs/examples`; these fixtures preserve the controlled environments used
by the existing browser assertions.

`migration-manifest.json` records the original source location, new fixture module,
and exact private compiled alias allowlist. `registry.json` maps stable acceptance
IDs to exported fixture scenarios. The static bundle publishes the same registry at
`/fixtures/index.json`. IDs retain their historical spelling so existing assertions
can move hosts without losing their scenario identity.

The test host accepts:

- `/fixtures/?id=<fixture-id>` to load a scenario.
- `globals=theme:dark;density:compact;locale:ar-EG;direction:rtl` for scope settings.
- `args=density:compact;activation:manual` for scenario prop overrides.
- `embed=true` to suppress automatic play assertions when a browser spec owns the flow.

The host applies the production stylesheet, Provider and translation adapter, then
retains scenario-specific scopes/decorators and host state. It exposes
`window.__SGUI_FIXTURE__` with the fixture ID, completion/error status, autoplay flag,
and whether a play assertion exists. The four retained foundation play functions use
owned assertions plus Testing Library's native interaction tools. Failed play functions
remain failures; the receipt does not substitute for browser assertions.

Ordinary fixtures import compiled public package exports. Ten internal grid proof
modules use explicitly allowlisted `@sgui-test-internals/...` imports resolving only
to `packages/ui/dist`, never raw library source. These are historical internal
acceptance proofs, not new public APIs. The Vite config and dedicated TypeScript
config contain their exact mapping. Public website routes do not import this host,
its registry, scenarios or aliases.

Build with `pnpm build:browser-docs` after the library build; the runner writes a fresh
static bundle to `packages/ui/browser-docs-static`. Browser pools may use a separate
immutable output directory. Never rebuild a bundle while tests are running against
it. Execute `pnpm test:browser` for the configured Chromium, Firefox and WebKit gates.

Fixture execution under this host is new evidence. Historical acceptance records
remain attributed to their original tested build; neither a file move nor a passing
registry check closes native/browser acceptance by itself.
