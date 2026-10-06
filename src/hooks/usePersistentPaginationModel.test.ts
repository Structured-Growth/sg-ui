import { describe, expect, it } from "vitest";
import { normalizePaginationModel } from "./usePersistentPaginationModel";

describe("normalizePaginationModel", () => {
  it("normalizes invalid page and page size", () => {
    expect(normalizePaginationModel({ page: -3, pageSize: Number.NaN })).toEqual({
      page: 0,
      pageSize: 25,
    });
  });

  it("clamps page size and floors page", () => {
    expect(normalizePaginationModel({ page: 2.9, pageSize: 150 })).toEqual({
      page: 2,
      pageSize: 100,
    });
  });

  it("rounds page size up to next allowed option", () => {
    expect(normalizePaginationModel({ page: 1, pageSize: 26 })).toEqual({
      page: 1,
      pageSize: 50,
    });
  });
});
