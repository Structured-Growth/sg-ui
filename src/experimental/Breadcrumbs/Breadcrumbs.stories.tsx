import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "./Breadcrumbs";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Breadcrumbs", component: Breadcrumbs, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { items: [{ id: "home", label: "Home", href: "/" }, { id: "courses", label: "Courses", href: "/courses" }, { id: "course", label: "Algebra" }] } } satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
