import type { Meta, StoryObj } from "@storybook/react-vite";
import * as icons from "./index";
import { Provider } from "../../experimental/Provider/Provider";
import { ThemeScope } from "../../foundation/ThemeScope";

function Catalog() {
  return <Provider><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: "1rem" }}>
    {Object.entries(icons).filter((entry): entry is [string, typeof icons.AddIcon] => /^[A-Z].*Icon$/.test(entry[0])).map(([name, Icon]) => <div key={name}><Icon size={24} /> <span>{name}</span></div>)}
  </div></Provider>;
}
const meta = { title: "Components/Icons", component: Catalog } satisfies Meta<typeof Catalog>;
export default meta;
export const AllPublicIcons: StoryObj<typeof meta> = {};
export const MeaningfulAndDecorative: StoryObj = { render: () => <Provider><div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
  <icons.CheckIcon size={24} label="Completed" />
  <span><icons.MenuBookIcon size={24} /> Lesson</span>
</div></Provider> };
export const ActivityMappingsAndHostOverrides: StoryObj = { render: () => <Provider><div style={{ display: "grid", gap: "1rem" }}>
  {["lesson", "quiz", "exam", "assignment", "project", "lab", "practice", "unknown"].map(type => <div key={type}>{icons.getActivityTypeIcon(type)} <span>{type}</span></div>)}
  <div>{icons.getActivityTypeIcon("lesson", { size: 24, overrides: { lesson: <icons.BookIcon size={24} /> } })} Host lesson override</div>
  <div>{icons.getActivityTypeIcon("new-type", { fallback: <icons.StarIcon size={24} /> })} Host unknown fallback</div>
</div></Provider> };
export const DirectionalIcons: StoryObj = { render: () => <ThemeScope dir="rtl"><div style={{ display: "flex", gap: "1rem" }}>
  <icons.ChevronRightIcon label="Next" /> <icons.ArrowForwardIcon label="Forward" /> <icons.UndoIcon label="Undo" /> <icons.UndoIcon label="Undo without mirroring" mirrorInRtl={false} />
</div></ThemeScope> };
