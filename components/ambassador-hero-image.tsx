"use client"

/**
 * AmbassadorHeroImage — the large cinematic hero panel under the headline.
 *
 * Effect: ONLY the 3D card perspective tilt (components/ui/3d-card). The whole
 * panel tilts toward the pointer; the image and the caption float at different
 * translateZ depths, so both lift off the surface. No depth-map parallax, no
 * drop shadow — just the clean tilt.
 *
 * The caption (eyebrow + title + tagline) sits on top of the image at the
 * bottom, over a light gradient for legibility, and floats highest.
 * After this section the page scrolls 100% normally.
 */

import Image from "next/image"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"

// A touch wider than the headline block so the panel reads as the hero's
// centerpiece (bigger in both length & breadth).
const HERO_WIDTH = "min(1320px, 94vw)"
const COLOR_SRC = "/images/imagineart-hero-amb.png"

export default function AmbassadorHeroImage() {
  return (
    <section className="w-full bg-background" aria-label="ImagineArt Ambassadors">
      {/* Small negative top margin pulls the panel up a little so it sits
          closer to the headline — kept conservative so it never overlaps the
          hero text above it. */}
      <div className="mx-auto -mt-[4vh] pb-24 md:-mt-[10vh] md:pb-32" style={{ width: HERO_WIDTH }}>
        <CardContainer containerClassName="w-full" className="w-full">
          <CardBody className="aspect-[16/9] w-full rounded-[24px] border border-white/10">
            {/* Image layer — floats off the surface. */}
            <CardItem translateZ={50} className="absolute inset-0">
              <div className="relative h-full w-full overflow-hidden rounded-[24px]">
                <Image
                  src={COLOR_SRC}
                  alt="ImagineArt community ambassadors"
                  fill
                  priority
                  sizes="(max-width: 768px) 94vw, 1320px"
                  className="object-cover"
                />
              </div>
            </CardItem>

            {/* Caption layer — floats highest, over a legibility gradient. */}
            <CardItem translateZ={90} className="pointer-events-none absolute inset-x-0 bottom-0">
              <div className="rounded-b-[24px] bg-gradient-to-t from-black/85 via-black/45 to-transparent px-6 pb-7 pt-24 md:px-10 md:pb-10 md:pt-32">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[1.8px] text-white/55">
                  ImagineArt Ambassador Program
                </span>
                <h2
                  className="mt-2 font-display font-semibold capitalize leading-[1.05] tracking-[-0.5px] text-white"
                  style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
                >
                  Build &amp; Lead The Community
                </h2>
                <p className="mt-3 max-w-[60ch] font-sans text-[14px] leading-[1.65] text-white/75 md:text-[16px]">
                  Represent ImagineArt in your region. Host events, mentor creators, and partner with us to
                  grow AI art culture across the Americas, Europe, Australia, and Asia.
                </p>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>
    </section>
  )
}
