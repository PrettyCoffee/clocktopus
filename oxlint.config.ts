import cozy from "@pretty-cozy/oxlint-config"
import { defineConfig, type DummyRuleMap, type AllowWarnDeny } from "oxlint"

/*
import { readdirSync } from "node:fs"
const restrictedPaths = {
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
}
*/

type GetRuleConfig<RuleName extends keyof DummyRuleMap> = Exclude<DummyRuleMap[RuleName], AllowWarnDeny | [AllowWarnDeny] | undefined>[1]

type RestrictedImports = GetRuleConfig<"no-restricted-imports">
const restrictedImports: RestrictedImports = {
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
}

export default defineConfig({
  extends: [cozy.base, cozy.react, cozy.tailwind, cozy.vitest],
  settings: {
    "better-tailwindcss": { entryPoint: "src/index.css" },
  },
  categories: {
    correctness: "error",
    suspicious: "error",
    perf: "error",
  },
  options: {
    typeAware: true,
    typeCheck: true,
    //reportUnusedDisableDirectives: "error",
    denyWarnings: true,
  },
  rules: {
    /** Not yet available in oxlint.
     *  @see https://github.com/oxc-project/oxc/issues/13789
    "import/no-restricted-paths": [
      "error",
      restrictedPaths
    ],
    */
  },
  overrides: [
    /** Not yet available in oxlint.
     *  @see https://github.com/oxc-project/oxc/issues/1117
    {
      files: ["tailwind/**"],
      rules: {
        "import/no-extraneous-dependencies": "off",
      },
    },
    */
    {
      files: ["**/*"],
      excludeFiles: ["src/lib/**"],
      rules: {
        "eslint/no-restricted-imports": [
          "error",
          restrictedImports
        ],
      },
    },
  ],
})
