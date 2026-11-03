import vitestEslint from "@vitest/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintPluginPrettierRecommended,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "no-duplicate-imports": "error",
      "no-lone-blocks": "warn",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "no-unneeded-ternary": "error",
      "no-warning-comments": "warn",
      "no-param-reassign": ["error", { props: false }],
      "prefer-template": "error",
      "no-console": "warn",
      "no-debugger": "warn",

      "react/jsx-pascal-case": "error",
      "react/jsx-boolean-value": "error",
      "react/jsx-no-target-blank": "error",
      "react/jsx-no-literals": ["warn", { noStrings: false }],

      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // side effects
            ["^\\u0000"],
            // External packages
            ["^react", "^next", "^axios", "^zustand", "^@?\\w"],
            // types
            ["^type:"],
            // api, helpers
            ["^@/services/(.*)$"],
            // shared UI and hooks
            ["^@/shared/components/(.*)$", "^@/shared/hooks/(.*)$"],
            // modules
            ["^@/modules/(.*)$"],
            // utils
            ["^@/utils/(.*)$", "^@/(.*)$"],
          ],
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "should", "has", "can"],
        },
      ],
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "with-single-extends" },
      ],
    },
  },
  {
    files: ["src/**/*.{test,spec}.{ts,tsx}"],
    plugins: { vitest: vitestEslint },
    rules: {
      ...vitestEslint.configs.recommended.rules,
    },
    settings: { vitest: { typecheck: true } },
    languageOptions: {
      globals: { ...vitestEslint.environments.env.globals },
    },
  },
]);

export default eslintConfig;
