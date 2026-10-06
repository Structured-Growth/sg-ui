import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePersistentPaginationModel } from "./usePersistentPaginationModel";
import { usePersistentState } from "./usePersistentState";

const setPersistentValue = vi.fn();
const usePersistentStateMock = vi.mocked(usePersistentState);

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useCallback: <T,>(fn: T) => fn,
    useEffect: (effect: () => void | (() => void)) => {
      effect();
    },
    useMemo: <T,>(factory: () => T) => factory(),
  };
});

vi.mock("./usePersistentState", () => ({
  usePersistentState: vi.fn(),
}));

describe("usePersistentPaginationModel (hook behavior)", () => {
  beforeEach(() => {
    setPersistentValue.mockReset();
  });

  it("normalizes persisted value and writes back corrected state", () => {
    usePersistentStateMock.mockReturnValue([{ page: -3, pageSize: 26 }, setPersistentValue]);

    const [value] = usePersistentPaginationModel("grid");
    expect(value).toEqual({ page: 0, pageSize: 50 });
    expect(setPersistentValue).toHaveBeenCalledWith({ page: 0, pageSize: 50 });
  });

  it("normalizes updates for both object and updater callbacks", () => {
    usePersistentStateMock.mockReturnValue([{ page: 1, pageSize: 25 }, setPersistentValue]);

    const [, setValue] = usePersistentPaginationModel("grid");

    setValue({ page: 4.8, pageSize: 150 });
    let updateFn = setPersistentValue.mock.calls[0][0] as (prev: { page: number; pageSize: number }) => {
      page: number;
      pageSize: number;
    };
    expect(updateFn({ page: 1, pageSize: 25 })).toEqual({ page: 4, pageSize: 100 });

    setPersistentValue.mockClear();
    setValue((prev) => ({ page: prev.page + 2.4, pageSize: prev.pageSize + 1 }));
    updateFn = setPersistentValue.mock.calls[0][0] as (prev: { page: number; pageSize: number }) => {
      page: number;
      pageSize: number;
    };
    expect(updateFn({ page: -5, pageSize: Number.NaN })).toEqual({ page: 2, pageSize: 50 });
  });

  it("normalizes page size values below the minimum option", () => {
    usePersistentStateMock.mockReturnValue([{ page: 3, pageSize: 1 }, setPersistentValue]);

    const [value] = usePersistentPaginationModel("grid");
    expect(value).toEqual({ page: 3, pageSize: 25 });
    expect(setPersistentValue).toHaveBeenCalledWith({ page: 3, pageSize: 25 });
  });
});
