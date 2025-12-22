import { motion } from 'framer-motion';
import React from 'react';
import { revealParent, revealChild, spring } from '../lib/motion';
import TechStrip from './TechStrip';
import Particles from './Particles';
import ScrambledText from './ScrambledText';

export default function Hero() {
  return (
    <section className="relative pt-28 md:pt-36 pb-20 md:pb-28" aria-label="Hero">
      <Particles
        particleColors={["#22d3ee", "#e6fbff", "#14b8a6"]}
        particleCount={420}
        particleSpread={22}
        speed={0.1}
        particleBaseSize={70}
        moveParticlesOnHover={false}
        particleHoverFactor={1}
        alphaParticles={false}
        disableRotation={false}
        className="z-0"
      />
      {/* Background blobs with smooth bottom gradient to transition */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Soft ambient blobs */}
        <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-cyan-500/10 blur-[90px] animate-blob" />
        <div className="absolute -bottom-24 -right-16 w-[28rem] h-[28rem] rounded-full bg-teal-500/10 blur-[110px] animate-blob" style={{ animationDelay: '2s' }} />

        {/* Right edge fade to reduce visible boundary on wide screens */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[22vw] max-w-[420px] bg-gradient-to-l from-[rgba(11,11,13,0.9)] via-[rgba(11,11,13,0.6)] to-transparent" />

        {/* Large radial vignette on the right to mask transitions */}
        <div className="pointer-events-none absolute right-[-10vw] top-1/3 w-[60vw] h-[60vw] -translate-y-1/2 rounded-full bg-cyan-400/6 blur-[140px]" />

        {/* Bottom gradient into content area */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[rgba(11,11,13,0.6)] to-[rgba(11,11,13,1)]" />
      </div>

      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={revealParent}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.p variants={revealChild} className="text-sm tracking-widest text-white/60">
          <ScrambledText text="" trigger="mount" />
        </motion.p>
        <motion.h1 variants={revealChild} className="mt-4 text-5xl md:text-7xl font-semibold">
          <span className="accent-text"><ScrambledText text="Çağıl Dişbudak" trigger="mount" /></span>
        </motion.h1>
        <motion.p variants={revealChild} className="mt-3 text-xl md:text-2xl text-white/80">
          <ScrambledText text="Software Engineer — Backend-focused" trigger="hover" />
        </motion.p>
        <motion.p variants={revealChild} className="mt-2 text-base md:text-lg text-cyan-400/90 font-medium tracking-wide">
          Building scalable backend systems & resilient infrastructure
        </motion.p>
        <div className="flex justify-center">
          <TechStrip />
        </div>

        <motion.div variants={revealChild} className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
          <a
            href="/PortfolioPage/Cagil-Disbudak-Resume.pdf"
            download="Cagil-Disbudak-Resume.pdf"
            className="glass px-8 py-3 text-base font-semibold hover:shadow-cyan-500/20 hover:shadow-glow transition-all active:scale-95 flex items-center gap-2"
            aria-label="Download resume"
          >
            <span>Download Resume/CV</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
          <a href="#contact" className="px-6 py-3 text-sm font-medium text-white/70 hover:text-white transition-colors">
            Contact Me
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

