"use client"

/**
 * Reveal — reveal-on-scroll wrapper used across the design system.
 * Toggles the `.reveal` / `.reveal-visible` classes (defined in globals.css)
 * when the element enters the viewport. Respects prefers-reduced-motion via
 * the CSS media query in globals.css.
 */

import { useEffect, useRef, useState, type ReactNode } from "react"

type Direction = "up" | "left" | "right" | "down"

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode
  className?: string
  delay?: number
  direction?: Direction
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const dirClass =
    direction === "left"
      ? "reveal-left"
      : direction === "right"
        ? "reveal-right"
        : direction === "down"
          ? "reveal-down"
          : ""

  return (
    <div
      ref={ref}
      className={`reveal ${dirClass} ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
