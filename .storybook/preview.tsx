import type { Preview } from "@storybook/react-vite";
import { AppThemeProvider } from "../src/theme";
const preview: Preview = {
  decorators: [(Story) => <AppThemeProvider><Story /></AppThemeProvider>],
  parameters: { controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } } },
};
export default preview;
