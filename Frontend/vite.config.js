import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Planet Rush",
        short_name: "Planet Rush",
        description: "Let's start Challenge!",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/icons/PlanetRush_192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/PlanetRush_512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/PlanetRush_512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@components": "/src/components",
      "@styles": "/src/styles",
    },
  },
});
