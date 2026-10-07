import type { StorybookConfig } from "@storybook/react-vite";
import { scopedName } from "../scripts/css-modules.mjs";
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  async viteFinal(config) {
    config.css = { ...config.css, modules: { generateScopedName: scopedName } };
    return config;
  },
};
export default config;
