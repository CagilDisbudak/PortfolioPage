import { useEffect } from 'react';
import BlackHoleScene from './components/BlackHoleScene';
import SiteNav from './components/SiteNav';
import ScrollProgress from './components/ScrollProgress';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import BackToTop from './components/BackToTop';

export default function App() {
  // Scroll to top on load — unless the URL carries a hash (a shared section
  // link), in which case scroll to that target instead. Using getElementById
  // rather than querySelector: a hash mangled by a chat client's linkifier
  // ("#contact." with a trailing dot) throws a SyntaxError in querySelector,
  // and an uncaught error in a mount effect unmounts the whole React tree.
  useEffect(() => {
    let target: HTMLElement | null = null;
    const hash = window.location.hash;
    if (hash.length > 1) {
      try {
        target = document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch {
        target = null; // malformed percent-encoding can throw in decodeURIComponent too
      }
    }
    const top = target ? Math.max(0, target.getBoundingClientRect().top + window.scrollY - 56) : 0;
    window.scrollTo({ top, behavior: 'instant' });
  }, []);

  return (
    <div className="relative min-h-screen text-white antialiased">
      <BlackHoleScene />
      <ScrollProgress />
      <SiteNav />

      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <footer className="relative z-10 pt-10 pb-10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Çağıl Dişbudak. Built with React, Tailwind, and Framer Motion.
      </footer>

      <BackToTop />
    </div>
  );
}
