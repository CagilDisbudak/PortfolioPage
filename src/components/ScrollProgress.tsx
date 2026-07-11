import { motion, useScroll, useSpring } from 'framer-motion';
import React from 'react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    // Sits on the nav bar's bottom edge rather than the viewport's top edge —
    // SiteNav (h-14, top-0) would otherwise render its opaque background
    // over this at an equal z-index and hide it entirely.
    <motion.div
      className="fixed top-14 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-fuchsia-600 origin-left z-50"
      style={{ scaleX }}
    />
  );
}
