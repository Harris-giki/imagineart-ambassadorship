/**
 * ImagineArt Ambassador Program — landing page.
 *
 *   SiteNav (fixed)
 *   1. CinematicIntro      — pinned, scroll-scrubbed zoom + black-out intro.
 *   2. AmbassadorHero      — revealed as the intro blacks out (headline block).
 *   3. AmbassadorHeroImage — depth-parallax hero panel (normal flow).
 *   4. AmbassadorSections  — What You Get → Who → What You Do → How It Works → Goals.
 *   5. FaqSection          — accordion + FAQPage JSON-LD.
 *   SiteFooter
 *
 * Whole-page smooth scrolling is provided by <SmoothScroll> (Lenis) in the
 * root layout, synced to the GSAP ScrollTrigger used by the intro.
 * Everything below the intro scrolls normally (the pin releases straight onto
 * the hero). Built on the design-system kit: Google Sans Flex, monochrome +
 * purple accent, Title Case headings.
 */

import { SiteNav } from "@/components/site/SiteNav"
import { SiteFooter } from "@/components/site/SiteFooter"
import { FaqSection } from "@/components/site/FaqSection"
import CinematicIntro from "@/components/cinematic-intro"
import AmbassadorHero from "@/components/ambassador-hero"
import AmbassadorHeroImage from "@/components/ambassador-hero-image"
import AmbassadorSections from "@/components/ambassador-sections"
import AmbassadorWhatYouGet from "@/components/ambassador-what-you-get"
import ShowcaseScrollSection from "@/components/showcase-scroll-section"
import { getShowcaseImages } from "@/lib/showcase-images"

export default function Page() {
  // Auto-discovered at render time from /public/showcase-images (no hardcoding).
  const showcaseImages = getShowcaseImages()

  return (
    <>
      <SiteNav />
      {/* The hero lives INSIDE the intro: the black-out cross-fades straight
          into it, then the pin releases onto it (no extra scroll). */}
      <CinematicIntro>
        <AmbassadorHero />
      </CinematicIntro>
      {/* The hero IMAGE lives here (normal flow, just after the pinned intro)
          so it can scroll through the viewport and drive its 3D tilt.
          Same jet-black surface as the hero → reads as one continuous hero. */}
      <AmbassadorHeroImage />
      <AmbassadorWhatYouGet />
      {/* Pinned showcase comes right after "What You Get": headline holds still
          while images glide up over it. */}
      <ShowcaseScrollSection images={showcaseImages} />
      <AmbassadorSections />
      <FaqSection />
      <SiteFooter />
    </>
  )
}
