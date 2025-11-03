import React, { useState } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import GooeyCursor from './components/GooeyCursor';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen((v) => !v);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="relative min-h-screen text-white antialiased">
      <GooeyCursor />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(11,11,13,0.6)] backdrop-blur-xl">
        <nav className="container mx-auto px-6 max-w-6xl h-14 flex items-center justify-between">
          <a href="#" className="font-semibold tracking-wide accent-text" aria-label="Çağıl Dişbudak home">Çağıl Dişbudak</a>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a className="hover:text-white" href="#about">About</a>
            <a className="hover:text-white" href="#projects">Work</a>
            <a className="hover:text-white" href="#skills">Skills</a>
            <a className="hover:text-white" href="#contact">Contact</a>
          </div>
          {/* Mobile button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400/80"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={toggleMobile}
          >
            <span className="sr-only">Toggle menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </nav>
        {/* Mobile menu sheet */}
        {mobileOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-white/10 bg-[rgba(11,11,13,0.9)] backdrop-blur-xl">
            <div className="container mx-auto px-6 max-w-6xl py-3 flex flex-col gap-2 text-sm">
              <a onClick={closeMobile} className="py-2 text-white/80 hover:text-white" href="#about">About</a>
              <a onClick={closeMobile} className="py-2 text-white/80 hover:text-white" href="#projects">Work</a>
              <a onClick={closeMobile} className="py-2 text-white/80 hover:text-white" href="#skills">Skills</a>
              <a onClick={closeMobile} className="py-2 text-white/80 hover:text-white" href="#contact">Contact</a>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <footer className="py-10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Çağıl Dişbudak. Built with React, Vite, Tailwind, and Framer Motion.
      </footer>
    </div>
  );
}

