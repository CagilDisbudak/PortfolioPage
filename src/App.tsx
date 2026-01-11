import React from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Terminal from './components/Terminal';
import Contact from './components/Contact';
import GooeyCursor from './components/GooeyCursor';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';

export default function App() {
  return (
    <div className="relative min-h-screen text-white antialiased bg-[#0b0b0d] dark:bg-[#0b0b0d]">
      <ScrollProgress />
      <GooeyCursor />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Projects />
        <Skills />
        <Terminal />
        <Contact />
      </main>

      <footer className="py-10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Çağıl Dişbudak. Built with React, Vite, Tailwind, and Framer Motion.
      </footer>
      
      <BackToTop />
    </div>
  );
}

