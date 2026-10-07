# Host adapter acceptance

Bounded acceptance for H-01, H-03, H-04, H-05 and U-10. This record covers the
adapter layer; full shell, Breadcrumbs, framework and assistive-technology
acceptance remains separate. See [shell integration](react-aria-modal-shells.md)
and [owned link contracts](react-aria-layout-actions.md).

## Routing ownership

Import `SGLink`, `SGNavigationProvider`, `usePathname` and `useRouter` from
`@structured-growth/sg-ui/adapters`. Without a navigation provider, SGLink renders
a native anchor and leaves click/keyboard activation to the browser. `replace`
is stripped from native DOM attributes. Imperative `useRouter().push(href,
{ replace: true })` retains the existing location-replace fallback; server-side
calls do not access browser globals. Unprovided pathname is `/`; the host must
supply and update pathname for route-aware consumers.

With a provider, ordinary unmodified primary activation of a relative destination
calls `navigate(href, { replace })` after the consumer's onClick. Consumer
cancellation, downloads, modified/non-primary clicks and non-self targets retain
native behavior. Absolute URLs, protocol-relative URLs and explicit schemes
bypass both navigate and the custom router Link, matching the owned Link default.
This is a routing classification, not URL trust validation: hosts own the URLs
they supply and application navigation policy.

A custom Link receives the relative href, replace, native attributes, children,
callbacks and anchor ref. It must forward the native anchor ref/attributes and
implement its own cancellation, modifier, target and download rules. SGUI does
not wrap the custom Link in a second navigation handler. Native activation in
the styled public Link reaches this same adapter through a native anchor; no
additional router provider or framework runtime is required.

The styled `Link` from `/primitives` adds owned visual tokens and new-tab
`noopener noreferrer`. Load `/styles.css` and provide Provider/ThemeScope for
styled controls. SGLink itself supplies anchor semantics without visual styling.
An explicit styled `external={false}` still cannot send an absolute destination
through SGLink's router: use imperative host navigation when that is required.

## Account ownership

SGAccountProvider supplies presentation sessions and operation callbacks. The
adapter does not read storage eagerly, persist credentials, fetch endpoints,
refresh sessions, navigate, retry, or change organization implicitly. No provider
means `enabled: false`, empty presentation sessions and safe no-op callbacks.
The callback results, promise identity and rejection reason pass through unchanged.

The host/composed action owner must await async callbacks, guard repeated requests,
present useful errors and permit retry. Adapter calls themselves are intentionally
not deduplicated: independent consumers can make independent requests. Pending
and errors do not imply session mutation; successful logout/navigation and
organization refresh remain host integration concerns. Existing SideNavigation
owns its composed pending/error UI; this slice does not modify that shell.

## Evidence and limits

- `src/adapters/navigation.test.tsx`: native fallback, external
  bypass, custom router attributes/ref, live pathname and imperative replace.
- `src/adapters/navigation.ssr.test.tsx`: native markup and safe imperative
  fallback in a Node environment without window.
- `src/adapters/accounts.test.tsx`: disabled fallback, exact presentation records,
  lazy getters, callback arguments, pending promise identity and rejection reason.
- `src/adapters/adapters.stories.tsx`: production scoped routing and a host-controlled
  async account example, with completion, rejection and retry.
- `tests/browser/batch01-adapters.spec.ts`: native Enter/hash navigation, styled
  link keyboard routing, custom ref focus, replace/path updates, download bytes,
  external document navigation and async account pending/retry.

The async story demonstrates host policy, not automatic adapter pending state.
Real routers, auth services, physical devices, assistive technology and broader
Breadcrumbs/shell behavior remain outside this slice. No broad gate is marked
complete by this record.
