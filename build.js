// Build script for copying files
import fs from "fs/promises"
import path from "path"

async function copyFiles() {
  try {
    // Make sure dist directory exists
    await fs.mkdir("dist", { recursive: true })

    // Copy manifest.json
    await fs.copyFile("manifest.json", "dist/manifest.json")
    console.log("Copied manifest.json to dist/")

    // Create icons directory
    await fs.mkdir("dist/icons", { recursive: true })

    // Copy any existing icons if they exist
    try {
      const icons = await fs.readdir("public/icons")
      for (const icon of icons) {
        await fs.copyFile(path.join("public/icons", icon), path.join("dist/icons", icon))
      }
      console.log("Copied icons to dist/icons/")
    } catch (err) {
      console.warn("Warning: No icons found in public/icons/")
    }

    // Copy popup.html if it's not already being processed by Vite
    try {
      const exists = await fs
        .access("dist/popup.html")
        .then(() => true)
        .catch(() => false)
      if (!exists) {
        await fs.copyFile("popup.html", "dist/popup.html")
        console.log("Copied popup.html to dist/")
      }
    } catch (err) {
      console.warn("Warning: Could not check/copy popup.html:", err)
    }
  } catch (error) {
    console.error("Error copying files:", error)
  }
}

// Call the function
copyFiles()
