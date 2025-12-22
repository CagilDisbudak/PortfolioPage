import React from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import GooeyCursor from './components/GooeyCursor';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="relative min-h-screen text-white antialiased">
      <GooeyCursor />
      <Navbar />

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

