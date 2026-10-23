# Retired implementation checks

The maintained source, docs host and package output use owned SGUI APIs.
MUI, Emotion, Storybook and removed public aliases are not runtime dependencies.

Run from the repository root:

```sh
pnpm foundations:check
node packages/ui/scripts/check-docs-host.mjs
node --test packages/ui/scripts/check-docs-host.test.mjs
pnpm build
pnpm test:package
```

The foundation check resolves production source imports, checks dependency
layers and rejects retired styling. The docs-host check rejects retired host
imports, dependencies, configuration and commands while validating current native
fixture registration. The package check scans fresh output and the packed
archive, including declarations, CSS, maps and assets.

These are regression guards: they fail if retired code is reintroduced. They do
not provide compatibility implementations or transform old application data.
Current third-party notices remain in THIRD_PARTY_NOTICES.md. Historical capture
archives and origin records are not retained in the working tree.
