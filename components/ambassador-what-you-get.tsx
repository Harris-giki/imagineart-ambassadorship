"use client"

/**
 * AmbassadorWhatYouGet — "What's In It / For You".
 *
 *   Header (normal flow): two-tone stacked headline + purple underline + subtext.
 *
 *   Below it, a PINNED scroll carousel (desktop, lg+, no reduced-motion):
 *   the wireframe Globe holds on the left while ONE item (heading + tagline +
 *   body) shows on the right, vertically centered against the globe. Scrolling
 *   advances through the items with a crossfade; a single 5-dot row marks the
 *   active step — the highlight moves horizontally across the fixed grid (colour
 *   only, the dots never animate position).
 *
 *   Mobile / reduced-motion: a plain stacked list of every item (no pin).
 */

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Reveal } from "@/components/primitives/Reveal"
import Globe from "@/components/globe"

gsap.registerPlugin(ScrollTrigger)

/* ---------- content -------------------------------------------------------- */

type Item = { title: string; tagline: string; body: string }

const ITEMS: Item[] = [
  {
    title: "Grow Your Local Community",
    tagline: "Meetups, Workshops, Hackathons",
    body: "Bring the creators around you together, whether that's your campus or your whole city. Connect with like-minded people, host and organize events, and grow your community — backed by ready-to-use content, promotion across ImagineArt's channels, and event funding.",
  },
  {
    title: "Create & Experiment",
    tagline: "Workshops, Experts, Prototypes",
    body: "Organize workshops with experts to lead your community into creating with the power of AI in art and design, prototyping new workflows and sharing what you learn along the way.",
  },
  {
    title: "Shape The Product",
    tagline: "Early Access, Feedback Sessions",
    body: "Bring your community's perspective straight to the ImagineArt team. Get pre-release features and a seat in feedback sessions that influence what we build next.",
  },
  {
    title: "Connect & Contribute",
    tagline: "Private Ambassador Network",
    body: "Swap what's working with ambassadors in other cities and on other campuses, and help shape how the program grows, through a private channel with fellow ambassadors and the ImagineArt team.",
  },
  {
    title: "Get Recognized",
    tagline: "Official Badge, Featured Profile",
    body: "Wear a verified 'ImagineArt Ambassador' badge and get a featured profile across our community spaces — a standout addition to your portfolio.",
  },
]

/* ---------- small parts ---------------------------------------------------- */

/** Fixed row of dots; the `active` one is bright, the rest dimmed. The highlight
 *  moves horizontally as the active step changes (colour only — no motion). */
function Dots({ active }: { active: number }) {
  return (
    <span className="flex items-center gap-2.5" aria-hidden="true">
      {ITEMS.map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-colors duration-300 ${
            i === active ? "bg-content-primary" : "bg-white/20"
          }`}
        />
      ))}
    </span>
  )
}

/** One item's heading + tagline + body (used in both the pinned card and list). */
function ItemContent({ item }: { item: Item }) {
  return (
    <>
      <h3
        className="font-sans font-medium tracking-[-0.01em] text-content-brand"
        style={{ fontSize: "clamp(24px, 2.5vw, 36px)" }}
      >
        {item.title}
      </h3>
      <span className="mt-2.5 block font-mono text-[11px] font-medium uppercase tracking-[1.8px] text-content-tertiary">
        {item.tagline}
      </span>
      <p className="mt-5 max-w-[54ch] text-pretty font-sans text-[16px] leading-[1.75] text-content-secondary md:text-[17px]">
        {item.body}
      </p>
    </>
  )
}

/* ---------- section -------------------------------------------------------- */

export default function AmbassadorWhatYouGet() {
  const [active, setActive] = useState(0)
  // Pin the carousel only on lg+ without reduced-motion. Starts false so SSR and
  // the first client render both output the static list (no hydration mismatch);
  // the effect flips it on after mount.
  const [pinnable, setPinnable] = useState(false)
  const pinRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)

  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setPinnable(lg.matches && !reduced.matches)
    sync()
    lg.addEventListener("change", sync)
    reduced.addEventListener("change", sync)
    return () => {
      lg.removeEventListener("change", sync)
      reduced.removeEventListener("change", sync)
    }
  }, [])

  useEffect(() => {
    if (!pinnable || !pinRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: `+=${ITEMS.length * 62}%`,
        pin: true,
        anticipatePin: 1,
        // Lower than the intro pin (priority 1) so the intro measures first.
        refreshPriority: 0,
        onUpdate: (self) => {
          const idx = Math.min(ITEMS.length - 1, Math.floor(self.progress * ITEMS.length))
          if (idx !== activeRef.current) {
            activeRef.current = idx
            setActive(idx)
          }
        },
      })
    }, pinRef)
    return () => ctx.revert()
  }, [pinnable])

  return (
    <section
      id="what-you-get"
      className="relative bg-background pt-12 pb-16 md:pt-28 md:pb-24"
    >
      {/* Faint grid backdrop behind the header — fades out before the body. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[70vh]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "clamp(64px, 7vw, 120px) clamp(64px, 7vw, 120px)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 42%, transparent 72%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 42%, transparent 72%)",
        }}
      />

      {/* header */}
      <div className="container-page relative z-10">
        <Reveal className="max-w-[920px]">
          <h2
            className="font-display leading-none tracking-[-0.01em]"
            style={{ fontSize: "clamp(38px, 7vw, 88px)", fontWeight: 600 }}
          >
            <span className="block text-content-primary">What&apos;s In It</span>
            <span className="block text-white/30">For You</span>
          </h2>
          <div
            aria-hidden
            className="mt-5 h-[3px] w-[clamp(150px,24vw,340px)] rounded-full md:mt-6"
            style={{
              background: "linear-gradient(90deg, #8A3FFC 0%, rgba(138,63,252,0.6) 55%, transparent 100%)",
              boxShadow: "0 0 22px rgba(138,63,252,0.5)",
            }}
          />
          <p className="mt-7 max-w-[46ch] text-pretty font-sans text-[16px] leading-[1.7] text-content-secondary md:mt-9 md:text-[18px]">
            The ImagineArt Ambassador Program gives you everything you need to build a thriving creative
            community, whether that&apos;s your campus or your city.
          </p>
        </Reveal>
      </div>

      {pinnable ? (
        /* ---- desktop: pinned scroll carousel ---- */
        <div ref={pinRef} className="relative z-10 h-screen">
          <div className="container-page flex h-full items-center gap-16">
            {/* globe (left) */}
            <div className="w-[42%] shrink-0">
              <div className="mx-auto aspect-square w-full max-w-[460px]">
                <Globe />
              </div>
            </div>

            {/* one item at a time (right), centered against the globe */}
            <div className="min-w-0 flex-1">
              <Dots active={active} />
              <div className="relative mt-8 min-h-[300px]">
                {ITEMS.map((item, i) => (
                  <div
                    key={item.title}
                    className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                      i === active ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                  >
                    <ItemContent item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ---- mobile / reduced-motion: plain stacked list ---- */
        <div className="container-page relative z-10 mt-10 border-t border-border-primary">
          {ITEMS.map((item) => (
            <div key={item.title} className="border-b border-border-primary py-7">
              <ItemContent item={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
