import { describe, expect, it } from "vitest";
import { extractIcuVariables, formatIcuMessage, validateIcuVariables } from "./icu";

const selection = "{count, plural, =0 {No rows selected} one {# row selected} other {# rows selected}}";

describe("owned ICU fallback", () => {
  it.each([[0, "No rows selected"], [1, "1 row selected"], [2, "2 rows selected"], [1234, "1,234 rows selected"]])("formats selection count %s", (count, expected) => {
    expect(formatIcuMessage(selection, "en-US", { count })).toBe(expected);
  });
  it("uses locale plural categories and number formatting", () => {
    const message = "{n, plural, zero {zero} one {one} two {two} few {few #} many {many #} other {other #}}";
    expect(formatIcuMessage(message, "ar-EG", { n: 0 })).toBe("zero");
    expect(formatIcuMessage(message, "ar-EG", { n: 2 })).toBe("two");
    expect(formatIcuMessage(message, "ar-EG", { n: 3 })).toBe(`few ${new Intl.NumberFormat("ar-EG").format(3)}`);
    expect(formatIcuMessage(message, "ar-EG", { n: 11 })).toBe(`many ${new Intl.NumberFormat("ar-EG").format(11)}`);
    expect(formatIcuMessage(selection, "fr-FR", { count: 0.5 })).toBe("0,5 row selected");
  });
  it("selects exact values before offset categories and subtracts offset for pound", () => {
    const message = "{n, plural, offset:1 =0 {Nobody} =1 {Only {name}} one {{name} and one other} other {{name} and # others}}";
    expect(formatIcuMessage(message, "en-US", { n: 1, name: "Ada" })).toBe("Only Ada");
    expect(formatIcuMessage(message, "en-US", { n: 2, name: "Ada" })).toBe("Ada and one other");
    expect(formatIcuMessage(message, "en-US", { n: 4, name: "Ada" })).toBe("Ada and 3 others");
    expect(formatIcuMessage("{n, plural, =1.0 {exact} other {other}}", "en-US", { n: 1 })).toBe("exact");
  });
  it.each([[1, "1st"], [2, "2nd"], [3, "3rd"], [11, "11th"], [21, "21st"]])("formats ordinal %s", (n, expected) => {
    expect(formatIcuMessage("{n, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}", "en-US", { n })).toBe(expected);
  });
  it("renders nested selects/plurals with the innermost count", () => {
    const message = "{kind, select, course {{n, plural, one {{name}: # course} other {{name}: # courses}}} other {Unknown}}";
    expect(formatIcuMessage(message, "en-US", { kind: "course", n: 2, name: "Ada" })).toBe("Ada: 2 courses");
    expect(formatIcuMessage(message, "en-US", { kind: "unknown" })).toBe("Unknown");
    expect(formatIcuMessage("{n, plural, other {# {kind, select, yes {#} other {no}} {m, plural, other {#}} #}}", "en-US", { n: 5, m: 3, kind: "yes" })).toBe("5 5 3 5");
  });
  it("supports ICU apostrophes and literal syntax without extracting quoted arguments", () => {
    const message = "Don't change '{hidden}' and ''{name}'' {n, plural, other {'#' #}}";
    expect(formatIcuMessage(message, "en-US", { name: "Ada", n: 2 })).toBe("Don't change {hidden} and 'Ada' # 2");
    expect(extractIcuVariables(message)).toEqual(["n", "name"]);
    expect(formatIcuMessage("'#'", "en-US", {})).toBe("'#'");
  });
  it("preserves scalar interpolation, null/undefined and dotted variable names", () => {
    expect(formatIcuMessage("{user.name}: {enabled}, {zero}, {missing}, {nil}", "en-US", { "user.name": "Ada", enabled: false, zero: 0, nil: null })).toBe("Ada: false, 0, , ");
    expect(formatIcuMessage("{name}", "en-US")).toBe("{name}");
    expect(formatIcuMessage("{name}", "en-US", { name: "<script>" })).toBe("<script>");
  });
  it("formats numbers, dates and times using Intl without imposing time zones", () => {
    const date = new Date("2026-10-07T12:34:00Z");
    expect(formatIcuMessage("{n, number}", "de-DE", { n: 1234.5 })).toBe(new Intl.NumberFormat("de-DE").format(1234.5));
    expect(formatIcuMessage("{d, date} {d, time}", "fr-FR", { d: date })).toBe(`${new Intl.DateTimeFormat("fr-FR").format(date)} ${new Intl.DateTimeFormat("fr-FR", { hour: "numeric", minute: "2-digit" }).format(date)}`);
    expect(formatIcuMessage("{d, date}", "en-US", { d: "not-a-date" })).toBe("not-a-date");
  });
  it.each(["bad_locale", "zz-ZZ", ""])("falls back to en-US for invalid/unsupported locale %s", locale => {
    expect(formatIcuMessage(selection, locale, { count: 1234 })).toBe("1,234 rows selected");
  });
  it.each([
    "Before {n, plural, one {one}}", "{n, plural, other {open}", "{n, plural, other {a} other {b}}",
    "{n, number, currency}", "{n, unknown}", "Before {name} }", "{n, plural, offset:-1 other {#}}",
  ])("rejects malformed/unsupported messages without partial interpolation: %s", message => {
    expect(formatIcuMessage(message, "en-US", { name: "Ada", n: 2 })).toBe(message);
    expect(() => extractIcuVariables(message)).toThrow(SyntaxError);
  });
  it.each([undefined, null, "2", NaN, Infinity])("preserves the message for invalid plural input %s", n => {
    expect(formatIcuMessage(selection, "en-US", { count: n })).toBe(selection);
  });
  it("bounds nesting depth", () => {
    const message = "{n, select, other {".repeat(51) + "deep" + "}}".repeat(51);
    expect(() => extractIcuVariables(message)).toThrow(SyntaxError);
    expect(formatIcuMessage(message, "en-US", { n: "other" })).toBe(message);
  });
});

describe("catalog variable validation", () => {
  it("compares variables from all branches, ignoring order/repetition and pound", () => {
    const english = "{n, plural, one {{name}} other {{name} {count, number}}}";
    expect(extractIcuVariables(english)).toEqual(["count", "n", "name"]);
    expect(validateIcuVariables(english, "{name} {count, number} {n, plural, other {#}}" )).toEqual({ missing: [], extra: [] });
    expect(validateIcuVariables(english, "{n, plural, other {{wrong}}}" )).toEqual({ missing: ["count", "name"], extra: ["wrong"] });
  });
  it("fails invalid baseline or translation syntax explicitly at catalog validation", () => {
    expect(() => validateIcuVariables("{bad", "Fine")).toThrow(SyntaxError);
    expect(() => validateIcuVariables("Fine", "{n, plural, one {one}}")).toThrow(SyntaxError);
  });
});
