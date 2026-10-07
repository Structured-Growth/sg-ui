import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "../../experimental/Provider/Provider";
import { MenuBookIcon } from "../../experimental/icons/MenuBookIcon";
import { Typography } from "../../experimental/Typography/Typography";
import { tokens } from "../../foundation/tokens.generated";
import { ContentEditorChrome } from "./ContentEditorChrome";
const meta = { title: "Editors/ContentEditorChrome", component: ContentEditorChrome, tags: ["autodocs"],
  args: { icon: null, title: "Untitled document", onTitleSave: () => {}, menuItems: [] },
  decorators: [Story => <Provider><Story /></Provider>],
} satisfies Meta<typeof ContentEditorChrome>;
export default meta;
type Story = StoryObj<typeof meta>;
function InteractiveChrome({ extended = false }: { extended?: boolean }) {
  const [title, setTitle] = useState("Untitled document"); const [action, setAction] = useState("");
  return <><ContentEditorChrome icon={<MenuBookIcon size={40} />} title={title} onTitleSave={setTitle}
    rightSlot={<Typography variant="bodyAlt2">Draft</Typography>}
    menuItems={(extended ? ["File", "Edit", "View", "Insert", "Format", "Tools"] : ["File", "Edit", "View"]).map(label => ({ id: label.toLowerCase(), label, onPress: anchor => setAction(`${label}: ${anchor.tagName}`) }))} />
    <p role="status">{action || "Choose an action or edit the title."}</p></>;
}
export const Default: Story = { render: () => <InteractiveChrome /> };
export const ExtendedMenu: Story = { render: () => <InteractiveChrome extended /> };
export const UnavailableAndPending: Story = { render: () => <ContentEditorChrome icon={null} title="Read-only lesson" titleReadOnly onTitleSave={()=>{}} menuItems={[{id:"file",label:"File"},{id:"saving",label:"Saving",onPress:()=>{},loading:true},{id:"locked",label:"Locked",onPress:()=>{},disabled:true}]} /> };
export const NarrowDark: Story = { render: () => <Provider theme="dark"><div style={{maxWidth:260,background:tokens.surface,color:tokens.text}}><InteractiveChrome extended /></div></Provider> };
