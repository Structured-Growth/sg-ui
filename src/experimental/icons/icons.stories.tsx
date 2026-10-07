import type { Meta, StoryObj } from "@storybook/react-vite";
import * as icons from "./index";
import { Provider } from "../Provider/Provider";
function Catalog() { return <Provider><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "1rem" }}>
  {Object.entries(icons).filter((entry): entry is [string, typeof icons.AddIcon] => /^[A-Z].*Icon$/.test(entry[0])).map(([name, Icon]) => <div key={name}><Icon size={24} /> <span>{name}</span></div>)}
</div></Provider>; }
const meta = { title: "Migration proofs/Icons", component: Catalog } satisfies Meta<typeof Catalog>;
export default meta;
export const CatalogStory: StoryObj<typeof meta> = {};
export const Meaningful: StoryObj = { render: () => <Provider><icons.CheckIcon size={24} label="Completed" /></Provider> };
