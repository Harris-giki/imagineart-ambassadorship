/**
 * getShowcaseImages — server-only helper that auto-discovers the showcase
 * images so we never hardcode filenames. Reads /public/showcase-images at
 * render time and returns web paths (e.g. "/showcase-images/1.jpeg"), sorted
 * numerically (1, 2, … 10).
 *
 * To add/remove showcase images: just drop files into /public/showcase-images
 * (jpg / jpeg / png / webp / avif). No code change needed.
 */

import fs from "fs"
import path from "path"

export function getShowcaseImages(): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "showcase-images")
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/showcase-images/${f}`)
  } catch {
    return []
  }
}
