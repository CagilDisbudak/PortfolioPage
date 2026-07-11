import { useEffect, useRef } from 'react';

// Fullscreen atmospheric background. The old black-hole scene was intentionally
// cinematic; this version is quieter and more editorial: slow aurora ribbons,
// sparse stars, soft glassy glow, and very restrained scroll/cursor parallax.

const vertexSrc = /* glsl */ `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentSrc = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uMouse;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise2(p);
      p = p * 2.02 + vec2(12.3, 8.7);
      a *= 0.5;
    }
    return v;
  }

  float starField(vec2 uv, float t) {
    vec2 grid = uv * vec2(120.0, 76.0);
    vec2 id = floor(grid);
    vec2 gv = fract(grid) - 0.5;
    float rnd = hash21(id);
    float keep = step(0.982, rnd);
    float point = exp(-dot(gv, gv) * 110.0);
    float twinkle = 0.78 + 0.22 * sin(t * 0.24 + rnd * 40.0);
    return keep * point * twinkle;
  }

  float ribbon(vec2 uv, float y, float width, float wave, float drift) {
    float n = fbm(vec2(uv.x * 1.35 + drift, uv.y * 0.55));
    float center = y + sin(uv.x * wave + drift) * 0.075 + (n - 0.5) * 0.16;
    float band = exp(-pow((uv.y - center) / width, 2.0));
    float edge = smoothstep(-0.95, 0.25, uv.x) * (1.0 - smoothstep(0.15, 1.15, uv.x));
    return band * edge;
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = (frag - 0.5 * uResolution) / uResolution.y;
    float aspect = uResolution.x / max(1.0, uResolution.y);
    float t = uTime;
    float p = clamp(uProgress, 0.0, 1.0);

    uv += vec2(uMouse.x * 0.025, uMouse.y * 0.018);
    uv.y += mix(0.08, -0.05, p);

    vec3 top = vec3(0.010, 0.012, 0.020);
    vec3 bottom = vec3(0.020, 0.015, 0.026);
    vec3 col = mix(bottom, top, smoothstep(-0.85, 0.9, uv.y));

    float leftGlow = exp(-length((uv - vec2(-0.62 * aspect, -0.18)) * vec2(0.78, 1.22)) * 1.7);
    float rightGlow = exp(-length((uv - vec2(0.58 * aspect, 0.22)) * vec2(0.86, 1.08)) * 1.95);
    float centerGlow = exp(-dot(uv - vec2(0.0, -0.04), uv - vec2(0.0, -0.04)) * 1.15);

    col += vec3(0.11, 0.075, 0.15) * leftGlow * 0.34;
    col += vec3(0.025, 0.11, 0.13) * rightGlow * 0.28;
    col += vec3(0.15, 0.11, 0.07) * centerGlow * 0.13;

    vec2 flowUv = uv;
    flowUv.x *= 0.86;
    float r1 = ribbon(flowUv, -0.10, 0.24, 2.2, t * 0.12 + p * 0.7);
    float r2 = ribbon(flowUv + vec2(0.18, 0.16), 0.08, 0.30, 1.7, -t * 0.09 + p * 0.45);
    float r3 = ribbon(flowUv + vec2(-0.12, -0.12), -0.28, 0.34, 1.45, t * 0.07 - p * 0.25);

    float texture = fbm(uv * 2.1 + vec2(t * 0.055, -t * 0.035));
    col += vec3(0.22, 0.12, 0.32) * r1 * (0.12 + texture * 0.18);
    col += vec3(0.05, 0.24, 0.22) * r2 * (0.09 + texture * 0.16);
    col += vec3(0.30, 0.20, 0.09) * r3 * (0.06 + texture * 0.10);

    float st = starField(uv + vec2(t * 0.002, 0.0), t);
    col += vec3(0.68, 0.72, 0.82) * st * 0.26;

    float grain = hash21(frag + t) - 0.5;
    float vignette = smoothstep(1.22, 0.20, length(uv * vec2(0.86, 1.05)));
    col *= mix(0.50, 1.0, vignette);
    col += grain / 520.0;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function BlackHoleScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }
    if (!gl) return;
    const ctx = gl;

    const compile = (type: number, src: string) => {
      const sh = ctx.createShader(type);
      if (!sh) return null;
      ctx.shaderSource(sh, src);
      ctx.compileShader(sh);
      if (!ctx.getShaderParameter(sh, ctx.COMPILE_STATUS)) {
        console.error('BlackHoleScene shader:', ctx.getShaderInfoLog(sh));
        ctx.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(ctx.VERTEX_SHADER, vertexSrc);
    const fs = compile(ctx.FRAGMENT_SHADER, fragmentSrc);
    if (!vs || !fs) return;

    const prog = ctx.createProgram();
    if (!prog) return;
    ctx.attachShader(prog, vs);
    ctx.attachShader(prog, fs);
    ctx.linkProgram(prog);
    if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) {
      console.error('BlackHoleScene link:', ctx.getProgramInfoLog(prog));
      return;
    }
    ctx.useProgram(prog);

    const buf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), ctx.STATIC_DRAW);
    const posLoc = ctx.getAttribLocation(prog, 'position');
    ctx.enableVertexAttribArray(posLoc);
    ctx.vertexAttribPointer(posLoc, 2, ctx.FLOAT, false, 0, 0);

    const uRes = ctx.getUniformLocation(prog, 'uResolution');
    const uTime = ctx.getUniformLocation(prog, 'uTime');
    const uProgress = ctx.getUniformLocation(prog, 'uProgress');
    const uMouse = ctx.getUniformLocation(prog, 'uMouse');

    container.appendChild(canvas);

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduced) {
      canvas.style.opacity = '0';
      canvas.style.transition = 'opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        canvas.style.opacity = '1';
      }));
    }

    const params = new URLSearchParams(window.location.search);
    const bgpParam = params.get('bgp');
    const forced = bgpParam === null ? NaN : parseFloat(bgpParam);
    const bgtParam = params.get('bgt');
    const forcedT = bgtParam === null ? NaN : parseFloat(bgtParam);

    let raf = 0;
    let progress = 0;
    let smooth = 0;
    const mouse = { x: 0, y: 0 };
    const start = performance.now();
    let last = start;
    let lost = false;

    const coarse =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches;
    const dprCap = coarse ? 1.2 : 1.45;
    const maxScale = 1.0;
    let scale = coarse ? 0.8 : 1.0;
    let ema = 16;
    let frames = 0;
    const pinned = !Number.isNaN(forced) || !Number.isNaN(forcedT);

    const computeProgress = () => {
      if (!Number.isNaN(forced)) {
        progress = Math.min(1, Math.max(0, forced));
        smooth = progress;
        return;
      }
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress = Math.min(1, Math.max(0, window.scrollY / max));
    };

    const render = () => {
      if (lost) return;
      const t = !Number.isNaN(forcedT) ? forcedT : reduced ? 0 : (performance.now() - start) * 0.00022;
      ctx.uniform2f(uRes, canvas.width, canvas.height);
      ctx.uniform1f(uTime, t);
      ctx.uniform1f(uProgress, smooth);
      ctx.uniform2f(uMouse, mouse.x, mouse.y);
      ctx.drawArrays(ctx.TRIANGLES, 0, 3);
    };

    let lastW = 0;
    let heightTimer = 0;

    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap) * scale;
      const w = container.clientWidth;
      const h = container.clientHeight;
      lastW = w;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.viewport(0, 0, canvas.width, canvas.height);
      computeProgress();
      if (reduced) {
        smooth = progress;
        render();
      }
    };

    const resize = () => {
      if (container.clientWidth !== lastW) {
        applySize();
      } else {
        window.clearTimeout(heightTimer);
        heightTimer = window.setTimeout(applySize, 300);
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const ms = Math.min(50, now - last);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      computeProgress();
      smooth += (progress - smooth) * (1 - Math.exp(-1.65 * dt));
      render();

      ema = ema * 0.9 + ms * 0.1;
      frames++;
      if (!pinned && frames > 90) {
        frames = 0;
        if (ema > 26 && scale > 0.55) {
          scale *= 0.85;
          applySize();
        } else if (ema < 15 && scale < maxScale) {
          scale = Math.min(maxScale, scale * 1.12);
          applySize();
        }
      }
    };

    const onScroll = () => {
      computeProgress();
      if (reduced) {
        smooth = progress;
        render();
      }
    };

    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      cancelAnimationFrame(raf);
    };

    canvas.addEventListener('webglcontextlost', onContextLost, false);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    resize();
    if (reduced) {
      smooth = progress;
      render();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(heightTimer);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
      ctx.deleteProgram(prog);
      ctx.deleteShader(vs);
      ctx.deleteShader(fs);
      ctx.deleteBuffer(buf);
      ctx.getExtension('WEBGL_lose_context')?.loseContext();
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />;
}
