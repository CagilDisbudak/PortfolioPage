import { motion } from 'framer-motion';
import React from 'react';
import { revealParent, revealChild } from '../lib/motion';
import GlassCard from './GlassCard';
import { socials } from '../lib/data';

export default function Contact() {
  return (
    <section id="contact" className="relative py-16 md:py-24" aria-label="Contact">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={revealParent}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={revealChild} className="text-2xl font-semibold">Contact</motion.h2>
        <GlassCard className="mt-6">
          <motion.p variants={revealChild} className="text-white/80">Open to collaboration and interesting challenges.</motion.p>
          <motion.div variants={revealChild} className="mt-5 flex flex-wrap gap-3">
            {socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.aria} className="px-3 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 hover:bg-white/8">
                {s.label}
              </a>
            ))}
            <a
              href="mailto:cdisbudak24@gmail.com"
              aria-label="Send email"
              className="px-3 py-1.5 rounded-full text-sm border border-white/20 hover:bg-white/5"
            >
              Email
            </a>
          </motion.div>
        </GlassCard>
      </motion.div>
    </section>
  );
}

