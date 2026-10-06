import type { Preview } from "@storybook/react-vite";
import { AppThemeProvider } from "../src/theme";
import { Provider } from "../src/experimental/Provider/Provider";
import "../src/foundation/tokens.css";
const preview: Preview = {
  decorators: [(Story) => <AppThemeProvider><Provider><Story /></Provider></AppThemeProvider>],
  parameters: { controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } } },
};
export default preview;
