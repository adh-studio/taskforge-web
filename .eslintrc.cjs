/* Configuration ESLint pour un projet React 18 + TypeScript strict. */
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", "docs", "coverage", "*.cjs", "vite.config.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["@typescript-eslint", "react-refresh"],
  rules: {
    // Les providers exposent volontairement leur hook (useBoard, useTheme)
    // dans le meme fichier : on neutralise l'avertissement fast refresh.
    "react-refresh/only-export-components": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
};
