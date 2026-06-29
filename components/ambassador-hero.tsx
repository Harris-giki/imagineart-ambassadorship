"use client"

/**
 * AmbassadorHero — the hero text block ("COMMUNITY / AMBASSADORS").
 *
 * Two presentations:
 *   • Desktop (default): rendered INSIDE the cinematic intro as its cross-fade
 *     reveal target — flat jet-black background (`withBackground=false`).
 *   • Mobile: there is no parallax intro, so the hero is shown directly with
 *     `withBackground` → the `imagineart-hero-amb` photo fills the hero behind a
 *     dark scrim for legibility. (Wired up in <HeroIntro/>.)
 *
 * Headline: both lines auto-fit to the SAME fixed width (min(1100px, 90vw)) via
 * <FitText>, so the longer word (AMBASSADORS) resolves smaller — GREYO look.
 * Dark surface → white-at-low-opacity text, per the design system.
 */

import Image from "next/image"
import { FitText } from "@/components/fit-text"

// Shared width for the headline.
const HERO_WIDTH = "min(1100px, 90vw)"

export default function AmbassadorHero({ withBackground = false }: { withBackground?: boolean }) {
  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-center"
    >
      {/* Mobile background photo + legibility scrim (only when withBackground). */}
      {withBackground && (
        <>
          <Image
            src="/images/imagineart-hero-amb.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Darken so the white headline stays readable over the photo. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.7) 100%)",
            }}
          />
        </>
      )}

      {/* Content sits above the photo/scrim. */}
      <div className="relative z-10 flex w-full flex-col items-center px-4">
        {/* Eyebrow */}
        <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[1.8px] text-white/55">
          ImagineArt Ambassador Program
        </span>

        {/* Fit-to-width stacked headline — both lines span HERO_WIDTH exactly. */}
        <div className="mt-5" style={{ width: HERO_WIDTH }}>
          <FitText
            className="text-white"
            style={{
              fontWeight: 600,
              letterSpacing: "-0.02em",
              // Variable-font width axis (Google Sans Flex) → condensed grotesk feel.
              fontStretch: "condensed",
            }}
          >
            COMMUNITY
          </FitText>
          <FitText
            className="-mt-[0.04em] text-white"
            style={{
              fontWeight: 600,
              letterSpacing: "-0.01em",
              fontStretch: "condensed",
            }}
          >
            AMBASSADORS
          </FitText>
        </div>
      </div>
    </section>
  )
}
