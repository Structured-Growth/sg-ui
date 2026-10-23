# Native browser fixtures

This private React host exercises the built public SGUI package. It is independent
of the Next.js application and is not shipped in the library tarball.

`module-manifest.json` lists current fixture modules and bounded internal compiled
aliases. `generate-registry.mjs` derives IDs from the modules' metadata and exported
examples. `registry.json` and `public/index.json` are generated current inventories.

From the repository root, build with `pnpm build:browser-docs`. Fixtures are served
at `/fixtures/?id=<fixture-id>` during library Playwright checks. Source-context
unit fixtures remain alongside library implementations.

Keep existing interaction assertions, production scopes, stylesheet loading and
public imports. Private compiled aliases are restricted to explicit internal
fixtures. Fixture changes must compile against a fresh library build. Do not
rebuild a host while a browser suite is using it.
