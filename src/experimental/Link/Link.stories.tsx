import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./Link";
import { Provider } from "../Provider/Provider";
import { useState, type MouseEvent } from "react";
import { SGNavigationProvider } from "../../adapters/navigation";
const meta = { title: "Migration proofs/Link", component: Link, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { href: "https://example.com", target: "_blank", children: "Course reference" } } satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

/** Native browser fixture: output observes the completed event after router handling. */
function NavigationSemanticsExample() {
  const [events, setEvents] = useState<string[]>([]);
  const observe = (label: string, event: MouseEvent<HTMLAnchorElement>, cancel = false) => {
    if (cancel) event.preventDefault();
    setEvents(previous => [...previous, `${label}:click`]);
    queueMicrotask(() => setEvents(previous => [...previous, `${label}:defaultPrevented=${event.defaultPrevented}`]));
  };
  const file = "data:text/plain;charset=utf-8,SGUI%20download%20regression";
  return <SGNavigationProvider value={{ pathname: "/", navigate: href => setEvents(previous => [...previous, `navigate:${href}`]) }}>
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Link href="#course" onClick={event => observe("route", event)}>Router course</Link>
      <Link href={file} external={false} download="" onClick={event => observe("empty-download", event)}>Download with empty filename</Link>
      <Link href={file} external={false} download="course.txt" onClick={event => observe("named-download", event)}>Download named file</Link>
      <Link href={file} external={false} download onClick={event => observe("boolean-download", event)}>Download boolean file</Link>
      <Link href="#false-download" download={false} onClick={event => observe("false-download", event)}>Route with download false</Link>
      <Link href="#cancel" onClick={event => observe("cancel", event, true)}>Cancel navigation</Link>
      <Link href="#target" target="_blank" onClick={event => observe("target", event)}>New tab course</Link>
      <Link href="#external" external onClick={event => observe("external", event)}>Native external link</Link>
    </div>
    <output aria-label="Navigation events" style={{ display: "block", whiteSpace: "pre-wrap" }}>{events.join("\n")}</output>
  </SGNavigationProvider>;
}
export const NavigationSemantics: Story = { render: () => <NavigationSemanticsExample /> };
