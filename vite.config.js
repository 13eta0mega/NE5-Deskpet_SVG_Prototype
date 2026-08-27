import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages project sites are served below /<repository>/.
  // Use an explicit absolute base so asset URLs work even when a webview
  // opens the page without preserving the trailing slash.
  base: "/NE5-Deskpet_SVG_Prototype/",
});
