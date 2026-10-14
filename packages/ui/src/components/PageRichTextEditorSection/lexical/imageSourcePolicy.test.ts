import { describe, expect, it } from "vitest";
import { isAllowedImageSource } from "./imageSourcePolicy";

describe("editor image source policy", () => {
  it.each([
    "https://cdn.example.com/cover.png?signature=a%2Bb", "http://localhost/image.webp", "HTTPS://example.com/image",
    "/assets/cover.png", "./cover.png", "../cover.png", "assets/course%20cover.png", "?image=cover", "#cover",
    "blob:https://example.com/5c402da0", "blob:null/5c402da0",
    "data:image/png;base64,aGVsbG8=", "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22/%3E",
    "data:image/svg+xml;charset=utf-8,%3Csvg/%3E", "DATA:image/avif;base64,aGVsbG8=",
  ])("accepts supported image source %s without rewriting host spelling", source => {
    expect(isAllowedImageSource(source)).toBe(true);
  });

  it.each([
    "", " https://example.com/image.png", "https://example.com/a b.png", "https://example.com/\nimage.png",
    "java\tscript:alert(1)", "javascript:alert(1)", "file:///tmp/image.png", "mailto:image@example.com",
    "ftp://example.com/image.png", "//example.com/image.png", "\\\\example.com\\image.png", "https://", "http:image.png",
    "https://[bad/image.png", "blob:", "data:text/html,%3Cscript%3E", "data:,image", "data:image/png;base64,",
    "data:image/png,", "data:image/pnggarbage", "data:image/png;invalid,aGVsbG8=", null, undefined, 42,
  ])("rejects unsupported or malformed source %s", source => {
    expect(isAllowedImageSource(source)).toBe(false);
  });
});
