"use client"

/**
 * ShowcaseScrollSection
 * =========================================================================
 * A pinned "showcase" section: a large all-caps headline sits centered and
 * FIXED while floating image cards drift UP and across ON TOP of it as you
 * scroll. The headline never moves until every image has scrolled past the
 * top; then the section releases to normal scroll.
 *
 * Mechanic (GSAP ScrollTrigger):
 *   • The section is PINNED when its top hits the top of the viewport, and a
 *     timeline is SCRUBBED 1:1 to scroll for the pin distance (~200vh desktop).
 *   • BACKGROUND layer (z-10): the headline. It only fades in at the very start
 *     (autoAlpha 0→1) then holds perfectly still — no transform.
 *   • FOREGROUND layer (z-20): each image card translates from ~+120vh (below)
 *     to ~-130vh (past the top), scrubbed. Per-card start/end distances differ
 *     (parallax) so they stagger instead of moving as one block; small x drift
 *     + scale change add depth. GPU transforms only (y/x/scale/opacity).
 *   • RELEASE: at progress 1 the pin ends (GSAP pinSpacing) → normal scroll.
 *
 * Responsive / a11y via gsap.matchMedia():
 *   • desktop : all cards, travel ×1.0, pin "+=200%".
 *   • mobile  : first 4 cards (rest hidden), travel ×0.8, pin "+=120%".
 *   • reduced-motion: handled OUTSIDE GSAP — we render a static stacked layout
 *     (headline + a simple image column) with normal scroll. See `reduced`.
 */

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { ShowcaseImage } from "@/lib/showcase-images"

gsap.registerPlugin(ScrollTrigger)

/* ---------- collage slot presets ------------------------------------------
 * Scattered (not a grid). Each slot: horizontal position + size + a little
 * x-drift/scale for depth. Cards are now BIG (≈38–47vw wide on desktop) and
 * varied. Vertical travel is no longer per-slot — every card runs the same
 * below→above path, but the timeline plays them ONE BY ONE (see build()). */
type Slot = {
  left: string
  width: string
  xFrom: number // x drift in % of card width (xPercent)
  xTo: number
  scaleFrom: number
  scaleTo: number
}

const SLOTS: Slot[] = [
  { left: "4%", width: "clamp(200px, 46vw, 640px)", xFrom: -2, xTo: 2, scaleFrom: 0.94, scaleTo: 1.06 },
  { left: "49%", width: "clamp(210px, 47vw, 660px)", xFrom: 3, xTo: -2, scaleFrom: 0.96, scaleTo: 1.08 },
  { left: "26%", width: "clamp(190px, 40vw, 560px)", xFrom: -1, xTo: 2, scaleFrom: 0.92, scaleTo: 1.02 },
  { left: "50%", width: "clamp(200px, 43vw, 600px)", xFrom: 2, xTo: -3, scaleFrom: 0.95, scaleTo: 1.05 },
  { left: "7%", width: "clamp(210px, 46vw, 640px)", xFrom: -2, xTo: 1, scaleFrom: 0.94, scaleTo: 1.07 },
  { left: "36%", width: "clamp(180px, 38vw, 520px)", xFrom: 1, xTo: -1, scaleFrom: 0.9, scaleTo: 1.0 },
  { left: "28%", width: "clamp(200px, 44vw, 600px)", xFrom: 2, xTo: -2, scaleFrom: 0.93, scaleTo: 1.04 },
]

const MAX_CARDS = 7

// Sequential timing: each card's tween starts this far (in timeline seconds)
// after the previous one. Each tween lasts 1s, so STEP < 1 = slight overlap
// (the next card enters when the previous is ~70% across) → continuous but
// clearly one-after-another.
const STEP = 0.7

