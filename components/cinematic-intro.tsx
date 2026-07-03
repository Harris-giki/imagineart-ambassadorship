"use client"

/**
 * CinematicIntro
 * =========================================================================
 * Scene: a studio group shot rebuilt as parallax depth layers — a backdrop
 * plate (background.png) with four extracted people (person1–4) full-bleed on
 * top, each PNG a full-frame 16:9 canvas so they auto-register into the original
 * composition, plus the ImagineArt logo as a mid brand beat.
 *
 * Two behaviors layered on the SAME scene, kept strictly separate so they
 * never fight over a CSS property:
 *
 *  PHASE 1 — the original intro (preserved):
 *    • One-time ENTRY animation on load (the `zoom-layer-*` keyframes): each
 *      layer scales / blurs / fades into place over ~4s.
 *    • Continuous INTERACTIVE PARALLAX: every layer shifts by a different
 *      amount with the mouse (desktop) or device tilt / gyro (mobile, with
 *      the iOS "Enable Parallax Effect" permission button).
 *    These run on React state + CSS only.
 *
 *  PHASE 2 — scroll-driven transition (added on top, GSAP ScrollTrigger):
 *    The section is PINNED and a timeline is SCRUBBED 1:1 to scroll:
 *      • 0.0–0.7  scene zooms toward screen CENTER, scale 1 -> ZOOM (ease-in)
 *      • 0.0–0.2  logo fades + scales out (opacity 1->0, scale 1->1.4)
 *      • 0.6–1.0  black overlay fades in (opacity 0->1)
 *    At full black the pin releases and the (dark) Ambassador hero below is
 *    revealed seamlessly; scrolling is 100% normal afterward.
 *
 *  PHASE 3 — release: handled for free by GSAP's pinSpacing (no scroll-jack
 *    after the pin ends).
 *
 * Why no conflict between the two phases:
 *   - GSAP only writes `transform`/`opacity` on three elements it OWNS:
 *       sceneRef (the zoom wrapper), logoInnerRef (the fading logo), and
 *       overlayRef (the black-out).
 *   - The per-layer mouse/gyro parallax writes `transform: translate3d(...)`
 *       on the LAYER elements (children of sceneRef) and on the logo's OUTER
 *       wrapper — never on the elements GSAP owns.
 *   - The entry animation uses the standalone `scale:` CSS property (separate
 *       from `transform`), so it composes with the parallax translate.
 *   - Parent (sceneRef) scale × child translate compose visually.
 *
 * Responsive / a11y via gsap.matchMedia():
 *   - desktop                : ZOOM 6,  pin "+=200%"
 *   - mobile (<768px)        : ZOOM 4,  pin "+=120%" (less scroll-jacking)
 *   - prefers-reduced-motion : no pin / no scrub — the intro just shows and
 *                              the page scrolls normally to the hero.
 */

