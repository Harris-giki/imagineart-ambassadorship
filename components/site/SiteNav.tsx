"use client"

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react"
import { getLenisInstance } from "@/lib/lenis-instance"

// Links point at the page's own sections (replaces the kit's placeholder labels).
const NAV_LINKS = [
  { label: "What You Get", href: "#what-you-get" },
  { label: "Who We Want", href: "#who" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  // Smooth in-page navigation. A native hash jump sets window.scrollY directly,
  // which desyncs from Lenis' virtual scroll and interrupts the pinned parallax.
  // Instead we drive the scroll THROUGH Lenis so the pin/scrub stay in step and
  // any distance (even fast-forwarding the whole intro) eases in a fixed time.
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return
    const lenis = getLenisInstance()
    // No Lenis (prefers-reduced-motion) → let the browser jump natively.
    if (!lenis) {
      setMenuOpen(false)
      return
    }
    e.preventDefault()

    // If the mobile menu is open, close it and free body scroll BEFORE scrolling.
    const wasMenuOpen = menuOpen
    if (wasMenuOpen) {
      setMenuOpen(false)
      document.body.style.overflow = ""
    }

    const run = () => {
      if (href === "#top") {
        lenis.scrollTo(0, { duration: 1.15 })
      } else {
        const target = document.querySelector(href) as HTMLElement | null
        if (!target) return
        // Leave clearance for the fixed navbar; fixed duration so a long jump
        // (through the intro) doesn't feel sluggish.
        lenis.scrollTo(target, { offset: -80, duration: 1.15 })
      }
      // Reflect the section in the URL without triggering a second jump.
      history.replaceState(null, "", href)
    }

    // When closing the mobile overlay, wait a frame so its unmount + restored
    // body scroll settle before Lenis measures the target.
    if (wasMenuOpen) requestAnimationFrame(run)
    else run()
  }

  // The site opens on a dark cinematic scene, so at the very top the bar uses
  // light text; once scrolled it collapses into the dark glass pill (also light
  // text). This keeps the nav legible over the dark hero at all times.
  const linkColor = "rgba(255,255,255,0.72)"
  const linkColorHover = "#fff"
  const linkBgHover = "rgba(255,255,255,0.1)"

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[60]"
        style={{ padding: scrolled ? "10px 0" : "16px 0", transition: "padding 0.3s ease" }}
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{
            maxWidth: scrolled ? "min(1180px, calc(100vw - 32px))" : "100%",
            padding: scrolled ? "8px 12px" : "10px clamp(40px,12vw,220px)",
            borderRadius: "22px",
            background: scrolled ? "rgba(10,10,11,0.72)" : "transparent",
            border: "1px solid transparent",
            backdropFilter: scrolled ? "blur(32px) saturate(180%)" : "none",
            boxShadow: scrolled
              ? "0 20px 48px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(255,255,255,0.1)"
              : "none",
            transition:
              "max-width 0.48s cubic-bezier(0.22,1,0.36,1), padding 0.48s cubic-bezier(0.22,1,0.36,1), background 0.48s cubic-bezier(0.22,1,0.36,1), border-color 0.48s cubic-bezier(0.22,1,0.36,1), box-shadow 0.48s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Logo (white wordmark — the whole experience sits on dark) */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, "#top")}
            className="inline-flex items-center shrink-0 no-underline"
          >
            <img
              src="/imagine-art-wordmark.svg"
              alt="ImagineArt"
              width={144}
              height={22}
              className="h-[22px] w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </a>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className="px-[14px] py-[6px] rounded-lg font-sans text-[14px] font-medium tracking-[0.14px] whitespace-nowrap transition-colors duration-150"
                style={{ color: linkColor }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = linkColorHover
                  ;(e.currentTarget as HTMLElement).style.background = linkBgHover
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = linkColor
                  ;(e.currentTarget as HTMLElement).style.background = "transparent"
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <a
              href="https://tally.so/r/vGbDl8"
              data-tally-open="vGbDl8"
              data-tally-layout="modal"
              data-tally-width="720"
              data-tally-overlay="1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-[34px] px-[16px] rounded-[22px] font-sans text-[13.5px] font-medium tracking-[0.14px] transition-all duration-200"
              style={{
                background: "#fff",
                color: "rgb(10,10,11)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              Apply Now
            </a>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden flex items-center justify-center w-[38px] h-[38px] rounded-[10px] border-none cursor-pointer transition-colors duration-150"
            style={{ background: "transparent", color: "rgba(255,255,255,0.9)" }}
            aria-label="Open menu"
          >
            <span className="flex flex-col gap-[5px]">
              <span
                className="block w-[18px] h-[1.5px] rounded-sm bg-current transition-transform duration-[250ms]"
                style={{ transform: menuOpen ? "translateY(3.25px) rotate(45deg)" : "none" }}
              />
              <span
                className="block w-[18px] h-[1.5px] rounded-sm bg-current transition-transform duration-[250ms]"
                style={{ transform: menuOpen ? "translateY(-3.25px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[101] bg-[#0a0a0a] flex flex-col"
          style={{ animation: "mobileMenuIn 0.22s cubic-bezier(0.4,0,0.2,1) forwards" }}
        >
          <div className="flex items-center justify-between px-6 py-[18px] shrink-0">
            <a
              href="#top"
              onClick={(e) => handleNavClick(e, "#top")}
              className="inline-flex items-center"
            >
              <img
                src="/imagine-art-wordmark.svg"
                alt="ImagineArt"
                width={144}
                height={22}
                className="h-[22px] w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </a>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center p-1 border-none bg-transparent cursor-pointer transition-colors duration-150"
              style={{ color: "rgba(255,255,255,0.7)" }}
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center pb-10">
            <div className="flex flex-col items-center gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className="block text-center px-8 py-2.5 rounded-[10px] font-sans text-[22px] font-light tracking-[-0.2px] transition-colors duration-150"
                  style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="w-[calc(100%-48px)] h-px bg-white/[0.1] my-4" />

            <div className="flex items-center justify-center gap-2.5 px-6">
              <a
                href="https://tally.so/r/vGbDl8"
                data-tally-open="vGbDl8"
                data-tally-layout="modal"
                data-tally-width="720"
                data-tally-overlay="1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center h-11 px-6 rounded-[14px] bg-white font-sans text-[14px] font-medium text-black"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
