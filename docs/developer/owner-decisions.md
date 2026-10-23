# Owner decisions — 2026-10-21

These instructions were supplied directly by the repository owner and supersede
earlier requests for the same decisions. They do not authorize a production
release or change third-party license obligations.

- Documentation hosting: AWS Amplify, at `https://ui.structured-growth.com`.
  Development uses `/dev/`; published snapshots use `/releases/<version>/`;
  `/latest/` follows the newest published release. Hosting account configuration
  and deployment are still required.
- First-party code: the owner created the source code and confirms all rights.
  No additional legal review is required for that first-party code. Remove
  repository-of-origin history from the working tree. Preserve current behavior,
  consumer contracts, tests and third-party license obligations.
- Performance: the agent may choose conservative representative profiles and
  budgets using measurements. No exact hardware percentile is required. A
  throttled reference is an explicitly labelled proxy, not a measured population
  percentile or physical-device certification.
- npm publication: deferred at the owner's request. The owner reports control of
  `@structure-growth`; the configured package remains `@structured-growth/sg-ui`.
  Confirm the intended spelling before future publishing setup. Do not rename
  the package or publish during this work.
- Production review: the owner wants pull-request review but reports insufficient
  GitHub permissions to enforce it. Preserve the PR policy. Do not claim technical
  branch protection from that policy or waive required production validation.
- Assistance: identify missing owner actions explicitly on each affected active
  backlog row. Continue independent implementation and validation first.
