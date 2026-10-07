import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { List, ListItem, ListItemButton, ListItemText, ListItemIcon } from "./List";
import { Provider } from "../Provider/Provider";
import { Button } from "../Button/Button";
const meta = { title: "Migration proofs/List", component: List, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>] } satisfies Meta<typeof List>;
export default meta;
type Story = StoryObj<typeof meta>;
function Selection() {
 const [selected, setSelected] = useState("algebra");
 return <List aria-label="Course selection">{[{ id: "algebra", label: "Algebra", detail: "Three lessons" }, { id: "geometry", label: "Geometry", detail: "Five lessons" }].map(item => <ListItem key={item.id}><ListItemButton selected={selected === item.id} onPress={() => setSelected(item.id)}><ListItemIcon>☆</ListItemIcon><ListItemText primary={item.label} secondary={item.detail} /></ListItemButton></ListItem>)}<ListItem><ListItemButton disabled><ListItemText primary="Archived course" /></ListItemButton></ListItem></List>;
}
export const SelectedActions: Story = { render: () => <Selection /> };
function MixedAction() {
 const [included, setIncluded] = useState(false);
 return <List aria-label="Course groups">
  <ListItem><ListItemText primary="Core courses" secondary="Two courses are always included" /></ListItem>
  <ListItem>
   <ListItemButton aria-pressed={included ? true : "mixed"} aria-describedby="optional-course-detail" onPress={() => setIncluded(value => !value)}>
    <ListItemText primary="Include optional courses" />
   </ListItemButton>
   <span id="optional-course-detail">{included ? "All optional courses included" : "Some optional courses included"}</span>
   <Button variant="text" tone="neutral" onPress={() => setIncluded(false)}>Restore partial inclusion</Button>
  </ListItem>
 </List>;
}
export const NativeMixedAction: Story = { render: () => <MixedAction /> };
