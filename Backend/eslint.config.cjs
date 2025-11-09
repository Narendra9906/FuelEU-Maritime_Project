// Convert the legacy .eslintrc.cjs to a minimal flat config programmatically.
// This keeps the project lintable under ESLint v9 without a full manual rewrite.
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  // Global ignores
  { ignores: ["dist/", "node_modules/"] },

  // TypeScript files: use the TypeScript parser and recommended rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules:
      tsPlugin && tsPlugin.configs && tsPlugin.configs.recommended
        ? tsPlugin.configs.recommended.rules
        : {},
  },
];
