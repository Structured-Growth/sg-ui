import { describe, expect, it } from "vitest";
import { normalizePaginationModel } from "./paginationModel";

describe("normalizePaginationModel", () => {
  it("defaults invalid pages and sizes without an inherited cap", () => {
    expect(normalizePaginationModel({ page: -3, pageSize: Number.NaN })).toEqual({ page: 0, pageSize: 25 });
    expect(normalizePaginationModel({ page: 2.9, pageSize: 150 })).toEqual({ page: 2, pageSize: 150 });
    expect(normalizePaginationModel({ page: 1, pageSize: 26.8 })).toEqual({ page: 1, pageSize: 26 });
    expect(normalizePaginationModel({ page: Infinity, pageSize: 1 })).toEqual({ page: 0, pageSize: 1 });
  });
  it("normalizes explicitly configured sizes and invalid defaults", () => {
    const options = { pageSizeOptions: [200, 10, 75, 10, -1, Infinity, 1.5], defaultPageSize: 75 };
    expect(normalizePaginationModel({ page: 0, pageSize: 26 }, options).pageSize).toBe(75);
    expect(normalizePaginationModel({ page: 0, pageSize: 500 }, options).pageSize).toBe(200);
    expect(normalizePaginationModel({ page: 0, pageSize: NaN }, options).pageSize).toBe(75);
    expect(normalizePaginationModel({ page: 0, pageSize: 0 }, { pageSizeOptions: [], defaultPageSize: -1 }).pageSize).toBe(25);
    expect(normalizePaginationModel({ page: Number.MAX_VALUE, pageSize: Number.MAX_VALUE })).toEqual({ page: 0, pageSize: 25 });
  });
});
