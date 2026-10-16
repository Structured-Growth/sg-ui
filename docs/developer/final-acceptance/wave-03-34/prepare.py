import pathlib,json,difflib,hashlib
root=pathlib.Path.cwd(); out=root/'docs/developer/final-acceptance/wave-03-34'; docs={}; skipped=[]
def edit(p,a,b):
 s=docs.get(p,(root/p).read_text())
 if a not in s:
  skipped.append({'path':p,'before':a,'alreadyPresent':b in s});return
 docs[p]=s.replace(a,b,1)
prior=json.loads((root/'docs/developer/final-acceptance/wave-02-13/proposed-doc-corrections.json').read_text())
for item in prior:
 # Runtime guide's dated block is expressly historical. Preserve all old receipts.
 if item['path']=='docs/developer/react-aria-runtime-ci.md':continue
 for r in item['replacements']:edit(item['path'],r['before'],r['after'])
edit('docs/agent-guidance-migration.md','Story fixtures remain local and independent.','Docs examples and native fixtures remain local and independent.')
edit('docs/developer/react-aria-component-recipe.md','   Do not restore Storybook or fork tokens or depend on host APIs/authentication.','''   Follow the [Button page template and example rules](../../AGENTS.md#component-documentation-requirements):
   bare overview, playground (processing-grid exception), named source-backed examples,
   Contains/Used In and page-level Documentation. Register public aliases and compound
   children. Each Example owns its state; source must track controls and include host callbacks.
   Do not restore Storybook or fork tokens or depend on host APIs/authentication.''')
