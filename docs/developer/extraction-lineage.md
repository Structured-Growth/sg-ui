# Component and fixture continuity

The [current component inventory](../extraction-manifest.json) records component
paths, presence and replacement paths within this repository. It contains no
repository-of-origin information. First-party ownership is confirmed in the
[owner decisions](owner-decisions.md). Third-party attribution remains separate.

Current acceptance uses shipped contracts, colocated tests, public docs examples
and the docs-native host. The [fixture mapping](../../apps/docs/native-fixtures/migration-manifest.json)
retains scenario identities needed by existing browser tests. These IDs describe
local test continuity and do not introduce an external runtime dependency.

Use [Button public-contract tests](../../packages/ui/src/components/Button/Button.public-contract.test.tsx),
[component contracts](react-aria-public-contracts.md), and the
[current architecture](component-architecture.md) for supported behavior.
Unfinished environment, legal, release and acceptance work remains in the
[backlog](backlog.md).
