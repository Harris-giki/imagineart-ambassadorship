/**
 * getShowcaseImages — server-only helper that auto-discovers the showcase
 * images so we never hardcode filenames. Reads /public/showcase-images at
 * render time and returns each image's web path + intrinsic dimensions
 * (needed so next/image can optimize them while keeping natural aspect),
 * sorted numerically (1, 2, … 10).
 *
 * To add/remove showcase images: just drop files into /public/showcase-images
 * (jpg / jpeg / png / webp / avif). No code change needed.
 */

import fs from "fs"
import path from "path"
import { imageSize } from "image-size"

export type ShowcaseImage = { src: string; width: number; height: number }

export function getShowcaseImages(): ShowcaseImage[] {
  try {
    const dir = path.join(process.cwd(), "public", "showcase-images")
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => {
        const { width, height } = imageSize(fs.readFileSync(path.join(dir, f)))
        return { src: `/showcase-images/${f}`, width: width ?? 1200, height: height ?? 800 }
      })
  } catch {
    return []
  }
}