import Image from "next/image"
import { useEffect, useRef, useState, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * The hero is passed in as `children` and rendered INSIDE the pinned stage as
 * the reveal layer, so the black-out cross-fades straight into it within the
 * same pin — no extra scrolling to "reach" the hero.
 */
export default function CinematicIntro({ children }: { children?: ReactNode }) {
  // ---- Phase 1 state (original parallax / entry / gyro) -------------------
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [needsPermission, setNeedsPermission] = useState(false)
  const [gyroActive, setGyroActive] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const frameRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)

  // ---- Preloader sync -----------------------------------------------------
  // The IntroPreloader covers the screen until THESE images (the parallax
  // assets, and only these) finish loading. Each image's onLoad/onError bumps
  // a counter; we broadcast progress so the preloader can show a bar and lift.
  // `revealed` then starts the entry animation exactly as the curtain lifts,
  // so the zoom never plays hidden behind the loader.
  const INTRO_ASSET_COUNT = 6 // background + 4 people + logo
  const [revealed, setRevealed] = useState(false)

  // Recompute progress from the ACTUAL <img> state inside the scene (rather
  // than counting onLoad calls) so already-cached images — whose load event
  // can fire before React attaches the handler — are still counted.
  const reportProgress = () => {
    const scene = sceneRef.current
    if (!scene) return
    const imgs = Array.from(scene.querySelectorAll("img")) as HTMLImageElement[]
    const total = imgs.length || INTRO_ASSET_COUNT
    const loaded = imgs.filter((im) => im.complete && im.naturalWidth > 0).length
    window.dispatchEvent(new CustomEvent("intro-progress", { detail: { loaded, total } }))
    if (total > 0 && loaded >= total) setRevealed(true)
  }
  const handleAssetLoad = reportProgress

  // Catch images already complete at mount (cache), then a 7s safety net so a
  // slow/failed network never blocks the reveal forever.
  useEffect(() => {
    const raf = requestAnimationFrame(reportProgress)
    const safety = window.setTimeout(() => {
      setRevealed(true)
      window.dispatchEvent(
        new CustomEvent("intro-progress", {
          detail: { loaded: INTRO_ASSET_COUNT, total: INTRO_ASSET_COUNT },
        }),
      )
    }, 7000)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(safety)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- Phase 2 refs (elements GSAP owns) ----------------------------------
  const rootRef = useRef<HTMLDivElement>(null) // pinned section / scroll trigger
  const sceneRef = useRef<HTMLDivElement>(null) // wraps all scene layers -> zooms
  const logoInnerRef = useRef<HTMLDivElement>(null) // the logo image -> fades + scales
  const overlayRef = useRef<HTMLDivElement>(null) // black-out overlay -> fades in
  const heroRef = useRef<HTMLDivElement>(null) // hero reveal layer -> cross-fades in

  // iOS 13+ requires a user gesture to grant device-orientation access.
  const requestOrientation = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission()
        if (permissionState === "granted") {
          setNeedsPermission(false)
          setGyroActive(true)
          setShouldAnimate(true)
        }
      } catch (error) {
        console.error("Permission denied:", error)
      }
    } else {
      setNeedsPermission(false)
      setGyroActive(true)
      setShouldAnimate(true)
    }
  }

  // ---- Always (re)start at the top of the parallax intro ------------------
  // Runs before the ScrollTrigger setup below so the timeline initializes at
  // progress 0. (The layout also sets scrollRestoration early to avoid a flash.)
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
    window.scrollTo(0, 0)
  }, [])

  // ---- Phase 1: mouse + gyro parallax (unchanged from the original) -------
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / window.innerWidth
      const y = (e.clientY - window.innerHeight / 2) / window.innerHeight
      setMousePosition({ x, y })
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const now = Date.now()
      if (now - lastUpdateRef.current < 16) return // throttle to ~60fps
      lastUpdateRef.current = now

      if (frameRef.current) cancelAnimationFrame(frameRef.current)

      frameRef.current = requestAnimationFrame(() => {
        const isLandscape = window.innerWidth > window.innerHeight
        let x = 0
        if (isLandscape) {
          const beta = e.beta || 0
          x = Math.max(-1, Math.min(1, beta / 45))
        } else {
          const gamma = e.gamma || 0
          x = Math.max(-1, Math.min(1, gamma / 45))
        }
        setMousePosition({ x, y: 0 })
      })
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768
    const isTouchDevice = isMobile || isTablet || "ontouchstart" in window || navigator.maxTouchPoints > 0

    if (isTouchDevice) {
      if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        setNeedsPermission(true)
      } else {
        setGyroActive(true)
        setShouldAnimate(true)
      }
    } else {
      window.addEventListener("mousemove", handleMouseMove)
      setShouldAnimate(true)
    }

    if (gyroActive) {
      window.addEventListener("deviceorientation", handleOrientation)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("deviceorientation", handleOrientation)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [gyroActive])

  // ---- Phase 2: scroll-driven pin + scrub (GSAP ScrollTrigger) ------------
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      const buildTimeline = (zoom: number, end: string) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end, // pin distance, e.g. "+=200%"
            pin: true, // pin the intro while the timeline scrubs
            scrub: 0.4, // light smoothing — low lag so the scene never trails past the reveal
            anticipatePin: 1, // avoid a 1-frame jump when the pin engages
            invalidateOnRefresh: true, // recompute on resize -> origin stays centered
            // This pin is at the TOP of the page, so it must refresh BEFORE the
            // showcase pin below it (which is created earlier, on first mount).
            // Higher refreshPriority = refreshed first, so the showcase then
            // measures its start with this pin's spacing already applied.
            refreshPriority: 1,
          },
        })

        // Timeline total duration is 1, so each tween's position+duration map
        // directly onto scroll progress 0 -> 1. The whole arc — scene zoom,
        // black-out, AND the hero cross-fade — happens inside this one pin, so
        // when the pin releases you're already ON the hero (no extra scroll).

        // 1) Gentle scene zoom toward center (kept small so the raster assets
        //    never scale enough to look pixelated). 0.0 -> 0.65.
        tl.fromTo(sceneRef.current, { scale: 1 }, { scale: zoom, ease: "power1.in", duration: 0.65 }, 0)

        // 2) Logo fades + scales out early: 0.0 -> 0.2.
        tl.fromTo(
          logoInnerRef.current,
          { autoAlpha: 1, scale: 1 },
          { autoAlpha: 0, scale: 1.4, ease: "power1.out", duration: 0.2 },
          0,
        )

        // 3) Black overlay fades IN to fully cover the scene: 0.3 -> 0.6.
        tl.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.3)

        // 3b) Once the black fully covers, HIDE the scene entirely (not just
        //     cover it). This guarantees the parallax scene can never reappear
        //     after the hero is revealed — even if the scrub lags on fast scroll.
        tl.to(sceneRef.current, { autoAlpha: 0, duration: 0.05 }, 0.6)

        // 4) Behind the black, make the hero ready (opaque): 0.6 -> 0.68.
        tl.fromTo(heroRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.6)

        // 5) Black overlay fades OUT to reveal the hero — the direct cross-fade
        //    from intro to hero: 0.68 -> 1.0.
        tl.to(overlayRef.current, { autoAlpha: 0, duration: 0.32 }, 0.68)

        return tl
      }

      // Desktop: gentle zoom, moderate pin distance.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        buildTimeline(2.2, "+=150%")
      })

      // Mobile: even gentler zoom + shorter pin so it doesn't feel endless.
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        buildTimeline(1.6, "+=110%")
      })

      // Reduced motion: no pin / no scrub. Skip the zoom/black-out and just
      // show the hero (its opaque background covers the scene behind it).
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(overlayRef.current, { autoAlpha: 0 })
        gsap.set(heroRef.current, { autoAlpha: 1 })
      })
    }, rootRef)

    return () => ctx.revert() // tears down ScrollTrigger + matchMedia
  }, [])

  return (
    // Pinned stage — exactly one viewport tall. overflow-hidden keeps the
    // zoomed scene from spilling onto the rest of the page.
    <section ref={rootRef} className="relative h-screen w-full overflow-hidden bg-black" aria-label="Intro">
      {/* iOS gyro permission gate */}
      {needsPermission && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
          <button
            onClick={requestOrientation}
            className="rounded-lg bg-orange-600 px-8 py-4 text-xl font-bold text-white transition-colors hover:bg-orange-700"
          >
            Enable Parallax Effect
          </button>
        </div>
      )}

      {/* ===== ZOOMING SCENE =================================================
          GSAP scales THIS wrapper about its center (transform-origin 50% 50%)
          so the zoom origin is always the middle of the screen. The children
          keep their own mouse/gyro parallax (translate) + entry (`scale:`)
          animations, which compose with the parent scale. */}
      <div
        ref={sceneRef}
        className="absolute inset-0"
        style={{ transformOrigin: "50% 50%", willChange: "transform" }}
      >
        {/* NOTE: every layer is a full-frame 16:9 PNG with the subject already
            in its correct position, so all layers share the SAME full-bleed
            sizing (oversized 120%, centered via -10% offsets, object-cover).
            That auto-registers them into the original group composition; only
            z-index, parallax multiplier and entry animation differ per depth.
            Bigger multiplier = closer = moves more. */}

        {/* 1. Backdrop — deepest layer (studio plate) */}
        <div
          className={`absolute ${shouldAnimate && revealed ? "zoom-layer-1" : ""}`}
          style={{
            zIndex: 0,
            transform: `translate3d(${mousePosition.x * 25}px, ${mousePosition.y * 25}px, 0)`,
            willChange: "transform",
            width: "120%",
            height: "120%",
            left: "-10%",
            top: "-10%",
          }}
        >
          <Image src="/new-background/background.png" alt="Studio backdrop" fill className="object-cover" priority sizes="120vw" onLoad={handleAssetLoad} onError={handleAssetLoad} />
        </div>

        {/* 2. Person 1 — center-back (holographic umbrella) */}
        <div
          className={`absolute ${shouldAnimate && revealed ? "zoom-layer-2" : ""}`}
          style={{
            zIndex: 10,
            transform: `translate3d(${mousePosition.x * 55}px, ${mousePosition.y * 55}px, 0)`,
            willChange: "transform",
            width: "120%",
            height: "120%",
            left: "-10%",
            top: "-10%",
          }}
        >
          <Image src="/new-background/person1.png" alt="" aria-hidden="true" fill className="object-cover" sizes="120vw" onLoad={handleAssetLoad} onError={handleAssetLoad} />
        </div>

        {/* 3. Logo — mid brand beat (behind the front people, above the backdrop).
            OUTER wrapper = parallax translate + entry animation; INNER element
            (logoInnerRef) = what GSAP fades + scales on scroll, so the parallax
            and GSAP never write the same element's transform. */}
        <div
          className={`absolute inset-0 flex items-center justify-center px-6 ${shouldAnimate && revealed ? "zoom-layer-text" : ""}`}
          style={{
            zIndex: 12,
            transform: `translate3d(${mousePosition.x * 90}px, ${mousePosition.y * 90}px, 0)`,
            willChange: "transform",
            perspective: "1000px",
          }}
        >
          <div
            ref={logoInnerRef}
            className="relative aspect-[4304/676] w-[55%] max-w-[750px]"
            style={{ willChange: "transform, opacity" }}
          >
            <Image src="/images/ImagineArt.png" alt="ImagineArt" fill className="object-contain" priority sizes="(max-width: 768px) 55vw, 750px" onLoad={handleAssetLoad} onError={handleAssetLoad} />
          </div>
        </div>

        {/* 4. Person 4 — left (green sweater, jacket over shoulder) */}
        <div
          className={`absolute ${shouldAnimate && revealed ? "zoom-layer-2" : ""}`}
          style={{
            zIndex: 15,
            transform: `translate3d(${mousePosition.x * 70}px, ${mousePosition.y * 70}px, 0)`,
            willChange: "transform",
            width: "120%",
            height: "120%",
            left: "-10%",
            top: "-10%",
          }}
        >
          <Image src="/new-background/person4.png" alt="" aria-hidden="true" fill className="object-cover" sizes="120vw" onLoad={handleAssetLoad} onError={handleAssetLoad} />
        </div>

        {/* 5. Person 3 — right (blue umbrella raised) */}
        <div
          className={`absolute ${shouldAnimate && revealed ? "zoom-layer-2" : ""}`}
          style={{
            zIndex: 16,
            transform: `translate3d(${mousePosition.x * 85}px, ${mousePosition.y * 85}px, 0)`,
            willChange: "transform",
            width: "120%",
            height: "120%",
            left: "-10%",
            top: "-10%",
          }}
        >
          <Image src="/new-background/person3.png" alt="" aria-hidden="true" fill className="object-cover" sizes="120vw" onLoad={handleAssetLoad} onError={handleAssetLoad} />
        </div>

        {/* 6. Person 2 — crouching, front, closest to camera (dramatic pop) */}
        <div
          className={`absolute ${shouldAnimate && revealed ? "zoom-layer-3" : ""}`}
          style={{
            zIndex: 20,
            transform: `translate3d(${mousePosition.x * 120}px, ${mousePosition.y * 120}px, 0)`,
            willChange: "transform",
            width: "120%",
            height: "120%",
            left: "-10%",
            top: "-10%",
          }}
        >
          <Image src="/new-background/person2.png" alt="" aria-hidden="true" fill className="object-cover" priority sizes="120vw" onLoad={handleAssetLoad} onError={handleAssetLoad} />
        </div>
      </div>

      {/* ===== HERO REVEAL LAYER ===========================================
          The hero is rendered here (passed in as children), above the scene
          but below the black overlay. It starts hidden and is cross-faded in
          as the overlay lifts, so the intro resolves straight into the hero. */}
      <div ref={heroRef} className="absolute inset-0 z-30 opacity-0" style={{ willChange: "opacity" }}>
        {children}
      </div>

      {/* ===== BLACK-OUT OVERLAY ===========================================
          Starts transparent (opacity-0 class avoids any SSR flash). GSAP fades
          it IN to cover the scene, then OUT to reveal the hero beneath it. */}
      <div ref={overlayRef} className="absolute inset-0 z-40 bg-black opacity-0" style={{ willChange: "opacity" }} aria-hidden="true" />

      {/* Entry animation keyframes (Phase 1) — unchanged from the original. */}
      <style jsx>{`
        .zoom-layer-1 {
          animation: zoomOut1 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .zoom-layer-starship {
          animation: zoomOutStarship 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .zoom-layer-2 {
          animation: zoomOut2 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .zoom-layer-3 {
          animation: zoomOut3 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .zoom-layer-text {
          animation: zoomOutText 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes zoomOut1 {
          0% {
            scale: 1.3;
          }
          100% {
            scale: 1;
          }
        }
        @keyframes zoomOutStarship {
          0% {
            scale: 1.5;
          }
          100% {
            scale: 0.75;
          }
        }
        @keyframes zoomOut2 {
          0% {
            scale: 2.5;
            filter: blur(20px);
          }
          50% {
            filter: blur(10px);
          }
          100% {
            scale: 1;
            filter: blur(0px);
          }
        }
        @keyframes zoomOut3 {
          0% {
            scale: 8;
            filter: blur(40px);
            opacity: 0;
          }
          30% {
            filter: blur(25px);
            opacity: 0.3;
          }
          70% {
            filter: blur(10px);
            opacity: 0.7;
          }
          100% {
            scale: 1;
            filter: blur(0px);
            opacity: 1;
          }
        }
        @keyframes zoomOutText {
          0% {
            scale: 3.5;
            opacity: 0;
          }
          40% {
            opacity: 0.3;
          }
          70% {
            opacity: 0.7;
          }
          100% {
            scale: 1;
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}
