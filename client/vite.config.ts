import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "app": path.resolve(__dirname, "./src"),
      "src": path.resolve(__dirname, "./src"),
      "apis": path.resolve(__dirname, "./src/apis"),
      "scss": path.resolve(__dirname, "./src/styles"),
      "store": path.resolve(__dirname, "./src/store"),
      "actions": path.resolve(__dirname, "./src/store/actions"),
      "reducers": path.resolve(__dirname, "./src/store/reducers"),
      "pages": path.resolve(__dirname, "./src/pages"),
      "components": path.resolve(__dirname, "./src/components"),
      "UI": path.resolve(__dirname, "./src/components/UI")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 2000
  }
})
