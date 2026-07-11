import { motion } from 'framer-motion';
import { revealParent, revealChild } from '../lib/motion';
import Panel from './Panel';
import { techBadges, keyCompetencies } from '../lib/data';

// Chapter 01. At this scroll depth the camera has orbited The Core to the
// right half of the frame, so the copy takes the left column on desktop.
export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-36" aria-label="About">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={revealParent}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="md:w-[52%]">
          <motion.span variants={revealChild} className="section-eyebrow">01 — About</motion.span>
          <motion.h2 variants={revealChild} className="section-heading mt-3">
            Solid foundations. Systems that scale quietly.
          </motion.h2>
          <motion.div variants={revealChild}>
            <Panel className="mt-8">
              <p className="text-white/80 leading-relaxed">
                Backend engineer crafting reliable systems with a playful touch. I love shaping APIs, data flows,
                and infrastructure that scale, while sprinkling in delightful UX. When not building services, I
                tinker with animations and micro-interactions.
              </p>
              <h3 className="mt-7 text-xs font-semibold uppercase tracking-wider text-amber-400">What I focus on</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/75">
                {keyCompetencies.map((c) => (
                  <li key={c} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/60 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap gap-2">
                {techBadges.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-white/60">
                    {t}
                  </span>
                ))}
              </div>
            </Panel>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
