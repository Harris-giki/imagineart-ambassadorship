"use client"

/**
 * Globe — a standalone, controls-free wireframe globe.
 * =========================================================================
 * Extracted from the globe-to-map-transform prototype, but stripped down to
 * JUST the globe: no slider, no "unroll"/expander button, no reset — only the
 * orthographic wireframe Earth.
 *
 * Rendering: d3-geo orthographic projection + world-atlas country outlines,
 * drawn into an SVG. Monochrome (white-on-black at low opacity) to match the
 * jet-black theme. Built once on data load, then each animation frame only
 * updates the path `d` attributes (cheap) as it slowly auto-rotates. Drag to
 * spin it by hand; auto-rotation resumes on release.
 *
 * Accessibility: prefers-reduced-motion disables the auto-spin (drag still
 * works). The world data is fetched client-side with a graceful no-op on
 * failure (the sphere + graticule still render).
 */

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { feature } from "topojson-client"

const SIZE = 600 // SVG viewBox is square; scales to the container via CSS

export default function Globe({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [worldData, setWorldData] = useState<GeoJSON.Feature[]>([])

  // Mutable refs read by the animation loop (no re-render per frame).
  const rotation = useRef<[number, number]>([0, -12]) // [longitude, latitude]
  const dragging = useRef(false)
  const lastMouse = useRef<[number, number]>([0, 0])
  const update = useRef<() => void>(() => {})

  // ---- Load country outlines (client-side) -------------------------------
  useEffect(() => {
    let cancelled = false
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((r) => r.json())
      .then((world: any) => {
        if (cancelled) return
        const countries = (feature(world, world.objects.countries) as any).features
        setWorldData(countries)
      })
      .catch(() => {
        /* sphere + graticule still render without country data */
      })
  }, [])

  // ---- Build the SVG once, expose an `update()` that re-projects ----------
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const projection = d3
      .geoOrthographic()
      .scale(SIZE / 2 - 6)
      .translate([SIZE / 2, SIZE / 2])
      .precision(0.5)
    const path = d3.geoPath(projection)

    // faint filled sphere so the globe reads as a solid body on black
    svg
      .append("path")
      .datum({ type: "Sphere" } as any)
      .attr("class", "g-sphere-fill")
      .attr("fill", "rgba(255,255,255,0.025)")
    // graticule grid
    svg
      .append("path")
      .datum(d3.geoGraticule()() as any)
      .attr("class", "g-graticule")
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.12)")
      .attr("stroke-width", 0.6)
    // country outlines
    svg
      .append("g")
      .attr("class", "g-countries")
      .selectAll("path")
      .data(worldData)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.45)")
      .attr("stroke-width", 0.7)
    // sphere outline on top
    svg
      .append("path")
      .datum({ type: "Sphere" } as any)
      .attr("class", "g-sphere-outline")
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.3)")
      .attr("stroke-width", 1)

    update.current = () => {
      projection.rotate(rotation.current)
      svg.selectAll<SVGPathElement, unknown>(".g-sphere-fill,.g-sphere-outline,.g-graticule").attr("d", path as any)
      svg.selectAll<SVGPathElement, GeoJSON.Feature>(".g-countries path").attr("d", (d) => {
        const s = path(d as any)
        return s && !s.includes("NaN") ? s : ""
      })
    }
    update.current()
  }, [worldData])

  // ---- Animation loop: slow auto-rotate (unless reduced motion / dragging) -
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = now - last
      last = now
      if (!reduce && !dragging.current) {
        rotation.current = [rotation.current[0] + dt * 0.006, rotation.current[1]]
      }
      update.current()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // ---- Drag to spin ------------------------------------------------------
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    lastMouse.current = [e.clientX, e.clientY]
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastMouse.current[0]
    const dy = e.clientY - lastMouse.current[1]
    lastMouse.current = [e.clientX, e.clientY]
    rotation.current = [
      rotation.current[0] + dx * 0.4,
      Math.max(-90, Math.min(90, rotation.current[1] - dy * 0.4)),
    ]
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      preserveAspectRatio="xMidYMid meet"
      className={`h-full w-full cursor-grab touch-none select-none active:cursor-grabbing ${className ?? ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      aria-hidden="true"
    />
  )
}
