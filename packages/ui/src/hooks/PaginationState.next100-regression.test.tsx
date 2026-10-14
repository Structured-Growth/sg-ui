// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { usePersistentPaginationModel, type PaginationModel } from "./index";

afterEach(cleanup);

it("accepts the safe integer size boundary through the public model setter and rejects overflow", () => {
  const initial: PaginationModel = { page: 7, pageSize: Number.MAX_SAFE_INTEGER };
  const { result } = renderHook(() => usePersistentPaginationModel(undefined, initial, { defaultPageSize: 10 }));
  expect(result.current[0]).toEqual(initial);
  act(() => result.current[1](previous => ({ ...previous, pageSize: previous.pageSize + 1 })));
  expect(result.current[0]).toEqual({ page: 7, pageSize: 10 });
  act(() => result.current[1]({ page: 0, pageSize: Number.MAX_SAFE_INTEGER }));
  expect(result.current[0]).toEqual({ page: 0, pageSize: Number.MAX_SAFE_INTEGER });
});

it("discards memory-only pagination on unmount while a mounted peer retains its own model", () => {
  const initial: PaginationModel = { page: 1, pageSize: 10 };
  const mount = () => renderHook(() => usePersistentPaginationModel("next100-s09-memory", initial));
  const first = mount();
  const peer = mount();
  act(() => first.result.current[1]({ page: 5, pageSize: 150 }));
  act(() => peer.result.current[1]({ page: 2, pageSize: 75 }));
  first.unmount();
  const remounted = mount();
  expect(remounted.result.current[0]).toEqual(initial);
  expect(peer.result.current[0]).toEqual({ page: 2, pageSize: 75 });
});
