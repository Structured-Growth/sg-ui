# Changed behavior and retained native evidence — A-X-13

This delta map covers the coordinator's BUG0008–0012 integration, not every historical library behavior. `input-evidence.json` compares all 112 supplied inputs and all built/fixture outputs: no differences. Thus the coordinator's exact bounded receipts can be retained. Its manifest is a sequential dirty-checkout snapshot, not a clean commit or proof that all transitive inputs were enumerated.

| Changed contract | Existing assertion / receipt | Attribution |
| --- | --- | --- |
| PeriodPicker late disabled/read-only policy blocks draft Apply/Clear, permits Cancel, preserves committed display | `apps/docs/tests/acceptance-picker-field-fixes.spec.ts:6`, period-picker case | Retain coordinator browsers-full 3-engine case; host-policy update inside trapped overlay is programmatic input click, not trusted user pointer through overlay |
| DateTimeRangePicker same late policy + availability changes | same spec line 6, datetime case; enriched datetime receipt | Retain enriched Chromium + Firefox/WebKit runs, replacing original datetime slice. First policy checkbox change visible click; second open-popup host update programmatic. 21 distinct executions overall, not 24 |
| DateRangeComparisonPicker same late policy | same spec line 6, comparison case | Retain original unaffected three-engine slice |
| TextArea start/end/both/no icon multiline geometry, RTL, click focus, source and sibling state | same spec line 31 | Retain unaffected three-engine slice; DOM direction change is a deliberate test setup |
| DatePicker text availability preserves committed FormData and blocks invalid submit | `apps/docs/tests/date-picker-availability-parity.spec.ts:5`, text case | Retain three-engine receipt; text input uses fill, submission uses visible Save appointment |
| DatePicker segmented/date-time availability | same spec line 5, segments and datetime cases | Retain enriched datetime slice plus unchanged segments slice; no speech/physical keyboard certification |
| Grid reserved utility IDs | fix-10 results + fresh package/type checks in coordinator manifest | Unit/typing evidence retained; no new native collision acceptance inferred |
| Calendar documentation honesty | fix-11 results and supplemental-reconciliation | Documentation evidence; no invented runtime obligation |
| Missing native grid entry without programmatic body focus | new `grid-native-entry.spec.ts` | Prepared and discovered in 3 projects only; unexecuted. No focus()/dispatchEvent within grid; trusted Tab from clicked Host action |

Retained transcripts: `../coordinator-integration/browsers-full.txt`, `datetime-chromium.txt`, `datetime-firefox-webkit.txt`, their named JSON and evidence manifest. Original driver/type failure transcripts remain preserved there. The earlier broad coverage inventory is retained from wave-02-09/10; expanded editor V evidence belongs to its existing owners. A frozen complete changed-contract inventory and receipt reconciliation is still required before broad X-13 closure.
