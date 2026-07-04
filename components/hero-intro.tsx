"use client"

/**
 * HeroIntro — decides how the top of the page renders by viewport:
 *
 *   • Desktop (≥768px): the full parallax experience — IntroPreloader (which
 *     waits on the parallax assets) + the pinned CinematicIntro that reveals
 *     the hero (the full-bleed imagineart-hero-amb photo with its 3D tilt).
 *   • Mobile (<768px): NO parallax. Start directly on that same photo hero.
 *     No preloader — nothing heavy to wait for.
 *
 * Decision is client-only (matchMedia). Until it resolves we render a plain
 * black full-screen placeholder: it matches both the desktop preloader and the
 * dark hero, so there's no flash and no SSR/hydration mismatch (server and the
 * first client render both output the placeholder).
 */

import { useEffect, useState } from "react"
import CinematicIntro from "@/components/cinematic-intro"
import AmbassadorHeroImage from "@/components/ambassador-hero-image"
import IntroPreloader from "@/components/intro-preloader"

type Mode = "pending" | "mobile" | "desktop"

export default function HeroIntro() {
  const [mode, setMode] = useState<Mode>("pending")

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const apply = () => setMode(mq.matches ? "mobile" : "desktop")
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  // (ScrollTrigger recalculation is handled by the preloader — it refreshes once
  // scroll is unlocked, while still behind the cover — so no refresh here. That
  // avoids refreshing while scroll is locked, which measured a 0 scroll range.)

  // Pre-decision: a FIXED full-screen black cover (z-200, same as the loader)
  // from the very first painted frame. Critical: the AmbassadorHeroImage card
  // below has a negative top margin and would otherwise peek into the first
  // screen and flash `imagineart-hero-amb` before the loader mounts. A fixed
  // cover paints over everything, so there's no flash on either platform.
  if (mode === "pending") {
    return <div className="fixed inset-0 z-[200] bg-background" aria-hidden="true" />
  }

  // Mobile: straight to the full-bleed photo hero, no parallax/loader.
  if (mode === "mobile") {
    return <AmbassadorHeroImage />
  }

  // Desktop: preloader (gated to parallax assets) + the pinned parallax intro,
  // which cross-fades into the full-bleed photo hero.
  return (
    <>
      <IntroPreloader />
      <CinematicIntro>
        <AmbassadorHeroImage />
      </CinematicIntro>
    </>
  )
}
