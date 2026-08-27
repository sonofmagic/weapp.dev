import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const source = fileURLToPath(new URL('../public/og.svg', import.meta.url))
const output = fileURLToPath(new URL('../public/og.png', import.meta.url))

await sharp(source, { density: 144 })
  .resize(1200, 630)
  .png({ compressionLevel: 9, palette: true })
  .toFile(output)
