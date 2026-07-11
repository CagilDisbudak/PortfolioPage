import { Variants, Transition } from 'framer-motion';

// Apple-style "resolve to a stop" easing — no spring overshoot on content
// entrances. Springs are reserved for live pointer interaction (hover).
export const easeOutExpo: Transition = {
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1],
};

export const revealParent: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...easeOutExpo, staggerChildren: 0.09, delayChildren: 0.05 },
  },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { ...easeOutExpo, staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const revealChild: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: easeOutExpo },
  whileInView: { opacity: 1, y: 0, transition: easeOutExpo },
};

// Signature "resolve into focus" reveal for hero-scale headings: starts soft
// and slightly displaced, sharpens to a stop with no spring overshoot.
export const revealBlur: Variants = {
  initial: { opacity: 0, y: 18, filter: 'blur(14px)' },
  whileInView: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};
