import { motion } from 'framer-motion';
import Magnetic from './Magnetic';
import { revealParent, revealChild } from '../lib/motion';
import { socials } from '../lib/data';

// Chapter 04 — the finale. The Core has reassembled and pulled back to
// center frame below this copy; one clear ask, nothing else.
export default function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-44" aria-label="Contact">
      <motion.div
        className="container mx-auto px-6 max-w-4xl text-center"
        variants={revealParent}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.span variants={revealChild} className="section-eyebrow">04 — Contact</motion.span>
        <motion.h2 variants={revealChild} className="section-heading mt-4">
          Let's build something <span className="accent-text">great</span>.
        </motion.h2>
        <motion.p variants={revealChild} className="mt-5 text-white/60 text-base md:text-lg max-w-lg mx-auto">
          Open to backend roles, collaborations, and the occasional interesting challenge. I usually reply within a day.
        </motion.p>

        <motion.div variants={revealChild} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Magnetic>
            <a
              href="mailto:cdisbudak24@gmail.com"
              aria-label="Send email"
              className="px-8 py-3.5 rounded-full text-base font-semibold bg-amber-400 text-black hover:bg-amber-300 transition-colors active:scale-95 flex items-center gap-2"
            >
              <span>Say hello</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </Magnetic>
          <div className="flex gap-3">
            {socials.map((s) => (
              <Magnetic key={s.label} strength={0.18}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.aria}
                  className="px-5 py-3.5 rounded-full text-sm font-medium text-white/70 border border-white/10 hover:text-white hover:border-white/25 hover:bg-white/5 transition-colors"
                >
                  {s.label}
                </a>
              </Magnetic>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
