import pathlib,difflib,json,hashlib
root=pathlib.Path.cwd(); out=root/'docs/developer/final-acceptance/wave-02-13'; patches=[]; edits=[]
def propose(path,replacements):
 old=(root/path).read_text(); new=old
 for before,after in replacements:
  assert before in new,(path,before)
  new=new.replace(before,after,1)
 if old==new:return
 patches.extend(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+path,tofile='b/'+path))
 edits.append({'path':path,'baseSha256':hashlib.sha256(old.encode()).hexdigest(),'proposedSha256':hashlib.sha256(new.encode()).hexdigest(),'replacements':[{'before':a,'after':b} for a,b in replacements]})
propose('docs/developer/react-aria-component-recipe.md',[
('7. **Demonstrate changed behavior.** Colocate stories using production Provider and\n   representative local data/host adapters. Cover the changed state/interaction and\n   compositional behavior; do not fork tokens or depend on host APIs/authentication.', '7. **Demonstrate changed behavior.** Update ordinary React examples in\n   `apps/docs/examples` with independent shared Example panels, meaningful prop\n   playgrounds and current copyable public-package source. Use production scopes\n   and representative local data/host adapters. Preserve native scenarios in\n   `apps/docs/native-fixtures`; source-context unit fixtures stay colocated.\n   Do not restore Storybook or fork tokens or depend on host APIs/authentication.'),
('8. **Test observable behavior.** Add colocated tests for keyboard/pointer actions,','8. **Test observable behavior.** During the functionality baseline, reuse existing\n   coverage and add only 1–3 meaningful smoke cases per component; track expanded\n   regression and hardening separately. As the assigned phase requires, test keyboard/pointer actions,')])
propose('docs/agent-guidance-migration.md',[
('Keep stories updated in the same change.','Update docs-owned examples/native fixtures in the same change; preserve historical story evidence.'),
('Retain public exports, colocated stories, production scopes and host independence;','Retain public exports, ordinary docs examples and native fixtures, production scopes and host independence;'),
('story theme uses production scopes','example and native-fixture themes use production scopes')])
propose('docs/developer/component-architecture.md',[('pre-production migration into `codex/dev`','pre-production migration into `dev`')])
propose('docs/github-setup.md',[
('`pnpm build-storybook`','`pnpm build:browser-docs`'),
('| `sgui-storybook-node-22.12.0`, `sgui-storybook-node-24` | Built static Storybook after successful checks |','| `sgui-browser-docs-node-22.12.0`, `sgui-browser-docs-node-24` | Built static docs-owned native fixtures after successful checks |'),
('`pnpm build-storybook`','`pnpm build:browser-docs`'),
('../release.config.mjs','../packages/ui/release.config.mjs')])
propose('docs/troubleshooting/validation.md',[
('`pnpm build-storybook`','`pnpm build:browser-docs`'),
('starts the static Storybook server','starts the static docs-owned native fixture server'),
('it does not build Storybook.','it does not build the fixtures.'),
('`pnpm build-storybook`','`pnpm build:browser-docs`'),
('Never rebuild Storybook during a suite run.','Never rebuild the fixture output during a suite run.'),
('Package and Storybook artifacts upload after success.','Package and native-fixture artifacts upload after success.')])
propose('docs/developer/react-aria-runtime-ci.md',[
('`pnpm build-storybook`','`pnpm build:browser-docs`'),
('| `sgui-storybook-node-22.12.0`, `sgui-storybook-node-24` | Static Storybook output | All validation steps pass |','| `sgui-browser-docs-node-22.12.0`, `sgui-browser-docs-node-24` | Static docs-owned native fixture output | All validation steps pass |')])
propose('docs/developer/react-aria-dependency-upgrades.md',[
('Vite, Storybook, Playwright/axe','Vite, Next.js documentation tooling, Playwright/axe'),
('Update affected stories and','Update affected docs examples/native fixtures and'),
('pre-production `codex/dev` migration','pre-production `dev` migration')])
propose('docs/troubleshooting/firefox-profile-launch.md',[
('diagnostic does not need Storybook, a server, or a full test suite:','diagnostic does not need a fixture build, a server, or a full test suite.\nRun this direct library script from `packages/ui`:')])
propose('docs/developer/react-aria-license-inventory.md',[
('From a repository with an already installed frozen-lockfile dependency tree:','From `packages/ui` in a repository with an already installed frozen-lockfile dependency tree:')])
(out/'proposed-doc-corrections.patch').write_text(''.join(patches));(out/'proposed-doc-corrections.json').write_text(json.dumps(edits,indent=2)+'\n');print(f'Prepared {len(edits)} document corrections; none applied.')
