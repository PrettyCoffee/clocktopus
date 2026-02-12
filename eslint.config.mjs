import { readdirSync } from "node:fs"

import prettyCozy from "@pretty-cozy/eslint-config"
import { defineConfig, globalIgnores } from "eslint/config"
import checkFile from "eslint-plugin-check-file"

export default defineConfig(
  prettyCozy.baseTs,
  prettyCozy.react,
  prettyCozy.tailwind({ entryPoint: "src/index.css" }),
  globalIgnores(["dist", "node_modules", "src/locales/*/messages.js"]),

  {
    rules: {
      // For some unknown reason vscode detects this rule as "warn", even when being disabled by prettyCozy.tailwind
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
    },
  },

  {
    name: "local-rules/lib-imports",
    ignores: ["src/lib/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "zod",
              allowImportNames: ["ZodError"],
              message: "Import from zod/mini instead.",
            },
            {
              name: "@lingui/core",
              allowImportNames: ["Messages", "MessageDescriptor"],
              message: "Import from @lingui/core/macro instead.",
            },
            {
              name: "@lingui/react",
              allowImportNames: ["I18nProvider", "useLingui"],
              message: "Import from @lingui/react/macro instead.",
            },
          ],
          patterns: [
            {
              group: ["@yaasl/*"],
              importNamePattern: "^",
              message: "Import from lib/yaasl instead.",
            },
          ],
        },
      ],
    },
  },

  {
    name: "situational-rules",
    rules: {
      // activate for temporary testing
      // "import/no-cycle": "error",
    },
  },

  {
    name: "local-rules/check-file-naming",
    plugins: { checkFile },
    rules: {
      "checkFile/folder-naming-convention": ["error", { "*/**": "KEBAB_CASE" }],
      "checkFile/filename-naming-convention": [
        "error",
        { "*/**": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
    },
  },

  {
    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
        },
      },
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // disables cross-feature imports:
            // e.g. src/features/notes should not import from src/features/taskbar, etc.
            ...readdirSync("./src/features").map(feature => ({
              target: `./src/features/${feature}`,
              from: "./src/features",
              except: [...new Set([`./${feature}`, "./components"])],
            })),

            // enforce unidirectional codebase:

            // src/app can import from src/features but not the other way around
            {
              target: "./src/features",
              from: "./src/app",
            },

            // src/data can only import from self + utils + lib + types
            {
              target: "./src/data",
              from: "./src",
              except: ["./data", "./utils", "./lib", "./types"],
            },

            // src/features and src/app can import from these shared modules but not the other way around
            {
              target: [
                "./src/components",
                "./src/hooks",
                "./src/lib",
                "./src/types",
                "./src/utils",
              ],
              from: ["./src/features", "./src/app"],
            },
          ],
        },
      ],
    },
  },

  {
    files: ["tailwind/**"],
    rules: {
      "import/no-extraneous-dependencies": "off",
    },
  },

  prettyCozy.prettier
)
