"use client"

/**
 * AmbassadorHeroImage — the hero shown after the parallax intro (and directly on
 * mobile): the `imagineart-hero-amb` photo as a large panel.
 *
 * Layout: the panel is inset from the top so it sits BELOW the fixed navbar
 * (never hidden behind it), spans nearly the full width, and leaves clear
 * spacing beneath it before the next section.
 *
 * Effect (kept): a subtle 3D perspective tilt (components/ui/3d-card) with a
 * small maxTilt (full-size element). The image is slightly oversized so the tilt
 * never reveals a hard edge; the caption floats above it at a higher translateZ.
 */

import Image from "next/image"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"

const COLOR_SRC = "/background-2.png"

export default function AmbassadorHeroImage() {
  return (
    <section id="top" className="relative h-screen w-full overflow-hidden bg-background" aria-label="ImagineArt Ambassadors">
      {/* Inset: top clears the fixed navbar, bottom leaves spacing before the
          next section. Small side gutters → wide panel. */}
      <div className="absolute inset-0 px-2 pb-6 pt-[78px] md:pb-8 md:pt-[92px]">
        <CardContainer containerClassName="h-full w-full" className="h-full w-full" maxTilt={4}>
          <CardBody className="relative h-full w-full overflow-hidden rounded-[22px] border border-white/10">
            {/* Image layer — fills the panel, floats slightly. Oversized so the
                tilt never exposes a hard edge. object-position biased UP so the
                group's heads/umbrellas aren't cropped at the top. */}
            <CardItem translateZ={30} className="absolute inset-0">
              {/* Portrait phones show the full height of this landscape photo,
                  so the signpost dominates and the people shrink. Zoom in on
                  mobile to bring the group forward; desktop keeps the wider,
                  subtler framing. */}
              <Image
                src={COLOR_SRC}
                alt="ImagineArt community ambassadors"
                fill
                priority
                sizes="100vw"
                className="scale-[1.2] object-cover object-center md:scale-105 md:object-[50%_38%]"
              />
            </CardItem>

            {/* Caption — floats highest, over a bottom legibility gradient. */}
            <CardItem translateZ={70} className="pointer-events-none absolute inset-x-0 bottom-0">
              <div className="rounded-b-[22px] bg-gradient-to-t from-black/80 via-black/35 to-transparent px-6 pb-8 pt-28 md:px-12 md:pb-12 md:pt-36">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[1.8px] text-white/60 md:text-[11px]">
                  ImagineArt Student Ambassador Program
                </span>
                <h2
                  className="h-scale-hero-caption mt-3 font-display font-semibold capitalize leading-[1.02] tracking-[-0.5px] text-white"
                  style={{ fontSize: "clamp(28px, 4vw, 54px)" }}
                >
                  Build &amp; Lead The Community
                </h2>
                <p className="mt-4 max-w-[54ch] text-pretty font-sans text-[15px] leading-[1.6] text-white/75 md:text-[17px]">
                  Represent ImagineArt at your university. Host events, mentor fellow students, and grow a
                  thriving creative community on your campus.
                </p>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>
    </section>
  )
}
