"use client"

/**
 * AmbassadorWhatYouGet — the "What You Get" section, rebuilt as a services-style
 * accordion (matching the supplied reference):
 *
 *   Header row: huge flush-left heading + short right-aligned description.
 *   Below, two columns: a wireframe Globe on the LEFT, the accordion on the
 *   RIGHT (each row: dots / Title / TAGLINE / chevron; click to expand).
 *
 * Behavior:
 *   • One row open at a time (accordion); first row open by default.
 *   • Row title highlights light purple on hover / when open (FAQ color).
 *   • Expand/collapse animates height (grid-rows 0fr→1fr) + opacity ~300ms.
 *   • prefers-reduced-motion → instant (motion-reduce:transition-none).
 *   • The 5-dot indicator increments its filled count per row (decorative).
 *
 * Background is the seamless jet-black page token; rows are separated by
 * hairline borders only (no fills, no grid texture).
 * Uses only existing design tokens (background / border-primary / content-*),
 * the shared container width, and the project fonts.
 */

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Reveal } from "@/components/primitives/Reveal"
import Globe from "@/components/globe"

/* ---------- content -------------------------------------------------------- */

type Item = { title: string; tagline: string; body: string }

const ITEMS: Item[] = [
  {
    title: "Grow Your Local Scene",
    tagline: "Meetups, Workshops, Hackathons",
    body: "Bring the creators around you together, whether that's your campus or your whole city. We back you with event funding, ready-to-use content, and promotion across ImagineArt's channels to help your community grow.",
  },
  {
    title: "Create & Experiment",
    tagline: "Live Demos, Prototypes, Credits",
    body: "Teach from experience by running live demos and prototyping workflows, uplifting the creators around you with the power of AI in art and design. Get monthly ImagineArt credits to power your workshops and projects.",
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
    body: "Wear a verified 'ImagineArt Student Ambassador' badge and get a featured profile across our community spaces — a standout addition to your résumé and portfolio.",
  },
]

const DOT_COUNT = 5

/* ---------- small parts ---------------------------------------------------- */

/** Five dots, the first `filled` of them bright, the rest dimmed. */
function Dots({ filled }: { filled: number }) {
  return (
    <span className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <span
          key={i}
          className={`h-[7px] w-[7px] rounded-full ${i < filled ? "bg-content-primary" : "bg-white/20"}`}
        />
      ))}
    </span>
  )
}

function AccordionRow({
  item,
  filled,
  open,
  onToggle,
}: {
  item: Item
  filled: number
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-border-primary">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-start gap-5 py-6 text-left md:gap-10"
      >
        {/* dots — aligned to the title line; hidden on very small screens */}
        <span className="mt-1 hidden sm:block">
          <Dots filled={filled} />
        </span>

        {/* title + tagline — title highlights light purple on hover / when open
            (matches the FAQ open-state color) */}
        <span className="min-w-0 flex-1">
          <span
            className={`block font-sans text-[18px] font-medium tracking-[-0.01em] transition-colors md:text-[19px] ${
              open ? "text-[#C8AAFF]" : "text-content-primary group-hover:text-[#C8AAFF]"
            }`}
          >
            {item.title}
          </span>
          <span className="mt-1.5 block font-mono text-[11px] font-medium uppercase tracking-[1.6px] text-content-tertiary">
            {item.tagline}
          </span>
        </span>

        {/* chevron — rotates when open */}
        <ChevronDown
          size={20}
          strokeWidth={1.75}
          className={`mt-1 shrink-0 text-content-secondary transition-transform duration-300 ease-out motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* expanding body */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {/* left padding aligns the body with the title column (dots + gap) */}
          <p className="max-w-[64ch] pb-7 font-sans text-[15.5px] leading-[1.72] text-content-secondary sm:pl-[calc(1.25rem+var(--dots-w))] md:pl-[calc(2.5rem+var(--dots-w))]">
            {item.body}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------- section -------------------------------------------------------- */

export default function AmbassadorWhatYouGet() {
  // Single open row at a time; first row open by default.
  const [openIndex, setOpenIndex] = useState(0)

  // Only mount the Globe on lg+ (where it's visible). Avoids its world-data
  // fetch + 60fps SVG redraw running on phones where the column is hidden.
  const [showGlobe, setShowGlobe] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const sync = () => setShowGlobe(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  return (
    <section
      id="what-you-get"
      // The hero-to-section gap lives HERE, on the <section> — NOT on the
      // .container-page div below, whose `padding: 0 32px` rule zeroes vertical
      // padding and would silently kill any pt/pb utility placed on it. Moderate
      // on mobile, generous on desktop.
      className="relative bg-background pt-12 pb-16 md:pt-28 md:pb-24"
      // width of the dots cluster, used to indent the expanded body text
      style={{ ["--dots-w" as string]: "59px" }}
    >
      {/* Faint grid backdrop behind the header — fades out before the body
          (matches the reference). Kept subtle so the jet-black stays dominant. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "clamp(64px, 7vw, 120px) clamp(64px, 7vw, 120px)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 42%, transparent 72%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 42%, transparent 72%)",
        }}
      />
      <div className="container-page relative z-10">
        {/* header — two-tone stacked headline + purple accent underline + subtext */}
        <Reveal className="max-w-[920px]">
          <h2
            className="font-display leading-none tracking-[-0.01em]"
            style={{ fontSize: "clamp(38px, 7vw, 88px)", fontWeight: 600 }}
          >
            <span className="block text-content-primary">What&apos;s In It</span>
            <span className="block text-white/30">For You</span>
          </h2>

          {/* purple accent underline (soft glow) */}
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

        {/* two columns: globe on the left, accordion on the right */}
        <div className="mt-12 flex flex-col gap-12 md:mt-16 lg:flex-row lg:items-center lg:gap-16">
          {/* LEFT — the globe, vertically centered against the accordion list.
              Hidden on small screens where there's no side column. */}
          <div className="hidden lg:block lg:w-[42%] lg:shrink-0">
            <div className="mx-auto aspect-square w-full max-w-[460px]">
              {showGlobe && <Globe />}
            </div>
          </div>

          {/* RIGHT — the accordion + learn more link */}
          <div className="min-w-0 flex-1">
            <Reveal className="border-t border-border-primary">
              {ITEMS.map((item, i) => (
                <AccordionRow
                  key={item.title}
                  item={item}
                  filled={i + 1}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
