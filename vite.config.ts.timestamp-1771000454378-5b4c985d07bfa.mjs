// vite.config.ts
import { defineConfig } from "file:///C:/Users/Kailash%20Singh/OneDrive/Desktop/electrocare/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Kailash%20Singh/OneDrive/Desktop/electrocare/frontend/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/Kailash%20Singh/OneDrive/Desktop/electrocare/frontend/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Kailash Singh\\OneDrive\\Desktop\\electrocare\\frontend";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};

