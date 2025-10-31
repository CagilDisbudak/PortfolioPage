import { Variants, Transition } from 'framer-motion';

export const spring: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 22,
  mass: 0.8,
};

export const revealParent: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...spring, staggerChildren: 0.08, delayChildren: 0.05 },
  },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { ...spring, staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const revealChild: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: spring },
  whileInView: { opacity: 1, y: 0, transition: spring },
};

export const hoverTilt: Variants = {
  rest: { rotateX: 0, rotateY: 0, scale: 1 },
  hover: { scale: 1.015 },
};

