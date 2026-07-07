import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" so the build works on GitHub Pages (same setup as StudyHub)
export default defineConfig({
  plugins: [react()],
  base: "./",
});
