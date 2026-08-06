import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssTarget: "chrome100",
    rollupOptions: {
      output: {
        // Keep the animation engine in its own chunk so the app shell stays small.
        manualChunks: {
          gsap: ["gsap", "gsap/ScrollTrigger", "gsap/Flip", "gsap/MotionPathPlugin"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