edit('docs/github-setup.md','boundaries, relevant stories/behavior criteria, validation commands and remaining','boundaries, relevant docs examples/native fixtures and behavior criteria, validation commands and remaining')
edit('docs/github-setup.md','''The checked-in AI prompt and patch allowlist permit only `src/`, `.storybook/`,
`docs/` and `README.md`. Package/workflow/agent changes and `.github` template edits
require ordinary maintainer PRs.''','''The checked-in AI prompt and patch allowlist permit bounded component work in
`packages/ui/src/`, `apps/docs/examples/`, `apps/docs/native-fixtures/scenarios/`,
`docs/` and `README.md`. Architecture, shared contracts/foundation/theme/tokens,
public exports/models, adapters/i18n infrastructure, dependencies, package configuration,
workflows and agent instructions remain maintainer-only even inside allowed paths.
Requests needing those changes require a maintainer handoff.''')
edit('docs/github-setup.md','''body is a short static summary; task IDs, detailed evidence and remaining gates
must be added during review. Updating the generated prompt/body is separate
workflow work (R-20), not accomplished by these templates.''','''body includes the structured task/contract/example/evidence/limitation report and a
workflow validation receipt identifying base HEAD, proposal patch SHA-256 and run.
Review the actual report and logs; this receipt does not identify a tested future PR
commit or establish the full browser/packed-consumer matrix.''')
edit('docs/github-setup.md',"proposal job's title/package/Storybook checks","proposal job's title/package/native-fixture checks")
edit('docs/github-setup.md','changed-state stories; focused browser checks with fresh Storybook','changed-state docs examples/native fixtures; focused browser checks with fresh native fixtures')
edit('.github/ISSUE_TEMPLATE/ui-change.yml','label: Stories and validation evidence','label: Docs examples and validation evidence')
edit('.github/ISSUE_TEMPLATE/ui-change.yml','Identify relevant stories/tests or reproduction links','Identify relevant docs examples/native fixtures/tests or reproduction links')
edit('.github/pull_request_template.md','Stories covering changed props/states','Docs examples/native fixtures covering changed props/states')
edit('docs/commercial-licensing.md','''Third-party dependencies remain under their own licenses. SGUI's commercial
notice does not relicense React, MUI, Emotion, or Lexical. Full notices for the
current direct runtime/peer packages are included in THIRD_PARTY_NOTICES.md;
dependencies also distribute their own licenses.''','''Third-party dependencies remain under their own licenses; SGUI's commercial
notice does not relicense them. Current direct runtime/peer dependencies are declared
in [the library manifest](../packages/ui/package.json). React Aria, TanStack, Lexical,
Lucide and React attribution must be reviewed against the exact candidate artifact
using the [license inventory](developer/react-aria-license-inventory.md).
[THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) also preserves historical extraction
notices, including MUI and Emotion; retained notices do not imply current dependencies.
Dependencies distribute their own licenses. Notice preservation alone does not establish
complete asset/transitive provenance or counsel approval.''')
edit('docs/developer/react-aria-runtime-ci.md','See [docs migration](docs-website.md) for current execution evidence.','''See [docs migration](docs-website.md) for current execution evidence.
Run root `pnpm` scripts from the repository root. Direct `node scripts/...`
consumer commands in the dated receipts resolve from `packages/ui` in the current
workspace. Do not run the retired `build-storybook` command to reproduce today's host.''')
edit('docs/migration.md','## Adoption and remaining limits','''## Changed defaults and compatibility names

Use the built public declarations for the version being adopted. The migration
changes above include these consumer-visible defaults and ownership rules:

| Concern | Current behavior / required migration |
| --- | --- |
| Button / removed AppButton | Import `Button` and `ButtonProps` from the root, components barrel or `/components/Button`. AppButton/AppButtonProps were removed before first release; historical evidence keeps its original names. Button defaults to `type="button"`, `variant="filled"`, `tone="primary"`; set submit/reset explicitly and use `onPress` without an upstream event. |
| Scope / Menu density | General scopes default to comfortable. Generic Menu inherits scope density; catalog menu wrappers explicitly choose compact. Set a local scope or supported density prop instead of assuming all menus are compact. |
| Typography tones | Use default/muted/subtle/accent/danger. `primary` is a compatibility alias for accent, not an action-priority label; semantic `as` and visual variant are independent. |
| Grid selection | AppDataGrid selection config uses `ReadonlySet<string>` input and `Set<string>` change requests. Supply stable top-level getRowId; reconcile retained IDs in the host. Do not forward an engine include/exclude object. |
| Pagination / persistence | Pages are zero-based. Criteria/page-size changes request page zero first. Persistence is opt-in with distinct keys; controlled values remain authoritative. |
| Preserved names | Class-prefixed names, AppThemeProvider and AppPaginationFooter remain supported exports, not an inferred deprecation schedule. The CardPaginationFooter directory/subpath exports AppPaginationFooter. `/experimental` is a proof entry point; do not rename public App components to match it. |

For example, after the application imports the stylesheet and provides its theme:

```tsx
import { useRef, useState } from "react";
import { Button, type ButtonProps } from "@structured-growth/sg-ui/components/Button";

export function SaveDraft({ onSave }: { onSave: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [saving, setSaving] = useState(false);
  const variant: ButtonProps["variant"] = "outlined";
  return <Button ref={ref} variant={variant} tone="neutral" loading={saving}
    onPress={() => {
      setSaving(true);
      try { onSave(); } finally { setSaving(false); }
    }}>{"Save draft"}</Button>;
}
```

This synchronous callback requests a host action; it does not persist a record or
model asynchronous saving. Async hosts own completion/error state and supply it
through the supported loading/disabled props. See the [adoption checklist](developer/react-aria-adoption-checklist.md).

## Adoption and remaining limits''')
# Keep example honest and simpler: synchronous callback has no fake loading state.
p='docs/migration.md';docs[p]=docs[p].replace('import { useRef, useState } from "react";','import { useRef } from "react";').replace('  const [saving, setSaving] = useState(false);\n','').replace('tone="neutral" loading={saving}\n    onPress={() => {\n      setSaving(true);\n      try { onSave(); } finally { setSaving(false); }\n    }}','tone="neutral"\n    onPress={onSave}')
edit('docs/developer/react-aria-license-inventory.md','react-aria-master-task-list.md#5-licensing-and-dependency-governance','react-aria-hardening-tasks.md')
edit('docs/developer/react-aria-license-inventory.md','node scripts/check-license-inventory.mjs /path/to/sg-ui','node scripts/check-license-inventory.mjs /path/to/sg-ui/packages/ui')
edit('docs/troubleshooting/validation.md','pnpm exec playwright install --with-deps chromium firefox webkit','pnpm --filter @structured-growth/sg-ui exec playwright install --with-deps chromium firefox webkit')
edit('docs/migration.md','Commercial terms and third-party notices remain authoritative.','\nSupport decisions still required are recorded in the [dependency policy decision record](developer/react-aria-dependency-upgrades.md#human-decision-record-required-for-operational-acceptance): supported-release/backport window, routine review cadence and accountable maintainer, confidential intake and disclosure authority. This guide does not establish a support service, response SLA or deprecation schedule. Resolve those decisions before claiming operational support acceptance.\n\nCommercial terms and third-party notices remain authoritative.')
edit('docs/commercial-licensing.md','SGUI is publicly distributed on npm as commercial software.','SGUI is configured for public npm distribution as commercial software.')
patch=[]; entries=[]
for p,new in docs.items():
 old=(root/p).read_text()
 if old==new:continue
 target=out/'proposed-files'/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(new)
 patch.extend(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+p,tofile='b/'+p))
 entries.append({'path':p,'baseSha256':hashlib.sha256(old.encode()).hexdigest(),'proposedSha256':hashlib.sha256(new.encode()).hexdigest()})
(out/'current-guidance.patch').write_text(''.join(patch));(out/'patch-inputs.json').write_text(json.dumps({'files':entries,'skippedPriorReplacements':skipped},indent=2)+'\n')
print(json.dumps({'documents':len(entries),'skippedPriorReplacements':skipped},indent=2))
