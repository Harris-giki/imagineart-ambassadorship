// How the font is wired in app/layout.tsx (Next.js next/font/local).
// Google Sans Flex is a VARIABLE font (weights 100–900) — we only ever use
// 300 / 400 / 500 / 600. Never 700+. See GUIDELINES.md.

import localFont from "next/font/local";

const googleSans = localFont({
  src: "./fonts/google-sans-flex.ttf",
  variable: "--font-google-sans", // consumed by --font-sans / --font-display in globals.css
  display: "swap",
  weight: "100 900",
});

// Apply `googleSans.variable` to <html> or <body>, e.g.
// <html lang="en" className={googleSans.variable}>
