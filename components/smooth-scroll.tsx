"use client"

/**
 * SmoothScroll
 * =========================================================================
 * Site-wide smooth scrolling via Lenis, synced to GSAP's ScrollTrigger so the
 * pinned cinematic intro stays perfectly in step with the eased scroll
 * position (otherwise the pin and the scrub would fight the smoothing).
 *
 * Wiring (the canonical Lenis × GSAP recipe):
 *   • lenis.on("scroll", ScrollTrigger.update) — ScrollTrigger reads Lenis'
 *     virtual scroll position instead of the native one.
 *   • gsap.ticker drives lenis.raf() — one shared RAF loop, no drift.
 *   • lagSmoothing(0) — keep GSAP and Lenis on the same clock.
 *
 * Accessibility: when prefers-reduced-motion is set we DON'T start Lenis, so
 * native (instant) scrolling is preserved.
 *
 * Mounted once in the root layout; renders nothing.
 */

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { setLenisInstance } from "@/lib/lenis-instance"

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll() {
  useEffect(() => {
    // Respect reduced-motion: skip smoothing entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      duration: 1.1, // higher = silkier / slower settle
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      touchMultiplier: 1.5, // keep touch feeling natural, not floaty
    })

    // Expose the instance so the navbar can drive smooth anchor scrolling
    // through Lenis (see lib/lenis-instance).
    setLenisInstance(lenis)

    // Keep ScrollTrigger in sync with Lenis' virtual scroll.
    lenis.on("scroll", ScrollTrigger.update)

    // Single shared RAF loop driven by GSAP's ticker.
    const onTick = (time: number) => lenis.raf(time * 1000) // gsap time is seconds
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Recalculate ScrollTrigger positions whenever the layout settles after
    // first paint — webfonts swapping in (FitText / condensed headings) and
    // late-loading images both change section heights and would otherwise
    // leave pinned triggers (intro, showcase) measuring stale start positions.
    const refresh = () => ScrollTrigger.refresh()
    if ((document as any).fonts?.ready) (document as any).fonts.ready.then(refresh).catch(() => {})
    window.addEventListener("load", refresh)

    return () => {
      gsap.ticker.remove(onTick)
      window.removeEventListener("load", refresh)
      setLenisInstance(null)
      lenis.destroy()
    }
  }, [])

  return null
}
