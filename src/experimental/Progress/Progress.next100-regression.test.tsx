// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Progress, type ProgressProps } from "./Progress";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

it("isolates public progress instances through updates, removal and remount", () => {
  const firstRef = createRef<HTMLDivElement>();
  const secondRef = createRef<HTMLDivElement>();
  const measurable: ProgressProps = { label: "Upload", minValue: 10, maxValue: 20, value: 12, valueText: "2 files sent" };
  const composition = (showUpload: boolean, value = 12) => <Provider>
    {showUpload && <Progress key="upload" {...measurable} value={value} ref={firstRef} />}
    <Progress key="index" aria-label="Index" variant="circular" ref={secondRef} />
  </Provider>;
  const { rerender, unmount } = render(composition(true));
  const upload = screen.getByRole("progressbar", { name: "Upload" });
  const index = screen.getByRole("progressbar", { name: "Index" });
  expect(firstRef.current).toBe(upload);
  expect(secondRef.current).toBe(index);
  expect(upload.getAttribute("aria-valuenow")).toBe("12");
  expect(upload.getAttribute("aria-valuetext")).toBe("2 files sent");
  expect(index.getAttribute("aria-valuenow")).toBeNull();

  rerender(composition(true, 18));
  expect(upload.getAttribute("aria-valuenow")).toBe("18");
  expect(secondRef.current).toBe(index);
  expect(index.hasAttribute("data-indeterminate")).toBe(true);
  rerender(composition(false));
  expect(firstRef.current).toBeNull();
  expect(screen.queryByRole("progressbar", { name: "Upload" })).toBeNull();
  expect(secondRef.current).toBe(index);
  rerender(composition(true));
  expect(firstRef.current).not.toBe(upload);
  expect(firstRef.current?.getAttribute("aria-valuenow")).toBe("12");
  expect(secondRef.current).toBe(index);
  unmount();
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBeNull();
});
