import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Dancing_Script } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import 'lenis/dist/lenis.css'
import './globals.css'
import SmoothScroll from '@/components/smooth-scroll'

// Google Sans Flex — the ONLY typeface (variable, weights 100–900).
// Consumed by --font-sans / --font-display in globals.css. Never use 700+.
const googleSans = localFont({
  src: './fonts/google-sans-flex.ttf',
  variable: '--font-google-sans',
  display: 'swap',
  weight: '100 900',
})

// Script face — the gold cursive "Students" flourish in the intro title.
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-script',
  display: 'swap',
})

// Responsive viewport (allow pinch-zoom for accessibility; cover the notch).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: 'ImagineArt Ambassador Program',
  description:
    'Build and lead the ImagineArt creative community in your region. Host events, mentor creators, and partner with ImagineArt to grow AI art culture worldwide.',
  icons: {
    icon: '/images/Group.png',
    apple: '/images/Group.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${googleSans.variable} ${dancingScript.variable}`}>
      <body className="font-sans antialiased">
        {/* Always start the experience from the top on every (re)load. Setting
            this before hydration stops the browser from restoring the previous
            scroll position, so a refresh anywhere replays the parallax intro. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }`,
          }}
        />
        {/* Site-wide smooth scrolling (Lenis), synced to GSAP ScrollTrigger. */}
        <SmoothScroll />
        {children}
        {/* Tally embed — powers the "Apply Now" popup form (data-tally-open). */}
        <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
