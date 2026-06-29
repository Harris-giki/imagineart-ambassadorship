/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Image Optimization ON (was `unoptimized: true`, which disabled it).
    // On Vercel this serves resized, modern-format images from the edge CDN —
    // the 13MB/10MB source PNGs get delivered as small AVIF/WebP sized to each
    // device. This is the main "render super fast" win; assets stay in /public.
    formats: ["image/avif", "image/webp"],
    // Cache optimized variants at the edge for ~31 days.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
}

export default nextConfig
