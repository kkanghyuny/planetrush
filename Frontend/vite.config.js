import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return defineConfig({
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Planet Rush",
          short_name: "Planet Rush",
          description: "Let's start Challenge!",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
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
    // server: {
    //   https: {
    //     cert: fs.readFileSync(path.resolve(__dirname, "server.pem")),
    //     key: fs.readFileSync(path.resolve(__dirname, "server-key.pem")),
    //   },
    // },
    resolve: {
      alias: {
        "@components": "/src/components",
        "@styles": "/src/styles",
      },
    },
    define: {
      global: "window", // global 변수를 window로 설정
      "process.env": env, //환경변수를 env 파일로 정의
    },
  });
};
