import { useEffect, useRef } from 'react';

// A fullscreen, physically-inspired black hole rendered by tracing light rays
// backwards from the camera through curved spacetime (the standard null-
// geodesic approximation: acceleration = -1.5 h² r̂ / r⁴). Because the rays
// genuinely bend, everything the reference imagery shows falls out of the
// math for free: the far side of the accretion disk arcs over and under the
// shadow, a razor-thin photon ring forms where rays orbit at r = 1.5, and the
// background smears and swirls near the hole. The backdrop itself is the
// quieter atmospheric scene (aurora ribbons, soft glow, sparse stars) so the
// hole reads as one accent within it rather than the whole show. Scroll moves
// the camera: distance closes in, elevation arcs up through the middle
// chapters and dives back near-edge-on for the finale.

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
  uniform float uProgress; // 0..1 scroll journey
  uniform vec2 uMouse;     // -1..1
  uniform float uSteps;    // march-step budget (lower on mobile GPUs)
  uniform float uDolly;    // portrait camera pull-back so the hole fits the width

  const float PI = 3.14159265;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  vec2 hash22(vec2 p) {
    float n = hash21(p);
    return vec2(n, hash21(p + n + 17.17));
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
      p = p * 2.05 + vec2(11.1, 7.3);
      a *= 0.52;
    }
    return v;
  }

  // Tiny gaussian point stars on a jittered grid.
  float starLayer(vec2 px, float cell, float radiusPx, float density, float t) {
    vec2 gv = px / cell;
    vec2 id = floor(gv);
    vec2 f = fract(gv);
    float b = hash21(id + 31.7);
    if (b < 1.0 - density) return 0.0;
    vec2 off = 0.2 + 0.6 * hash22(id);
    vec2 d = (f - off) * cell / radiusPx;
    float tw = 0.82 + 0.18 * sin(t * (0.15 + 0.3 * fract(b * 7.0)) + b * 40.0);
    return tw * exp(-dot(d, d) * 3.0) * (0.4 + 0.6 * fract(b * 13.0));
  }

  float ribbon(vec2 uv, float y, float width, float wave, float drift) {
    float n = fbm(vec2(uv.x * 1.35 + drift, uv.y * 0.55));
    float center = y + sin(uv.x * wave + drift) * 0.075 + (n - 0.5) * 0.16;
    float band = exp(-pow((uv.y - center) / width, 2.0));
    float edge = smoothstep(-0.95, 0.25, uv.x) * (1.0 - smoothstep(0.15, 1.15, uv.x));
    return band * edge;
  }

  // Sky sampled by a (bent) escaped ray: the same quiet atmospheric backdrop
  // (gradient wash, glow pools, aurora ribbons, sparse stars) used for the
  // rest of the page, just reprojected onto the ray's spherical direction so
  // it reads as one continuous scene instead of a seam around the hole. The
  // angular seam is anchored behind the camera's horizontal forward axis so
  // it can never appear inside the field of view.
  vec3 background(vec3 rd, vec3 fwdH, float t, float p) {
    vec3 rightH = vec3(fwdH.z, 0.0, -fwdH.x);
    float sx = atan(dot(rd, rightH), dot(rd, fwdH));
    float sy = asin(clamp(rd.y, -1.0, 1.0));
    vec2 uv = vec2(sx, sy) * 0.62;

    vec3 top = vec3(0.010, 0.012, 0.020);
    vec3 bottom = vec3(0.020, 0.015, 0.026);
    vec3 col = mix(bottom, top, smoothstep(-0.85, 0.9, uv.y));

    float leftGlow = exp(-length((uv - vec2(-0.62, -0.18)) * vec2(0.78, 1.22)) * 1.7);
    float rightGlow = exp(-length((uv - vec2(0.58, 0.22)) * vec2(0.86, 1.08)) * 1.95);
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

    vec2 px = uv * 620.0;
    float s = 0.0;
    s += starLayer(px, 42.0, 1.0, 0.42, t) * 0.55;
    s += starLayer(px + 53.0, 31.0, 1.25, 0.30, t) * 0.8;
    s += starLayer(px + 97.0, 61.0, 1.6, 0.32, t);
    col += vec3(0.68, 0.72, 0.82) * s * 0.9;

    return col;
  }

  // Emission where a ray crosses the equatorial disk plane. n is the unit
  // vector from the emitting gas toward the observer (opposite the traced
  // ray's travel direction).
  vec4 diskShade(vec3 hit, vec3 n, float t, float rIn, float rOut) {
    float hr = length(hit.xz);
    float phi = atan(hit.z, hit.x);

    // Differential rotation: inner annuli shear ahead — this is what draws
    // the turbulence out into trailing spiral filaments over time.
    float om = 2.6 * pow(hr, -1.5);
    float a1 = phi + om * t * 0.85;
    float bands = fbm(vec2(hr * 2.6 - t * 0.05, a1 * 2.2));
    float fil = fbm(vec2(hr * 8.5, a1 * 7.0));
    float texd = max(0.42 + 0.68 * bands + 0.42 * (fil - 0.5), 0.0);

    float inEdge = smoothstep(rIn, rIn + 0.55, hr);
    float outFade = 1.0 - smoothstep(rOut * 0.42, rOut, hr);
    float heat = pow(clamp(rIn / hr, 0.0, 1.02), 1.8);
    float em = inEdge * outFade * (0.35 + 2.6 * heat) * texd;

    // Doppler beaming: gas orbits counter-clockwise seen from +y; the side
    // sweeping toward the camera brightens as ~δ³ and shifts blue-white.
    vec3 vdir = normalize(vec3(-hit.z, 0.0, hit.x));
    float v = 0.55 * inversesqrt(max(hr, 1.0));
    float dop = clamp(1.0 / (1.0 - v * dot(vdir, n)), 0.45, 2.4);
    em *= pow(dop, 3.0) * 0.55;

    float g = clamp((hr - rIn) / (rOut - rIn), 0.0, 1.0);
    vec3 cHot = vec3(1.05, 1.00, 0.95);
    vec3 cAmber = vec3(1.05, 0.62, 0.22);
    vec3 cEmber = vec3(0.75, 0.26, 0.12);
    vec3 cViolet = vec3(0.45, 0.18, 0.55);
    vec3 c = mix(cHot, cAmber, smoothstep(0.0, 0.28, g));
    c = mix(c, cEmber, smoothstep(0.28, 0.62, g));
    c = mix(c, cViolet, smoothstep(0.62, 1.0, g));
    c = mix(c, vec3(0.90, 0.95, 1.10), clamp((dop - 1.0) * 0.35, 0.0, 0.5));

    return vec4(c * em, clamp(em * 0.9, 0.0, 1.0));
  }

  vec3 aces(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = (frag - 0.5 * uResolution) / uResolution.y;
    float t = uTime;
    float p = clamp(uProgress, 0.0, 1.0);

    // Scroll-driven camera path. uDolly backs the camera off on tall/narrow
    // viewports (the FOV is height-normalized, so without it the shadow
    // swallows the whole width of a phone screen).
    float dist = mix(9.6, 6.6, smoothstep(0.0, 1.0, p)) * uDolly;
    float el = mix(0.16, 0.42, sin(p * PI)) + uMouse.y * 0.02;
    float az = 0.4 + p * 1.15 + t * 0.006 + uMouse.x * 0.04;
    float expo = mix(1.0, 1.45, p);
    // Keep the hole below the hero copy early on, centered later.
    uv.y += mix(0.13, 0.03, smoothstep(0.0, 0.6, p));

    vec3 ro = dist * vec3(cos(el) * sin(az), sin(el), -cos(el) * cos(az));
    vec3 fwd = normalize(-ro);
    vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, fwd);
    vec3 rd = normalize(fwd * 1.32 + uv.x * right + uv.y * up);
    vec3 fwdH = normalize(vec3(fwd.x, 0.0, fwd.z));

    const float R_IN = 2.35;
    const float R_OUT = 6.8;

    // Trace the ray backwards through curved spacetime. h² = |r × v|² is the
    // conserved squared angular momentum of the photon; the bending term
    // -1.5 h² r/r⁵ is the standard weak-field null-geodesic approximation
    // with the event horizon at r = 1 (photon sphere then sits at r = 1.5).
    vec3 pos = ro;
    vec3 vel = rd;
    vec3 ch = cross(pos, vel);
    float h2 = dot(ch, ch);

    vec3 col = vec3(0.0);
    float trans = 1.0;
    float minR = 1e4;
    float jetAcc = 0.0;
    float captured = 0.0;
    float escaped = 0.0;
    vec3 outDir = rd;

    for (int i = 0; i < 80; i++) {
      if (float(i) >= uSteps) break;
      float r2 = dot(pos, pos);
      float r = sqrt(r2);
      minR = min(minR, r);
      if (r2 < 1.0) { captured = 1.0; break; }
      if (r > 13.0 && dot(pos, vel) > 0.0) { escaped = 1.0; outDir = normalize(vel); break; }

      float step2 = max(0.045, 0.085 * (r - 0.7));
      vel += (-1.5 * h2 * pos / (r2 * r2 * r)) * step2;
      vec3 np = pos + vel * step2;

      // Faint plasma cones hugging the spin axis near the hole — detail, not
      // a beam, so they never wash out foreground copy.
      float dax = length(pos.xz);
      jetAcc += exp(-dax * dax * 7.0) * exp(-abs(pos.y) * 0.7) * smoothstep(1.0, 1.7, r) * step2;

      // Equatorial plane crossing → shade the disk (front-to-back compositing,
      // so multiple lensed images of the disk stack correctly).
      if (pos.y * np.y < 0.0 && trans > 0.02) {
        float f = pos.y / (pos.y - np.y);
        vec3 hit = mix(pos, np, f);
        float hr = length(hit.xz);
        if (hr > R_IN * 0.98 && hr < R_OUT) {
          vec4 d = diskShade(hit, -normalize(vel), t, R_IN, R_OUT);
          col += trans * d.rgb;
          trans *= (1.0 - d.a);
        }
      }
      pos = np;
    }

    if (captured < 0.5) {
      vec3 dir = escaped > 0.5 ? outDir : normalize(vel);
      col += trans * background(dir, fwdH, t, p);
      // Photon-ring glow: rays that skimmed the photon sphere pick up a hot rim.
      col += vec3(1.0, 0.88, 0.70) * exp(-abs(minR - 1.5) * 2.6) * 0.5;
    }

    col += vec3(0.55, 0.75, 1.0) * jetAcc * 0.16;

    col *= expo;
    col = aces(col);
    col = pow(col, vec3(0.92));
    col += (hash21(frag) - 0.5) / 255.0;

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
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
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
    const uSteps = ctx.getUniformLocation(prog, 'uSteps');
    const uDolly = ctx.getUniformLocation(prog, 'uDolly');

    container.appendChild(canvas);

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduced) {
      canvas.style.opacity = '0';
      canvas.style.transition = 'opacity 1.6s cubic-bezier(0.16, 1, 0.3, 1)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        canvas.style.opacity = '1';
      }));
    }

    // Debug/tuning hooks: ?bgp=0.5 pins journey progress, ?bgt=20 pins time.
    const params = new URLSearchParams(window.location.search);
    const bgpParam = params.get('bgp');
    const forced = bgpParam === null ? NaN : parseFloat(bgpParam);
    const bgtParam = params.get('bgt');
    const forcedT = bgtParam === null ? NaN : parseFloat(bgtParam);

    let raf = 0;
    let progress = 0;
    let smooth = 0; // camera-damped copy of progress
    const mouse = { x: 0, y: 0 };
    const start = performance.now();
    let last = start;
    let lost = false;

    // Mobile GPUs can't afford the desktop march budget: coarse-pointer
    // devices start at a lower internal resolution and step count, and a
    // frame-time EMA drops (or restores) the render scale at runtime.
    const coarse =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches;
    const dprCap = coarse ? 1.25 : 1.5;
    const maxScale = 1.0;
    let scale = coarse ? 0.7 : 1.0;
    ctx.uniform1f(uSteps, coarse ? 52 : 80);
    let ema = 16;
    let frames = 0;
    const pinned = !Number.isNaN(forced) || !Number.isNaN(forcedT);

    const computeProgress = () => {
      if (!Number.isNaN(forced)) {
        progress = Math.min(1, Math.max(0, forced));
        smooth = progress; // pin exactly for screenshots
        return;
      }
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress = Math.min(1, Math.max(0, window.scrollY / max));
    };

    const render = () => {
      if (lost) return;
      const t = !Number.isNaN(forcedT) ? forcedT : reduced ? 0 : (performance.now() - start) * 0.001;
      ctx.uniform2f(uRes, canvas.width, canvas.height);
      ctx.uniform1f(uTime, t);
      ctx.uniform1f(uProgress, smooth);
      ctx.uniform2f(uMouse, mouse.x, mouse.y);
      ctx.drawArrays(ctx.TRIANGLES, 0, 3);
    };

    let lastW = 0;
    let heightTimer = 0;

    const applySize = () => {
      // The geodesic march is expensive per pixel, so the backing store is
      // capped well below full DPR; the visual is soft glow and starfields,
      // which upscale invisibly.
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap) * scale;
      const w = container.clientWidth;
      const h = container.clientHeight;
      lastW = w;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.viewport(0, 0, canvas.width, canvas.height);
      const aspect = w / Math.max(1, h);
      ctx.uniform1f(uDolly, Math.min(1.8, Math.max(1, 1.15 / Math.pow(aspect, 0.6))));
      computeProgress();
      if (reduced) {
        smooth = progress;
        render();
      }
    };

    const resize = () => {
      // iOS Safari fires resize continuously while its URL bar collapses
      // during scroll; rebuilding the backing store every frame stutters
      // badly. Width changes (rotation, real resizes) apply immediately;
      // height-only changes settle through a debounce — the CSS-stretched
      // canvas covers the gap invisibly in the meantime.
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
      smooth += (progress - smooth) * (1 - Math.exp(-5.5 * dt));
      render();
      // Adaptive quality: consistently sub-40fps → shrink the render scale;
      // comfortably fast → creep back up. Skipped when debug params pin the
      // frame, so screenshots stay deterministic.
      ema = ema * 0.9 + ms * 0.1;
      frames++;
      if (!pinned && frames > 90) {
        frames = 0;
        if (ema > 26 && scale > 0.45) {
          scale *= 0.8;
          applySize();
        } else if (ema < 15 && scale < maxScale) {
          scale = Math.min(maxScale, scale * 1.15);
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
