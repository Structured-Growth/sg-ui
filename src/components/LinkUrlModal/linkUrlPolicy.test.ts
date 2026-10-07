import { describe, expect, it } from "vitest";
import { normalizeLinkUrl, type LinkProtocol } from "./linkUrlPolicy";

describe("shared editor destination policy", () => {
  it.each(["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,unsafe", "blob:https://example.org/id", "file:///tmp/guide", "sms:123", "//example.org", "\\\\example.org", "java\nscript:alert(1)", "https:\\example.org", "https://", "https:guide", "mailto:", "tel:", "\u0000https://example.org", "https://example.org/\u007f"])("rejects %s", value => {
    expect(normalizeLinkUrl(value)).toBeNull();
  });
  it.each(["/guide", "../guide", "guide/lesson", "?view=course", "#section", "https://example.org", "HTTP://example.org", "mailto:teacher@example.org", "tel:+15551234567"])("keeps allowed destination %s", value => {
    expect(normalizeLinkUrl(value)).toBe(value);
  });
  it("normalizes www destinations while respecting host restrictions", () => {
    expect(normalizeLinkUrl("www.example.org/guide")).toBe("https://www.example.org/guide");
    expect(normalizeLinkUrl("www.example.org", ["http"])).toBeNull();
    expect(normalizeLinkUrl("/guide", ["https"], false)).toBeNull();
    expect(normalizeLinkUrl("mailto:teacher@example.org", ["https"])).toBeNull();
    expect(normalizeLinkUrl("javascript:alert(1)", ["javascript" as LinkProtocol])).toBeNull();
  });
});
