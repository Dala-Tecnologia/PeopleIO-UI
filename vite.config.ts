import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const rawApiBaseUrl = env.VITE_API_BASE_URL;

  let proxyTarget = "https://peopleio-api-dev.azurewebsites.net";
  if (rawApiBaseUrl) {
    try {
      proxyTarget = new URL(rawApiBaseUrl).origin;
    } catch {
      // Keep default target if env var is not a complete URL.
    }
  }

  return {
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
})
