import fs from "fs/promises"
import path from "path"

async function createBasicIcon(size, outputPath) {
  // Create a simple SVG icon with the given size
  const svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#4285f4"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size / 2}"
        text-anchor="middle" dy="${size / 6}" fill="white">TT</text>
</svg>`

  try {
    await fs.writeFile(outputPath, svgContent, "utf8")
    console.log(`Created icon: ${outputPath}`)
  } catch (err) {
    console.error(`Failed to create icon ${outputPath}:`, err)
  }
}

async function createIcons() {
  // Ensure the directories exist
  const distIconsDir = path.join("dist", "icons")
  const publicIconsDir = path.join("public", "icons")

  try {
    await fs.mkdir(distIconsDir, { recursive: true })
    await fs.mkdir(publicIconsDir, { recursive: true })

    // Create icons in both directories
    const sizes = [16, 48, 128]
    for (const size of sizes) {
      await createBasicIcon(size, path.join(distIconsDir, `icon${size}.svg`))
      await createBasicIcon(size, path.join(publicIconsDir, `icon${size}.svg`))
    }

    console.log("All icons created successfully!")
  } catch (err) {
    console.error("Error creating icons:", err)
  }
}

createIcons()
