import { motion } from 'framer-motion';
import React from 'react';
import GlassCard from './GlassCard';
import { revealParent, revealChild } from '../lib/motion';
import { techBadges, keyCompetencies } from '../lib/data';

export default function About() {
  return (
    <section id="about" className="relative py-16 md:py-24" aria-label="About">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={revealParent}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={revealChild} className="text-2xl font-semibold">About</motion.h2>
        <GlassCard className="mt-6">
          <motion.p variants={revealChild} className="text-white/80 leading-relaxed text-lg">
            Backend engineer crafting reliable systems with a playful touch. I love shaping APIs, data flows, and
            infrastructure that scale, while sprinkling in delightful UX. When not building services, I tinker with
            animations and micro-interactions. ⚙️✨
          </motion.p>

          <motion.div variants={revealChild} className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-4">Key Competencies</h3>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-white/70">
              {keyCompetencies.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={revealChild} className="mt-8 flex flex-wrap gap-2">
            {techBadges.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/60">
                {t}
              </span>
            ))}
          </motion.div>
        </GlassCard>
      </motion.div>
    </section>
  );
}

