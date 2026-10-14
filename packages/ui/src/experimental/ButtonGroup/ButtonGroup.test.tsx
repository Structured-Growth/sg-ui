// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { ButtonGroup } from "./ButtonGroup";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button/Button";
afterEach(cleanup);
it("names a native group without adding toolbar keyboard semantics", () => {
 const ref = createRef<HTMLDivElement>(); render(<ButtonGroup ref={ref} label="Course actions" joined orientation="vertical"><button>Edit</button><button>Delete</button></ButtonGroup>);
 const group = screen.getByRole("group", { name: "Course actions" }); expect(ref.current).toBe(group); expect(group.dataset.orientation).toBe("vertical"); expect(group.dataset.joined).toBe("true"); expect(screen.getAllByRole("button")).toHaveLength(2); expect(group.hasAttribute("tabindex")).toBe(false);
});
it("supports server rendering without a provider", () => { expect(renderToString(<ButtonGroup label="Actions" />)).toContain('aria-label="Actions"'); });
it("preserves child-owned disabled state and nested actions in normal Tab order", async () => {
 const user = userEvent.setup();
 render(<><button>Before</button><ButtonGroup label="Actions"><Button>Create</Button><Button disabled>Import</Button><div><Button>Archive</Button><a href="#details">Details</a></div></ButtonGroup><button>After</button></>);
 for (const name of ["Before", "Create", "Archive", "Details", "After"]) {
  await user.tab(); expect(document.activeElement?.textContent).toBe(name);
 }
 expect((screen.getByRole("button", { name: "Import" }) as HTMLButtonElement).disabled).toBe(true);
 await user.tab({ shift: true }); expect(document.activeElement).toBe(screen.getByRole("link", { name: "Details" }));
});
