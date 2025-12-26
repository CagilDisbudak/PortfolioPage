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
            <GlassCard key={p.title} className={`flex flex-col ${p.isFeatured ? 'md:col-span-2 md:flex-row md:gap-6' : ''}`}>
              <div className="flex-1">
                <motion.h3 variants={revealChild} className="text-lg font-semibold flex items-center gap-2">
                  <a href={p.github ?? '#'} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4" aria-label={`Open ${p.title} repository`}>
                    {p.title}
                  </a>
                  {p.isFeatured && <span className="text-[10px] uppercase font-bold text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full bg-cyan-500/10">Featured</span>}
                  {p.live && p.live !== '#' && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[10px] uppercase font-bold text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                    >
                      Live Demo
                    </a>
                  )}
                </motion.h3>
                {p.subtitle && (
                  <motion.p variants={revealChild} className="text-white/60 text-sm mt-1 font-medium">{p.subtitle}</motion.p>
                )}

                {p.achievements && p.achievements.length > 0 && (
                  <motion.ul variants={revealChild} className="mt-4 space-y-2 text-sm text-white/70 list-disc list-outside ml-4 marker:text-cyan-400">
                    {p.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </motion.ul>
                )}

                {!p.achievements && p.blurb && (
                  <motion.p variants={revealChild} className="mt-4 text-sm text-white/70">
                    {p.blurb}
                  </motion.p>
                )}

                <motion.div variants={revealChild} className="mt-6 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] bg-white/5 border border-white/10 text-white/50">{t}</span>
                  ))}
                </motion.div>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

