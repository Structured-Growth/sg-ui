// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Card, CardContent, Provider, type CardProps, type CardContentProps } from "../index";

afterEach(cleanup);

it("composes public Card slots with native refs, overrides and host events", () => {
  const cardRef = createRef<HTMLElement>();
  const contentRef = createRef<HTMLElement>();
  const onClick = vi.fn();
  const cardProps = {
    as: "section", variant: "raised", tone: "subtle", padding: 2,
    className: "host-card", style: { margin: "3px" }, "aria-label": "Course summary",
  } satisfies CardProps;
  const contentProps = {
    as: "main", padding: 1, className: "host-content", style: { padding: "7px" },
    "aria-label": "Course content", onClick,
  } satisfies CardContentProps;
  render(<Provider><Card {...cardProps} ref={cardRef}>
    <CardContent {...contentProps} ref={contentRef}><button type="button">Open course</button></CardContent>
  </Card></Provider>);

  const card = screen.getByRole("region", { name: "Course summary" });
  const content = screen.getByRole("main", { name: "Course content" });
  expect(cardRef.current).toBe(card);
  expect(contentRef.current).toBe(content);
  expect(content.parentElement).toBe(card);
  expect(card.dataset.variant).toBe("raised");
  expect(card.dataset.tone).toBe("subtle");
  expect(card.classList.contains("host-card")).toBe(true);
  expect(content.classList.contains("host-content")).toBe(true);
  expect(card.style.padding).toBe("var(--sgui-space2)");
  expect(card.style.margin).toBe("3px");
  expect(content.style.padding).toBe("7px");
  fireEvent.click(screen.getByRole("button", { name: "Open course" }));
  expect(onClick).toHaveBeenCalledTimes(1);
});

it("keeps presentation instances independent across updates, removal and remount", () => {
  const firstRef = createRef<HTMLElement>();
  const firstContentRef = createRef<HTMLElement>();
  const secondRef = createRef<HTMLElement>();
  const secondContentRef = createRef<HTMLElement>();
  function Pair({ first = true, updated = false }) {
    return <Provider>
      {first && <Card key="first" ref={firstRef} aria-label="First" variant={updated ? "flat" : "raised"} tone="subtle">
        <CardContent ref={firstContentRef} padding={updated ? 0 : 1}>{updated ? "Updated" : "Initial"}</CardContent>
      </Card>}
      <Card key="second" ref={secondRef} aria-label="Second"><CardContent ref={secondContentRef}>Unchanged</CardContent></Card>
    </Provider>;
  }
  const view = render(<Pair />);
  const second = screen.getByRole("article", { name: "Second" });
  const secondContent = secondContentRef.current;
  view.rerender(<Pair updated />);
  expect(firstRef.current?.dataset.variant).toBe("flat");
  expect(firstContentRef.current?.style.padding).toBe("0px");
  expect(screen.getByText("Updated").parentElement).toBe(firstRef.current);
  expect(secondRef.current).toBe(second);
  expect(secondContentRef.current).toBe(secondContent);
  expect(second.dataset.variant).toBe("outlined");
  expect(second.dataset.tone).toBe("default");
  expect(secondContent?.style.padding).toBe("var(--sgui-space4)");
  view.rerender(<Pair first={false} />);
  expect(firstRef.current).toBeNull();
  expect(firstContentRef.current).toBeNull();
  expect(secondRef.current).toBe(second);
  view.rerender(<Pair />);
  expect(firstRef.current?.dataset.variant).toBe("raised");
  expect(firstContentRef.current?.textContent).toBe("Initial");
  expect(firstContentRef.current?.style.padding).toBe("var(--sgui-space1)");
  view.unmount();
  expect(firstRef.current).toBeNull();
  expect(firstContentRef.current).toBeNull();
  expect(secondRef.current).toBeNull();
  expect(secondContentRef.current).toBeNull();
});
