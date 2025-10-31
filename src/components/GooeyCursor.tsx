import React, { useEffect, useMemo, useRef, useState } from 'react';

type TrailDot = { x: number; y: number; life: number; id: number };

export default function GooeyCursor() {
  const [enabled, setEnabled] = useState(true);
  const dots = useRef<TrailDot[]>([]);
  const raf = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const prefersReducedMotion = useMemo(() =>
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  []);

  useEffect(() => {
    if (prefersReducedMotion) setEnabled(false);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      dots.current.push({ x: e.clientX, y: e.clientY, life: now + 600, id: now });
      if (dots.current.length > 32) dots.current.shift();
    };

    const update = () => {
      const now = Date.now();
      const node = containerRef.current;
      if (!node) return;
      node.innerHTML = '';
      const frag = document.createDocumentFragment();
      dots.current = dots.current.filter(d => d.life > now);
      for (const d of dots.current) {
        const t = 1 - (d.life - now) / 600;
        const size = 10 + 24 * (1 - t);
        const opacity = 0.04 + 0.12 * (1 - t);
        const el = document.createElement('span');
        el.setAttribute('aria-hidden', 'true');
        el.style.position = 'fixed';
        el.style.left = `${d.x - size / 2}px`;
        el.style.top = `${d.y - size / 2}px`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = '9999px';
        el.style.background = 'rgba(255,255,255,0.06)';
        el.style.backdropFilter = 'blur(12px)';
        el.style.border = '1px solid rgba(255,255,255,0.12)';
        el.style.opacity = String(opacity);
        el.style.pointerEvents = 'none';
        el.style.willChange = 'transform, opacity';
        frag.appendChild(el);
      }
      node.appendChild(frag);
      raf.current = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    raf.current = requestAnimationFrame(update);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="pointer-events-none fixed inset-0 goo z-[1]" ref={containerRef} aria-hidden />
  );
}

