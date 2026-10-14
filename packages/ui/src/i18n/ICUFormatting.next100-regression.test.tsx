import { describe, expect, it } from "vitest";
import { extractIcuVariables, formatIcuMessage, validateIcuVariables, type MessageValues } from ".";

describe("public ICU formatting regression", () => {
  it("repeats deterministic results after intervening locale/value calls without retaining caller state", () => {
    const message = "{kind, select, course {{n, plural, one {{name}: # course} other {{name}: # courses}}} other {Unknown}}";
    const values: MessageValues = Object.freeze({ kind: "course", n: 1234, name: "Ada" });
    expect(formatIcuMessage(message, "en-US", values)).toBe("Ada: 1,234 courses");
    const variables = extractIcuVariables(message);
    variables.push("caller-only");
    const mismatch = validateIcuVariables(message, "{name} {wrong}");
    expect(mismatch).toEqual({ missing: ["kind", "n"], extra: ["wrong"] });
    mismatch.missing.push("caller-only");

    expect(formatIcuMessage(message, "ar-EG", { kind: "unknown", n: 0 })).toBe("Unknown");
    expect(formatIcuMessage("{n, number}", "de-DE", { n: 1234 })).toBe("1.234");
    expect(formatIcuMessage(message, "en-US", values)).toBe("Ada: 1,234 courses");
    expect(extractIcuVariables(message)).toEqual(["kind", "n", "name"]);
    expect(validateIcuVariables(message, "{name} {wrong}")).toEqual({ missing: ["kind", "n"], extra: ["wrong"] });
    expect(values).toEqual({ kind: "course", n: 1234, name: "Ada" });
  });
});
