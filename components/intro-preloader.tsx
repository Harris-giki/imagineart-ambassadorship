"use client"

/**
 * IntroPreloader
 * =========================================================================
 * A full-screen loader shown on first paint that lifts ONLY once the cinematic
 * intro's parallax assets have loaded — so the scroll-driven parallax plays
 * smoothly with no pop-in. It is deliberately scoped to JUST those assets:
 *
 *   • CinematicIntro broadcasts `intro-progress` ({ loaded, total }) as each of
 *     its images fires onLoad/onError. This preloader listens, fills a bar, and
 *     fades out when loaded === total. Nothing else on the page gates it.
 *   • Because it keys off the intro's actual <Image> load events, it tracks the
 *     real (optimized) URLs the intro requests — not the raw source files.
 *
 * Safety: a 7s timeout lifts the curtain no matter what (slow/failed network).
 * Scroll is locked while visible; restored on lift. SSR-rendered visible so
 * there's never a flash of un-loaded content.
 */

import { useEffect, useState } from "react"

const FALLBACK_TOTAL = 5

export default function IntroPreloader() {
  const [progress, setProgress] = useState(0) // 0..1
  const [lifting, setLifting] = useState(false) // fading out
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    document.body.style.overflow = "hidden" // lock scroll while loading

    let total = FALLBACK_TOTAL
    let done = false

    const finish = () => {
      if (done) return
      done = true
      setProgress(1)
      setLifting(true) // start opacity fade
      window.setTimeout(() => {
        setMounted(false)
        document.body.style.overflow = ""
      }, 520) // match the CSS transition duration below
    }

    const onProgress = (e: Event) => {
      const detail = (e as CustomEvent).detail || {}
      if (detail.total) total = detail.total
      const p = Math.min(1, (detail.loaded ?? 0) / total)
      setProgress(p)
      if (p >= 1) finish()
    }

    window.addEventListener("intro-progress", onProgress as EventListener)
    const safety = window.setTimeout(finish, 7000)

    return () => {
      window.removeEventListener("intro-progress", onProgress as EventListener)
      window.clearTimeout(safety)
      document.body.style.overflow = ""
    }
  }, [])

  if (!mounted) return null

  const pct = Math.round(progress * 100)

  return (
    <div
      aria-hidden={lifting}
      role="status"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ease-out ${
        lifting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* minimal, on-brand: mono wordmark + thin progress line + percentage */}
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[2px] text-white/55">
        ImagineArt
      </span>
      <div className="mt-5 h-px w-[180px] overflow-hidden bg-white/15">
        <div
          className="h-full bg-white transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="mt-3 font-mono text-[10px] tracking-[1.5px] text-white/35 tabular-nums">{pct}%</span>
    </div>
  )
}
