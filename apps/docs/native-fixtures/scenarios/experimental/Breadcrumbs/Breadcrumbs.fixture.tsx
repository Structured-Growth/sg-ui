import type { Meta, StoryObj } from "../../../types";
import { Breadcrumbs } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
const meta = { title: "Migration proofs/Breadcrumbs", component: Breadcrumbs, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { items: [{ id: "home", label: "Home", href: "/" }, { id: "courses", label: "Courses", href: "/courses" }, { id: "course", label: "Algebra" }] } } satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const LongAncestor: Story = { args: { style: { width: 220 }, items: [
  { id: "home", label: "Home", href: "/" },
  { id: "ancestor", label: "Professional development courses for instructors and administrators", href: "/courses" },
  { id: "current", label: "Course details" },
] } };
