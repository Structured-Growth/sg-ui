Describe the consumer-visible change, the concrete trigger and why it is needed.
For guidance-only changes, describe the corrected claim and its source.

- Task IDs (when applicable), bounded scope and acceptance criteria:
- Owned API/native ref and styling contract (tokens, CSS, `/styles.css`, Provider/ThemeScope), or N/A:
- Host boundary (data, routing, translations, account actions, persistence/uploads), or N/A:
- Stories covering changed props/states and meaningful behavior/composed/browser evidence, or N/A with reason:
- Validation commands/results and head/run/artifact links; unverified behavior:
- Remaining backlog/acceptance gates and follow-up owner (do not claim broad completion from a bounded slice):
- Conventional Commit title and release impact; breaking mappings/migration steps:

During pre-production `codex/dev` work, use targeted tests and relevant guards,
browser/build/consumer checks for the changed behavior. Full runs occur at occasional
coordinator checkpoints, not for each task or dev integration. Documentation-only
work checks links/anchors, paths, examples and template structure. Record exact
commands, tested head and limitations. Automatic GitHub CI/title checks for
`codex/dev` PRs are paused; production/main validation remains complete.
See [development validation policy](../docs/developer/react-aria-development-validation.md)
and [setup guidance](../docs/github-setup.md).

AI-generated changes remain draft PRs for review. Record actual CI evidence;
the AI proposal summary alone does not establish browser/packed-consumer validation.
Squash-merge using the validated title, preserving `!` or the `BREAKING CHANGE:`
footer in the commit body. Do not publish locally, edit versions or add changesets.
