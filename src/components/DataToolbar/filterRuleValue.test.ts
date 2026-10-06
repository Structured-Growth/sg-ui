import { describe, expect, it } from "vitest";
import { FILTER_RULE_MULTI_VALUE_DELIMITER, parseFilterRuleValues, serializeFilterRuleValues } from "./filterRuleValue";

describe("filterRuleValue", () => {
  it("serializes and parses multiple values", () => {
    const raw = serializeFilterRuleValues(["active", "draft"]);
    expect(raw).toBe(`active${FILTER_RULE_MULTI_VALUE_DELIMITER}draft`);
    expect(parseFilterRuleValues(raw)).toEqual(["active", "draft"]);
  });

  it("returns empty array for blank values", () => {
    expect(parseFilterRuleValues("   ")).toEqual([]);
  });

  it("trims each parsed value", () => {
    const raw = ` active ${FILTER_RULE_MULTI_VALUE_DELIMITER} planned `;
    expect(parseFilterRuleValues(raw)).toEqual(["active", "planned"]);
  });

  it("parses a single value without delimiter", () => {
    expect(parseFilterRuleValues(" active ")).toEqual(["active"]);
  });
});
