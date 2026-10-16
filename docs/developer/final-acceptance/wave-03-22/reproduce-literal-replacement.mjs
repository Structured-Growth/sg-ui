import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const { formatIcuMessage } = await import(resolve(repo, "packages/ui/src/i18n/icu.ts"));
const source = readFileSync(resolve(repo, "packages/ui/src/components/InstructorClassCard/InstructorClassCard.tsx"), "utf8");
assert(source.includes('.replace("{value}", resolvedLastLearnerActivityLabel)'));
const label = "Draft {value} $& $$ $` $' <review>";
const formatted = formatIcuMessage("Last Learner Activity: {value}", "en-US", { value: label });
const before = formatted.replace("{value}", label);
assert.equal(formatted, `Last Learner Activity: ${label}`);
assert.notEqual(before, formatted);
console.log(JSON.stringify({ runtime: process.version, expected: formatted, actualBefore: before,
  result: "Confirmed: post-format replacement corrupts literal host content; formatter output is already final." }, null, 2));
