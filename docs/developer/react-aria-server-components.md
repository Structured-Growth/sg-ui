# Server and client packaging

R-02 removes the former blanket `"use client"` injection from the build.
Directives now come from the source implementation and survive compilation.
Barrels do not establish a client boundary. Tokens, models and presentation
implementations such as Box, Typography, Table, ClassCardFrame, AuthShell and
AppShell remain eligible for server rendering. Their native refs continue to
work for client consumers with React 18.3 and 19.

Interactive components, hooks and context providers retain explicit client
boundaries. Provider and ThemeScope depend on context, so they are Client
Components even though their initial SSR markup is stable. A Server Component
can pass server-rendered presentation content as their children. Event handlers,
render callbacks and other function props for an interactive component belong
in a consumer Client Component, following the host framework's serialization
rules.

The package check verifies every production TypeScript module's emitted directive
against its source and rejects React client API imports without an explicit
boundary. Compiled CSS class maps are ordinary server-importable JavaScript;
applications still load `/styles.css` once and provide an owned visual scope.

`pnpm test:foundation-consumer` packs the actual package into a clean fixture.
Its React 19 fixture also installs the matching official
`react-server-dom-webpack` test renderer, runs with Node's `react-server`
condition and the official directive loader, and produces a Flight stream.
It verifies that public presentation imports are executed on the server,
that Provider and AppButton become client references, and that a composed
shell/card/table tree serializes without render errors. The renderer is confined
to the disposable fixture and adds no package runtime dependency.

The same fixture retains ordinary SSR and Vite hydration-entry builds, production
CSS and unused icon pruning assertions. Running
`node scripts/test-foundation-consumer.mjs --react18`
validates the React 18.3 path without installing the React 19 Flight
renderer. This evidence does not certify every host framework, browser hydration
behavior or remaining R acceptance requirement; those need their own checks.
