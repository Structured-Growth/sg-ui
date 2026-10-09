// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Typography } from "./Typography";

afterEach(cleanup);

it("isolates sibling typography updates and releases only the removed native ref", () => {
  const changingRef = createRef<HTMLElement>();
  const stableRef = createRef<HTMLElement>();
  const stable = <Typography key="stable" ref={stableRef} as="code" variant="code" tone="muted">Stable text</Typography>;
  const view = render(<>
    <Typography key="changing" ref={changingRef} as="h2" variant="h1" noWrap>First title</Typography>
    {stable}
  </>);
  const stableNode = stableRef.current;
  const initialHeading = changingRef.current;

  view.rerender(<>
    <Typography key="changing" ref={changingRef} as="p" variant="bodyAlt2" tone="danger">Updated text</Typography>
    {stable}
  </>);
  expect(changingRef.current).toBe(screen.getByText("Updated text"));
  expect(changingRef.current?.tagName).toBe("P");
  expect(changingRef.current?.getAttribute("data-variant")).toBe("bodyAlt2");
  expect(changingRef.current?.getAttribute("data-tone")).toBe("danger");
  expect(changingRef.current?.hasAttribute("data-no-wrap")).toBe(false);
  expect(initialHeading?.isConnected).toBe(false);
  expect(screen.queryByRole("heading")).toBeNull();
  expect(stableRef.current).toBe(stableNode);
  expect(stableNode?.tagName).toBe("CODE");
  expect(stableNode?.getAttribute("data-variant")).toBe("code");
  expect(stableNode?.getAttribute("data-tone")).toBe("muted");
  expect(stableNode?.textContent).toBe("Stable text");

  view.rerender(<>{stable}</>);
  expect(changingRef.current).toBeNull();
  expect(stableRef.current).toBe(stableNode);
  expect(stableNode?.isConnected).toBe(true);
  view.unmount();
  expect(stableRef.current).toBeNull();
});
