"use client"

/**
 * CinematicIntro
 * =========================================================================
 * Scene: a studio group shot rebuilt as parallax depth layers — a backdrop
 * plate (background.png) with four extracted people (person1–4) full-bleed on
 * top, each PNG a full-frame 16:9 canvas so they auto-register into the original
 * composition. (No logo overlay — the resting frame is the exact photo.)
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
 *      • 0.6–1.0  black overlay fades in (opacity 0->1)
 *    At full black the pin releases and the (dark) Ambassador hero below is
 *    revealed seamlessly; scrolling is 100% normal afterward.
 *
 *  PHASE 3 — release: handled for free by GSAP's pinSpacing (no scroll-jack
 *    after the pin ends).
 *
 * Why no conflict between the two phases:
 *   - GSAP only writes `transform`/`opacity` on three elements it OWNS:
 *       sceneRef (the zoom wrapper) and overlayRef (the black-out).
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
  const frameRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)

  // ---- Preloader sync -----------------------------------------------------
  // The IntroPreloader covers the screen until THESE images (the parallax
  // assets, and only these) finish loading. We broadcast load progress so the
  // preloader can show a bar and then lift to reveal the ready scene (there's
  // no separate scene entry animation — the preloader's fade IS the reveal).
  const INTRO_ASSET_COUNT = 2 // original group photo + all-people occlusion cutout

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
  }
  const handleAssetLoad = reportProgress

  // Catch images already complete at mount (cache), then a 7s safety net so a
  // slow/failed network never blocks the reveal forever.
  useEffect(() => {
    const raf = requestAnimationFrame(reportProgress)
    const safety = window.setTimeout(() => {
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
        }
      } catch (error) {
        console.error("Permission denied:", error)
      }
    } else {
      setNeedsPermission(false)
      setGyroActive(true)
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

  // ---- Phase 1: mouse + gyro parallax -------------------------------------
  useEffect(() => {
    // rAF-throttle the mouse so we setState at most once per frame. Without
    // this, mousemove fires 100-200×/s and re-renders every image layer each
    // time → the visible "blinking"/lag during the parallax.
    let mouseRaf = 0
    let pending: { x: number; y: number } | null = null
    const handleMouseMove = (e: MouseEvent) => {
      pending = {
        x: (e.clientX - window.innerWidth / 2) / window.innerWidth,
        y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
      }
      if (mouseRaf) return
      mouseRaf = requestAnimationFrame(() => {
        mouseRaf = 0
        if (pending) setMousePosition(pending)
      })
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
      }
    } else {
      window.addEventListener("mousemove", handleMouseMove)
    }

    if (gyroActive) {
      window.addEventListener("deviceorientation", handleOrientation)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("deviceorientation", handleOrientation)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      if (mouseRaf) cancelAnimationFrame(mouseRaf)
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
            // NOTE: no invalidateOnRefresh here — the intro tweens are static, and
            // invalidating re-rendered the timeline on every refresh, which
            // flashed the scene at load. The showcase pin below keeps it.
            // This pin is at the TOP of the page, so it must refresh BEFORE the
            // showcase pin below it. Higher refreshPriority = refreshed first, so
            // the showcase measures its start with this pin's spacing applied.
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

        // (Logo removed from the scene — no logo tween.)

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
        {/* FULL-BLEED STAGE — fills the whole viewport edge to edge. Every layer
            is object-cover, so the 16:9 assets cover the screen (a little top/
            bottom is cropped on ultra-wide screens, which is the trade for full
            bleed). All layers share identical geometry so they crop together and
            stay perfectly registered. */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Depth from the REAL group photo. The deepest layer is the full
              original shot (so the scene is ALWAYS pixel-faithful to the
              reference — perfect positions/scale, nothing missing). On top sit
              two in-place cutouts (cut directly from the original at their exact
              spots) of the two front figures, so they parallax a hair more than
              the plate for a subtle depth pop. All layers share identical
              geometry (inset-0, 100%, object-cover) → at rest they recompose
              into the exact original. Multipliers are tiny and deltas are small,
              so registration never visibly breaks. */}

          {/* 1. Full original group photo — deepest, guarantees exact framing */}
          <div
            className="absolute inset-0"
            style={{
              zIndex: 0,
              transform: `translate3d(${mousePosition.x * 4}px, ${mousePosition.y * 4}px, 0)`,
              willChange: "transform",
            }}
          >
            <Image src="/new-background/original.png" alt="ImagineArt Ambassadors" fill className="object-cover" priority sizes="100vw" onLoad={handleAssetLoad} onError={handleAssetLoad} />
          </div>

          {/* 1b. "COMMUNITY" — IN FRONT of the group (top line), fully visible,
              stacked directly above AMBASSADORS as one title over the scene. */}
          <div
            className="absolute inset-0 flex items-center justify-center px-6 pt-[15vh] text-center"
            style={{
              zIndex: 25,
              transform: `translate3d(${mousePosition.x * 10}px, ${mousePosition.y * 10}px, 0)`,
              willChange: "transform",
            }}
            aria-hidden="true"
          >
            <span
              className="font-display uppercase leading-[0.82] tracking-[-0.015em] text-white"
              style={{
                fontWeight: 600,
                fontStretch: "condensed",
                fontSize: "clamp(38px, 8vw, 176px)",
                textShadow: "0 4px 34px rgba(0,0,0,0.5)",
                transform: "translateY(-0.46em)", // stack as the top line
              }}
            >
              Community
            </span>
          </div>

          {/* 2. ALL PEOPLE — an in-place cutout of the whole group, sitting
              ABOVE the title so the title reads fully BEHIND everyone. Pops a
              little more than the backdrop for a subtle depth nudge. */}
          <div
            className="absolute inset-0"
            style={{
              zIndex: 10,
              transform: `translate3d(${mousePosition.x * 8}px, ${mousePosition.y * 8}px, 0)`,
              willChange: "transform",
            }}
          >
            <Image src="/new-background/people_all.png" alt="" aria-hidden="true" fill className="object-cover" priority sizes="100vw" onLoad={handleAssetLoad} onError={handleAssetLoad} />
          </div>

          {/* 3. "AMBASSADORS" — IN FRONT of the group (bottom line), fully
              visible over the people. Highest scene layer (still below the
              black-out/hero). Pops the most for depth. */}
          <div
            className="absolute inset-0 flex items-center justify-center px-6 pt-[15vh] text-center"
            style={{
              zIndex: 25,
              transform: `translate3d(${mousePosition.x * 10}px, ${mousePosition.y * 10}px, 0)`,
              willChange: "transform",
            }}
            aria-hidden="true"
          >
            <span
              className="font-display uppercase leading-[0.82] tracking-[-0.015em] text-white"
              style={{
                fontWeight: 600,
                fontStretch: "condensed",
                fontSize: "clamp(38px, 8vw, 176px)",
                textShadow: "0 6px 40px rgba(0,0,0,0.62)",
                transform: "translateY(0.46em)", // stack as the bottom line
              }}
            >
              Ambassadors
            </span>
          </div>
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
    </section>
  )
}
