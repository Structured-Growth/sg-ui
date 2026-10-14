// @vitest-environment node
import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import Link from "./Link";
import { usePathname, useRouter } from "./navigation";

it("keeps unprovided navigation safe without browser globals", () => {
  function Consumer() {
    const router = useRouter();
    router.push("/courses", { replace: true });
    return <Link href="/courses" replace>{usePathname()}</Link>;
  }
  expect(typeof window).toBe("undefined");
  expect(renderToString(<Consumer />)).toBe('<a href="/courses">/</a>');
});
