import { motion, useMotionValue, useTransform } from 'framer-motion';
import React, { PropsWithChildren, useMemo } from 'react';

type Props = {
  className?: string;
};

export default function GlassCard({ children, className }: PropsWithChildren<Props>) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const shadow = useTransform(rotateY, [ -10, 0, 10 ], [ 'rgba(34,211,238,0.15)', 'rgba(34,211,238,0.08)', 'rgba(34,211,238,0.15)' ]);

  const dropletPositions = useMemo(() => (
    Array.from({ length: 4 }).map((_, i) => ({
      left: `${15 + i * 18 + (i % 2 ? 4 : -2)}%`,
      top: `${18 + (i * 14) % 60}%`,
      size: 10 + (i % 3) * 8,
      delay: i * 0.6,
    }))
  ), []);

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - py) * 8);
    rotateY.set((px - 0.5) * 12);
  };

  const onLeave = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      style={{ rotateX, rotateY, boxShadow: `0 0 50px ${shadow.get()}` }}
      className={`relative glass p-6 md:p-8 overflow-hidden select-none will-change-transform ${className ?? ''}`}
    >
      {/* Goo droplets */}
      <div className="absolute inset-0 pointer-events-none goo">
        {dropletPositions.map((d, idx) => (
          <span
            key={idx}
            className="absolute block rounded-full bg-white/8 border border-white/10 backdrop-blur-xl transition-transform duration-300 will-change-transform"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              animation: `blob 8s ease-in-out ${d.delay}s infinite`,
            }}
            aria-hidden
          />
        ))}
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

