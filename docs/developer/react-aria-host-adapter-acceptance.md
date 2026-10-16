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

## Composed routes and callback boundaries

Breadcrumbs and SideNavigation leaf links use the shared styled Link, including
its host-provided custom Link when present. React Aria Menu route items instead
call the same adapter's `navigate` directly for eligible relative primary
activation. Menu does not render the custom Link. `onAction` is an item notification;
a host must not also navigate to that same item's href from `onAction`. Keep
application routing inside the adapter so a single activation requests one route.
Modified activation, external URLs and non-self targets retain native semantics.
Menu commands without href remain host actions.

A custom Link owns cancellation and native bypass rules after receiving the
consumer callback. Invoke `onClick` first, stop if it prevents default, and call
`preventDefault()` before `navigate`. Preserve `replace`, all native anchor
attributes, children and the anchor ref. React Aria interaction implementations
remain internal; adding another routing provider is unnecessary for these owned
components. Framework imports belong to the host application.

The private adapter routing fixture additionally composes Menu, Breadcrumbs,
SideNavigation and Link with both navigate-only and custom-Link adapters. The
focused `tests/browser/navigation-composed.spec.ts` defines pointer/Enter exact
counts, consumer cancellation/order, pathname replacement/selected state,
anchor identity/ref focus, modifier/target popups and a same-origin download.
These are runnable assertions, not a recorded browser pass until coordinator
integration and native execution. The fixture's local pathname state represents
host acceptance; it does not simulate framework history, persistence or a backend.

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

## Host diagnostics for asynchronous actions

SideNavigation admits one account operation at a time, suppresses repeated or
competing menu actions while pending, and permits an explicit retry after failure.
It shows generic translated alerts and does not forward caught errors. Retain
useful diagnostics in the host callback before rejecting. Apply this host-owned
wrapper to each of `logoutAccount`, `logoutAllAccounts` and `onOrganizationChange`:

```ts
function withHostDiagnostics<Args extends unknown[]>(
  operation: "logoutAccount" | "logoutAllAccounts" | "onOrganizationChange",
  request: (...args: Args) => Promise<void>,
  retain: (entry: { operation: string; cause: unknown }) => void,
): (...args: Args) => Promise<void> {
  return async (...args) => {
    try {
      await request(...args);
    } catch (cause: unknown) {
      retain({ operation, cause });
      throw cause;
    }
  };
}
```

This helper is host application code, not an SGUI export. `retain` must be a
nonthrowing synchronous sink; the host owns redaction, access, storage, transport
failures and retention. Keep the original unknown rejection object, including
Error causes or opaque values, for diagnostic processing. Do not stringify raw
backend errors into visible alerts or public console logs. Keep wrapped callback
references stable across renders (for example with host `useMemo`); changing the
adapter callbacks intentionally invalidates library-owned pending results.

A stale request still settles and is diagnosed by its original host wrapper.
SideNavigation ignores its obsolete UI/session/navigation result after callback
or adapter replacement or unmount; it does not cancel the host request. Distinct
adapter callers remain independent. `Button.onPress` itself does not await a
returned promise, deduplicate host requests or report rejections: standalone
async actions must own their pending guard and catch failures in the host.

## Evidence and limits

- `src/adapters/navigation.test.tsx`: native fallback, external
  bypass, custom router attributes/ref, live pathname and imperative replace.
- `src/adapters/navigation.ssr.test.tsx`: native markup and safe imperative
  fallback in a Node environment without window.
- `src/adapters/accounts.test.tsx`: disabled fallback, exact presentation records,
  lazy getters, callback arguments, pending promise identity and rejection reason.
- `apps/docs/native-fixtures/scenarios/adapters/adapters.fixture.tsx`: production scoped routing and a host-controlled
  async account example, with completion, rejection and retry.
- `tests/browser/batch01-adapters.spec.ts`: native Enter/hash navigation, styled
  link keyboard routing, custom ref focus, replace/path updates, download bytes,
  external document navigation and async account pending/retry.

The async fixture demonstrates host policy, not automatic adapter pending state.
Real routers, auth services, physical devices, assistive technology and broader
Breadcrumbs/shell behavior remain outside this slice. No broad gate is marked
complete by this record.
