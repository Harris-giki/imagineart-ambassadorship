"use client";

import { useState } from "react";
import { Reveal } from "@/components/primitives/Reveal";
import { FAQ } from "@/lib/data/faq";

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-black/[0.05] text-content-primary">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <line
          x1="7"
          y1="1"
          x2="7"
          y2="13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{
            transition: "transform 240ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 200ms ease",
            transformOrigin: "center",
            transform: open ? "scaleY(0)" : "scaleY(1)",
            opacity: open ? 0 : 1,
          }}
        />
      </svg>
    </span>
  );
}

function FaqRow({ q, a, delay, defaultOpen = false }: { q: string; a: string; delay: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Reveal delay={delay} className="border-b border-border-primary">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-8 py-6 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span
          className="font-sans font-medium leading-snug text-content-primary"
          style={{ fontSize: "clamp(16px, 1.4vw, 19px)" }}
        >
          {q}
        </span>
        <PlusMinus open={open} />
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 280ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        }}
      >
        <div className="overflow-hidden">
          <p className="font-sans text-[16px] leading-[1.75] text-content-secondary pb-6 max-w-[72ch]">
            {a}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export function FaqSection() {
  return (
    <section id="faq" className="border-t border-border-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container-page">
        <div className="py-16 md:py-24 flex flex-col lg:flex-row gap-10 lg:gap-20">

          {/* Left: heading + subtext */}
          <Reveal className="lg:w-[360px] shrink-0">
            <h2
              className="font-display font-semibold leading-[1.05] tracking-[-0.5px] m-0 text-content-primary"
              style={{ fontSize: "clamp(36px, 4vw, 52px)" }}
            >
              Got any questions{" "}
              <span className="text-black/35">left?</span>
            </h2>
            <p className="font-sans text-[17px] leading-[1.7] text-content-secondary max-w-[36ch] mt-5 tracking-[-0.005em]">
              We&apos;ve answered the most frequently asked questions below.
            </p>
          </Reveal>

          {/* Right: accordion */}
          <div className="flex-1 min-w-0 border-t border-border-primary">
            {FAQ.map((item, i) => (
              <FaqRow key={item.q} q={item.q} a={item.a} delay={i * 60} defaultOpen />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
