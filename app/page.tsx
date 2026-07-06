/**
 * ImagineArt Ambassador Program — landing page.
 *
 *   SiteNav (fixed)
 *   1. HeroIntro           — desktop: preloader + pinned parallax intro that
 *                            cross-fades into the full-bleed photo hero;
 *                            mobile: that photo hero directly.
 *   2. AmbassadorWhatYouGet → WhoWeWant → ShowcaseScrollSection → HowItWorks
 *   3. FaqSection          — accordion + FAQPage JSON-LD.
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
import HeroIntro from "@/components/hero-intro"
import { WhoWeWant } from "@/components/ambassador-sections"
import AmbassadorWhatYouGet from "@/components/ambassador-what-you-get"
import ShowcaseScrollSection from "@/components/showcase-scroll-section"
import { getShowcaseImages } from "@/lib/showcase-images"

export default function Page() {
  // Auto-discovered at render time from /public/showcase-images (no hardcoding).
  const showcaseImages = getShowcaseImages()

  return (
    <>
      <SiteNav />
      {/* Desktop: preloader + pinned parallax intro that cross-fades into the
          full-bleed photo hero. Mobile: that photo hero directly. The hero (the
          imagineart-hero-amb picture with its 3D tilt) lives inside HeroIntro. */}
      <HeroIntro />
      <AmbassadorWhatYouGet />
      {/* Our Ambassadors sits above the pinned showcase. */}
      <WhoWeWant />
      {/* Pinned showcase: headline holds still while images glide up over it. */}
      <ShowcaseScrollSection images={showcaseImages} />
      <FaqSection />
      <SiteFooter />
    </>
  )
}
