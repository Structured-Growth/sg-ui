"""Fail-closed completion predicate for coordinator reconciliation, not ledger mutation."""
def migration_complete(*, required_a, required_editor_v, commitment_review_complete,
                       dependency_feature_pr_record_complete, production_evidence_complete,
                       legal_owner_gates_complete, human_release_approval):
    # Empty or omitted evidence must never become vacuous all([]) success.
    return bool(required_a and required_editor_v
                and all(x == 'complete' for x in required_a.values())
                and all(x == 'complete' for x in required_editor_v.values())
                and commitment_review_complete and dependency_feature_pr_record_complete
                and production_evidence_complete and legal_owner_gates_complete
                and human_release_approval)
