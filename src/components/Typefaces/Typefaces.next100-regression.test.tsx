// @vitest-environment jsdom
import { createRef, type ReactElement } from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, within } from "@testing-library/react";
import { Provider, Typography, type TypographyProps } from "../../primitives";
import { Defaults } from "./Typefaces.stories";

afterEach(cleanup);

it("keeps the production Typefaces catalog complete with semantic sample elements", () => {
  const Catalog = Defaults.render as () => ReactElement;
  const { container } = render(<Provider><Catalog /></Provider>);
  const roles = ["h1", "h2", "h3", "h4", "h5", "h6", "body1", "body2", "bodyAlt2", "subtitle1", "subtitle2", "button", "caption", "overline", "code"];
  const samples = within(container).getAllByText("The quick brown fox jumps over the lazy dog.");
  expect(samples.map(sample => sample.getAttribute("data-variant"))).toEqual(roles);
  for (const [index, role] of roles.entries()) {
    expect(samples[index].tagName).toBe(role === "code" ? "CODE" : "P");
    expect(within(container).getByRole("heading", { level: 3, name: role }).getAttribute("data-variant")).toBe("body2");
  }
  expect(within(container).getByRole("heading", { level: 2, name: "Typography Variants" }).getAttribute("data-variant")).toBe("h5");
});

it("isolates public typography consumers through updates, unmount and repeated catalog rendering", () => {
  const firstRef = createRef<HTMLElement>();
  const secondRef = createRef<HTMLElement>();
  const props: TypographyProps = { as: "label", variant: "bodyAlt2", tone: "muted", style: { marginTop: 8 } };
  function Host({ changed = false }: { changed?: boolean }) {
    return <Provider>
      <Typography {...props} ref={firstRef} variant={changed ? "code" : props.variant}>First</Typography>
      <Typography as="h2" variant="h1" ref={secondRef}>Second</Typography>
    </Provider>;
  }
  const host = render(<Host />);
  const first = firstRef.current;
  const second = secondRef.current;
  expect(first?.tagName).toBe("LABEL");
  expect(first?.style.marginTop).toBe("8px");
  host.rerender(<Host changed />);
  expect(firstRef.current).toBe(first);
  expect(first?.getAttribute("data-variant")).toBe("code");
  expect(secondRef.current).toBe(second);
  expect(second?.getAttribute("data-variant")).toBe("h1");
  expect(second?.tagName).toBe("H2");
  host.unmount();
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBeNull();

  const Catalog = Defaults.render as () => ReactElement;
  const catalog = render(<Provider><Catalog /></Provider>);
  const snapshot = catalog.container.innerHTML;
  catalog.rerender(<Provider><Catalog /></Provider>);
  expect(catalog.container.innerHTML).toBe(snapshot);
  catalog.unmount();
  const remounted = render(<Provider><Catalog /></Provider>);
  expect(remounted.container.innerHTML).toBe(snapshot);
});
