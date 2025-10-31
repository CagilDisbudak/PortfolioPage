import { motion } from 'framer-motion';
import React from 'react';
import GlassCard from './GlassCard';
import { projects } from '../lib/data';
import { revealParent, revealChild } from '../lib/motion';

export default function Projects() {
  return (
    <section id="projects" className="relative py-16 md:py-24" aria-label="Featured Work">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={revealParent}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={revealChild} className="text-2xl font-semibold">Featured Work</motion.h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <GlassCard key={p.title}>
              <motion.h3 variants={revealChild} className="text-lg font-semibold">
                <a href={p.github ?? '#'} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4" aria-label={`Open ${p.title} repository`}>
                  {p.title}
                </a>
              </motion.h3>
              {p.subtitle && (
                <motion.p variants={revealChild} className="text-white/60 text-sm mt-1">{p.subtitle}</motion.p>
              )}
              <motion.div variants={revealChild} className="mt-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] bg-white/5 border border-white/10">{t}</span>
                ))}
              </motion.div>
              {p.blurb && (
                <motion.p variants={revealChild} className="mt-4 text-sm text-white/70">
                  {p.blurb}
                </motion.p>
              )}
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

