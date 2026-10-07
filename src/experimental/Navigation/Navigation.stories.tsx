import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Navigation, NavigationItem } from "./Navigation";
import { List, ListItem } from "../List/List";
import { Disclosure } from "../Disclosure/Disclosure";
import { Provider } from "../Provider/Provider";
import { SGNavigationProvider } from "../../adapters/navigation";
const meta = { title: "Migration proofs/Navigation", component: Navigation, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Main navigation" } } satisfies Meta<typeof Navigation>;
export default meta;
type Story = StoryObj<typeof meta>;
function Example() {
 const [pathname, setPathname] = useState("/courses/algebra");
 return <SGNavigationProvider value={{ pathname, navigate: (href) => setPathname(href) }}><Navigation label="Main navigation"><List><ListItem><NavigationItem href="/" current={pathname === "/"}>Overview</NavigationItem></ListItem><ListItem><Disclosure label="Courses" defaultExpanded><List>{["algebra", "geometry"].map(course => <ListItem key={course}><NavigationItem href={`/courses/${course}`} current={pathname === `/courses/${course}`}>{course === "algebra" ? "Algebra" : "Geometry"}</NavigationItem></ListItem>)}</List></Disclosure></ListItem><ListItem><NavigationItem href="/settings" current={pathname === "/settings"}>Settings</NavigationItem></ListItem></List></Navigation></SGNavigationProvider>;
}
export const HostRoutingAndExpansion: Story = { render: () => <Example /> };
