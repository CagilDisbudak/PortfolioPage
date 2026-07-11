import { motion, useReducedMotion, useSpring } from 'framer-motion';
import React, { useMemo, useRef } from 'react';

const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

// Magnetic hover wrapper: the child leans very slightly toward the cursor
// while hovered and settles back on leave — a quiet, weighted nudge rather
// than a snappy chase. Desktop pointers only; inert for reduced motion.
export default function Magnetic({
  children,
  strength = 0.14,
  maxOffset = 10,
  className = '',
}: {
  children: React.ReactNode;
  strength?: number;
  maxOffset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const fine = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: fine)').matches,
    []
  );
  const enabled = !reduced && fine;

  const x = useSpring(0, { stiffness: 140, damping: 20, mass: 0.7 });
  const y = useSpring(0, { stiffness: 140, damping: 20, mass: 0.7 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength, maxOffset));
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength, maxOffset));
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={enabled ? { x, y } : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
