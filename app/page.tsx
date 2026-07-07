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

export default function Page() {
  return (
    <>
      <SiteNav />
      {/* Desktop: preloader + pinned parallax intro that cross-fades into the
          full-bleed photo hero. Mobile: that photo hero directly. */}
      <HeroIntro />
      <AmbassadorWhatYouGet />
      <WhoWeWant />
      <FaqSection />
      <SiteFooter />
    </>
  )
}
