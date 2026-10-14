// @vitest-environment jsdom
import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { usePersistentPaginationModel } from "./usePersistentPaginationModel";

afterEach(() => { vi.restoreAllMocks(); window.localStorage.clear(); });
it("renders initial pagination on the server and restores only after hydration", async () => {
  window.localStorage.setItem("hydrated-pagination", '{"page":4,"pageSize":250}');
  const read = vi.spyOn(window.Storage.prototype, "getItem");
  function View() {
    const [model] = usePersistentPaginationModel("hydrated-pagination", { page: 0, pageSize: 10 }, { storage: "local" });
    return <output>{model.page}:{model.pageSize}</output>;
  }
  const markup = renderToString(<View />);
  expect(markup).toBe("<output>0<!-- -->:<!-- -->10</output>");
  expect(read).not.toHaveBeenCalled();
  const container = document.createElement("div"); container.innerHTML = markup; document.body.append(container);
  const recoverable = vi.fn();
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => { root = hydrateRoot(container, <View />, { onRecoverableError: recoverable }); });
  expect(container.textContent).toBe("4:250"); expect(recoverable).not.toHaveBeenCalled();
  await act(async () => { root!.unmount(); }); container.remove();
});
