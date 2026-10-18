# Public contract acceptance follow-up

This supplements [public contracts](react-aria-public-contracts.md),
[names and composition](react-aria-public-composition-contracts.md) and
[runtime evidence](react-aria-runtime-ci.md). It records a bounded source review;
it does not announce a broader TypeScript support range or close native/AT gates.

## Custom Dialog headers

`Dialog.header` replaces the generated heading and description content. Providing
`title` alongside a custom header does not render that title or automatically name
the dialog. Supply a nonempty `aria-label` explicitly, or include a correctly
associated accessible heading in the custom header. The simplest explicit contract:

```tsx
import { Typography } from '@structured-growth/sg-ui';
import { Dialog } from '@structured-growth/sg-ui/experimental';

export function CourseDialog({ open, onDismiss }: {
  open: boolean;
  onDismiss: (reason: 'escape' | 'outside' | 'close-button' | 'dismiss') => void;
}) {
  return <Dialog open={open} aria-label="Edit course" onDismiss={onDismiss}
    header={<Typography as="h2" variant="h2">Edit course</Typography>}>
    Course form supplied by the host
  </Dialog>;
}
```

Load the public stylesheet and provide the application scope as described in
installation guidance. Custom header content owns description associations too:
the default description ID is attached only when the generated header is used.
A Tooltip or root class cannot repair a missing name. The string type prevents
omission only where required; it cannot prove nonempty translated text or speech.

## Scope and field defaults

ThemeScope inherits omitted theme/density/interactionMode/direction/language from
its parent; its root defaults are light/comfortable/auto. Only `--sgui-*` variables
from its style enter overlay context. Ordinary layout style remains local. Overlay
visual direction uses explicit scope direction, then interaction-locale direction.
These are conditional composition defaults, not five independent literal defaults.

Checkbox standalone state starts false when defaultChecked is omitted. Native reset
uses the latest default for uncontrolled standalone state. `slot="selection"`
delegates ownership to the collection; do not apply standalone reset semantics to
it. Its ref is the label; use the label's native `control` for input focus/validity.

TextField uncontrolled state starts empty and an uncanceled reset restores the
latest default. Explicit empty strings remain controlled values. Its preserved
native error is used only when errorMessage is nullish; an explicit empty host
errorMessage suppresses that saved text. This precedence is distinct from validity
and should not be generalized to date/time fields.

DataToolbar view controls are presence-based: omitted showViewModeToggle uses
Boolean(viewMode && onViewModeChange). Explicit false/true controls visibility;
a missing callback still disables the actions. The source expression, rather than
optional prop syntax, defines this default. See [the toolbar contract](react-aria-data-toolbar.md).

## Installed declaration proof

`packages/ui/scripts/acceptance-installed-types.mjs` reads an existing isolated
foundation consumer produced by the immutable wave-03-32 matrix. It does not install,
pack, rebuild or mutate that fixture. Run it serially with supported Node22/24:

```sh
node packages/ui/scripts/acceptance-installed-types.mjs \
  --fixture /absolute/retained-foundation-consumer \
  --output /absolute/new-types-evidence
```

It compiles the existing positive and expected-negative consumer plus the colocated
public-contract-consumer.tsx fixture twice, with
skipLibCheck true and false. It then masks only expect-error comment bytes in
memory and requires a diagnostic in each following statement; the original source
and offsets remain intact. This checks that negative assertions reject real invalid
API usage, rather than silently passing through an any-valued declaration. The
receipt retains exact compiler entry, React/type versions, fixture and installed
declaration hashes and all diagnostics. A failure is preserved and fails the proof;
never add skipLibCheck or weaken an assertion to turn it green.

`--compilers` accepts comma-separated existing TypeScript package directories for
an explicitly chosen matrix. No versions are downloaded and a passing pinned
version does not define a new supported range. Run both independently installed
React18 and React19 fixtures against the same frozen tarball. Keep their artifact
identity/install records from the matrix; type receipts do not replace CSS/module
retention, SSR, Flight or browser hydration evidence.

## Historical contract and release boundary

The initial extraction lock resolves material/icons7.3.11, data-grid8.29.3,
emotion-react11.14.0 and emotion-styled11.14.1. The acceptance follow-up recovered
the exact integrity-bound archives and transitive declarations, then resolved the
captured primitive and Button/modal/grid wrapper contracts. The
[inherited styling map](react-aria-inherited-styling-migration.md) records 740 hooks
against the current declared boundaries. Other original wrapper joins and runtime
default semantics remain separate before claiming complete API compatibility.
Do not substitute current upstream APIs or infer props from component names.

