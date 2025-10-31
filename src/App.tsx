import React from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import GooeyCursor from './components/GooeyCursor';

export default function App() {
  return (
    <div className="relative min-h-screen text-white antialiased">
      <GooeyCursor />
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(11,11,13,0.6)] backdrop-blur-xl">
        <nav className="container mx-auto px-6 max-w-6xl h-14 flex items-center justify-between">
          <a href="#" className="font-semibold tracking-wide accent-text" aria-label="Çağıl Dişbudak home">Çağıl Dişbudak</a>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a className="hover:text-white" href="#about">About</a>
            <a className="hover:text-white" href="#projects">Work</a>
            <a className="hover:text-white" href="#skills">Skills</a>
            <a className="hover:text-white" href="#contact">Contact</a>
          </div>
        </nav>
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

