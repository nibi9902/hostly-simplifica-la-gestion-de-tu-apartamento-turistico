import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Chunk warning size: 600KB (no més estricte per features.js que té contingut pesat)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — canvi rar, cache molt llarg
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // UI libs grans separades per cache eficient
          // (lucide-react NO es chunk manual perquè trenca el tree-shake — només inclou les icones realment usades)
          "framer-vendor": ["framer-motion"],
          "radix-vendor": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-dialog",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-tabs",
            "@radix-ui/react-popover",
          ],
          // Animacions complexes — només a hero/landing
          "gsap-vendor": ["gsap"],
          // i18n
          "i18n-vendor": ["i18next", "react-i18next", "i18next-browser-languagedetector"],
        },
      },
    },
  },
}));
