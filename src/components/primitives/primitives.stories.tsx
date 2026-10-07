import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Autocomplete, Button, Checkbox, CircularProgress, LinearProgress, Menu, Provider, Select, Stack, TextField, Typography } from "../../primitives";
const meta = { title: "Components/primitives", tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const OwnedPublicForm: Story = { render: function Form() {
  const [status,setStatus] = useState("draft"); const [action,setAction] = useState("No action");
  return <form><Stack gap={3} style={{maxInlineSize:"28rem"}}><Typography as="h2" variant="h4">Course details</Typography>
    <TextField label="Course name" name="course" defaultValue="Science" /><Checkbox label="Published" name="published" />
    <Select label="Status" options={[{id:"draft",label:"Draft"},{id:"active",label:"Active"}]} value={status} onValueChange={value=>setStatus(value ?? "draft")} />
    <Autocomplete label="Category" options={[{id:"science",label:"Science"},{id:"arts",label:"Arts"}]} />
    <Menu label="Course actions" trigger={<Button>Actions</Button>} items={[{id:"preview",label:"Preview"},{id:"delete",label:"Delete",disabled:true}]} onAction={setAction} />
    <Typography role="status">{action}</Typography><LinearProgress label="Upload" value={40} /><CircularProgress aria-label="Loading preview" />
    <Button type="reset">Reset fields</Button></Stack></form>;
} };
