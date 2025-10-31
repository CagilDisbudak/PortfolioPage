import { motion } from 'framer-motion';
import React from 'react';
import GlassCard from './GlassCard';
import { revealParent, revealChild } from '../lib/motion';
import { skills } from '../lib/data';

export default function Skills() {
  const groups: Array<[string, { level: string; items: string[] }]> = Object.entries(skills) as any;
  return (
    <section id="skills" className="relative py-16 md:py-24" aria-label="Skills">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={revealParent}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={revealChild} className="text-2xl font-semibold">Skills</motion.h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {groups.map(([name, group]) => (
            <GlassCard key={name}>
              <motion.h3 variants={revealChild} className="text-lg font-semibold capitalize">{name}</motion.h3>
              <motion.p variants={revealChild} className="text-white/60 text-sm mt-1">{group.level}</motion.p>
              <motion.ul variants={revealChild} className="mt-4 space-y-2">
                {group.items.map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-cyan-400/60" aria-hidden />
                    <span className="text-sm text-white/80">{i}</span>
                  </li>
                ))}
              </motion.ul>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

