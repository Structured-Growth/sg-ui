// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { Pagination, type PaginationProps, ThemeScope } from "../index";
import { formatIcuMessage, SGTranslationProvider, type SGTranslationAdapter } from "../../i18n";

afterEach(cleanup);

it("keeps translated consuming pagination instances independent across requests and remount", async () => {
  const ref = createRef<HTMLElement>();
  const firstRequest = vi.fn();
  const secondRequest = vi.fn();
  const translations = vi.fn<SGTranslationAdapter["t"]>((key, options) => {
    const messages: Record<string, string> = {
      "common.ui.nextPage": "Suivante", "common.ui.previousPage": "Précédente",
      "common.ui.firstPage": "Première", "common.ui.lastPage": "Dernière",
      "common.ui.pageSize": "Lignes par page", "common.ui.pageOfCount": "Page {page} sur {count}",
    };
    return formatIcuMessage(messages[key] ?? options.defaultMessage, "fr", options.values);
  });
  function Host({ second = true }: { second?: boolean }) {
    return <ThemeScope><SGTranslationProvider value={{ locale: "fr", t: translations, useNamespace: () => {} }}>
      <View label="Courses" onRequest={firstRequest} forwardedRef={ref} />
      {second && <View label="Archives" onRequest={secondRequest} />}
    </SGTranslationProvider></ThemeScope>;
  }
  function View({ label, onRequest, forwardedRef }: {
    label: string; onRequest: PaginationProps["onPaginationChange"]; forwardedRef?: typeof ref;
  }) {
    const [model, setModel] = useState({ page: 1, pageSize: 25 });
    return <Pagination ref={forwardedRef} label={label} className="host-pagination" style={{ marginTop: 4 }}
      {...model} pageCount={3} pageSizeOptions={[25, 50]}
      onPageChange={page => setModel(current => ({ ...current, page }))}
      onPaginationChange={(page, pageSize) => { onRequest?.(page, pageSize); setModel({ page, pageSize }); }} />;
  }
  const user = userEvent.setup();
  const { rerender } = render(<Host />);
  const courses = screen.getByRole("navigation", { name: "Courses" });
  const archives = screen.getByRole("navigation", { name: "Archives" });
  expect(ref.current).toBe(courses);
  expect(courses.classList.contains("host-pagination")).toBe(true);
  expect(courses.style.marginTop).toBe("4px");
  const firstSelect = within(courses).getByRole("combobox", { name: "Lignes par page" });
  const secondSelect = within(archives).getByRole("combobox", { name: "Lignes par page" });
  expect(firstSelect.id).not.toBe(secondSelect.id);
  await user.selectOptions(firstSelect, "50");
  expect(firstRequest).toHaveBeenCalledExactlyOnceWith(0, 50);
  expect(secondRequest).not.toHaveBeenCalled();
  expect(within(courses).getByText("Page 1 sur 3")).toBeTruthy();
  expect((within(courses).getByRole("button", { name: "Précédente" }) as HTMLButtonElement).disabled).toBe(true);
  expect((secondSelect as HTMLSelectElement).value).toBe("25");
  await user.click(within(archives).getByRole("button", { name: "Suivante" }));
  expect(within(archives).getByText("Page 3 sur 3")).toBeTruthy();
  expect((within(archives).getByRole("button", { name: "Dernière" }) as HTMLButtonElement).disabled).toBe(true);
  rerender(<Host second={false} />);
  expect(screen.queryByRole("navigation", { name: "Archives" })).toBeNull();
  rerender(<Host />);
  expect(within(screen.getByRole("navigation", { name: "Archives" })).getByText("Page 2 sur 3")).toBeTruthy();
  expect(within(courses).getByText("Page 1 sur 3")).toBeTruthy();
  expect((firstSelect as HTMLSelectElement).value).toBe("50");
  expect(translations).toHaveBeenCalledWith("common.ui.pageOfCount", {
    defaultMessage: "Page {page} of {count}", values: { page: 1, count: 3 },
  });
});
