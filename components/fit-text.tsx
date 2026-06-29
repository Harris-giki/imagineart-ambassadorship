"use client"

/**
 * FitText
 * =========================================================================
 * Scales a SINGLE line of text so its natural width exactly fills 100% of its
 * parent container — the "fit-to-width" effect used by the GREYO-style hero.
 *
 * It measures the text's natural width at a fixed base size, then sets the
 * real font-size to `baseSize * (containerWidth / naturalWidth)`. Because text
 * width scales linearly with font-size, one pass fits it precisely.
 *
 * This is UNIFORM scaling (letterforms preserved) — NOT horizontal stretching.
 * That's deliberate: when two stacked lines share the same container width,
 * the line with more characters resolves to a smaller font size automatically
 * (e.g. COMMUNITY ends up larger than AMBASSADORS). No font-size is hardcoded.
 *
 * Why this over the `fitty` library or SVG <text textLength>:
 *   - No extra dependency, SSR-safe, and it refits on container resize.
 *   - SVG textLength="spacingAndGlyphs" would DISTORT glyphs to fill the width;
 *     here the glyphs keep their shape and only the size changes.
 *
 * Refits on: mount, container resize (ResizeObserver), and webfont load
 * (metrics shift after the font swaps in).
 */

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react"

interface FitTextProps {
  children: string
  className?: string
  style?: CSSProperties
  /** Font size (px) used only for the measurement pass. */
  baseSizePx?: number
  /** Upper clamp so a very short line can't blow up absurdly large. */
  maxSizePx?: number
}

export function FitText({
  children,
  className,
  style,
  baseSizePx = 120,
  maxSizePx = 480,
}: FitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  // Start at base size; corrected to the fitted size before first paint.
  const [fontSize, setFontSize] = useState(baseSizePx)

  useLayoutEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const fit = () => {
      const available = container.clientWidth
      if (!available) return
      // Measure natural width at a known base size.
      text.style.fontSize = `${baseSizePx}px`
      const natural = text.scrollWidth
      if (!natural) return
      const next = Math.min(maxSizePx, baseSizePx * (available / natural))
      text.style.fontSize = `${next}px` // apply immediately (avoid flash)
      setFontSize(next) // keep React state in sync
    }

    fit()

    const ro = new ResizeObserver(fit)
    ro.observe(container)
    // Webfonts change glyph metrics once they load — refit when ready.
    if (typeof document !== "undefined" && (document as any).fonts?.ready) {
      ;(document as any).fonts.ready.then(fit).catch(() => {})
    }
    return () => ro.disconnect()
  }, [children, baseSizePx, maxSizePx])

  return (
    <div ref={containerRef} className={className} style={{ width: "100%", ...style }}>
      <span
        ref={textRef}
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          fontSize,
          lineHeight: 0.9,
        }}
      >
        {children}
      </span>
    </div>
  )
}
