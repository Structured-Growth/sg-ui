from pathlib import Path
import difflib,json,hashlib,subprocess
root=Path.cwd(); own=root/'docs/developer/final-acceptance/wave-03-37'; mirror=own/'proposed-files'
original={}
def save(path,text):
 p=root/path; original[path]=p.read_text() if p.exists() else ''
 target=mirror/path; target.parent.mkdir(parents=True,exist_ok=True); target.write_text(text)
ai=(root/'.github/workflows/ai-code.yml').read_text()
ai=ai.replace("if: github.ref == 'refs/heads/main'", "if: github.ref == 'refs/heads/dev'")
ai=ai.replace('          persist-credentials: false','          ref: ${{ github.sha }}\n          persist-credentials: false')
ai=ai.replace('changed-state docs examples.', 'changed-state docs playground/reference examples, source-context unit fixtures and docs-owned native scenarios. Each live docs panel owns its state and copyable source.')
ai=ai.replace('Run pnpm check and pnpm build:browser-docs;', 'Run pnpm check and pnpm build:browser-docs;')
start=ai.index('  propose:\n'); apply=ai.index('    steps:\n',start)
ai=ai[:start]+'''  validate-proposal:
    needs: implement
    runs-on: ubuntu-latest
    timeout-minutes: 30
    # Generated code executes only in a fresh read-only job without API/PR secrets.
    permissions:
      contents: read
'''+ai[apply:]
cut=ai.index('      - uses: peter-evans/create-pull-request@v7')
ai=ai[:cut]+'''      - name: Assemble validated proposal data
        run: |
          mkdir -p "$RUNNER_TEMP/sgui-reviewed"
          cp /tmp/sgui-proposal/sgui.patch "$RUNNER_TEMP/sgui-reviewed/sgui.patch"
          cp "$RUNNER_TEMP/sgui-pr-body" "$RUNNER_TEMP/sgui-reviewed/sgui-pr-body"
          cp "$RUNNER_TEMP/sgui-pr-title" "$RUNNER_TEMP/sgui-reviewed/sgui-pr-title"
      - uses: actions/upload-artifact@v4
        with:
          name: ai-reviewed-proposal
          retention-days: 14
          if-no-files-found: error
          path: ${{ runner.temp }}/sgui-reviewed/
  propose:
    needs: validate-proposal
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: write
      pull-requests: write
    outputs:
      head: ${{ steps.draft.outputs.pull-request-head-sha }}
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.sha }}
          persist-credentials: false
      - uses: actions/download-artifact@v4
        with:
          name: ai-reviewed-proposal
          path: /tmp/sgui-proposal
      - uses: actions/download-artifact@v4
        with:
          name: ai-proposal
          path: /tmp/sgui-original
      # The original artifact is immutable across jobs. Generated tests may have
      # modified files in their validation runner; never publish a replacement patch.
      - name: Verify original patch identity
        run: |
          node --input-type=module <<'JS'
          import { readFileSync } from 'node:fs';
          import { createHash } from 'node:crypto';
          const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');
          if (digest('/tmp/sgui-original/sgui.patch') !== digest('/tmp/sgui-proposal/sgui.patch')) throw new Error('Validation artifact changed proposal bytes');
          JS
      # Only trusted inline code and actions execute here. Never install dependencies,
      # invoke package scripts, source files, hooks or executables from the patch.
      - name: Apply validated data and read title
        id: metadata
        run: |
          git apply --check /tmp/sgui-proposal/sgui.patch
          git apply /tmp/sgui-proposal/sgui.patch
          node --input-type=module <<'JS'
          import { readFileSync, appendFileSync } from 'node:fs';
          const title = readFileSync('/tmp/sgui-proposal/sgui-pr-title', 'utf8').trim();
          if (!title || /[\\r\\n]/.test(title)) throw new Error('Invalid single-line title');
          appendFileSync(process.env.GITHUB_OUTPUT, `title=${title}\\n`);
          JS
      - uses: peter-evans/create-pull-request@v7
        id: draft
        with:
          token: ${{ github.token }}
          base: dev
          branch: codex/ai-sgui-${{ github.run_id }}
          commit-message: ${{ steps.metadata.outputs.title }}
          title: ${{ steps.metadata.outputs.title }}
          body-path: /tmp/sgui-proposal/sgui-pr-body
          draft: true
      - name: Require a resulting draft head
        env:
          PROPOSAL_HEAD: ${{ steps.draft.outputs.pull-request-head-sha }}
          PROPOSAL_NUMBER: ${{ steps.draft.outputs.pull-request-number }}
        run: |
          node --input-type=module <<'JS'
          if (!/^[0-9a-f]{40}$/.test(process.env.PROPOSAL_HEAD ?? '') || !/^[1-9][0-9]*$/.test(process.env.PROPOSAL_NUMBER ?? '')) throw new Error('No resulting draft identity; full validation cannot be inferred');
          JS
  validate-draft:
    needs: propose
    permissions:
      contents: read
    # Explicit call does not depend on a default-token PR event or the dev CI pause.
    uses: ./.github/workflows/ci.yml
    with:
      ref: ${{ needs.propose.outputs.head }}
'''
save('.github/workflows/ai-code.yml',ai)
ci=(root/'.github/workflows/ci.yml').read_text().replace('  workflow_call:\n','''  workflow_call:
    inputs:
      ref:
        description: Exact proposal commit to validate; empty uses the triggering ref
        required: false
        default: ''
        type: string
''')
ci=ci.replace('      - uses: actions/checkout@v4\n','''      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.ref || github.sha }}
          persist-credentials: false
      - name: Record exact checked head
        env:
          EXPECTED_HEAD: ${{ inputs.ref || github.sha }}
        run: |
          actual=$(git rev-parse HEAD)
          test "$actual" = "$EXPECTED_HEAD"
          echo "Validated checkout: $actual" >> "$GITHUB_STEP_SUMMARY"
        working-directory: .
''')
save('.github/workflows/ci.yml',ci)
issue=(root/'.github/ISSUE_TEMPLATE/ui-change.yml').read_text().replace('Actions on main','Actions on dev').replace('/blob/main/','/blob/dev/').replace('Stories and validation evidence','Docs examples, fixtures and validation evidence').replace('Identify relevant stories/tests or reproduction links and planned checks.', 'Identify docs playground/reference examples, source-context unit fixtures, docs-owned native scenarios or reproduction links and exact behavior cases. Source/copy must match rendered props and state. Record tested head/base and patch identity, commands/results and unrun or failed checks.')
save('.github/ISSUE_TEMPLATE/ui-change.yml',issue)
pr=(root/'.github/pull_request_template.md').read_text().replace('Stories covering changed props/states and meaningful behavior/composed/browser evidence','Docs playground/reference examples and unit/native fixtures covering changed props/states, source/copy correspondence and meaningful behavior evidence').replace('Validation commands/results and head/run/artifact links; unverified behavior','Validation commands/results, exact head/base and patch identity, run/artifact links; failed/unrun checks and unverified behavior')
save('.github/pull_request_template.md',pr)
test=(root/'packages/ui/scripts/ai-component-scope.test.mjs').read_text().replace('src/components/Button/Button.test.tsx: keyboard activation; story: disabled state.', 'packages/ui/src/components/Button/Button.test.tsx: keyboard activation; apps/docs/examples/catalog/ButtonExamples.tsx: disabled state.')
test=test.replace("changed-state docs examples", "changed-state docs playground/reference examples")
test=test.replace("body-path: ${{ runner.temp }}/sgui-pr-body", "body-path: /tmp/sgui-proposal/sgui-pr-body")
test+='''\n// These are configuration regressions, not live permission-isolation proof.
test('generated validation is separate from write credentials and draft head calls full CI explicitly', () => {
  const validation = workflow.split('  validate-proposal:\\n')[1].split('  propose:\\n')[0];
  assert.ok(validation.includes('contents: read'));
  assert.ok(validation.includes('      - run: pnpm check'));
  assert.ok(!validation.includes('${{ secrets.') && !validation.includes('contents: write'));
  const proposal = workflow.split('  propose:\\n')[1].split('  validate-draft:\\n')[0];
  assert.ok(proposal.includes('contents: write') && proposal.includes('pull-requests: write'));
  for (const forbidden of ['pnpm ', 'npm ', 'secrets.', 'scripts/', 'auto-merge']) assert.ok(!proposal.includes(forbidden), forbidden);
  for (const required of ['token: ${{ github.token }}', 'base: dev', 'draft: true', 'persist-credentials: false', 'Require a resulting draft head']) assert.ok(proposal.includes(required), required);
  const full = workflow.split('  validate-draft:\\n')[1];
  assert.ok(full.includes('uses: ./.github/workflows/ci.yml'));
  assert.ok(full.includes('ref: ${{ needs.propose.outputs.head }}'));
  assert.ok(full.includes('contents: read'));
  assert.ok(!full.includes('secrets: inherit'));
});
'''
test=test.replace("['/tmp/sgui-proposal/sgui.patch', patch]", "['/tmp/sgui-proposal/sgui.patch', patch], ['/tmp/sgui-original/sgui.patch', 'inert patch']")
test+='''
test('write job rejects patch bytes replaced during generated validation', () => {
  fixture('Verify original patch identity');
  assert.throws(() => fixture('Verify original patch identity', { patch: 'replaced patch' }), /changed proposal bytes/);
});
test('missing draft identity fails before the full CI call', () => {
  assert.throws(() => fixture('Require a resulting draft head'), /No resulting draft identity/);
});
'''
save('packages/ui/scripts/ai-component-scope.test.mjs',test)
# Stable source-context identity: snapshot only selected files; never central manifests/output.
inputs={p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in original}
for p in ['AGENTS.md','docs/developer/react-aria-final-acceptance.md','docs/developer/final-acceptance/wave-02-12/report.md','docs/developer/final-acceptance/wave-02-12/results.json','docs/developer/final-acceptance/coordinator-integration/evidence.json','.github/workflows/release.yml','.github/workflows/pr-title.yml','package.json','packages/ui/playwright.config.ts']:
 inputs[p]=hashlib.sha256((root/p).read_bytes()).hexdigest()
prior=json.loads((root/'docs/developer/final-acceptance/wave-02-12/evidence.json').read_text())
(own/'input-receipt.json').write_text(json.dumps({'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'runtime':subprocess.check_output(['node','--version'],text=True).strip(),'sha256':inputs,'priorEvidenceKeys':list(prior)},indent=2)+'\n')
