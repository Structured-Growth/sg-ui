import type { Meta, StoryObj } from "../../../types";
import * as icons from "@structured-growth/sg-ui/experimental/icons";
import { Provider } from "@structured-growth/sg-ui/theme";
function Catalog() { return <Provider><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "1rem" }}>
  {Object.entries(icons).filter((entry): entry is [string, typeof icons.AddIcon] => /^[A-Z].*Icon$/.test(entry[0])).map(([name, Icon]) => <div key={name}><Icon size={24} /> <span>{name}</span></div>)}
</div></Provider>; }
const meta = { title: "Migration proofs/Icons", component: Catalog } satisfies Meta<typeof Catalog>;
export default meta;
export const CatalogStory: StoryObj<typeof meta> = {};
export const Meaningful: StoryObj = { render: () => <Provider><icons.CheckIcon size={24} label="Completed" /></Provider> };
