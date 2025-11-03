import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  text: string;
  className?: string;
  durationMs?: number;
  charset?: string;
  trigger?: 'mount' | 'hover' | 'always';
};

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-_';

export default function ScrambledText({
  text,
  className,
  durationMs = 900,
  charset = DEFAULT_CHARS,
  trigger = 'mount',
}: Props) {
  const [display, setDisplay] = useState(text);
  const raf = useRef<number | null>(null);
  const startTs = useRef<number | null>(null);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useMemo(() =>
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  []);

  const animate = () => {
    if (prefersReducedMotion) { setDisplay(text); return; }
    if (raf.current) cancelAnimationFrame(raf.current);
    startTs.current = null;
    const original = text;
    const run = (ts: number) => {
      if (!startTs.current) startTs.current = ts;
      const elapsed = ts - (startTs.current || 0);
      const progress = Math.min(1, elapsed / durationMs);
      const revealCount = Math.floor(progress * original.length);
      let next = '';
      for (let i = 0; i < original.length; i++) {
        if (original[i] === ' ') { next += ' '; continue; }
        if (i < revealCount) next += original[i];
        else next += charset[Math.floor(Math.random() * charset.length)];
      }
      setDisplay(next);
      if (progress < 1) raf.current = requestAnimationFrame(run);
      else setDisplay(original);
    };
    raf.current = requestAnimationFrame(run);
  };

  useEffect(() => {
    setDisplay(text);
    if (trigger === 'mount' || trigger === 'always') animate();
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const handleMouseEnter = () => { if (trigger === 'hover' || trigger === 'always') animate(); };

  return (
    <span ref={containerRef} onMouseEnter={handleMouseEnter} className={className}>{display}</span>
  );
}


