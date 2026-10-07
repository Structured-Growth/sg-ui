import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextAlignMenuControl, type AlignOption } from "./TextAlignMenuControl";
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
