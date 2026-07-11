import { motion } from 'framer-motion';
import Panel from './Panel';
import { revealParent, revealChild } from '../lib/motion';
import { skills } from '../lib/data';

const LEVEL_FILL: Record<string, number> = {
  Expert: 5,
  Solid: 4,
  Functional: 3,
};

function LevelBar({ level }: { level: string }) {
  const fill = LEVEL_FILL[level] ?? 3;
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left' }}
            className={`block h-1 w-4 rounded-full origin-left ${i < fill ? 'bg-amber-400' : 'bg-white/10'}`}
          />
        ))}
      </div>
      <span className="text-white/60 text-xs font-medium whitespace-nowrap">{level}</span>
    </div>
  );
}

// Chapter 03. The Core is inspected from above behind this — the spec sheet
// moment, so the content is a literal spec-comparison table.
export default function Skills() {
  const groups: Array<[string, { level: string; items: string[] }]> = Object.entries(skills) as any;
  return (
    <section id="skills" className="relative py-24 md:py-36" aria-label="Skills">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={revealParent}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.span variants={revealChild} className="section-eyebrow">03 — Skills</motion.span>
        <motion.h2 variants={revealChild} className="section-heading mt-3">Toolbox</motion.h2>

        <motion.div variants={revealChild} className="mt-10">
          <Panel className="!p-4 md:!p-6">
            <div className="spec-table-wrap">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Level</th>
                    <th>Tools</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map(([name, group]) => (
                    <tr key={name}>
                      <td className="text-white font-semibold capitalize whitespace-nowrap">{name}</td>
                      <td><LevelBar level={group.level} /></td>
                      <td className="text-white/70">{group.items.join(' · ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </motion.div>
      </motion.div>
    </section>
  );
}
