import { motion } from 'framer-motion';
import Panel from './Panel';
import { projects } from '../lib/data';
import { revealParent, revealChild } from '../lib/motion';

// Chapter 02. The Core is exploded into its layers on the left of the frame
// here, so the featured work reads down the right column on desktop —
// copy beside the visual, the way Apple lays out chip deep-dives.
export default function Projects() {
  const featured = projects.filter((p) => p.isFeatured);
  const rest = projects.filter((p) => !p.isFeatured);

  return (
    <section id="projects" className="relative py-24 md:py-36" aria-label="Featured Work">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={revealParent}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="md:ml-auto md:w-[58%]">
          <motion.span variants={revealChild} className="section-eyebrow">02 — Work</motion.span>
          <motion.h2 variants={revealChild} className="section-heading mt-3">Selected Work</motion.h2>
          <motion.p variants={revealChild} className="mt-4 max-w-xl text-white/60 text-base md:text-lg">
            A few systems and interfaces I've shipped end to end, from data model to deploy.
          </motion.p>

          <div className="mt-10 flex flex-col gap-8">
            {featured.map((p, i) => (
              <motion.div key={p.title} variants={revealChild}>
                <Panel>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-amber-400/70 tracking-widest">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {p.live && p.live !== '#' && (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] uppercase font-bold text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold">
                    <a href={p.github ?? '#'} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors underline-offset-4 hover:underline">
                      {p.title}
                    </a>
                  </h3>
                  {p.subtitle && <p className="stat-callout mt-2 text-white/90">{p.subtitle}</p>}

                  {p.achievements && p.achievements.length > 0 && (
                    <ul className="mt-5 space-y-2.5 text-sm text-white/70 leading-relaxed">
                      {p.achievements.map((a, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 w-1 h-1 rounded-full bg-amber-400/60 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-white/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </Panel>
              </motion.div>
            ))}
          </div>
        </div>

        {rest.length > 0 && (
          <div className="mt-16 md:mt-20">
            <motion.p variants={revealChild} className="font-mono text-xs uppercase tracking-widest text-white/40">
              More experiments
            </motion.p>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((p) => (
                <motion.div key={p.title} variants={revealChild}>
                  <Panel className="h-full">
                    <h3 className="text-base font-semibold">
                      <a href={p.github ?? '#'} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors underline-offset-4 hover:underline">
                        {p.title}
                      </a>
                    </h3>
                    {p.subtitle && <p className="text-white/55 text-xs mt-1">{p.subtitle}</p>}
                    {p.blurb && <p className="mt-3 text-sm text-white/70 leading-relaxed">{p.blurb}</p>}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-white/45">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Panel>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
