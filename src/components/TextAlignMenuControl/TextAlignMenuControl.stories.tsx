import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextAlignMenuControl, type AlignOption } from "./TextAlignMenuControl";
import { AppButton } from "../AppButton";
import { Provider } from "../../experimental/Provider/Provider";
import { SGTranslationProvider } from "../../i18n";
const meta = { title: "Editors/TextAlignMenuControl", component: TextAlignMenuControl, tags: ["autodocs"] } satisfies Meta<typeof TextAlignMenuControl>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: args => {
    const [value, setValue] = useState<AlignOption>(args.value ?? "left");
    const [indent, setIndent] = useState(0);
    return <><TextAlignMenuControl {...args} value={value} onChange={setValue} canOutdent={indent > 0} canIndent={indent < 3}
      onOutdent={() => setIndent(count => count - 1)} onIndent={() => setIndent(count => count + 1)} />
      <p role="status">Host alignment: {value}; indent: {indent}</p></>;
  },
};
export const LogicalRightToLeft: Story = { ...Default, args: { value: "start" }, decorators: [Story => <SGTranslationProvider value={{ locale: "ar", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}><Provider theme="dark"><Story /></Provider></SGTranslationProvider>] };
export const UnavailableCommands: Story = {};

/** F2 represents an external host selection change, including while the menu is open. */
export const DirectionCommands: Story = {
  render: () => {
    const [value, setValue] = useState<AlignOption>("start");
    const [requests, setRequests] = useState<string[]>([]);
    useEffect(() => {
      const replaceSelection = (event: KeyboardEvent) => {
        if (event.key === "F2") { event.preventDefault(); setValue("end"); }
      };
      window.addEventListener("keydown", replaceSelection);
      return () => window.removeEventListener("keydown", replaceSelection);
    }, []);
    return <>
      <p>Requests are recorded without changing host alignment. Press F2 to replace host alignment with end.</p>
      <AppButton onPress={() => setValue("start")}>Host selects start</AppButton>
      <TextAlignMenuControl value={value}
        onChange={next => setRequests(previous => [...previous, next])}
        onOutdent={() => setRequests(previous => [...previous, "outdent"])} canOutdent={false}
        canIndent={false} />
      <p role="status" aria-label="Host alignment">{value}</p>
      <p role="status" aria-label="Host requests">{requests.join(", ") || "No requests"}</p>
    </>;
  },
};
