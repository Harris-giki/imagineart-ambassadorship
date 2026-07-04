/**
 * Shared handle to the single Lenis instance created in <SmoothScroll>.
 *
 * The navbar needs to drive scrolling THROUGH Lenis (lenis.scrollTo) rather than
 * letting the browser do a native hash jump — a native jump sets window.scrollY
 * directly, which fights Lenis' virtual scroll position and interrupts the
 * GSAP-pinned parallax (the two scroll systems desync → jank). Routing anchor
 * clicks through this instance keeps the pin/scrub perfectly in step.
 *
 * SmoothScroll sets it on mount and clears it on unmount; consumers read it and
 * fall back to native behavior when it's null (e.g. prefers-reduced-motion, where
 * Lenis is never started).
 */
import type Lenis from "lenis"

let instance: Lenis | null = null

export const setLenisInstance = (l: Lenis | null) => {
  instance = l
}

export const getLenisInstance = (): Lenis | null => instance
