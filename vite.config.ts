import { lingui } from "@lingui/vite-plugin"
import babelPlugin, { defineRolldownBabelPreset } from "@rolldown/plugin-babel"
import tailwind from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const linguiPreset = defineRolldownBabelPreset({
  preset: () => ({ plugins: ["@lingui/babel-plugin-lingui-macro"] }),
  rolldown: {
    filter: {
      code: /from ['"]@lingui\/(?:react|core)\/macro['"]/,
    },
  },
})

export default defineConfig({
  base: "./",
  plugins: [
    tailwind(),
    react(),
    lingui(),
    babelPlugin({ presets: [linguiPreset] }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
})
