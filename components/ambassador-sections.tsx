/**
 * AmbassadorSections — the text-based landing content, built from the
 * Ambassador Program brief and structured like the Anthropic Community
 * Ambassadors page: What You Get, Who We Want, How It Works.
 *
 * Pure design-system styling: white surfaces, black text, Title Case headings,
 * mono uppercase eyebrows, purple used only as a tiny accent. Section rhythm is
 * eyebrow → heading → body, separated by hairline borders.
 */

import { Users, Sparkles, GraduationCap, type LucideIcon } from "lucide-react"
import { Reveal } from "@/components/primitives/Reveal"
import { ButtonLink } from "@/components/site/Button"

/* ---------- shared bits ---------------------------------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[1.8px] text-content-tertiary">
      {children}
    </span>
  )
}

function SectionHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={`font-display font-semibold capitalize leading-[1.05] tracking-[-0.5px] text-content-primary ${className}`}
      style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
    >
      {children}
    </h2>
  )
}

/* ---------- data ----------------------------------------------------------- */

const PROFILES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Users,
    title: "Community Builders",
    body: "You bring students together and uplift their creative workflow by organizing meetups, leading campus groups, or holding a visible presence on Discord, Reddit, or X.",
  },
  {
    icon: Sparkles,
    title: "Top Creators",
    body: "You consistently create stunning content with ImagineArt and engage positively and frequently in community spaces.",
  },
  {
    icon: GraduationCap,
    title: "Students & Campus Leaders",
    body: "You’re enrolled at a leading university and want to grow AI art culture on your campus through workshops and meetups.",
  },
]

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Apply",
    body: "Complete the application and tell us about your background, your community, and why you want to lead the ImagineArt movement in your region.",
  },
  {
    n: "02",
    title: "Selection",
    body: "Our team reviews applications and selects ambassadors per region for diversity and reach across top creators and leading universities.",
  },
  {
    n: "03",
    title: "Onboarding",
    body: "Get a Welcome Kit with the brand guide, event and report templates, and join a monthly orientation call with your community manager.",
  },
]

/* ---------- sections ------------------------------------------------------- */

/**
 * Dotted-divider editorial grid (shared by the two sections below).
 * One dotted rectangle around the whole group with dotted dividers BETWEEN
 * cells — not three separate boxes. Tailwind `divide-dotted` gives the inner
 * 1px dotted lines; the outer `border border-dotted` closes the rectangle.
 * Cells are transparent (black shows through), square corners, generous
 * padding. Hover draws a subtle solid inset hairline on just that cell.
 */
function DottedGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 border border-dotted border-white/15 divide-y divide-dotted divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
      {children}
    </div>
  )
}

function DottedCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 transition-shadow duration-200 ease-out hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] md:p-10">
      {children}
    </div>
  )
}

export function WhoWeWant() {
  return (
    <section id="who" className="bg-background">
      {/* padding-block: clamp(96px, 12vh, 180px) → guaranteed empty black above
          and below so the two sections can never kiss/overlap. */}
      <div className="container-page" style={{ paddingBlock: "clamp(96px, 12vh, 180px)" }}>
        <Reveal className="mx-auto max-w-[680px] text-center">
          <SectionHeading>Our Ambassadors</SectionHeading>
          <p className="mx-auto mt-6 max-w-[56ch] font-sans text-[17px] leading-[1.7] tracking-[-0.005em] text-content-secondary">
            If you&apos;re active in your community and want to go further with ImagineArt&apos;s support, we
            encourage you to apply. No professional title required.
          </p>
        </Reveal>

        {/* header → grid gap: 80px (mt-20). */}
        <Reveal className="mt-16 md:mt-20">
          <DottedGrid>
            {PROFILES.map((p) => (
              <DottedCell key={p.title}>
                <p.icon size={22} strokeWidth={1.5} className="text-content-primary" />
                {/* icon → title 20px, title → body 16px */}
                <h3 className="mt-5 font-display text-[19px] font-medium capitalize tracking-[-0.2px] text-content-primary">
                  {p.title}
                </h3>
                <p className="mt-4 max-w-[42ch] font-sans text-[15px] leading-[1.7] text-content-secondary">
                  {p.body}
                </p>
              </DottedCell>
            ))}
          </DottedGrid>
        </Reveal>
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background">
      <div className="container-page" style={{ paddingBlock: "clamp(96px, 12vh, 180px)" }}>
        <Reveal className="mx-auto max-w-[680px] text-center">
          <SectionHeading>From Application To Ambassador</SectionHeading>
          <p className="mx-auto mt-6 max-w-[56ch] font-sans text-[17px] leading-[1.7] tracking-[-0.005em] text-content-secondary">
            Ambassadors can be from any background and anywhere in the world. Multiple ambassadors from
            the same city are welcome.
          </p>
        </Reveal>

        <Reveal className="mt-16 md:mt-20">
          <DottedGrid>
            {STEPS.map((s) => (
              <DottedCell key={s.n}>
                {/* 01/02/03 accent numeral, top-left of the cell */}
                <span className="font-mono text-[13px] font-semibold tracking-[1.5px] text-content-brand">
                  {s.n}
                </span>
                <h3 className="mt-5 font-display text-[19px] font-medium capitalize tracking-[-0.2px] text-content-primary">
                  {s.title}
                </h3>
                <p className="mt-4 max-w-[42ch] font-sans text-[15px] leading-[1.7] text-content-secondary">
                  {s.body}
                </p>
              </DottedCell>
            ))}
          </DottedGrid>
        </Reveal>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section id="apply" className="relative overflow-hidden bg-background">
      {/* Sparing purple accent — a soft glow behind the final call to action */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(60% 70% at 50% 50%, rgba(138,63,252,0.18) 0%, rgba(0,0,0,0) 70%)",
        }}
      />
      <div className="container-page relative py-20 md:py-28">
        <Reveal className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <Eyebrow>
            <span className="text-white/45">Applications Are Open</span>
          </Eyebrow>
          <h2
            className="mt-4 font-display font-semibold capitalize leading-[1.05] tracking-[-0.5px] text-white"
            style={{ fontSize: "clamp(34px, 4.5vw, 56px)" }}
          >
            Ready To Lead Your Region&apos;s Community?
          </h2>
          <p className="mt-5 max-w-[48ch] font-sans text-[17px] leading-[1.7] tracking-[-0.005em] text-white/65">
            If you&apos;re a creator who brings people together, we&apos;d love to hear from you. Apply to become
            an ImagineArt Ambassador today.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <ButtonLink
              href="https://tally.so/r/vGbDl8"
              variant="white"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              data-tally-open="vGbDl8"
              data-tally-layout="modal"
              data-tally-width="720"
              data-tally-overlay="1"
            >
              Apply Now
            </ButtonLink>
            <a
              href="#what-you-get"
              className="font-sans text-[15px] font-medium text-white/75 transition-colors hover:text-white"
            >
              Learn More →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function AmbassadorSections() {
  return (
    <>
      <WhoWeWant />
      <HowItWorks />
    </>
  )
}
