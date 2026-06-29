/**
 * FooterMap — a faint dotted world-map backdrop for the footer.
 *
 * Self-contained: land cells are derived from a set of normalized ellipses
 * approximating the continents (Americas on the left, Europe/Africa centre,
 * Asia/Australia right) and rendered as faint dots.
 */

const COLS = 90
const ROWS = 40

// [cx, cy, rx, ry] in normalized 0..1 space (x: West→East, y: North→South).
const LAND: [number, number, number, number][] = [
  [0.20, 0.30, 0.12, 0.17], // North America
  [0.255, 0.47, 0.035, 0.08], // Central America
  [0.36, 0.15, 0.045, 0.06], // Greenland
  [0.31, 0.68, 0.06, 0.15], // South America
  [0.50, 0.29, 0.055, 0.07], // Europe
  [0.54, 0.58, 0.085, 0.15], // Africa
  [0.71, 0.30, 0.17, 0.13], // Asia
  [0.665, 0.49, 0.04, 0.055], // India
  [0.81, 0.56, 0.06, 0.045], // SE Asia
  [0.85, 0.73, 0.055, 0.05], // Australia
]

function isLand(nx: number, ny: number) {
  for (const [cx, cy, rx, ry] of LAND) {
    const dx = (nx - cx) / rx
    const dy = (ny - cy) / ry
    if (dx * dx + dy * dy <= 1) return true
  }
  return false
}

export default function FooterMap() {
  const dots: React.ReactNode[] = []
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const nx = i / (COLS - 1)
      const ny = j / (ROWS - 1)
      if (isLand(nx, ny)) {
        dots.push(<circle key={`${i}-${j}`} cx={i} cy={j} r={0.36} />)
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${COLS - 1} ${ROWS - 1}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        fill: "rgba(255,255,255,0.06)",
      }}
    >
      {dots}
    </svg>
  )
}
