import { defineConfig } from "vite"
import { resolve } from "path"
import fs from "fs"
import path from "path"

// Custom plugin to copy manifest and static assets
function copyManifestPlugin() {
  return {
    name: "copy-manifest",
    // This will execute after the build is complete
    closeBundle: async () => {
      // Copy manifest.json to dist
      try {
        await fs.promises.copyFile("manifest.json", "dist/manifest.json")
        console.log("Copied manifest.json to dist/")
      } catch (err) {
        console.error("Error copying manifest.json:", err)
      }

      // Ensure icons directory exists
      try {
        if (!fs.existsSync("dist/icons")) {
          await fs.promises.mkdir("dist/icons", { recursive: true })
        }

        // Copy icons if they exist
        if (fs.existsSync("public/icons")) {
          const icons = await fs.promises.readdir("public/icons")
          for (const icon of icons) {
            await fs.promises.copyFile(
              path.join("public/icons", icon),
              path.join("dist/icons", icon),
            )
          }
          console.log("Copied icons to dist/icons/")
        }
      } catch (err) {
        console.warn("Warning: Could not copy icons:", err)
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        background: resolve(__dirname, "src/background.js"),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [copyManifestPlugin()],
})
