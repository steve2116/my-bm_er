import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,cjs}"],
    rules: {
      "prefer-const": "warn",
    },
  },
]);
