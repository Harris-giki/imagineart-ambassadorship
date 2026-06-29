/**
 * ImagineArt Ambassador Program — landing page.
 *
 *   SiteNav (fixed)
 *   1. HeroIntro           — desktop: preloader + pinned parallax intro → hero;
 *                            mobile: hero directly, with the photo as background.
 *   2. AmbassadorHeroImage — 3D-tilt hero photo card (desktop only).
 *   3. AmbassadorWhatYouGet, ShowcaseScrollSection, AmbassadorSections
 *   4. FaqSection          — accordion + FAQPage JSON-LD.
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
      {/* Desktop: preloader + pinned parallax intro → hero.
          Mobile: no parallax — the hero shows directly with the photo as its
          background. (Decided client-side inside HeroIntro.) */}
      <HeroIntro />
      {/* The big hero IMAGE card (3D tilt). Hidden on mobile, where the same
          photo is already the hero background — avoids showing it twice. */}
      <div className="hidden md:block">
        <AmbassadorHeroImage />
      </div>
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
