"use client"

/**
 * AmbassadorHero — the text block of the landing hero revealed when the
 * cinematic intro blacks out.
 *
 * Background: seamless jet black (the page token) — the Earth/space image is
 * gone, so the intro's black-out resolves straight into the flat black page.
 *
 * Headline: "COMMUNITY / AMBASSADORS" stacked on two lines, each auto-fitted to
 * fill the SAME fixed-width container (min(1100px, 90vw)). Because both lines
 * fill the same width, the longer word (AMBASSADORS) resolves to a smaller font
 * size automatically — the GREYO-style edge-to-edge look. See <FitText>.
 *
 * The large hero IMAGE lives in a sibling section (AmbassadorHeroImage) right
 * after the intro, so it can scroll through the viewport and drive its own
 * depth parallax. This block is intentionally one viewport tall (it's the
 * intro's cross-fade reveal target).
 *
 * Dark surface → white-at-low-opacity text, per the design system.
 */

import { FitText } from "@/components/fit-text"

// Shared width for the headline (and the image panel below it).
const HERO_WIDTH = "min(1100px, 90vw)"

export default function AmbassadorHero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-center"
    >
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
    </section>
  )
}