export default function ShowcaseScrollSection({ images }: { images: ShowcaseImage[] }) {
  const rootRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<HTMLDivElement[]>([])

  // Reduced motion is handled with a different (static) DOM, so track it in
  // React. Starts false (matches SSR) then syncs on mount → no hydration drift.
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  const items = images.slice(0, MAX_CARDS).map((img, i) => ({ ...img, slot: SLOTS[i % SLOTS.length] }))

  // ---- GSAP pin + scrub (skipped entirely for reduced motion) -------------
  useEffect(() => {
    if (reduced) return
    const cards = cardRefs.current.filter(Boolean)
    if (!cards.length) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      const build = (count: number, end: string) => {
        const active = cards.slice(0, count)
        const hidden = cards.slice(count)
        // Cards beyond the active count are hidden (mobile shows fewer).
        gsap.set(hidden, { autoAlpha: 0, display: "none" })
        gsap.set(active, { autoAlpha: 1, display: "block", willChange: "transform" })

        // Start every card just below the viewport (so none show before its turn).
        const yStart = () => window.innerHeight * 1.12 // 112vh down
        // End fully above the top: top edge cleared by the card's own height + margin.
        const yEnd = (el: HTMLElement) => -(el.offsetHeight + window.innerHeight * 0.15)

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end, // pin distance — scales with card count so each gets room
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true, // recompute vh/height values on resize
          },
        })

        // Headline: fade in at the very start, then hold (no movement) for the
        // whole pin so it stays put until every card has finished crossing.
        tl.fromTo(headlineRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0)

        // SEQUENTIAL: each card's tween is placed at `i * STEP`, not 0, so they
        // travel up & past the headline one after another (slight overlap).
        active.forEach((el, i) => {
          const s = items[i].slot
          tl.fromTo(
            el,
            { y: yStart, xPercent: s.xFrom, scale: s.scaleFrom },
            { y: () => yEnd(el), xPercent: s.xTo, scale: s.scaleTo, duration: 1 },
            i * STEP, // ← position on the timeline: one-by-one
          )
        })
      }

      // Desktop: all cards; pin length scales with count so the one-by-one
      // sequence has room to play out (≈120% of viewport per card).
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        build(items.length, `+=${items.length * 120}%`)
      })

      // Mobile: fewer cards (max 4), shorter pin (≈90% per card).
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const count = Math.min(4, items.length)
        build(count, `+=${count * 90}%`)
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduced, items])

  /* ---------- reduced motion: static stacked layout, normal scroll -------- */
  if (reduced) {
    return (
      <section className="bg-background" aria-label="Showcase">
        <div className="container-page py-24 text-center md:py-32">
          <Headline />
          <div className="mt-12 flex flex-col items-center gap-6">
            {items.map((it) => (
              <Image
                key={it.src}
                src={it.src}
                width={it.width}
                height={it.height}
                alt=""
                sizes="(max-width: 520px) 90vw, 460px"
                className="h-auto w-full max-w-[460px] rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* ---------- animated (pinned) layout ----------------------------------- */
  return (
    <section ref={rootRef} className="relative h-screen w-full overflow-hidden bg-background" aria-label="Showcase">
      {/* BACKGROUND — centered headline (fixed; only fades in). */}
      <div ref={headlineRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <Headline />
      </div>

      {/* FOREGROUND — floating image cards that glide up over the headline. */}
      <div className="absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
        {items.map((it, i) => (
          <div
            key={it.src}
            ref={(el) => {
              if (el) cardRefs.current[i] = el
            }}
            className="absolute top-0 overflow-hidden rounded-2xl shadow-[0_24px_70px_-18px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
            style={{ left: it.slot.left, width: it.slot.width, willChange: "transform" }}
          >
            <Image
              src={it.src}
              width={it.width}
              height={it.height}
              alt=""
              draggable={false}
              sizes="(max-width: 767px) 80vw, 45vw"
              className="block h-auto w-full select-none"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- shared headline ------------------------------------------------ */
function Headline() {
  return (
    <>
      <h2
        className="mx-auto font-display uppercase leading-[0.95] tracking-[-0.02em] text-content-primary"
        style={{
          // Smaller + fluid so it never touches the edges: caps at ~78vw width
          // and a much smaller max font-size than before (was 120px).
          fontSize: "clamp(26px, 5.2vw, 76px)",
          fontWeight: 600,
          fontStretch: "condensed",
          maxWidth: "min(78vw, 900px)",
        }}
      >
        Lead The New Era Of Art &amp; Creativity
      </h2>
      <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[1.8px] text-content-tertiary">
        ImagineArt Community Ambassadors
      </p>
    </>
  )
}
