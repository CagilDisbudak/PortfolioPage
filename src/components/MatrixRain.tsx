import { useEffect, useRef } from 'react';

// Real code snippets that rain down
const CODE_CHARS = [
  'const', 'async', 'await', 'function', 'return', 'import', 'export', 'class',
  'interface', 'type', 'extends', 'implements', 'new', 'void', 'null', 'true',
  'false', '{}', '[]', '=>', '===', '!==', '&&', '||', '??', '...', ':',
  'if', 'else', 'for', 'while', 'try', 'catch', 'throw', 'break', 'continue',
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'GROUP BY', 'ORDER BY',
  'docker', 'kubectl', 'nginx', 'redis', 'postgres',
  '0x', '1337', '404', '200', '500',
  '<T>', '<K,V>', '[]string', '&mut', 'pub fn',
  '#!/bin/sh', 'npm run', 'git push',
];

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const FONT_SIZE = 13;
    const COLS = Math.floor(W / (FONT_SIZE * 5.5));

    interface Drop {
      x: number;
      y: number;
      speed: number;
      chars: string[];
      charIndex: number;
      alpha: number;
      fadeSpeed: number;
      color: string;
    }

    const COLORS = ['#00e5ff', '#7c3aed', '#22d3ee', '#818cf8', '#06b6d4'];

    const drops: Drop[] = Array.from({ length: COLS }, (_, i) => ({
      x: i * (W / COLS),
      y: Math.random() * -H,
      speed: 0.4 + Math.random() * 1.2,
      chars: Array.from({ length: 8 + Math.floor(Math.random() * 12) }, () =>
        CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
      ),
      charIndex: 0,
      alpha: 0.1 + Math.random() * 0.5,
      fadeSpeed: 0.008 + Math.random() * 0.015,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let raf = 0;
    let lastTime = 0;

    const draw = (time: number) => {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      // Faint trail
      ctx.fillStyle = 'rgba(2,0,18,0.18)';
      ctx.fillRect(0, 0, W, H);

      ctx.font = `${FONT_SIZE}px ui-monospace, "Cascadia Code", Menlo, monospace`;

      drops.forEach((d) => {
        d.y += d.speed * (dt / 16);

        const totalH = d.chars.length * (FONT_SIZE + 6);
        if (d.y > H + totalH) {
          d.y = -totalH - Math.random() * H * 0.5;
          d.x = Math.random() * W;
          d.speed = 0.4 + Math.random() * 1.2;
          d.chars = Array.from({ length: 8 + Math.floor(Math.random() * 12) }, () =>
            CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
          );
          d.alpha = 0.1 + Math.random() * 0.5;
          d.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        d.chars.forEach((ch, ci) => {
          const cy = d.y + ci * (FONT_SIZE + 6);
          if (cy < -20 || cy > H + 20) return;

          // Head char glows bright
          const isHead = ci === d.chars.length - 1;
          const fraction = ci / d.chars.length;
          const alpha = d.alpha * fraction * (isHead ? 1.8 : 1);

          ctx.globalAlpha = Math.min(alpha, 0.95);
          ctx.fillStyle = isHead ? '#ffffff' : d.color;
          ctx.fillText(ch, d.x, cy);
        });
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame((t) => { lastTime = t; draw(t); });

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden
      style={{ opacity: 0.55 }}
    />
  );
}
