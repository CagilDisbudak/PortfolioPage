import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { revealParent, revealChild, revealBlur } from '../lib/motion';
import Magnetic from './Magnetic';

// One-screen opener: name and a single action, silhouetted against the
// black hole. The fullscreen shader itself (BlackHoleScene, scroll-scrubbed)
// is the hero visual — no floating object to frame here.
export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const departOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-screen flex flex-col items-center text-center px-6 pt-32 md:pt-40"
      aria-label="Intro"
    >
      <motion.div style={reduced ? undefined : { opacity: departOpacity }}>
        <motion.div
          className="container mx-auto max-w-4xl"
          variants={revealParent}
          initial="initial"
          animate="animate"
        >
          <motion.span variants={revealChild} className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/60">
            Backend Engineer
          </motion.span>
          <motion.h1 variants={revealBlur} initial="initial" animate="whileInView" className="hero-title mt-5 font-semibold will-change-[filter,transform]">
            <span className="accent-text">Çağıl Dişbudak</span>
          </motion.h1>
          <motion.p variants={revealChild} className="mt-4 text-lg md:text-xl text-white/70 max-w-xl mx-auto">
            Building scalable backend systems &amp; resilient infrastructure.
          </motion.p>

          <motion.div variants={revealChild} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Magnetic>
              <a
                href="/PortfolioPage/Cagil-Disbudak-Resume.pdf"
                download="Cagil-Disbudak-Resume.pdf"
                className="px-7 py-3 rounded-full text-base font-semibold bg-amber-400 text-black hover:bg-amber-300 transition-colors active:scale-95 flex items-center gap-2"
                aria-label="Download resume"
              >
                <span>Download CV</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </a>
            </Magnetic>
            <Magnetic strength={0.22}>
              <a href="#contact" className="px-6 py-3 text-sm font-medium text-white/70 hover:text-white transition-colors">
                Contact →
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        style={reduced ? undefined : { opacity: cueOpacity }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors"
        aria-label="Scroll to learn more"
      >
        <span className="font-mono text-[10px] tracking-[0.35em] uppercase">Scroll</span>
        <motion.svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={reduced ? undefined : { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.a>
    </section>
  );
}