Use the existing nineteen breaking-map dispositions and twelve absent-symbol
mappings as starting evidence. For each additional inherited key/default, record
retained/replaced/removed, the precise consumer migration, and the release-range
commit responsible. Release history and owner approval remain external inputs.
The initial extraction is not proof of publication. A release-worthy incompatible
change to an existing published contract requires a real `!` or `BREAKING CHANGE:`
marker in the analyzed integration range; a proposed title is not such evidence.
Semantic-release calculates versions. Production approval, final validation and
promotion remain separate requirements.

## Resolved inventory and migration gate

Generate the complete current public declaration inventory without emitting code:

```sh
node packages/ui/scripts/public-contract-inventory.mjs \
  --package packages/ui --output /absolute/new-public-inventory
node packages/ui/scripts/verify-contract-migrations.mjs \
  --inventory /absolute/new-public-inventory/public-contracts.json \
  --repo . --source-ref HEAD --output /absolute/new-migration-receipt.json
```

The generator expands wildcard exports, resolves aliases and inherited native
properties, and records generic parameters, union alternatives, callback signatures,
ref properties and deprecated tags. Top-level any/unknown fails the command and is
retained as an issue. The generated declaration manifest hashes every current type
file; optional props remain separate from source-backed runtime defaults.

The migration gate requires all absent baseline names to have existing public
replacement exports and a consumer guide. It also checks six changed default
bindings against exact source hashes, named
implementation owners and current declared props. Five calendar defaults changed
since the saved owned snapshot; omitted AppDataGrid selection changed from absent
to enabled relative to the initial extraction. Pass `selection={false}` to retain
that earlier presentation. The separate locked-type evidence resolves 38 captured
analysis contracts and 740 inherited styling mappings; it does not promise every
upstream prop remains compatible. `--source-ref` pins the source check to a Git
commit, keeping uncommitted candidate changes separate. Source changes invalidate
the relevant default
row until reviewed. The gate neither publishes nor changes library versions.

The [public boundary index](react-aria-public-boundary-index.md) defines naming,
description, visual domains and composition/ref hooks for 111 non-icon callable
boundaries and 96 icon contracts. Its JSON retains naming-union alternatives and
aliases. InstructorClassCard.className is course-name content, not a CSS hook.
The current inventory resolved 480 contracts on 238 public routes with no
unresolved top-level types. The migration guard verified 12 removed-name mappings
and five changed defaults in that historical receipt. The maintained map now also
tracks the extraction-to-owned grid selection default, for six total. These are
declaration/source checks; the separate
installed-consumer receipts provide runtime and hydration evidence.


## Frozen contract reconciliation

The [per-contract join](final-acceptance/wave-04/02/public-contract-reconciliation/contract-join.json)
links the 38 recovered boundary/model/event analysis contracts and all 740 styling
rows to their resolved owned declarations, callback signatures, models, deprecated
tags, route identities and specific migration guides. It also updates all 266
baseline symbol dispositions, including the twelve absent names and the surviving
`MenuItem` name's runtime-component-to-record-type change. A same-name alias or
same type spelling is not a promise of upstream runtime compatibility.

The [source initializer comparison](final-acceptance/wave-04/02/public-contract-reconciliation/direct-default-drift.json)
checks the saved 214 public-default candidates against committed source: 209 keep
the same initializer expression and five calendar bindings changed. The separate
grid selection row compares the initial extraction. Reference, context and
controlled-state expressions remain conditional ownership rules, not inferred
constant values. The original derived-expression queue is retained as source
candidates; it is not relabeled as hundreds of fixed public defaults.

The [release-impact record](final-acceptance/wave-04/02/public-contract-reconciliation/release-impact.json)
preserves actual commit history and distinguishes source-family major markers
from exact default-change commits. The originally unmarked nearest-endpoint and
independent-calendar changes now have the concrete migration instructions and
breaking marker in integration commit `339c958d`. Project commitlint passes, and
the configured analyzer classifies that actual committed message as major; see the
[actual commit validation](final-acceptance/wave-04/02/public-contract-reconciliation/actual-commit-validation.json).
Publication, version calculation and future approved promotion to main remain separate.
