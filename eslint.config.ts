import { globalIgnores } from "eslint/config";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";
import pluginPlaywright from "eslint-plugin-playwright";
import pluginVitest from "@vitest/eslint-plugin";
import pluginOxlint from "eslint-plugin-oxlint";
import skipFormatting from "eslint-config-prettier/flat";
import noEmptyStyle from "./eslint-rules/no-empty-style";
import requireScriptSetupLangTs from "./eslint-rules/require-script-setup-lang-ts";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{vue,ts,mts,tsx}"],
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  ...pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,

  {
    ...pluginPlaywright.configs["flat/recommended"],
    files: ["e2e/**/*.{test,spec}.{js,ts,jsx,tsx}"],
  },

  {
    ...pluginVitest.configs.recommended,
    files: ["src/**/__tests__/*"],
  },

  ...pluginOxlint.buildFromOxlintConfigFile(".oxlintrc.json"),

  {
    name: "app/vue-undef-components",
    files: ["**/*.vue"],
    rules: {
      "vue/no-undef-components": [
        "warn",
        {
          ignorePatterns: [
            "^V[A-Z]",
            "^router-view$",
            "^router-link$",
            "^apexchart",
          ],
        },
      ],
    },
  },

  {
    name: "app/no-empty-style",
    files: ["**/*.vue"],
    plugins: {
      "no-empty-style": { rules: { enforce: noEmptyStyle } },
    },
    rules: {
      "no-empty-style/enforce": "warn",
    },
  },

  {
    name: "app/require-script-setup-lang-ts",
    files: ["**/*.vue"],
    plugins: {
      "require-script-setup-lang-ts": {
        rules: { enforce: requireScriptSetupLangTs },
      },
    },
    rules: {
      "require-script-setup-lang-ts/enforce": "error",
    },
  },

  {
    name: "app/vue-block-order",
    files: ["**/*.vue"],
    rules: {
      "vue/block-order": ["error", { order: ["script", "template", "style"] }],
    },
  },

  {
    name: "app/func-style",
    files: ["src/**/*.{ts,tsx,vue}"],
    rules: {
      "func-style": ["warn", "expression", { allowArrowFunctions: true }],
    },
  },

  {
    name: "app/camelcase",
    files: ["src/**/*.{ts,tsx,vue}"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "variable",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/strict-boolean-expressions": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
    },
  },

  {
    name: "app/test-relaxed-rules",
    files: ["src/test/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
    },
  },

  {
    name: "app/router-relaxed-rules",
    files: ["src/router/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "func-style": "off",
    },
  },

  {
    name: "app/mocks-relaxed-rules",
    files: ["src/mocks/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "func-style": "off",
    },
  },

  skipFormatting,
);
