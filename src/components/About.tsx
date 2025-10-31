import { motion } from 'framer-motion';
import React from 'react';
import GlassCard from './GlassCard';
import { revealParent, revealChild } from '../lib/motion';
import { techBadges } from '../lib/data';

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
          <motion.p variants={revealChild} className="text-white/80 leading-relaxed">
            Backend engineer crafting reliable systems with a playful touch. I love shaping APIs, data flows, and
            infrastructure that scale, while sprinkling in delightful UX. When not building services, I tinker with
            animations and micro-interactions. ⚙️✨
          </motion.p>
          <motion.div variants={revealChild} className="mt-6 flex flex-wrap gap-2">
            {techBadges.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10">
                {t}
              </span>
            ))}
          </motion.div>
        </GlassCard>
      </motion.div>
    </section>
  );
}

