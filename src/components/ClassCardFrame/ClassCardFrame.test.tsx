import { describe, expect, it } from "vitest";
import {
  ClassCardFrame,
  STANDARD_CLASS_CARD_MIN_WIDTH,
  STANDARD_CLASS_CARD_WIDTH,
} from "./ClassCardFrame";

describe("ClassCardFrame", () => {
  it("exports standard width constants", () => {
    expect(STANDARD_CLASS_CARD_WIDTH).toBe(420);
    expect(STANDARD_CLASS_CARD_MIN_WIDTH).toBe(360);
  });

  it("renders card slots and optional footer", () => {
    const withFooter = ClassCardFrame({
      header: "header",
      body: "body",
      footer: "footer",
    }) as any;
    expect(withFooter.props.sx.maxWidth).toBe(420);
    expect(withFooter.props.children).toHaveLength(3);

    const withoutFooter = ClassCardFrame({
      header: "header",
      body: "body",
    }) as any;
    expect(withoutFooter.props.children[2]).toBeNull();
  });

  it("supports custom width and sx arrays for each section", () => {
    const element = ClassCardFrame({
      header: "header",
      body: "body",
      footer: "footer",
      width: 500,
      headerSx: [{ borderColor: "primary.main" }] as any,
      bodySx: { mt: 2 } as any,
      footerSx: [{ mb: 1 }] as any,
    }) as any;
    expect(element.props.sx.maxWidth).toBe(500);

    const [header, body, footer] = element.props.children as any[];
    expect(Array.isArray(header.props.sx)).toBe(true);
    expect(Array.isArray(body.props.sx)).toBe(true);
    expect(Array.isArray(footer.props.sx)).toBe(true);
  });

  it("accepts body sx as an array", () => {
    const element = ClassCardFrame({
      header: "header",
      body: "body",
      bodySx: [{ mt: 1 }, { mb: 1 }] as any,
    }) as any;
    const body = element.props.children[1];
    expect(body.props.sx).toHaveLength(3);
  });
});
