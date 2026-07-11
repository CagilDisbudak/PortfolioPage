import { useEffect, useRef, useState } from 'react';

const CHAPTERS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

// Persistent top bar, modeled on apple.com product pages: a permanently
// frosted header with brand + horizontally-scrollable jump links (the
// mobile-friendly pattern Apple itself uses once the link row can't fit)
// and an ever-present primary CTA on the right, standing in for "Buy".
export default function SiteNav() {
  const [active, setActive] = useState(CHAPTERS[0].id);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.4;
      let current = CHAPTERS[0].id;
      for (const c of CHAPTERS) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= mid) current = c.id;
      }
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        current = CHAPTERS[CHAPTERS.length - 1].id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // `inset-x-0` gives a fixed element its width indirectly (left/right
  // insets); in at least one Chromium layout path that indirection doesn't
  // count as a "definite" size for a *nested* CSS Grid `1fr` track to
  // measure against, so the track falls back to sizing off its content
  // instead of the available space — the pill row then expands the whole
  // header and shoves the CTA button off-screen on narrow viewports. An
  // explicit pixel width sidesteps it entirely, so we measure and set one.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () => {
      el.style.width = `${document.documentElement.clientWidth}px`;
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  return (
    <header ref={headerRef} className="fixed top-0 left-0 z-50 h-14 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="h-full mx-auto max-w-7xl px-4 md:px-6 grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-6">
        <a href="#top" className="shrink-0 text-sm font-semibold tracking-tight text-white/90 hover:text-white transition-colors">
          <span className="md:hidden">Ç.D.</span>
          <span className="hidden md:inline">Çağıl Dişbudak</span>
        </a>

        <nav
          className="nav-scroll min-w-0 flex items-center gap-1 overflow-x-auto"
          aria-label="Page sections"
        >
          {CHAPTERS.map((c) => {
            const isActive = active === c.id;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${isActive ? 'text-amber-300 bg-amber-400/10' : 'text-white/55 hover:text-white/85'
                  }`}
              >
                {c.label}
              </a>
            );
          })}
        </nav>

        <a
          href="/PortfolioPage/Cagil-Disbudak-Resume.pdf"
          download="Cagil-Disbudak-Resume.pdf"
          className="shrink-0 px-3.5 md:px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-400 text-black hover:bg-amber-300 transition-colors"
        >
          <span className="md:hidden">CV</span>
          <span className="hidden md:inline">Download CV</span>
        </a>
      </div>
    </header>
  );
}
