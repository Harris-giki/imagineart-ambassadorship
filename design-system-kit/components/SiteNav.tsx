"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Features",     href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing",      href: "#pricing" },
  { label: "FAQ",          href: "#faq" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const linkColor      = scrolled ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)";
  const linkColorHover = scrolled ? "#fff" : "rgb(23,23,23)";
  const linkBgHover    = scrolled ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[60]"
        style={{ padding: scrolled ? "10px 0" : "16px 0", transition: "padding 0.3s ease" }}
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{
            maxWidth:       scrolled ? "min(1180px, calc(100vw - 32px))" : "100%",
            padding:        scrolled ? "8px 12px" : "10px clamp(40px,12vw,220px)",
            borderRadius:   "22px",
            background:     scrolled ? "rgba(10,10,11,0.72)" : "transparent",
            border:         "1px solid transparent",
            backdropFilter: scrolled ? "blur(32px) saturate(180%)" : "none",
            boxShadow:      scrolled ? "0 20px 48px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(255,255,255,0.1)" : "none",
            transition:     "max-width 0.48s cubic-bezier(0.22,1,0.36,1), padding 0.48s cubic-bezier(0.22,1,0.36,1), background 0.48s cubic-bezier(0.22,1,0.36,1), border-color 0.48s cubic-bezier(0.22,1,0.36,1), box-shadow 0.48s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Logo */}
          <Link href="https://www.imagine.art/" className="inline-flex items-center shrink-0 no-underline">
            <img
              src="/imagine-art-wordmark.svg"
              alt="ImagineArt"
              width={144}
              height={22}
              className="h-[22px] w-auto transition-[filter] duration-300"
              style={{ filter: scrolled ? "brightness(0) invert(1)" : "none" }}
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="px-[14px] py-[6px] rounded-lg font-sans text-[14px] font-medium tracking-[0.14px] whitespace-nowrap transition-colors duration-150"
                style={{ color: linkColor }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = linkColorHover; (e.currentTarget as HTMLElement).style.background = linkBgHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = linkColor; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <a
              href="#install"
              className="inline-flex items-center justify-center h-[34px] px-[16px] rounded-[22px] font-sans text-[13.5px] font-medium tracking-[0.14px] transition-all duration-200"
              style={{
                background: scrolled ? "#fff" : "rgb(23,23,23)",
                color: scrolled ? "rgb(10,10,11)" : "#fff",
                boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
              }}
            >
              Get Started
            </a>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden flex items-center justify-center w-[38px] h-[38px] rounded-[10px] border-none cursor-pointer transition-colors duration-150"
            style={{ background: "transparent", color: scrolled ? "rgba(255,255,255,0.85)" : "rgb(23,23,23)" }}
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
        <div className="fixed inset-0 z-[101] bg-white flex flex-col" style={{ animation: "mobileMenuIn 0.22s cubic-bezier(0.4,0,0.2,1) forwards" }}>
          <div className="flex items-center justify-between px-6 py-[18px] shrink-0">
            <Link href="https://www.imagine.art/" className="inline-flex items-center">
              <img
                src="/imagine-art-wordmark.svg"
                alt="ImagineArt"
                width={144}
                height={22}
                className="h-[22px] w-auto"
              />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center p-1 border-none bg-transparent cursor-pointer transition-colors duration-150"
              style={{ color: "rgba(0,0,0,0.6)" }}
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
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => setMenuOpen(false)}
                  className="block text-center px-8 py-2.5 rounded-[10px] font-sans text-[22px] font-light tracking-[-0.2px] transition-colors duration-150"
                  style={{ color: "rgba(0,0,0,0.7)", textDecoration: "none" }}
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="w-[calc(100%-48px)] h-px bg-black/[0.08] my-4" />

            <div className="flex items-center justify-center gap-2.5 px-6">
              <a
                href="#install"
                onClick={() => setMenuOpen(false)}
                className="bg-content-primary inline-flex items-center justify-center h-11 px-6 rounded-[14px] font-sans text-[14px] font-medium text-white"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
