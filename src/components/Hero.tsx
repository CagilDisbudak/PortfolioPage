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
        <div className="flex justify-center">
          <TechStrip />
        </div>

        <motion.div variants={revealChild} className="mt-8 flex gap-4 justify-center">
          <a href="#contact" className="glass px-5 py-3 text-sm font-medium hover:shadow-glow transition-shadow">
            Contact
          </a>
          <a href="#" className="px-5 py-3 text-sm font-medium border border-white/20 rounded-2xl hover:bg-white/5 transition-colors" aria-label="Download resume (placeholder)">
            Resume
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

