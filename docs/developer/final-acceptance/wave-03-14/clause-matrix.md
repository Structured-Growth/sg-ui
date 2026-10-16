# AppModal / overlay clause matrix

All rows retain the prior report's dated host/head limits. “Candidate” means
unapplied and unexecuted. F-C08/T-C08/V-C08 links are in
[wave-02-01 A-M-08](../wave-02-01/report.md#a-m-08--partial) and
[modal/shell contracts](../../react-aria-modal-shells.md).

| Original clause | Retained concrete assertions | New candidate / remaining evidence |
| --- | --- | --- |
| Owned sizes/parts/styles | AppModal.test.tsx: native ref/style, slot boundary, width/height override, full ignores heightMode | ContractMatrix:24 size×heightMode pairs plus540×440 custom override; each checks first focus, draft preservation, last-field→footer native Tab, containment at1280/360px. Last-field placement uses focus(), so not a claim of traversing every intermediate field. |
| HeightMode auto/sm/md/lg | AppModal implementation resolves auto/56/68/80dvh; full uses viewport CSS | Candidate compares literal requested height and surface bounds for all pairs. Native whole-content reachability remains required. |
| Initial/return focus, three overlay levels | batch01-dialogs.spec.ts first case: parent→child→guidance, Tab/Shift+Tab, Escape→each opener | Candidate combined dialog/menu/tooltip/editor and repeated child open/close. Retain batch52 removed/surviving opener suite and two-frame successful host placement assertions. |
| Dismissal reasons/locks | AppModal.test.tsx: Escape/outside/close-button; independent locks; pending/disabled native actions | No implementation change; preserve existing assertions, no extra ornamental status readouts. |
| Sticky tabs and whole-dialog fallback | modal-container-boundary.spec.ts:20 native field stops, sticky tab geometry, scrolling panel and outer fallback at200% root text; inventory-modal-boundaries.spec.ts md/lg custom chrome | Recover missing raw receipts or execute only unmatched coordinator-admitted cases. CSS text enlargement is not browser chrome zoom. |
| Actions and steps | AppModal.test.tsx: total1 hides steps, total>=2 shows owned translated label; actions form-safe and pending; next100 separate hosts | Existing assertions retained unchanged. |
| Document locking/background modality | Dialog delegates ModalOverlay; batch01 traps native focus in child | Candidate proves document really scrolls before/after, wheel is blocked at both nested levels, lock retained after child close; Tab stays in child. Real AT virtual-cursor isolation still needs operator. |
| Shell/gutter during resize | apps/docs/tests/scrollbar-layout.spec.ts existing open/dismiss width and unlocked resize tests | Candidate resizes while native lock is active and compares same-viewport locked/unlocked geometry; no lock disabling or gutter CSS patch. |
| Layer/portal/collision scope | ThemeScope copies owned visual/locale variables; token layers1400/1410; existing Popover collision spec | Candidate records portal parent/rect/layer, menu hit targets and tooltip bounds through1100↔360 resize and light↔dark/dir/lang/density changes. Real browser zoom and remaining date/select families still outstanding. |
| Spoken announcements | Prior A-M-08 explicitly remains partial | operator-cases.md supplies exact unexecuted procedure; native/DOM focus cannot close speech acceptance. |
