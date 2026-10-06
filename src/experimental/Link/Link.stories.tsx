import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./Link";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Link", component: Link, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { href: "https://example.com", target: "_blank", children: "Course reference" } } satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
