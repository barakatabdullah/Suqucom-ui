// uno.config.ts
import { defineConfig, presetUno, presetIcons } from "unocss";

export default defineConfig({
  content: {
    filesystem: ["**/*.{html,js,ts,vue}"],
  },
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        width: "1.2em",
        height: "1.2em",
      },
    }),
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: "#0a0a0az",
        50: "#fafafa",
        100: "#f5f5f5",
        200: "#e5e5e5",
        300: "#d4d4d4",
        400: "#a3a3a3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
        950: "#0a0a0a",
      },
      neutral: {
        DEFAULT: "#737373",
        50: "#fafafa",
        100: "#f5f5f5",
        200: "#e5e5e5",
        300: "#d4d4d4",
        400: "#a3a3a3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
        950: "#0a0a0a",
      },
    },
  },
  safelist: [...Array.from({ length: 8 }, (_, i) => `col-span-${i + 1}`)],
});
