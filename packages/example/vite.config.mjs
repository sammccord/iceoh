/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      iceoh: path.resolve(__dirname, "../iceoh/src/index.ts"),
    },
  },
});
