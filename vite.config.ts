import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages project site: served from
  // https://<owner>.github.io/Progetto-Build-/ — every asset URL must be
  // prefixed with this, not just root ("/"). Bundled JS/CSS get this
  // automatically from Vite; hand-written absolute paths (logo, favicon,
  // photo URLs from the generated data) are resolved through
  // import.meta.env.BASE_URL / %BASE_URL% instead — see src/lib/asset.ts.
  base: "/Progetto-Build-/",
  plugins: [react()],
  build: {
    target: "es2020",
    sourcemap: false,
  },
});
