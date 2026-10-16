# Fix 08 — BUG-0010 / K04 DatePicker entry parity

Implemented K04-datepicker-entry-parity for A-K-04/A-K-07 on shared uncommitted `dev`, HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`. Source is stable for coordinator validation. This report closes the reproduced implementation defect and focused unit regression only; it does not close the broader acceptance leaves.

Read AGENTS.md, README.md, docs/migration.md, docs/developer/component-architecture.md, react-aria-final-acceptance.md and wave-02-11 report plus exact acceptance.test.tsx. The K04 probe deliberately asserted the old bad behavior (accepted callback, valid native input and forbidden submitted value); it is retained unchanged as historical characterization, not rerun or claimed passing acceptance after this fix. Its equivalent positive regression now lives in DatePicker.test.tsx.

## Change

DatePicker resolves static unavailable records and getDateUnavailableReason using the same Gregorian date and `{range:null, endpoint:null}` context as Calendar. An empty static reason still restricts its date, with the existing translated invalid-date fallback. A private DateFieldValidationContext carries the policy to text and segmented fields; no public prop was added.

Text drafts validate availability alongside parsing/bounds before commit, native custom validity and onValidityChange. Invalid text remains editable and unnormalized; visible feedback remains deferred until Enter, blur or native validation and clears during correction. Named hidden values retain the accepted selection rather than forbidden drafts; a host selection that itself becomes unavailable serializes empty and blocks validity. Controlled hosts retain authority over accepted requests.

Segments retain a private rejected draft so the candidate remains editable and native validation fails without accepting a callback. Their named native input continues to serialize the accepted host/uncontrolled value, never the rejected candidate. Host value replacement and native reset discard the rejected draft. Segmented date/datetime fields now report their realtime validity through the existing onValidityChange callback, so an outer host Apply can guard submission.

Datetime popup Apply uses the same availability resolver along with existing complete-time/local-datetime/bounds checks. Availability, disabled and readOnly updates while open block commits; the central change boundary also guards current host rules and availability. Cancel remains available. Calendar source and tests belong to the other worker and were not edited.

## Focused evidence

Working directory: `packages/ui`. Runtime: Node **v24.21.0**, Vitest **4.1.11**, jsdom. Exact final command:

```sh
PATH=/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin:$PATH pnpm exec vitest run src/experimental/DatePicker/DatePicker.test.tsx src/experimental/DateField/DateField.test.tsx src/experimental/DateField/TextDateField.test.tsx
```

Final result, exit 0:

```text
 RUN  v4.1.11 /Users/thomashall/Repositories/sg-ui/packages/ui
 Test Files  3 passed (3)
      Tests  37 passed (37)
   Start at  17:48:39
   Duration  2.11s (transform 309ms, setup 34ms, import 806ms, tests 3.13s, environment 455ms)
```

The three affected suites originally passed 28 existing cases after plumbing changes; after the first six added regressions they passed 34 cases. The final nine new cases cover callback/array text restrictions, deferred feedback/live invalidity, native submit blocking, accepted hidden values, controlled rejecting hosts and changed host policies, segmented date/datetime drafts and recovery, controlled segment replacement, dynamic datetime Apply restrictions (including empty static reason), disabled/readOnly changes and host Apply driven by validity. No assertions were removed. A root-directory invocation immediately failed with `Command "vitest" not found` (exit 254); rerunning the identical scoped command from the required library workspace produced the final passing evidence above. No suite ran in the failed invocation. `git diff --check` on tracked changed source/tests passed.

No shared build, broad/consumer/browser suite, dependency install, server, agent/thread/message, staging, commit, push, reset, clean, worktree, version or release action was performed. Existing unrelated dirty files were left alone. DateField.test.tsx and TextDateField.test.tsx were run but not changed; their hashes below identify affected regression inputs.

## Limits and follow-ups

Coordinator owns fresh library/fixture builds, public typechecking, affected docs/native acceptance and any public contract guidance updates. Existing onValidityChange documentation now correctly describes entry validity rather than text-only validity; no new public API needs documentation. Coordinator should retain the K04 native form probe with assertions inverted to forbid callbacks/forbidden hidden values, and exercise Enter/blur, segment correction, dynamic availability and datetime Apply under the replacement browser host. Native browser/AT/device acceptance and full A-K-04/A-K-07 obligations remain separate. Old compiled output is not evidence for these changed sources. No attempt was made to resolve other calendar-family defects or acceptance leaves.

## SHA-256 inputs at handoff

- `packages/ui/src/experimental/DatePicker/DatePicker.tsx`: `cc1cc4fd1264b16c391f04f34bdfdb5b2d409ba899a022fc83eaa2ad9d7d1dc3`
- `packages/ui/src/experimental/DatePicker/DatePicker.test.tsx`: `8904345f870d5ae9dd7f857cfc8cab94bdf2ce63b46c0f29714478701a50ad7d`
- `packages/ui/src/experimental/DateField/DateField.tsx`: `431d304e602b45a9a8d036de607984bcdaca2023868bb8734974a31955e2c9da`
- `packages/ui/src/experimental/DateField/TextDateField.tsx`: `b652b635363dd8f79a7a97088d988a3f683d3a223a6c34ee7bfd4163a621916a`
- `packages/ui/src/experimental/DateField/DateFieldControl.tsx`: `fe95d976fdace22b54fed78bc1fab190f45b540a08ee63518dbfea0dd1323e9d`
- `packages/ui/src/experimental/DateField/DateField.test.tsx`: `085a51de13288c1cbdf529691820a8c55bb2a1cb34ce9b9632d42054af191583` (unchanged affected suite)
- `packages/ui/src/experimental/DateField/TextDateField.test.tsx`: `39f400ecd36969fc87aa0c1e117a16bf5387ad29b03677d760cb0cef467e8848` (unchanged affected suite)
