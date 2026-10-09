// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SGLink, SGNavigationProvider, usePathname, useRouter, type SGNavigationAdapter } from "./index";

afterEach(cleanup);

it("isolates nested and sibling navigation hosts through replacement, removal and remount", () => {
  const outer: SGNavigationAdapter = { pathname: "/outer", navigate: vi.fn() };
  const inner: SGNavigationAdapter = { pathname: "/inner", navigate: vi.fn() };
  const sibling: SGNavigationAdapter = { pathname: "/sibling", navigate: vi.fn() };
  const replacement: SGNavigationAdapter = { pathname: "/replacement", navigate: vi.fn() };
  function Consumer({ name }: { name: string }) {
    const pathname = usePathname();
    const router = useRouter();
    return <section aria-label={name}>
      <output>{pathname}</output>
      <button onClick={() => router.push(`#${name}`, { replace: true })}>Navigate</button>
      <SGLink href={`#${name}`} replace>Open</SGLink>
    </section>;
  }
  function Composition({ nested }: { nested: SGNavigationAdapter | null }) {
    return <>
      <SGNavigationProvider value={outer}>
        <Consumer name="outer" />
        {nested ? <SGNavigationProvider value={nested}><Consumer name="inner" /></SGNavigationProvider> : <Consumer name="inner" />}
      </SGNavigationProvider>
      <SGNavigationProvider value={sibling}><Consumer name="sibling" /></SGNavigationProvider>
      <Consumer name="native" />
    </>;
  }
  const region = (name: string) => within(screen.getByRole("region", { name }));
  const { rerender, unmount } = render(<Composition nested={inner} />);
  fireEvent.click(region("inner").getByRole("button"));
  expect(inner.navigate).toHaveBeenCalledExactlyOnceWith("#inner", { replace: true });
  expect(outer.navigate).not.toHaveBeenCalled();
  expect(sibling.navigate).not.toHaveBeenCalled();

  rerender(<Composition nested={replacement} />);
  expect(region("inner").getByText("/replacement")).toBeTruthy();
  expect(fireEvent.click(region("inner").getByRole("link"))).toBe(false);
  expect(replacement.navigate).toHaveBeenCalledExactlyOnceWith("#inner", { replace: true });
  expect(inner.navigate).toHaveBeenCalledTimes(1);

  rerender(<Composition nested={null} />);
  expect(region("inner").getByText("/outer")).toBeTruthy();
  fireEvent.click(region("inner").getByRole("button"));
  expect(outer.navigate).toHaveBeenCalledExactlyOnceWith("#inner", { replace: true });
  expect(region("sibling").getByText("/sibling")).toBeTruthy();
  fireEvent.click(region("sibling").getByRole("link"));
  expect(sibling.navigate).toHaveBeenCalledExactlyOnceWith("#sibling", { replace: true });
  expect(region("native").getByText("/")).toBeTruthy();
  expect(fireEvent.click(region("native").getByRole("link"))).toBe(true);
  expect(replacement.navigate).toHaveBeenCalledTimes(1);

  unmount();
  render(<Consumer name="remounted" />);
  expect(region("remounted").getByText("/")).toBeTruthy();
  expect(fireEvent.click(region("remounted").getByRole("link"))).toBe(true);
  expect(outer.navigate).toHaveBeenCalledTimes(1);
  expect(inner.navigate).toHaveBeenCalledTimes(1);
  expect(sibling.navigate).toHaveBeenCalledTimes(1);
  expect(replacement.navigate).toHaveBeenCalledTimes(1);
});
