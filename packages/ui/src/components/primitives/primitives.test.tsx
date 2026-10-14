// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Autocomplete, Box, Button, Checkbox, Collapse, List, ListItem, ListItemButton, Menu, Provider, Select, Stack, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextField, Typography } from "../../primitives";
afterEach(cleanup);
it("composes public form controls with keyboard string-ID selection and native reset", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const select = createRef<HTMLButtonElement>();
  const { container } = render(<Provider><Box as="section"><form><Stack><Typography as="h2">Course details</Typography>
    <TextField label="Course" name="course" defaultValue="Science" />
    <Checkbox label="Published" name="published" defaultChecked />
    <Select ref={select} label="Status" name="status" defaultValue="draft" options={[{id:"draft",label:"Draft"},{id:"active",label:"Active"}]} onValueChange={change} />
    <Button type="reset">Reset</Button></Stack></form></Box></Provider>);
  await user.tab(); await user.keyboard("{Control>}a{/Control}Math");
  await user.tab(); await user.keyboard(" "); await user.tab();
  expect(document.activeElement).toBe(select.current);
  await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
  expect(change).toHaveBeenLastCalledWith("active");
  const form = container.querySelector("form")!;
  expect(new FormData(form).get("status")).toBe("active");
  expect(new FormData(form).get("course")).toBe("Math");
  await user.click(screen.getByRole("button",{name:"Reset"}));
  expect(new FormData(form).get("status")).toBe("draft");
  expect(new FormData(form).get("course")).toBe("Science");
  expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
});
it("uses public menu activation once and restores the nested list trigger after Escape", async () => {
  const user = userEvent.setup(); const action = vi.fn();
  render(<Provider><List><ListItem><Menu label="Course actions" trigger={<ListItemButton>Actions</ListItemButton>} items={[{id:"edit",label:"Edit"},{id:"delete",label:"Delete",disabled:true}]} onAction={action} /></ListItem></List></Provider>);
  await user.tab(); await user.keyboard("{Enter}"); await user.click(screen.getByRole("menuitem",{name:"Edit"}));
  expect(action).toHaveBeenCalledExactlyOnceWith("edit");
  await waitFor(()=>expect(document.activeElement).toBe(screen.getByRole("button",{name:"Actions"})));
  await user.keyboard("{Enter}"); await screen.findByRole("menu"); await user.keyboard("{Escape}");
  await waitFor(()=>expect(screen.queryByRole("menu")).toBeNull());
  await waitFor(()=>expect(document.activeElement).toBe(screen.getByRole("button",{name:"Actions"})));
});
it("preserves owned autocomplete input refs, static table semantics and collapsed child state", async () => {
  const user = userEvent.setup(); const input = createRef<HTMLInputElement>(); const table = createRef<HTMLTableElement>();
  const View = ({expanded}:{expanded:boolean}) => <Provider><Autocomplete ref={input} label="Category" options={[{id:"science",label:"Science"}]} />
    <Collapse expanded={expanded}><TextField label="Note" defaultValue="Kept" /></Collapse>
    <Table ref={table}><TableHead><TableRow><TableHeaderCell scope="col">Name</TableHeaderCell></TableRow></TableHead><TableBody><TableRow><TableCell>Science</TableCell></TableRow></TableBody></Table></Provider>;
  const { rerender } = render(<View expanded />);
  expect(input.current).toBe(screen.getByRole("combobox",{name:"Category"}));
  await user.click(screen.getByRole("textbox",{name:"Note"})); await user.type(screen.getByRole("textbox",{name:"Note"})," value");
  rerender(<View expanded={false} />); expect(screen.queryByRole("textbox",{name:"Note"})).toBeNull();
  rerender(<View expanded />); expect((screen.getByRole("textbox",{name:"Note"}) as HTMLInputElement).value).toBe("Kept value");
  expect(table.current).toBe(screen.getByRole("table")); expect(screen.getByRole("columnheader",{name:"Name"}).getAttribute("scope")).toBe("col");
});
