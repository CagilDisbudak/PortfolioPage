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
          particleCount={260}
          particleSpread={20}
          speed={0.1}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          particleHoverFactor={1}
          alphaParticles={false}
          disableRotation={false}
          className="z-0"
        />
        {/* Background blobs with smooth bottom gradient to transition */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-cyan-500/10 blur-[80px] animate-blob" />
          <div className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full bg-teal-500/10 blur-[90px] animate-blob" style={{ animationDelay: '2s' }} />
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

        <motion.div variants={revealChild} className="mt-8 flex gap-4">
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

