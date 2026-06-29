/* eslint-disable @next/next/no-img-element */

const BASE = "https://www.imagine.art";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "ImagineArt AI Studios",
    links: [
      { label: "Image Studio", href: `${BASE}/image` },
      { label: "Video Studio", href: `${BASE}/video` },
      { label: "Audio Studio", href: `${BASE}/audio-studio` },
      { label: "Film Studio", href: `${BASE}/ai-film-studio` },
      { label: "Workflow", href: `${BASE}/flow` },
      { label: "Enterprise", href: `${BASE}/business/enterprise` },
      { label: "Teams", href: `${BASE}/teams-plan` },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "AI Image Generator", href: `${BASE}/ai-image-generator` },
      { label: "AI Video Generator", href: `${BASE}/ai-video-generator` },
      { label: "AI Audio Generator", href: `${BASE}/audio-studio` },
      { label: "AI Text-to-Speech", href: `${BASE}/audio/text-to-speech` },
      { label: "AI Music Generator", href: `${BASE}/audio/music/elevenlabs-music` },
      { label: "AI Film Studio", href: `${BASE}/ai-film-studio` },
      { label: "AI Workflows", href: `${BASE}/workflow` },
    ],
  },
  {
    heading: "Apps",
    links: [
      { label: "Video Translate", href: `${BASE}/apps/video-translate` },
      { label: "HeyGen Avatar", href: `${BASE}/apps/heygen-avatar` },
    ],
  },
  {
    heading: "Contact Us",
    links: [
      { label: "Contact Sales", href: `${BASE}/teams-plan/contact-us` },
      { label: "Book a Demo", href: "https://cal.com/team/imagineart/imagineart-customer-assist" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Discord", href: "https://discord.com/invite/z7kjUyvAbv" },
      { label: "Twitter / X", href: "https://twitter.com/Imagine_aiart" },
      { label: "Instagram", href: "https://www.instagram.com/imagineartofficial" },
    ],
  },
  {
    heading: "Pricing",
    links: [{ label: "See Plans", href: `${BASE}/subscription` }],
  },
];

const SOCIALS: { title: string; href: string; path: string }[] = [
  { title: "Facebook", href: "https://www.facebook.com/groups/imagineai", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { title: "Twitter / X", href: "https://twitter.com/Imagine_aiart", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.432-8.5L2.25 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { title: "Discord", href: "https://discord.com/invite/z7kjUyvAbv", path: "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.03.05a19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.1.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" },
  { title: "Instagram", href: "https://www.instagram.com/imagineartofficial", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { title: "YouTube", href: "https://www.youtube.com/@imagineartofficial", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" },
  { title: "Reddit", href: "https://www.reddit.com/r/ImagineAiArt/", path: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#070707] border-t border-white/[0.06] overflow-x-hidden">
      <div className="max-w-[1240px] mx-auto px-5 md:px-10 pt-10 md:pt-14 pb-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-12 flex-wrap">

          {/* Brand */}
          <div className="flex flex-row md:flex-col w-full md:w-40 shrink-0 items-start justify-between md:justify-start gap-6 md:gap-8 flex-wrap">
            <img src="/footer/logo-icon.svg" alt="ImagineArt" width={28} height={28} className="block" />

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold tracking-[0.5px] text-white/[0.38] mb-1">
                Try Imagine Mobile
              </span>
              <a
                href="https://app.adjust.com/1a1xymg6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[7px] px-3 py-[7px] rounded-[9px] border border-white/10 text-white/60 text-[11.5px] font-semibold hover:border-white/[0.28] hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </a>
              <a
                href="https://app.adjust.com/1rx90a0u"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[7px] px-3 py-[7px] rounded-[9px] border border-white/10 text-white/60 text-[11.5px] font-semibold hover:border-white/[0.28] hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0"><path d="M3.18 23.75c.33.18.7.26 1.08.22l13.12-7.57-2.82-2.82-11.38 10.17zM.75 1.13C.28 1.63 0 2.39 0 3.36v17.28c0 .97.28 1.73.76 2.22l.12.11 9.68-9.68v-.23L.87 3.02.75 1.13zM20.9 9.61l-2.8-1.62-3.15 3.14 3.15 3.15 2.81-1.62c.8-.46.8-1.21 0-1.67v.62zM4.26.25L17.38 7.82l-2.82 2.82L3.18.47A1.39 1.39 0 014.26.25z"/></svg>
                Google Play
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 flex-1 min-w-0">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <span className="block text-[11px] font-semibold tracking-[0.5px] text-white/[0.38] mb-5">
                  {col.heading}
                </span>
                <ul className="flex flex-col gap-3 list-none m-0 p-0">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] leading-[1.4] text-white/55 hover:text-white/90 transition-colors no-underline"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Big watermark */}
      <div className="max-w-[1240px] mx-auto text-center select-none pointer-events-none px-5 md:px-10 pt-4 leading-[0]">
        <img src="/footer/watermark.svg" alt="" aria-hidden="true" className="w-full max-w-[1240px] h-auto inline-block" />
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1240px] mx-auto px-5 md:px-10 pb-6 md:pb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-5 pb-2 border-t border-white/[0.06] flex-wrap">
          <div className="flex items-center gap-0.5 flex-wrap">
            <span className="text-[12px] text-white/25">
              © {year} <strong className="font-semibold">Vyro Turkey</strong>. All rights reserved.
            </span>
            <button type="button" className="text-[12px] text-white/25 px-3 bg-transparent border-none cursor-pointer hover:text-white/55 transition-colors">
              Manage Cookie Preferences
            </button>
          </div>
          <div className="flex items-center gap-0.5">
            {SOCIALS.map((s) => (
              <a
                key={s.title}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.title}
                aria-label={s.title}
                className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-white/35 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px]"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
