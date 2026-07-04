"use client"

/**
 * 3D Card (perspective tilt) — adapted from the Aceternity UI pattern.
 * =========================================================================
 * CardContainer establishes a 3D `perspective` and rotates its inner card
 * toward the pointer (rotateX/rotateY) on mouse-move. CardItem children float
 * at different `translateZ` depths while the pointer is inside, so they appear
 * to lift off the surface — and settle back flat on mouse-leave.
 *
 * Children share `transform-style: preserve-3d`, which is what lets each
 * CardItem's translateZ read as real depth against the tilted parent.
 */

import { cn } from "@/lib/utils"
import React, { createContext, useState, useContext, useRef, useEffect } from "react"

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)

export const CardContainer = ({
  children,
  className,
  containerClassName,
  maxTilt = 10,
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  /** Max tilt in degrees at the edges — size-independent, so it works for both
   *  a small card and a full-bleed hero (pass a small value for the latter). */
  maxTilt?: number
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMouseEntered, setIsMouseEntered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    // Normalize pointer offset to [-1, 1] then scale to maxTilt, so the tilt is
    // the same regardless of element size.
    const x = ((e.clientX - left - width / 2) / (width / 2)) * maxTilt
    const y = ((e.clientY - top - height / 2) / (height / 2)) * maxTilt
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`
  }

  const handleMouseEnter = () => setIsMouseEntered(true)

  const handleMouseLeave = () => {
    if (!containerRef.current) return
    setIsMouseEntered(false)
    containerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)"
  }

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("flex items-center justify-center", containerClassName)}
        style={{ perspective: "1400px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative flex items-center justify-center transition-all duration-200 ease-out",
            className,
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  )
}

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn("relative [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}
    >
      {children}
    </div>
  )
}

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType
  children: React.ReactNode
  className?: string
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
  [key: string]: unknown
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isMouseEntered] = useMouseEnter()

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.transform = isMouseEntered
      ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      : "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)"
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ])

  // createElement (not JSX) so a polymorphic `as` element type doesn't collapse
  // its props to `never` under strict typing.
  return React.createElement(
    Tag,
    { ref, className: cn("transition duration-200 ease-out", className), ...rest },
    children,
  )
}

// Hook to read whether the pointer is inside the card.
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext)
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a CardContainer")
  }
  return context
}
