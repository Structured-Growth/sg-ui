# Main protection proposal

The [API payload](main-protection-proposal.json) is prepared for owner review.
It is not applied. The [read-only observations](github-control-observations-2026-10-21.json)
show no protection on main/dev and no repository or inherited rulesets.
Those observations do not establish why the owner could not configure protection.

The proposal requires one approving reviewer, a new approval after the last push,
dismissal of stale approvals, resolved conversations, an up-to-date branch and all
six actual CI job contexts, pinned to GitHub Actions app ID 15368 observed on
commit `2b611c2e689e598856f605ce03c429218cf2238e`. It applies to administrators and disallows force pushes
and deletion. It grants no bypass or automatic merge and does not authorize a
production promotion, tag or publication. The owner must confirm that a distinct
human reviewer is available; self-approval cannot satisfy this policy.

Do not apply this main payload to dev: automatic full CI is deliberately paused
for dev PRs, so requiring those contexts there would leave ordinary development
blocked. A separate dev enforcement design would need the corresponding CI route.

A-R-27 remains open until the owner approves enforcement/bypass policy, the
settings are applied through authorized repository access, and a genuine failed
or missing-check PR is observed blocked. Do not push main or create a release as
a test. This proposal is concrete review material, not evidence of enforcement.
