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
  { left: "2%", width: "clamp(220px, 52vw, 720px)", xFrom: -2, xTo: 2, scaleFrom: 0.94, scaleTo: 1.06 },
  { left: "47%", width: "clamp(230px, 53vw, 740px)", xFrom: 3, xTo: -2, scaleFrom: 0.96, scaleTo: 1.08 },
  { left: "24%", width: "clamp(210px, 45vw, 630px)", xFrom: -1, xTo: 2, scaleFrom: 0.92, scaleTo: 1.02 },
  { left: "48%", width: "clamp(220px, 48vw, 675px)", xFrom: 2, xTo: -3, scaleFrom: 0.95, scaleTo: 1.05 },
  { left: "5%", width: "clamp(230px, 52vw, 720px)", xFrom: -2, xTo: 1, scaleFrom: 0.94, scaleTo: 1.07 },
  { left: "34%", width: "clamp(200px, 43vw, 585px)", xFrom: 1, xTo: -1, scaleFrom: 0.9, scaleTo: 1.0 },
  { left: "26%", width: "clamp(220px, 50vw, 675px)", xFrom: 2, xTo: -2, scaleFrom: 0.93, scaleTo: 1.04 },
]

const MAX_CARDS = 7

// Sequential timing: each card's tween starts this far (in timeline seconds)
// after the previous one. Each tween lasts 1s, so STEP < 1 = slight overlap
// (the next card enters when the previous is ~70% across) → continuous but
// clearly one-after-another.
const STEP = 0.55

export default function ShowcaseScrollSection({ images }: { images: ShowcaseImage[] }) {
  const rootRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<HTMLDivElement[]>([])

  // Reduced motion → static stacked; mobile (<768px) → a simple swipe gallery
  // (no pinned/floating effect). `resolved` gates the GSAP setup so it NEVER
  // runs before we know the viewport (avoids pinning on mobile then tearing down).
  const [reduced, setReduced] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [resolved, setResolved] = useState(false)
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    const mq = window.matchMedia("(max-width: 767px)")
    const sync = () => setIsMobile(mq.matches)
    sync()
    setResolved(true)
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  const items = images.slice(0, MAX_CARDS).map((img, i) => ({ ...img, slot: SLOTS[i % SLOTS.length] }))

  // ---- GSAP pin + scrub (desktop only; skipped for mobile & reduced motion) --
  useEffect(() => {
    if (!resolved || reduced || isMobile) return
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
            // Lower than the intro pin (refreshPriority 1) so the intro refreshes
            // first and this pin's start is measured with the intro's pin spacing
            // already in place — otherwise it pins early, over "What You Get".
            refreshPriority: 0,
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

      // Desktop only (mobile renders the gallery instead). Pin length scales
      // with count so the one-by-one sequence has room. ~70% of viewport/card
      // keeps each card to roughly one screen of scroll — enough to read the
      // sequence without a long, mostly-dark pinned stretch (was 120%, which
      // made ~2 screens per card and felt like a big black gap on entry).
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        build(items.length, `+=${items.length * 70}%`)
      })
    }, rootRef)

    return () => ctx.revert()
  }, [resolved, reduced, isMobile, items])

  /* ---------- mobile: CommunityCreations-style swipe gallery -------------- */
  // ONE stable <section> for every mode. It is NEVER swapped for a different
  // node — only its className + inner content change — so GSAP's pin (which
  // wraps this element in a pin-spacer on desktop) can never cause a React
  // "removeChild is not a child" crash when the viewport crosses the breakpoint.
  const desktopAnimated = resolved && !isMobile && !reduced

  return (
    <section
      ref={rootRef}
      aria-label="Showcase"
      className={
        desktopAnimated
          ? "relative h-screen w-full overflow-hidden bg-background"
          : "bg-background"
      }
    >
      {isMobile ? (
        /* ---- mobile: swipe gallery ---- */
        <MobileGalleryContent images={images} />
      ) : reduced ? (
        /* ---- reduced motion: static stacked ---- */
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
      ) : (
        /* ---- desktop: pinned floating cards over a fixed headline ---- */
        <>
          <div
            ref={headlineRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          >
            <Headline />
          </div>
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
        </>
      )}
    </section>
  )
}

/* ---------- shared headline ------------------------------------------------ */
function Headline() {
  return (
    <>
      <h2
        className="h-scale-showcase mx-auto font-display uppercase leading-[0.95] tracking-[-0.02em] text-content-primary"
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

/* ---------- mobile gallery (phone only) ------------------------------------
 * A CommunityCreations-style horizontal swipe gallery — no pinning, no floating
 * effect, just native touch scroll. Left-aligned heading, snap-scroll strip of
 * the showcase images. Used in place of the pinned effect on < 768px. */
function MobileGalleryContent({ images }: { images: ShowcaseImage[] }) {
  return (
    <div className="py-16">
      <div className="container-page">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[1.8px] text-content-tertiary">
          Showcase
        </span>
        <h2
          className="mt-3 font-display uppercase leading-[0.95] tracking-[-0.02em] text-content-primary"
          style={{ fontSize: "clamp(32px, 9vw, 60px)", fontWeight: 600, fontStretch: "condensed" }}
        >
          Lead The New Era Of Art &amp; Creativity
        </h2>
        <p className="mt-4 max-w-[46ch] text-pretty font-sans text-[15px] leading-[1.6] text-content-secondary">
          Work made by creators around the world using ImagineArt. Swipe through the gallery.
        </p>
      </div>

      {/* Full-bleed horizontal snap-scroll strip. All cards share ONE aspect
          ratio (4:5) via object-cover; the last image is dropped. */}
      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.slice(0, -1).map((img) => (
          <div
            key={img.src}
            className="relative aspect-[4/5] w-[72vw] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-2xl ring-1 ring-white/10"
          >
            <Image src={img.src} alt="" fill sizes="72vw" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
