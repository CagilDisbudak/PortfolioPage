import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, animate as animateValue } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════════════
   § 1 — PORTFOLIO DATA
   Everything the game displays comes from this object. Edit text here only —
   the world, NPCs, exhibits and menus all read from it.
   ═══════════════════════════════════════════════════════════════════════════ */

const portfolioData = {
  name: 'Çağıl Dişbudak',
  role: 'Software Engineer · Backend, Full Stack & Game Dev',
  tagline: 'Python backends, React interfaces and the occasional game — 4+ years of shipping.',

  about: [
    'Software engineer with 4+ years of Python backends and React interfaces for EV charging, EV route planning and web search.',
    'I build REST APIs, JWT auth, role-based access control and event-driven OCPP integrations with Django REST Framework, FastAPI and Flask, then ship them as containers on Docker and Kubernetes.',
    'Games are the other half: C# and Unity at TaleWorlds, an Android runner, a real-time multiplayer board game, and this town.',
  ],

  contact: {
    email: 'cdisbudak24@gmail.com',
    cvFile: 'Cagil-Disbudak-Resume.pdf',
    socials: [
      { label: 'GitHub', href: 'https://github.com/CagilDisbudak' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/cagildisbudak/' },
    ],
  },

  skills: {
    // The HUD "party" — six companions with levels (shown as HP bars).
    party: [
      { name: 'PYTHON', abbr: 'PY', lv: 92, type: 'BACKEND', color: '#3b82f6' },
      { name: 'JAVA', abbr: 'JV', lv: 85, type: 'BACKEND', color: '#f97316' },
      { name: 'DOCKER', abbr: 'DK', lv: 80, type: 'DEVOPS', color: '#38bdf8' },
      { name: 'K8S', abbr: 'K8', lv: 74, type: 'DEVOPS', color: '#818cf8' },
      { name: 'POSTGRES', abbr: 'PG', lv: 82, type: 'DATA', color: '#22c55e' },
      { name: 'REACT', abbr: 'RX', lv: 63, type: 'FRONTEND', color: '#2dd4bf' },
    ],
    groups: {
      backend: { level: 'Expert', items: ['Python (Django · DRF · FastAPI · Flask)', 'REST APIs, JWT & RBAC', 'OCPP & event-driven webhooks', 'Elasticsearch & Redis'] },
      devops: { level: 'Solid', items: ['Docker & Kubernetes', 'CI/CD pipelines', 'Microservices', 'Monitoring & incident support'] },
      frontend: { level: 'Functional', items: ['React & TypeScript', 'Admin dashboards', 'Map & route views', 'HTML5 & CSS'] },
      gamedev: { level: 'Hands-on', items: ['C# & Unity', 'Real-time multiplayer', 'Android builds', 'Canvas pixel art'] },
    },
    competencies: [
      'REST API design with Django REST Framework, FastAPI & Flask',
      'JWT authentication & role-based access control',
      'Event-driven OCPP & webhook integrations',
      'Microservices on Docker & Kubernetes',
      'Search & caching with Elasticsearch and Redis',
      'React & TypeScript dashboards and map views',
    ],
    badges: ['Python', 'Django', 'DRF', 'FastAPI', 'Flask', 'React', 'TypeScript', 'Docker', 'Kubernetes', 'Elasticsearch', 'Redis', 'CI/CD', 'C#', 'Unity'],
  },

  // Work history, newest first. Drives the CAREER HALL plaques, the RECRUITER
  // NPC, the BACKPACK > PROFILE tab and the classic CV view (?classic=1).
  // `color` paints the company's plaque in the CAREER HALL.
  experience: [
    {
      role: 'Software Engineer',
      company: 'Electrinn',
      period: 'Nov 2025 — Present',
      summary: 'Django REST Framework APIs and React dashboards for EV charge-point management.',
      highlights: [
        'Develop DRF endpoints for charge-point management: station CRUD and detail views, ownership, claiming with ownership validation, station status and user sessions.',
        'Implement multi-user access control with 4 operations (grant, revoke, drop, user removal) and a 5-step access-request lifecycle.',
        'Secure every station and account operation with JWT (Bearer) authentication and role-based permission checks.',
        'Handle OCPP events from chargers through event-driven webhook endpoints.',
        'Build React and TypeScript admin dashboards, user-facing screens and map and route views on top of these APIs.',
        'Containerize microservices with Docker, run them on Kubernetes and take part in deployment and configuration work.',
      ],
      color: '#22c55e',
    },
    {
      role: 'Software Engineer',
      company: 'Üstünova Mühendislik ve ARGE',
      period: 'Nov 2024 — Nov 2025',
      summary: 'Server side of Chargepick, a live EV route-planning application.',
      highlights: [
        'Developed the server side of Chargepick, a live EV route-planning application.',
        'Created route-optimization algorithms that plan charging-stop frequency and duration from battery state of charge.',
        'Exposed real-time route and charging data through RESTful APIs built with FastAPI and Django.',
        'Integrated external map and location APIs for accurate navigation and station suggestions.',
        'Partnered with frontend and research teams on EV charging optimization.',
      ],
      color: '#f59e0b',
    },
    {
      role: 'Software Engineer',
      company: 'Huawei · Petal Search',
      period: 'Jul 2022 — Nov 2024',
      summary: 'Python and Flask APIs for the Petal Search box, with Elasticsearch and Redis.',
      highlights: [
        "Built RESTful APIs with Python and Flask for the Petal Search box, part of Huawei's search engine.",
        'Wrote Elasticsearch indexing and query logic for the product.',
        'Added a Redis caching layer to speed up response times.',
        'Authored unit and integration tests to keep releases reliable.',
        'Provided production support through monitoring, debugging and incident resolution.',
        'Shipped joint projects with frontend, QA and data teams through CI/CD pipelines.',
      ],
      color: '#ef4444',
    },
    {
      role: 'Game Developer Intern',
      company: 'TaleWorlds Entertainment',
      period: 'Aug 2021 — Sep 2021',
      summary: 'Developed games with C# and Unity in a 4-person team.',
      highlights: ['Developed games with C# and Unity in a 4-person team.'],
      color: '#a78bfa',
    },
    {
      role: 'Software Engineer Intern',
      company: 'Labris Networks',
      period: 'Jul 2020 — Aug 2020',
      summary: 'Web development with Python and Django.',
      highlights: ['Worked on web development with Python and Django.'],
      color: '#38bdf8',
    },
  ],

  education: [{ degree: 'B.Sc. Computer Engineering', school: 'Çankaya University', period: '2017 — 2022' }],
  languages: ['Turkish — Native', 'English — C1 (Advanced)', 'German — A1 (Beginner)'],

  projects: [
    {
      title: 'DragMate',
      subtitle: 'Multiplayer Chess & Backgammon Platform',
      tech: ['React', 'TypeScript', 'TailwindCSS', 'dnd-kit'],
      github: 'https://github.com/CagilDisbudak/DragMate',
      live: 'https://cagildisbudak.github.io/DragMate/',
      blurb: 'A modern, liquid-glass aesthetic platform featuring real-time multiplayer Chess and Backgammon with smooth drag-and-drop interactions.',
      achievements: [
        'Implemented real-time multiplayer logic and adaptive AI opponents for both Chess and Backgammon.',
        'Designed a premium "liquid glass" UI with dynamic animations and responsive layouts.',
        'Built a robust drag-and-drop system using @dnd-kit/core for seamless gameplay.',
      ],
      screenColor: '#38bdf8',
    },
    {
      title: 'Portfolio Town',
      subtitle: 'Pixel-Art RPG Portfolio (you are standing in it)',
      tech: ['React', 'TypeScript', 'Canvas 2D', 'Web Audio'],
      github: 'https://github.com/CagilDisbudak/PortfolioPage',
      live: 'https://cagildisbudak.github.io/PortfolioPage/',
      blurb: 'A playable top-down RPG town as a portfolio: walk into buildings, talk to NPCs, battle and catch software bugs, and read the CV along the way.',
      achievements: [
        'Every sprite, tile and creature is drawn on canvas from hand-authored string matrices, with no image files.',
        'Tile-based movement, wandering NPCs, line-of-sight trainers, turn-based battles and a catch mechanic.',
        'Original chiptune loops scheduled with the Web Audio API.',
        'A plain classic CV view (?classic=1) for visitors in a hurry.',
      ],
      screenColor: '#2dd4bf',
    },
    {
      title: 'Platform Runner',
      subtitle: 'Mobile Platform-Runner Game',
      tech: ['Unity', 'C#', 'Android'],
      github: 'https://github.com/CagilDisbudak/Platform-Runner',
      live: '',
      blurb: 'A mobile platform-runner built in Unity with C#, featuring a player character and NPCs, shipped as an Android APK.',
      achievements: [
        'Built the player character and NPC behaviour in Unity with C#.',
        'Packaged and shipped the game as an Android APK.',
      ],
      screenColor: '#fb923c',
    },
    {
      title: 'BookSwap',
      subtitle: 'Book Swap & Donation Platform',
      tech: ['Django', 'React', 'Docker'],
      github: 'https://github.com/CagilDisbudak/BookSwap',
      live: '',
      blurb: 'A full-stack platform for swapping or donating books securely, with user registration, book requests and approvals, donation options and in-app chat.',
      achievements: [
        'Built the Django backend for user registration, book listings, swap requests and approvals.',
        'Added donation options alongside swaps.',
        'Implemented in-app chat between swapping users, with a React frontend.',
      ],
      screenColor: '#fbbf24',
    },
    {
      title: 'MoviePage',
      subtitle: 'Movie Discovery Interface',
      tech: ['TypeScript', 'React', 'TMDB API'],
      github: 'https://github.com/CagilDisbudak/MoviePage',
      live: '',
      blurb: 'A clean, responsive interface for browsing movie metadata using the TMDB API.',
      achievements: [
        'Built a type-safe data layer using TypeScript to handle complex API responses reliably.',
        'Implemented client-side filtering and sorting to reduce unnecessary network requests.',
      ],
      screenColor: '#f472b6',
    },
    {
      title: 'Decentralized Voting',
      subtitle: 'Blockchain-based Voting System',
      tech: ['JavaScript', 'Solidity', 'Web3.js'],
      github: 'https://github.com/CagilDisbudak/A-Decentralized-Voting-App-using-Blockchain',
      live: '',
      blurb: 'Proof-of-concept dApp demonstrating secure, immutable voting mechanisms on the blockchain.',
      achievements: [
        'Developed smart contracts to ensure vote immutability and prevent double-voting.',
        'Integrated Web3 wallet connection flows for secure user authentication.',
      ],
      screenColor: '#a78bfa',
    },
    {
      title: 'BIST 30 Prediction',
      subtitle: 'Stock Index Forecasting',
      tech: ['Python', 'TensorFlow', 'Jupyter'],
      github: 'https://github.com/CagilDisbudak/BIST30-Prediction',
      live: '',
      blurb: 'Forecasting BIST 30 stock index data with machine-learning models.',
      achievements: ['Trained and compared machine-learning models on historical BIST 30 index data.'],
      screenColor: '#f87171',
    },
    {
      title: 'Plant Pathology 2020',
      subtitle: 'AI-Based Leaf Disease Classification',
      tech: ['Python', 'TensorFlow', 'Keras', 'OpenCV'],
      github: 'https://github.com/CagilDisbudak/Plant-Pathology-2020',
      live: '',
      blurb: 'Deep learning solution for automating the diagnosis of foliar diseases in apple leaves.',
      achievements: [
        'Developed CNN models to classify apple leaf diseases with high accuracy.',
        'Iterated through 6 architectural variations to optimize performance and reduce overfitting.',
        'Implemented advanced preprocessing pipelines including augmentation and normalization.',
      ],
      screenColor: '#4ade80',
    },
  ],

  funFacts: [
    'This shelf is full of books on distributed systems... and one dusty chess opening manual.',
    'A note inside one book reads: "Ship boring tech. Save the excitement for the UX."',
    'There is a well-worn copy of "Designing Data-Intensive Applications" here.',
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   § 2 — CORE TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */

type Dir = 'up' | 'down' | 'left' | 'right';
type Vec = { x: number; y: number };

const TILE = 16; // native pixels per tile
// Everything is painted at HD "fine" pixels per art pixel: tiles carry detail
// finer than their 16px grid (thin seams, grain, blades) and sprites are
// Scale3x-upscaled, so the world looks sharper at the same on-screen size.
const HD = 3;
const F = 1 / HD; // one fine pixel, in art pixels
const WALK_MS = 190; // ms per tile, walking (GBA-like cadence)
const RUN_MS = 110; // ms per tile, holding Shift / B
const NPC_MS = 260; // NPCs stroll slower
const TURN_MS = 110; // tap = turn in place; hold past this = step

const DELTA: Record<Dir, Vec> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };

// Deterministic pseudo-random (no Math.random — keeps screenshots/replays stable).
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash2 = (x: number, y: number) => {
  let h = (x * 374761393 + y * 668265263) ^ 0x5bf03635;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const randInt = (rng: () => number, a: number, b: number) => a + Math.floor(rng() * (b - a + 1));

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════════════════════════════════════════════════════════════════════
   § 3 — SPRITE FACTORY (original pixel art, drawn from string matrices)
   Chars: . transparent · O outline · A cap/accent · H hair · S skin · E eye
          C shirt · D shirt shade · P pants · B shoes
   ═══════════════════════════════════════════════════════════════════════════ */

const SPRITE_W = 16;
const SPRITE_H = 20;

// Hand-authored character parts, composed by stack() into 16x20 frames.
// Legend: O outline · A cap · a cap-highlight · H hair · S skin · s skin-shadow
//         E eye · C shirt · c shirt-highlight · D shirt-shade · P pants
//         p pants-highlight · B shoes. Lowercase tones are DERIVED from the
//         base palette color at render time (see getSpriteFrame), so richer
//         shading costs no extra per-character palette data.
const HEAD_DOWN = [
  '.....OOOOOO.....',
  '...OOaaaaaaOO...',
  '..OaaaaaaaaaaO..',
  '.OAAAAAAAAAAAAO.',
  '.OHHHHHHHHHHHHO.',
  '.OSSSSSSSSSSSSO.',
  '.OSSEESSSSEESSO.',
  '.OSSssSSSSssSSO.',
  '..OSSSSSSSSSSO..',
  '...OOSSSSSSOO...',
];
const HEAD_UP = [
  '.....OOOOOO.....',
  '...OOaaaaaaOO...',
  '..OaaaaaaaaaaO..',
  '.OAAAAAAAAAAAAO.',
  '.OHHHHHHHHHHHHO.',
  '.OHHHHHHHHHHHHO.',
  '.OHHHHHHHHHHHHO.',
  '.OHHHHHHHHHHHHO.',
  '..OHHHHHHHHHHO..',
  '...OOHHHHHHOO...',
];
const HEAD_SIDE = [
  '.....OOOOOO.....',
  '...OOaaaaaaOO...',
  '..OaaaaaaaaaaO..',
  '.OAAAAAAAAAAAAO.',
  '.OHHHHHHHHHHHHO.',
  '.OSSSSSSHHHHHHO.',
  '.OSSEESSHHHHHHO.',
  '.OSSssSSHHHHHHO.',
  '..OSSSSSHHHHHO..',
  '...OOSSSHHHOO...',
];

const TORSO_FRONT = [
  '...OCCCCCCCCO...',
  '..OCcCCCCCCcCO..',
  '.OSCCCCCCCCCCSO.',
  '.OSSCCCDDCCCSSO.',
  '..OOCCCCCCCCOO..',
];
const TORSO_BACK = [
  '...OCCCCCCCCO...',
  '..OCcCCCCCCcCO..',
  '.OSCCCCCCCCCCSO.',
  '.OSSCCCCCCCCSSO.',
  '..OOCCCCCCCCOO..',
];
const TORSO_SIDE = [
  '...OCCCCCCCCO...',
  '...OCcCCCCcCO...',
  '...OSSCCCCSSO...',
  '...OSSCDDCSSO...',
  '...OOCCCCCCOO...',
];

const LEGS_STAND = ['...OPPPPPPPPO...', '...OPPPOOPPPO...', '...OPPPOOPPPO...', '...OBBBOOBBBO...', '....OOOOOOOO....'];
const LEGS_WALK = ['...OPPPPPPPPO...', '...OBBPOOPPPO...', '...OBBBOOPPPO...', '....OOOOOBBBO...', '.........OOO....'];
const LEGS_SIDE_STAND = ['...OPPPPPPPPO...', '....OPPPPPPO....', '....OBBBBBBO....', '....OOOOOOOO....', '................'];
const LEGS_SIDE_WALK = ['...OPPPPPPPPO...', '...OPPO..OPPO...', '...OBBO..OBBO...', '...OOO...OOO....', '................'];

function mirrorRows(rows: string[]): string[] {
  return rows.map((r) => r.split('').reverse().join(''));
}
const stack = (...parts: string[][]) => parts.flat();

// frames[facing] = [stand, walkA, walkB]
const FRAME_MATRICES: Record<Dir, string[][]> = {
  down: [
    stack(HEAD_DOWN, TORSO_FRONT, LEGS_STAND),
    stack(HEAD_DOWN, TORSO_FRONT, LEGS_WALK),
    stack(HEAD_DOWN, TORSO_FRONT, mirrorRows(LEGS_WALK)),
  ],
  up: [
    stack(HEAD_UP, TORSO_BACK, LEGS_STAND),
    stack(HEAD_UP, TORSO_BACK, LEGS_WALK),
    stack(HEAD_UP, TORSO_BACK, mirrorRows(LEGS_WALK)),
  ],
  left: [
    stack(HEAD_SIDE, TORSO_SIDE, LEGS_SIDE_STAND),
    stack(HEAD_SIDE, TORSO_SIDE, LEGS_SIDE_WALK),
    stack(HEAD_SIDE, TORSO_SIDE, LEGS_SIDE_STAND),
  ],
  right: [
    mirrorRows(stack(HEAD_SIDE, TORSO_SIDE, LEGS_SIDE_STAND)),
    mirrorRows(stack(HEAD_SIDE, TORSO_SIDE, LEGS_SIDE_WALK)),
    mirrorRows(stack(HEAD_SIDE, TORSO_SIDE, LEGS_SIDE_STAND)),
  ],
};

type Palette = { A: string; H: string; S: string; C: string; D: string; P: string; B: string };
const OUTLINE = '#241d33';
const EYE = '#241d33';

// Blend a hex color toward white (amt>0) or black (amt<0). Used to derive
// highlight/shadow tones from a character's base palette at render time.
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const target = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const mix = (c: number) => Math.round(c + (target - c) * p);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const PALETTES: Record<string, Palette> = {
  player: { A: '#f59e0b', H: '#3b2c20', S: '#f3c396', C: '#14b8a6', D: '#0f9488', P: '#334155', B: '#7c3f21' },
  guide: { A: '#4ade80', H: '#57402b', S: '#f3c396', C: '#16a34a', D: '#15803d', P: '#57534e', B: '#3f2d1e' },
  recruiter: { A: '#1e293b', H: '#1e293b', S: '#eab88f', C: '#475569', D: '#334155', P: '#1e293b', B: '#111827' },
  curator: { A: '#c084fc', H: '#7e22ce', S: '#f3c396', C: '#9333ea', D: '#7e22ce', P: '#3b0764', B: '#2e1065' },
  kid: { A: '#ef4444', H: '#78350f', S: '#fcd9ae', C: '#f97316', D: '#ea580c', P: '#1d4ed8', B: '#7f1d1d' },
  fan: { A: '#fde047', H: '#a16207', S: '#f3c396', C: '#eab308', D: '#ca8a04', P: '#44403c', B: '#292524' },
  sensei: { A: '#60a5fa', H: '#111827', S: '#e7b287', C: '#2563eb', D: '#1d4ed8', P: '#f8fafc', B: '#1e293b' },
  sergeant: { A: '#a3a380', H: '#3f3f2e', S: '#d9a06b', C: '#7c7a52', D: '#5f5d3f', P: '#44412e', B: '#26241a' },
  rookie: { A: '#f9a8d4', H: '#9d174d', S: '#fcd9ae', C: '#ec4899', D: '#db2777', P: '#4c1d95', B: '#2e1065' },
  leader: { A: '#0f172a', H: '#0f172a', S: '#e7b287', C: '#f59e0b', D: '#d97706', P: '#0f172a', B: '#0b1120' },
  nurse: { A: '#f8fafc', H: '#ec4899', S: '#fcd9ae', C: '#f9a8d4', D: '#ec4899', P: '#f1f5f9', B: '#db2777' },
  hiker: { A: '#ea580c', H: '#3f2d1e', S: '#e7b287', C: '#a16207', D: '#854d0e', P: '#3f6212', B: '#422006' },
  catcher: { A: '#eab308', H: '#422006', S: '#f3c396', C: '#4d7c0f', D: '#3f6212', P: '#a16207', B: '#422006' },
  mentor: { A: '#9ca3af', H: '#d1d5db', S: '#e7b287', C: '#1e3a8a', D: '#172f6e', P: '#374151', B: '#1f2937' },
};

const spriteCache = new Map<string, HTMLCanvasElement>();
function getSpriteFrame(paletteId: string, facing: Dir, frame: number): HTMLCanvasElement {
  const key = `${paletteId}|${facing}|${frame}`;
  const cached = spriteCache.get(key);
  if (cached) return cached;
  const pal = PALETTES[paletteId] ?? PALETTES.player;
  const rows = FRAME_MATRICES[facing][frame];
  const c = document.createElement('canvas');
  c.width = SPRITE_W;
  c.height = SPRITE_H;
  const ctx = c.getContext('2d')!;
  const colors: Record<string, string> = {
    O: OUTLINE,
    E: EYE,
    ...pal,
    a: shade(pal.A, 0.28), // cap highlight
    s: shade(pal.S, -0.18), // skin shadow (under-eye / cheek)
    c: shade(pal.C, 0.16), // shirt highlight
    p: shade(pal.P, 0.24), // pants highlight (unused in current matrices, kept for future frames)
  };
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.') continue;
      const col = colors[ch];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  // returned at HD resolution: SPRITE_W*HD x SPRITE_H*HD
  const hd = upscale3(c);
  paintTopLightShade(hd.getContext('2d')!, hd.width, hd.height);
  spriteCache.set(key, hd);
  return hd;
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 4 — TILE & DECOR PAINTERS (procedural pixel art on canvas)
   ═══════════════════════════════════════════════════════════════════════════ */

type Ctx = CanvasRenderingContext2D;
const px = (ctx: Ctx, x: number, y: number, w: number, h: number, c: string) => {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
};

// Directional light overlay for character sprites: a soft highlight upper-left,
// a soft shadow lower-right, composited with 'source-atop' so it only tints
// pixels the sprite already drew (transparent background stays untouched).
// This gives every flat-color creature/character a bit of pixel-art depth
// without hand-authoring shaded variants of every palette + matrix.
function paintTopLightShade(ctx: Ctx, w: number, h: number) {
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, 'rgba(255,255,255,0.22)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// AdvanceMAME Scale3x: triples a pixel-art canvas, turning diagonal stair-steps
// into smoother edges without inventing new colours. Sprites are drawn at art
// resolution, upscaled with this, then shaded at the higher resolution.
function upscale3(src: HTMLCanvasElement): HTMLCanvasElement {
  const w = src.width, h = src.height;
  const s = new Uint32Array(src.getContext('2d')!.getImageData(0, 0, w, h).data.buffer);
  const out = document.createElement('canvas');
  out.width = w * 3;
  out.height = h * 3;
  const octx = out.getContext('2d')!;
  const img = octx.createImageData(w * 3, h * 3);
  const d = new Uint32Array(img.data.buffer);
  const at = (x: number, y: number) => s[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
  const W3 = w * 3;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const A = at(x - 1, y - 1), B = at(x, y - 1), C = at(x + 1, y - 1);
      const D = at(x - 1, y), E = s[y * w + x], R = at(x + 1, y);
      const G = at(x - 1, y + 1), H = at(x, y + 1), I = at(x + 1, y + 1);
      let e0 = E, e1 = E, e2 = E, e3 = E, e5 = E, e6 = E, e7 = E, e8 = E;
      if (B !== H && D !== R) {
        e0 = D === B ? D : E;
        e1 = (D === B && E !== C) || (B === R && E !== A) ? B : E;
        e2 = B === R ? R : E;
        e3 = (D === B && E !== G) || (D === H && E !== A) ? D : E;
        e5 = (B === R && E !== I) || (H === R && E !== C) ? R : E;
        e6 = D === H ? D : E;
        e7 = (D === H && E !== I) || (H === R && E !== G) ? H : E;
        e8 = H === R ? R : E;
      }
      const o = y * 3 * W3 + x * 3;
      d[o] = e0; d[o + 1] = e1; d[o + 2] = e2;
      d[o + W3] = e3; d[o + W3 + 1] = E; d[o + W3 + 2] = e5;
      d[o + 2 * W3] = e6; d[o + 2 * W3 + 1] = e7; d[o + 2 * W3 + 2] = e8;
    }
  }
  octx.putImageData(img, 0, 0);
  return out;
}

// Paints in fine pixels (HD per art pixel) with the origin at art (x, y), so
// tile painters can add detail thinner than one art pixel.
type Put = (fx: number, fy: number, w: number, h: number, c: string) => void;
function fine(ctx: Ctx, x: number, y: number, draw: (put: Put) => void) {
  draw((fx, fy, w, h, c) => px(ctx, x + fx * F, y + fy * F, w * F, h * F, c));
}
const FT = TILE * HD; // a tile, in fine pixels

// Generic matrix renderer for hand-authored pixel art: rows of palette chars,
// '.' = transparent. Used by the tree, battle creatures and wild bugs — richer
// shading than stacking fillRect blocks, and each piece stays hand-editable.
function drawMatrix(ctx: Ctx, rows: string[], palette: Record<string, string>, ox: number, oy: number, mirror = false) {
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = mirror ? row[row.length - 1 - x] : row[x];
      if (ch === '.') continue;
      const col = palette[ch];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(ox + x, oy + y, 1, 1);
    }
  }
}

function paintGrass(ctx: Ctx, tx: number, ty: number) {
  const x = tx * TILE, y = ty * TILE;
  // Classic GBA route-grass checkerboard: two flat greens alternating per tile.
  px(ctx, x, y, TILE, TILE, (tx + ty) % 2 === 0 ? '#79c860' : '#71bd58');
  const r = hash2(tx, ty);
  fine(ctx, x, y, (put) => {
    // short tufts: two dark strokes with a sunlit tip, deterministic per tile
    for (let i = 0; i < 6; i++) {
      const bx = 2 + Math.floor(hash2(tx * 7 + i, ty * 13 + i) * 42);
      const by = 3 + Math.floor(hash2(tx * 17 + i, ty * 5 - i) * 40);
      put(bx, by, 1, 3, '#5fa847');
      put(bx + 2, by + 1, 1, 2, '#5fa847');
      put(bx, by - 1, 1, 1, '#94d97a');
    }
    if (r > 0.97) {
      // wildflower: four petals round a yellow eye, on a short stem
      const col = r > 0.985 ? '#fef3c7' : '#fda4af';
      const cx = 18, cy = 16;
      put(cx + 1, cy + 6, 1, 6, '#4f9a3a');
      put(cx + 2, cy + 9, 3, 1, '#4f9a3a');
      put(cx, cy - 3, 3, 3, col);
      put(cx, cy + 3, 3, 3, col);
      put(cx - 3, cy, 3, 3, col);
      put(cx + 3, cy, 3, 3, col);
      put(cx, cy, 3, 3, '#fbbf24');
      put(cx, cy, 1, 1, '#fde68a');
    } else if (r > 0.93) {
      // small rock cluster
      fineStone(put, 14, 22, 12, 8);
      fineStone(put, 25, 27, 7, 5);
    } else if (r > 0.88) {
      // bare dirt patch with ragged edges and a few dark specks
      put(13, 16, 22, 16, '#b5905c');
      put(11, 19, 2, 10, '#b5905c');
      put(35, 18, 2, 11, '#b5905c');
      put(16, 14, 15, 2, '#b5905c');
      put(15, 32, 17, 2, '#b5905c');
      put(14, 16, 8, 1, '#c6a372');
      put(17, 20, 3, 2, '#9c7a4c');
      put(28, 25, 3, 2, '#9c7a4c');
      put(22, 29, 2, 1, '#9c7a4c');
    }
  });
}

// A pebble in fine pixels: rounded body, lit top edge, dark underside, shadow.
function fineStone(put: Put, x: number, y: number, w: number, h: number) {
  put(x + 1, y, w - 2, h, '#8a8a7a');
  put(x, y + 1, w, h - 2, '#8a8a7a');
  put(x + 1, y, w - 3, 2, '#a6a696');
  put(x + 2, y + h - 1, w - 3, 1, '#6f6f61');
  put(x + 1, y + h, w - 1, 1, 'rgba(30,61,40,0.25)');
}

function paintPath(ctx: Ctx, tx: number, ty: number, rows: string[]) {
  const x = tx * TILE, y = ty * TILE;
  px(ctx, x, y, TILE, TILE, '#e5cf9a');
  const isP = (xx: number, yy: number) => rows[yy]?.[xx] === 'P';
  fine(ctx, x, y, (put) => {
    // packed-earth grain: scattered dark and pale specks
    for (let i = 0; i < 14; i++) {
      const gx = 1 + Math.floor(hash2(tx * 11 + i, ty * 3 + i) * 45);
      const gy = 1 + Math.floor(hash2(tx * 5 - i, ty * 19 + i) * 45);
      put(gx, gy, i % 3 === 0 ? 2 : 1, 1, i % 2 ? '#d3b87e' : '#f0dfb3');
    }
    // Neighbor-aware edge trim: where the path meets grass, a darker rim plus
    // a bright inner line (a slightly sunken dirt road), with grass tufts
    // leaning over the top edge.
    const tuft = (fx: number, fy: number) => {
      put(fx, fy, 1, 3, '#5fa847');
      put(fx + 2, fy + 1, 1, 2, '#6ab54f');
    };
    if (!isP(tx, ty - 1)) {
      put(0, 0, FT, 5, '#c4a76e');
      put(0, 5, FT, 1, '#b39760');
      put(0, 6, FT, 2, '#f2e2b6');
      for (let i = 0; i < 3; i++) tuft(4 + Math.floor(hash2(tx * 13 + i, ty * 7) * 40), 2);
    }
    if (!isP(tx, ty + 1)) {
      put(0, FT - 6, FT, 6, '#c4a76e');
      put(0, FT - 7, FT, 1, '#d8c188');
    }
    if (!isP(tx - 1, ty)) {
      put(0, 0, 5, FT, '#c4a76e');
      put(5, 0, 1, FT, '#b39760');
      put(6, 0, 2, FT, '#f2e2b6');
    }
    if (!isP(tx + 1, ty)) {
      put(FT - 6, 0, 6, FT, '#c4a76e');
      put(FT - 7, 0, 1, FT, '#d8c188');
    }
    const r2 = hash2(tx * 31, ty * 13);
    if (r2 > 0.94) {
      // small pebble cluster
      put(18, 21, 5, 4, '#c2a877');
      put(18, 21, 4, 1, '#d9c296');
      put(27, 27, 5, 3, '#c2a877');
      put(27, 27, 3, 1, '#d9c296');
    } else if (r2 > 0.9) {
      // hairline crack
      put(12, 15, 1, 7, '#c9b077');
      put(13, 22, 10, 1, '#c9b077');
      put(23, 17, 1, 6, '#c9b077');
      put(24, 16, 3, 1, '#c9b077');
    }
  });
}

// Hand-authored 16x24 tree: rounded 4-tone canopy, shaded trunk. The extra
// 8px extend ABOVE the tile; because the map paints rows top-to-bottom, each
// tree overlaps the tile behind it, so tree rows read as a dense forest.
const TREE_ROWS = [
  '......OOOO......',
  '....OOLLLLOO....',
  '...OLLHHHHLLO...',
  '..OLLHHHHHHLLO..',
  '.OLLHHHHHHHHLLO.',
  '.OLHHHHHHHHHHLO.',
  'OLLHHHHHHHHHHLLO',
  'OLLHHHHHHHHHHLLO',
  'OMLLHHHHHHHHLLMO',
  'OMLLLHHHHHHLLLMO',
  'OMMLLLLLLLLLLMMO',
  'OMMMLLLLLLLLMMMO',
  'ODMMMMLLLLMMMMDO',
  'ODDMMMMMMMMMMDDO',
  '.ODDMMMMMMMMDDO.',
  '.ODDDDMMMMDDDDO.',
  '..ODDDDDDDDDDO..',
  '...OODDDDDDOO...',
  '.....OTTuTO.....',
  '.....OTTuTO.....',
  '.....OTTuTO.....',
  '....OTTTuTTO....',
  '....OttttttO....',
  '................',
];
const TREE_PALETTE: Record<string, string> = {
  O: '#1e3d28',
  D: '#2e6e3e',
  M: '#3f9150',
  L: '#55b167',
  H: '#79cf7f',
  T: '#7a4a2b',
  t: '#5d3720',
  u: '#96613a',
};

// The tree matrix is drawn once per orientation and stamped with drawImage:
// outdoor maps paint thousands of trees (including the forest ring).
const treeSpriteCache: HTMLCanvasElement[] = [];
function getTreeSprite(mirror: boolean): HTMLCanvasElement {
  const i = mirror ? 1 : 0;
  if (!treeSpriteCache[i]) {
    const c = document.createElement('canvas');
    c.width = TILE;
    c.height = TREE_ROWS.length;
    drawMatrix(c.getContext('2d')!, TREE_ROWS, TREE_PALETTE, 0, 0, mirror);
    treeSpriteCache[i] = upscale3(c);
  }
  return treeSpriteCache[i];
}

function paintTree(ctx: Ctx, tx: number, ty: number) {
  const x = tx * TILE, y = ty * TILE;
  paintGrass(ctx, tx, ty);
  // soft contact shadow so the trunk sits IN the grass rather than on it
  px(ctx, x + 3, y + 13, 10, 2, 'rgba(30,61,40,0.25)');
  ctx.drawImage(getTreeSprite(hash2(tx * 3, ty * 5) > 0.5), x, y - 8, TILE, TREE_ROWS.length);
}

function paintWater(ctx: Ctx, tx: number, ty: number, frame: number, rows: string[]) {
  const x = tx * TILE, y = ty * TILE;
  // Checkerboard water base (swaps with the animation frame, GBA-style ripple).
  const checker = (tx + ty + frame) % 2 === 0;
  px(ctx, x, y, TILE, TILE, checker ? '#3f97d9' : '#3d8fcc');
  const isW = (xx: number, yy: number) => rows[yy]?.[xx] === 'W';
  const off = frame % 2 === 0 ? 0 : 6;
  const foamShift = frame % 2 === 0 ? 0 : 9;
  fine(ctx, x, y, (put) => {
    // ripples: a bright crest over a darker trough, drifting with the frame
    for (let i = 0; i < 4; i++) {
      const rx = 4 + Math.floor(hash2(tx * 3 + i, ty * 7 + i) * 32);
      const ry = 5 + ((Math.floor(hash2(tx * 9 + i, ty * 2 + i) * 36) + off) % 36);
      put(rx, ry, 8, 1, '#7cc0ec');
      put(rx + 2, ry - 1, 4, 1, '#a9daf6');
      put(rx + 1, ry + 1, 6, 1, '#3681bd');
    }
    // Neighbor-aware shoreline: sandy lip + animated foam dashes where the
    // pond touches land, dark depth line along the bottom and inner sides.
    if (!isW(tx, ty - 1)) {
      put(0, 0, FT, 5, '#e5cf9a');
      put(0, 5, FT, 1, '#c9b07a');
      put(0, 6, FT, 2, '#bfe6f4');
      for (let fx = foamShift; fx < FT; fx += 18) put(fx, 9, 8, 1, '#e8f6fb');
    } else {
      put(0, 0, FT, 1, '#5fb0e6');
    }
    if (!isW(tx, ty + 1)) {
      put(0, FT - 6, FT, 6, '#2b6ea6');
      put(0, FT - 8, FT, 2, '#357fbd');
    }
    if (!isW(tx - 1, ty)) {
      put(0, 0, 5, FT, '#357fbd');
      put(6, foamShift + 12, 1, 6, '#bfe6f4');
    }
    if (!isW(tx + 1, ty)) {
      put(FT - 5, 0, 5, FT, '#357fbd');
      put(FT - 7, FT - foamShift - 18, 1, 6, '#bfe6f4');
    }
    if (hash2(tx * 53, ty * 29) > 0.92) {
      // lily pad with a notch and a lit rim, gently bobbing with the frame
      const ly = 18 + (frame % 2 === 0 ? 0 : 2);
      put(14, ly + 1, 20, 13, '#3f8f4f');
      put(16, ly, 16, 15, '#3f8f4f');
      put(17, ly + 2, 14, 10, '#4aa85c');
      put(24, ly, 2, 7, checker ? '#3f97d9' : '#3d8fcc'); // notch
      put(17, ly + 1, 6, 1, '#6cc47c');
      put(19, ly + 14, 11, 1, '#2f7a3d');
    }
  });
}

function paintTallGrass(ctx: Ctx, tx: number, ty: number) {
  const x = tx * TILE, y = ty * TILE;
  px(ctx, x, y, TILE, TILE, '#57a844');
  fine(ctx, x, y, (put) => {
    put(0, FT - 6, FT, 6, '#478f38'); // shade at the roots
    // two rows of tapering blades (back row darker), each with a lit edge and tip
    for (let row = 0; row < 2; row++) {
      for (let b = 0; b < 8; b++) {
        const bx = 1 + b * 6 + row * 3 + Math.floor(hash2(tx * 9 + b, ty * 3 + row) * 2);
        const top = (row ? 10 : 3) + Math.floor(hash2(tx * 5 + b, ty * 11 + row) * 6);
        const body = row ? '#3c8a31' : '#2f7a27';
        put(bx, top + 3, 3, FT - top - 6, body);
        put(bx + 1, top, 1, 3, body);
        put(bx + 2, top + 4, 1, FT - top - 12, row ? '#4c9c3c' : '#3c8a31');
        put(bx + 1, top, 1, 1, row ? '#7bc561' : '#5aa548');
      }
    }
    if (hash2(tx * 71, ty * 41) > 0.9) {
      // a small flower peeking through the blades
      put(21, 8, 3, 3, '#fef3c7');
      put(22, 9, 1, 1, '#fbbf24');
    }
  });
}

function paintFloor(ctx: Ctx, tx: number, ty: number, kind: string) {
  const x = tx * TILE, y = ty * TILE;
  fine(ctx, x, y, (put) => {
    if (kind === 'gallery') {
      // pale stone slabs: grout on two edges, a lit edge opposite, a faint vein
      put(0, 0, FT, FT, '#ded7c8');
      put(0, FT - 1, FT, 1, '#c3baa8');
      put(FT - 1, 0, 1, FT, '#c3baa8');
      put(0, 0, FT - 1, 1, '#ebe6da');
      put(0, 0, 1, FT - 1, '#ebe6da');
      const v = hash2(tx * 7, ty * 3);
      const vy = 8 + Math.floor(v * 24);
      for (let i = 0; i < 6; i++) put(5 + i * 6, vy + ((i * 3) % 7), 5, 1, '#d2cab8');
      return;
    }
    if (kind === 'office') {
      // carpet tiles: a fine two-tone weave, seams where the tiles meet
      put(0, 0, FT, FT, '#b9c3d1');
      for (let fy = 0; fy < FT; fy += 2) {
        for (let fx = (fy / 2) % 2 === 0 ? 0 : 2; fx < FT; fx += 4) put(fx, fy, 2, 2, '#b1bbca');
      }
      put(0, FT - 1, FT, 1, '#a1acbd');
      put(FT - 1, 0, 1, FT, '#a1acbd');
      return;
    }
    // wooden boards (house, gym): four per tile, a lit top edge and a dark seam
    // per board, staggered butt joints, grain streaks and the odd knot
    const gym = kind === 'gym';
    const base = gym ? '#cbb9a2' : '#dcb079';
    const seam = gym ? '#ad9a82' : '#b8895a';
    const lit = gym ? '#d8c8b3' : '#e8c08a';
    const grain = gym ? '#c0ad94' : '#cf9f68';
    put(0, 0, FT, FT, base);
    for (let p = 0; p < 4; p++) {
      const py = p * 12;
      put(0, py, FT, 1, lit);
      put(0, py + 11, FT, 1, seam);
      const joint = 4 + Math.floor(hash2(tx * 5 + p, ty * 11) * 40);
      put(joint, py, 1, 11, seam);
      put(joint + 1, py + 1, 1, 10, lit);
      for (let g = 0; g < 2; g++) {
        const gx = Math.floor(hash2(tx * 13 + p, ty * 7 + g) * 36);
        put(gx, py + 3 + g * 4, 6 + Math.floor(hash2(tx + g, ty * 3 + p) * 8), 1, grain);
      }
      if (hash2(tx * 29 + p, ty * 17) > 0.93) {
        put(20, py + 4, 3, 3, seam);
        put(21, py + 5, 1, 1, grain);
      }
    }
  });
}

// isFace: the wall's front (floor below it). lip: a wall top directly above a
// front, which gets a lit edge. edgeL / edgeR: the side meets floor there.
function paintWall(ctx: Ctx, tx: number, ty: number, kind: string, isFace: boolean, lip: boolean, edgeL: boolean, edgeR: boolean) {
  const x = tx * TILE, y = ty * TILE;
  const tone =
    kind === 'gym' ? ['#5b6478', '#6d7890', '#49505f']
    : kind === 'gallery' ? ['#7a6a58', '#8d7c68', '#5f5344']
    : kind === 'office' ? ['#3f4c63', '#55637e', '#2f3a4d']
    : ['#8a6f4d', '#9c805c', '#6d5639'];
  fine(ctx, x, y, (put) => {
    if (isFace) {
      // wallpaper with thin pale stripes, a chair rail, a darker dado and a baseboard
      put(0, 0, FT, FT, tone[1]);
      for (let sx = 2; sx < FT; sx += 8) put(sx, 7, 2, 19, shade(tone[1], 0.08));
      put(0, 0, FT, 6, tone[0]);
      put(0, 6, FT, 1, shade(tone[0], -0.25)); // cornice shadow
      put(0, 26, FT, 1, shade(tone[1], 0.25)); // chair rail: lit top, body, shadow
      put(0, 27, FT, 2, shade(tone[1], -0.1));
      put(0, 29, FT, 1, shade(tone[1], -0.3));
      put(0, 30, FT, 6, shade(tone[1], -0.07));
      for (let sx = 7; sx < FT; sx += 16) put(sx, 31, 1, 4, shade(tone[1], -0.2)); // dado panel joints
      put(0, 36, FT, 12, tone[2]); // baseboard
      put(0, 36, FT, 1, shade(tone[2], 0.25));
      put(0, FT - 1, FT, 1, shade(tone[2], -0.3));
    } else {
      // wall top seen from above: a flat cap with faint texture, a lit lip
      // over the front wall and a lit inner edge where a side meets the floor
      put(0, 0, FT, FT, tone[0]);
      for (let i = 0; i < 3; i++) put(Math.floor(hash2(tx * 3 + i, ty * 5) * 40), 6 + i * 12, 7, 1, shade(tone[0], -0.08));
      if (lip) {
        put(0, FT - 7, FT, 1, shade(tone[0], 0.18));
        put(0, FT - 6, FT, 6, tone[2]);
      }
      if (edgeR) {
        put(FT - 3, 0, 1, FT, shade(tone[0], 0.18));
        put(FT - 2, 0, 2, FT, tone[2]);
      }
      if (edgeL) {
        put(2, 0, 1, FT, shade(tone[0], 0.18));
        put(0, 0, 2, FT, tone[2]);
      }
    }
  });
}

// Rugs are neighbour-aware: adjacent 'R' tiles form one rug with a border,
// gold pinstripe and fringe only on its outer edges, and a diamond per tile.
function paintRug(ctx: Ctx, tx: number, ty: number, kind: string, rows: string[]) {
  const x = tx * TILE, y = ty * TILE;
  paintFloor(ctx, tx, ty, kind);
  const main = kind === 'gym' ? '#4f7cd1' : kind === 'office' ? '#2f5d9e' : '#c2564b';
  const trim = kind === 'gym' ? '#3a5ea6' : kind === 'office' ? '#23497d' : '#9c4038';
  const gold = '#e8c170';
  const isR = (xx: number, yy: number) => rows[yy]?.[xx] === 'R';
  const up = isR(tx, ty - 1), down = isR(tx, ty + 1), left = isR(tx - 1, ty), right = isR(tx + 1, ty);
  fine(ctx, x, y, (put) => {
    const x0 = left ? 0 : 4, x1 = right ? FT : FT - 4;
    const y0 = up ? 0 : 5, y1 = down ? FT : FT - 5;
    put(x0, y0, x1 - x0, y1 - y0, main);
    if (!up) {
      put(x0, y0, x1 - x0, 5, trim);
      put(x0 + (left ? 0 : 6), y0 + 6, x1 - x0 - (left ? 0 : 6) - (right ? 0 : 6), 1, gold);
      for (let fx = x0 + 1; fx < x1 - 1; fx += 3) put(fx, y0 - 3, 1, 3, '#efe3c6');
    }
    if (!down) {
      put(x0, y1 - 5, x1 - x0, 5, trim);
      put(x0 + (left ? 0 : 6), y1 - 7, x1 - x0 - (left ? 0 : 6) - (right ? 0 : 6), 1, gold);
      for (let fx = x0 + 1; fx < x1 - 1; fx += 3) put(fx, y1, 1, 3, '#efe3c6');
    }
    if (!left) {
      put(x0, y0, 5, y1 - y0, trim);
      put(x0 + 6, y0 + (up ? 0 : 6), 1, y1 - y0 - (up ? 0 : 6) - (down ? 0 : 6), gold);
    }
    if (!right) {
      put(x1 - 5, y0, 5, y1 - y0, trim);
      put(x1 - 7, y0 + (up ? 0 : 6), 1, y1 - y0 - (up ? 0 : 6) - (down ? 0 : 6), gold);
    }
    // diamond outline with a dark centre
    const c = 24;
    for (let i = 0; i <= 5; i++) {
      put(c - i, c - 5 + i, 1, 1, gold);
      put(c + i, c - 5 + i, 1, 1, gold);
      put(c - i, c + 5 - i, 1, 1, gold);
      put(c + i, c + 5 - i, 1, 1, gold);
    }
    put(c - 1, c - 1, 3, 3, trim);
  });
}

function paintMat(ctx: Ctx, tx: number, ty: number) {
  const x = tx * TILE, y = ty * TILE;
  fine(ctx, x, y, (put) => {
    // woven door mat: dark border, a lighter field with weave rows, a lit inner square
    put(0, 0, FT, FT, '#3e4757');
    put(6, 6, 36, 36, '#59657c');
    for (let wy = 8; wy < 40; wy += 3) put(7, wy, 34, 1, '#4f5a6f');
    put(12, 12, 24, 24, '#6f7d99');
    for (let wx = 13; wx < 36; wx += 3) put(wx, 13, 1, 22, '#66748f');
    put(12, 12, 24, 1, '#8592ad');
  });
}

type MapKind = 'town' | 'house' | 'gym' | 'gallery' | 'office';

function paintTerrainTile(ctx: Ctx, ch: string, tx: number, ty: number, kind: MapKind, frame: number, rows: string[]) {
  if (kind === 'town') {
    switch (ch) {
      case 'T': paintTree(ctx, tx, ty); return;
      case 'P': paintPath(ctx, tx, ty, rows); return;
      case 'W': paintWater(ctx, tx, ty, frame, rows); return;
      case 't': paintTallGrass(ctx, tx, ty); return;
      default: paintGrass(ctx, tx, ty); return;
    }
  }
  switch (ch) {
    case 'W': {
      const open = (ch2: string | undefined) => ch2 !== undefined && ch2 !== 'W';
      const below = rows[ty + 1]?.[tx];
      paintWall(ctx, tx, ty, kind, open(below), below === 'W' && open(rows[ty + 2]?.[tx]), open(rows[ty]?.[tx - 1]), open(rows[ty]?.[tx + 1]));
      return;
    }
    case 'R': paintRug(ctx, tx, ty, kind, rows); return;
    case 'M': paintMat(ctx, tx, ty); return;
    default: paintFloor(ctx, tx, ty, kind); return;
  }
}

/* Buildings (town only) — drawn over terrain. */
type Building = {
  x: number; y: number; w: number; h: number;
  roof: string; roofDark: string; wall: string;
  door: Vec; // tile within the building footprint
  heal?: boolean; // stamps a big white-bordered red cross on the roof
};

function paintBuilding(ctx: Ctx, b: Building) {
  const x = b.x * TILE, y = b.y * TILE, w = b.w * TILE, h = b.h * TILE;
  const wallRows = 2 * TILE;
  const roofH = h - wallRows;
  const W = w * HD; // building width in fine pixels
  // roof: shingle courses, each with a dark lower edge, a lit top line and
  // staggered gaps between shingles
  px(ctx, x, y, w, roofH, b.roof);
  fine(ctx, x, y, (put) => {
    for (let ry = 9, row = 0; ry < roofH * HD - 6; ry += 9, row++) {
      put(0, ry, W, 2, b.roofDark);
      put(0, ry + 2, W, 1, shade(b.roof, 0.18));
      for (let gx = (row % 2) * 9 + 4; gx < W; gx += 18) put(gx, ry - 7, 1, 7, shade(b.roof, -0.14));
    }
  });
  // ridge cap: dark crown with a bright sunlit line beneath it
  px(ctx, x - 1, y, w + 2, 3, b.roofDark);
  px(ctx, x, y + 3, w, 1, '#ffffff50' as string);
  px(ctx, x - 2, y + roofH - 4, w + 4, 4, b.roofDark); // eaves overhang
  fine(ctx, x - 2, y + roofH - 4, (put) => {
    put(0, 0, W + 12, 1, shade(b.roofDark, 0.2));
    put(0, 11, W + 12, 1, shade(b.roofDark, -0.3));
  });
  px(ctx, x, y, 2, roofH, b.roofDark);
  px(ctx, x + w - 2, y, 2, roofH, b.roofDark);
  if (b.heal) {
    // Big unmistakable white-bordered red cross centered on the roof — the
    // universal "heal here" marker.
    const cw = 20, ch = 20;
    const cx = x + (w - cw) / 2;
    const cy = y + Math.max(4, (roofH - ch) / 2);
    px(ctx, cx - 2, cy - 2, cw + 4, ch + 4, '#ffffff'); // white backing
    const armT = 6;
    px(ctx, cx + (cw - armT) / 2, cy, armT, ch, '#e23b3b'); // vertical bar
    px(ctx, cx, cy + (ch - armT) / 2, cw, armT, '#e23b3b'); // horizontal bar
    fine(ctx, cx - 2, cy - 2, (put) => {
      put(0, 0, (cw + 4) * HD, 1, '#e2e8f0');
      put(0, (ch + 4) * HD - 1, (cw + 4) * HD, 1, '#cbd5e1');
      put(((cw - armT) / 2 + 2) * HD, 6, armT * HD, 2, '#f87171'); // little highlight
      put(((cw - armT) / 2 + 2) * HD + armT * HD - 2, 6, 2, ch * HD, '#b91c1c');
    });
  } else {
    // brick chimney with a lazy puff of smoke drifting above the ridge
    const chimX = x + w - 10;
    px(ctx, chimX, y - 6, 6, 10, b.roofDark);
    px(ctx, chimX + 1, y - 6, 4, 8, b.roof);
    fine(ctx, chimX + 1, y - 6, (put) => {
      for (let by = 3; by < 24; by += 4) put(0, by, 12, 1, shade(b.roof, -0.2));
      for (let by = 0; by < 24; by += 8) put(6, by, 1, 4, shade(b.roof, -0.2));
      put(0, 0, 12, 1, shade(b.roof, 0.25));
    });
    fine(ctx, chimX, y - 13, (put) => {
      put(3, 9, 6, 6, 'rgba(226,232,240,0.6)');
      put(4, 8, 4, 1, 'rgba(226,232,240,0.6)');
      put(7, 0, 8, 8, 'rgba(241,245,249,0.5)');
      put(8, -1, 6, 1, 'rgba(241,245,249,0.5)');
    });
  }
  // walls: clapboard siding with a shadow line every few fine pixels
  const wy = y + roofH;
  px(ctx, x, wy, w, wallRows, b.wall);
  fine(ctx, x, wy, (put) => {
    for (let sy = 6; sy < wallRows * HD - 9; sy += 7) put(0, sy, W, 1, shade(b.wall, -0.07));
    put(0, 0, W, 2, 'rgba(0,0,0,0.18)'); // shade under the eaves
  });
  px(ctx, x, wy + wallRows - 3, w, 3, '#00000035');
  px(ctx, x, wy, 2, wallRows, '#00000025');
  px(ctx, x + w - 2, wy, 2, wallRows, '#00000025');
  // windows on the upper wall row, skipping the door column
  for (let cx = b.x + 1; cx < b.x + b.w - 1; cx += 2) {
    if (Math.abs(cx - b.door.x) <= 0) continue;
    const wxp = cx * TILE + 4;
    px(ctx, wxp - 1, wy + 4, 10, 10, '#241d33');
    px(ctx, wxp, wy + 5, 8, 8, '#9fd8f0');
    fine(ctx, wxp, wy + 5, (put) => {
      put(0, 0, 24, 9, '#c9ecf9'); // brighter sky in the upper panes
      put(3, 13, 2, 2, '#e8f7fd'); // glare: two short diagonal strokes
      put(5, 11, 2, 2, '#e8f7fd');
      put(7, 9, 2, 2, '#e8f7fd');
      put(15, 15, 2, 2, '#e8f7fd');
      put(17, 13, 2, 2, '#e8f7fd');
      put(9, 0, 6, 24, '#241d33'); // mullion
      put(0, 11, 24, 2, '#241d33'); // transom
      put(0, 22, 24, 2, '#7dc4e4');
    });
    // flower box under the sill
    px(ctx, wxp - 2, wy + 14, 12, 3, '#8a5a2b');
    fine(ctx, wxp - 2, wy + 12, (put) => {
      put(0, 6, 36, 1, '#a06c36');
      put(0, 14, 36, 1, '#5b3a1e');
      const blooms = ['#f87171', '#fbbf24', '#f87171', '#f9a8d4', '#fbbf24'];
      for (let i = 0; i < 5; i++) {
        const fx = 3 + i * 7;
        put(fx + 1, 3, 1, 3, '#3c8a31');
        put(fx, 0, 3, 3, blooms[i]);
        put(fx + 1, 1, 1, 1, '#fde68a');
      }
    });
  }
  // door: frame, two inset panels, a brass knob and a stone step
  const dx = b.door.x * TILE, dy = b.door.y * TILE;
  px(ctx, dx, dy - 4, TILE, 4, '#241d33');
  px(ctx, dx + 1, dy, 14, TILE, '#241d33');
  px(ctx, dx + 3, dy + 2, 10, 14, '#6b4423');
  fine(ctx, dx + 3, dy + 2, (put) => {
    put(0, 0, 30, 4, '#845733');
    put(4, 7, 22, 14, '#5b3a1e');
    put(5, 8, 20, 12, '#74492a');
    put(4, 25, 22, 14, '#5b3a1e');
    put(5, 26, 20, 12, '#74492a');
    put(5, 8, 20, 1, '#8a5a2b');
    put(5, 26, 20, 1, '#8a5a2b');
    put(24, 18, 4, 4, '#e5cf9a');
    put(24, 18, 2, 2, '#fff3c4');
  });
  // welcome mat on the ground just outside the door
  px(ctx, dx + 2, dy + TILE, TILE - 4, 3, '#8a5a2b');
  fine(ctx, dx + 2, dy + TILE, (put) => {
    put(3, 3, 30, 1, '#a06c36');
    for (let fx = 2; fx < 36; fx += 4) put(fx, 8, 2, 1, '#6b4423');
  });
}

/* Decor painters — furniture, signs, exhibits. Painted onto the map canvas. */
type DecorType =
  | 'sign' | 'mailbox' | 'bed' | 'desk' | 'bookshelf' | 'tv' | 'sofa'
  | 'plant' | 'exhibit' | 'bench' | 'weights' | 'platform' | 'healmachine' | 'counter'
  | 'plaque' | 'diploma' | 'fence' | 'flowers';

type Decor = {
  type: DecorType;
  x: number; y: number;
  solid?: boolean;
  color?: string;
  dialogueId?: string; // key into the dialogue registry
  label?: string; // interact hint, e.g. 'VIEW: DRAGMATE' (falls back to DECOR_HINTS)
};

// Default interact-hint verbs per decor type; exhibits and plaques set their own label.
const DECOR_HINTS: Partial<Record<DecorType, string>> = {
  sign: 'READ: SIGN',
  mailbox: 'CHECK: MAILBOX',
  desk: 'USE: PC',
  bookshelf: 'BROWSE: BOOKSHELF',
  tv: 'WATCH: TV',
  diploma: 'READ: DIPLOMA',
};

// All decor is drawn in fine pixels from its tile's top-left; negative fy
// reaches up into the tile above (tall furniture, wall-mounted frames).
function paintDecor(ctx: Ctx, d: Decor, kind: MapKind) {
  const x = d.x * TILE, y = d.y * TILE;
  fine(ctx, x, y, (put) => {
    switch (d.type) {
      case 'sign':
        // post with a lit edge, a framed board, a grained face, two nails, two "words"
        put(19, 44, 10, 2, 'rgba(30,61,40,0.3)');
        put(21, 24, 6, 21, '#6b4423');
        put(21, 24, 2, 21, '#8a5a2b');
        put(6, 6, 36, 21, '#6b4423');
        put(7, 7, 34, 19, '#8a5a2b');
        put(9, 9, 30, 15, '#c89858');
        put(9, 9, 30, 1, '#dcb070');
        put(9, 16, 30, 1, '#bd8c4e');
        put(12, 12, 24, 2, '#7a4c22');
        put(12, 18, 17, 2, '#7a4c22');
        put(8, 8, 2, 2, '#4a2e17');
        put(38, 8, 2, 2, '#4a2e17');
        break;
      case 'mailbox':
        put(19, 44, 10, 2, 'rgba(30,61,40,0.3)');
        put(21, 24, 6, 21, '#57534e');
        put(21, 24, 2, 21, '#78716c');
        put(10, 6, 28, 2, '#991b1b'); // rounded top
        put(9, 8, 30, 18, '#991b1b');
        put(10, 8, 28, 16, '#dc2626');
        put(11, 7, 26, 1, '#f87171');
        put(10, 8, 28, 3, '#f87171');
        put(12, 17, 14, 1, '#7f1d1d'); // letter slot
        put(36, 9, 2, 12, '#57534e'); // flag
        put(38, 9, 6, 5, '#fbbf24');
        put(38, 9, 6, 1, '#fde68a');
        break;
      case 'bed':
        // wooden frame and headboard, pillow with a crease, folded-back blanket
        put(3, 0, 42, 93, '#6b4423');
        put(4, 1, 40, 91, '#8a5a2b');
        put(4, 1, 40, 7, '#a06c36');
        put(4, 8, 40, 1, '#5b3a1e');
        put(7, 10, 34, 80, '#e2e8f0');
        put(9, 12, 30, 14, '#f8fafc');
        put(10, 12, 28, 1, '#ffffff');
        put(9, 25, 30, 1, '#cbd5e1');
        put(23, 15, 1, 8, '#e2e8f0');
        put(7, 33, 34, 57, '#38bdf8');
        put(7, 33, 34, 5, '#7dd3fc');
        put(7, 38, 34, 1, '#0ea5e9');
        put(7, 52, 34, 2, '#0ea5e9');
        put(7, 70, 34, 2, '#0ea5e9');
        put(39, 39, 2, 51, '#0284c7');
        put(4, 90, 40, 3, '#5b3a1e');
        break;
      case 'desk': {
        // desk with drawers, a monitor showing syntax-coloured code, keyboard, mug
        put(3, 18, 90, 27, '#5b3a1e');
        put(4, 18, 88, 25, '#8a5a2b');
        put(4, 18, 88, 5, '#a06c36');
        put(4, 23, 88, 1, '#5b3a1e');
        for (const dx2 of [8, 66]) {
          put(dx2, 28, 22, 13, '#6b4423');
          put(dx2 + 1, 29, 20, 11, '#8a5a2b');
          put(dx2 + 1, 29, 20, 1, '#a06c36');
          put(dx2 + 8, 34, 5, 1, '#d4a017');
        }
        put(9, -12, 36, 27, '#241d33');
        put(10, -11, 34, 1, '#3b3352');
        put(12, -9, 30, 20, '#0f172a');
        const code: Array<[number, number, number, string]> = [
          [14, -7, 7, '#f472b6'], [23, -7, 10, '#e2e8f0'],
          [17, -4, 5, '#38bdf8'], [24, -4, 13, '#a3e635'],
          [17, -1, 12, '#e2e8f0'],
          [14, 2, 6, '#fbbf24'], [22, 2, 9, '#38bdf8'],
          [17, 5, 10, '#e2e8f0'], [14, 8, 4, '#f472b6'],
        ];
        for (const [cx, cy, cw, cc] of code) put(cx, cy, cw, 1, cc);
        put(20, 8, 2, 1, '#e2e8f0'); // cursor
        put(24, 15, 6, 3, '#241d33'); // stand
        put(19, 17, 16, 2, '#334155');
        put(50, 12, 26, 6, '#334155'); // keyboard
        put(50, 12, 26, 1, '#475569');
        for (let k = 0; k < 6; k++) {
          put(52 + k * 4, 14, 3, 1, '#94a3b8');
          put(53 + k * 4, 16, 3, 1, '#94a3b8');
        }
        put(80, 8, 7, 10, '#f8fafc'); // mug
        put(87, 10, 2, 5, '#f8fafc');
        put(81, 9, 5, 1, '#78350f');
        put(80, 17, 7, 1, '#cbd5e1');
        break;
      }
      case 'bookshelf': {
        // case, three shelves of books in varied widths and heights, each with
        // a lit spine edge and a dark band
        put(3, -18, 42, 64, '#5b3a1e');
        put(4, -17, 40, 62, '#6b4423');
        put(4, -17, 40, 2, '#8a5a2b');
        const books = ['#dc2626', '#2563eb', '#16a34a', '#f59e0b', '#7c3aed', '#0891b2', '#e2e8f0'];
        for (let s = 0; s < 3; s++) {
          const sy = -15 + s * 21;
          put(6, sy, 36, 15, '#241d33');
          let bx = 7;
          for (let i = 0; bx < 40; i++) {
            const bw = 3 + Math.floor(hash2(d.x * 7 + i, s * 13 + d.y) * 3);
            const bh = 10 + Math.floor(hash2(d.x * 3 + s, i * 5) * 5);
            const col = books[(i * 3 + s + d.x) % books.length];
            const w2 = Math.min(bw, 41 - bx);
            put(bx, sy + 15 - bh, w2, bh, col);
            put(bx, sy + 15 - bh, 1, bh, shade(col, 0.3));
            put(bx, sy + 15 - bh + 3, w2, 1, shade(col, -0.3));
            bx += bw + 1;
          }
          put(4, sy + 15, 40, 2, '#8a5a2b');
          put(4, sy + 17, 40, 1, '#4a2e17');
        }
        break;
      }
      case 'tv':
        // CRT with rounded casing, scanlines, a glare and a red power light
        put(4, 9, 40, 30, '#241d33');
        put(3, 10, 42, 28, '#241d33');
        put(4, 10, 40, 1, '#3b3352');
        put(7, 12, 34, 22, '#94a3b8');
        for (let sy = 13; sy < 34; sy += 2) put(7, sy, 34, 1, '#8796ab');
        put(9, 14, 10, 2, '#e2e8f0');
        put(9, 16, 4, 2, '#e2e8f0');
        put(37, 35, 3, 2, '#ef4444');
        put(15, 39, 18, 4, '#0f172a');
        put(12, 43, 24, 2, '#0f172a');
        break;
      case 'sofa':
        // backrest, two seat cushions, rounded arms, little wooden legs
        put(3, 12, 42, 31, '#7f1d1d');
        put(4, 13, 40, 28, '#b91c1c');
        put(4, 13, 40, 8, '#dc2626');
        put(4, 21, 40, 1, '#991b1b');
        put(23, 22, 1, 15, '#991b1b');
        put(10, 23, 8, 1, '#ef4444');
        put(28, 23, 8, 1, '#ef4444');
        put(3, 7, 10, 36, '#991b1b');
        put(4, 6, 8, 1, '#991b1b');
        put(4, 7, 8, 2, '#b91c1c');
        put(35, 7, 10, 36, '#991b1b');
        put(36, 6, 8, 1, '#991b1b');
        put(36, 7, 8, 2, '#b91c1c');
        put(5, 43, 3, 3, '#3f2d1e');
        put(40, 43, 3, 3, '#3f2d1e');
        break;
      case 'plant': {
        // tapered clay pot with a lit rim, leaves with pale midribs
        put(15, 30, 18, 15, '#b45309');
        put(29, 31, 3, 13, '#92400e');
        put(17, 35, 14, 2, '#c2620f');
        put(16, 44, 16, 1, '#7c2d12');
        put(13, 27, 22, 4, '#92400e');
        put(13, 27, 22, 1, '#d97706');
        const leaf = (lx: number, ly: number, lw: number, lh: number, c: string, vein: string) => {
          put(lx + 1, ly, lw - 2, lh, c);
          put(lx, ly + 1, lw, lh - 2, c);
          put(lx + Math.floor(lw / 2), ly + 2, 1, lh - 4, vein);
        };
        leaf(5, 12, 11, 12, '#15803d', '#22c55e');
        leaf(32, 12, 11, 12, '#15803d', '#22c55e');
        leaf(11, 2, 12, 17, '#16a34a', '#4ade80');
        leaf(25, 2, 12, 17, '#16a34a', '#4ade80');
        leaf(18, -4, 12, 19, '#22c55e', '#86efac');
        put(14, 23, 20, 4, '#15803d');
        break;
      }
      case 'exhibit': {
        // pedestal + framed project screen with a title bar, text lines, a thumbnail
        const col = d.color ?? '#38bdf8';
        put(6, 30, 36, 18, '#8d7c68');
        put(6, 30, 36, 4, '#a5947e');
        put(38, 34, 4, 14, '#7a6a58');
        put(6, 46, 36, 2, '#6f604f');
        put(3, -18, 42, 48, '#241d33');
        put(4, -17, 40, 1, '#3b3352');
        put(6, -15, 36, 36, col);
        put(6, -15, 36, 1, shade(col, 0.35));
        put(9, -12, 30, 4, shade(col, 0.45));
        put(9, -5, 21, 1, '#ffffffaa' as string);
        put(9, -1, 25, 1, '#ffffff88' as string);
        put(9, 3, 17, 1, '#ffffff88' as string);
        put(9, 7, 23, 1, '#ffffff66' as string);
        put(30, 11, 9, 7, shade(col, -0.25));
        put(9, 14, 12, 3, '#ffffffaa' as string);
        break;
      }
      case 'bench':
        put(4, 41, 40, 2, 'rgba(0,0,0,0.12)');
        put(5, 25, 5, 16, '#6b4423');
        put(38, 25, 5, 16, '#6b4423');
        put(3, 14, 42, 4, '#8a5a2b');
        put(3, 14, 42, 1, '#a06c36');
        put(3, 19, 42, 4, '#8a5a2b');
        put(3, 19, 42, 1, '#a06c36');
        put(3, 23, 42, 2, '#5b3a1e');
        break;
      case 'weights':
        put(3, 22, 42, 6, '#475569');
        put(3, 22, 42, 2, '#64748b');
        put(3, 12, 9, 27, '#334155');
        put(4, 13, 2, 25, '#475569');
        put(36, 12, 9, 27, '#334155');
        put(37, 13, 2, 25, '#475569');
        put(12, 20, 3, 10, '#94a3b8');
        put(33, 20, 3, 10, '#94a3b8');
        put(15, 33, 18, 9, '#64748b');
        put(15, 33, 18, 2, '#94a3b8');
        break;
      case 'platform':
        // the gym leader's dais: lit front edge, side bevels, a star inlay
        put(0, 0, FT, FT * 2, '#8d7c68');
        put(0, 0, FT, 9, '#a5947e');
        put(0, 9, FT, 1, '#b8a891');
        put(0, 0, 1, FT * 2, '#6f604f');
        put(FT - 1, 0, 1, FT * 2, '#6f604f');
        put(0, FT * 2 - 10, FT, 1, '#76695a');
        put(0, FT * 2 - 9, FT, 9, '#5f5344');
        put(20, 40, 8, 8, '#f59e0b');
        put(22, 37, 4, 14, '#f59e0b');
        put(17, 42, 14, 4, '#f59e0b');
        put(23, 40, 2, 2, '#fde68a');
        break;
      case 'counter':
        // reception counter segment with panel joints
        put(0, 18, FT, 30, '#b45309');
        put(0, 18, FT, 6, '#d97706');
        put(0, 24, FT, 1, '#92400e');
        for (let cx = 0; cx < FT; cx += 12) put(cx, 27, 1, 13, '#92400e');
        put(0, 42, FT, 6, '#7c4a12');
        break;
      case 'healmachine':
        // med-bay pod: dark casing, glass dome with glare, two restore orbs, red cross
        put(3, 9, 42, 36, '#1e293b');
        put(4, 10, 40, 34, '#334155');
        put(4, 10, 40, 4, '#475569');
        put(6, 15, 36, 21, '#93c5fd');
        put(6, 15, 36, 1, '#bfdbfe');
        put(8, 17, 2, 12, '#dbeafe');
        put(12, 18, 9, 9, '#f8fafc');
        put(13, 19, 3, 3, '#ffffff');
        put(27, 18, 9, 9, '#f8fafc');
        put(28, 19, 3, 3, '#ffffff');
        put(18, 36, 12, 6, '#ef4444');
        put(21, 33, 6, 12, '#ef4444');
        put(21, 33, 6, 1, '#f87171');
        put(6, 39, 6, 6, '#22d3ee');
        put(36, 39, 6, 6, '#22d3ee');
        break;
      case 'plaque': {
        // framed career plaque on a wall face: company-colour header band,
        // text lines, a small logo square and a brass nameplate
        const col = d.color ?? '#3b5b92';
        put(3, -12, 42, 42, '#4a3018');
        put(4, -11, 40, 1, '#6b4a2a');
        put(6, -9, 36, 36, '#f3ead4');
        put(6, -9, 36, 9, col);
        put(6, -9, 36, 1, shade(col, 0.3));
        put(6, 0, 36, 1, shade(col, -0.3));
        put(10, 4, 22, 1, '#8d7c68');
        put(10, 8, 26, 1, '#b8a98f');
        put(10, 11, 20, 1, '#b8a98f');
        put(10, 14, 24, 1, '#b8a98f');
        put(10, 18, 14, 1, '#b8a98f');
        put(31, 17, 7, 6, shade(col, -0.1));
        put(18, 30, 12, 5, '#b8860b');
        put(18, 30, 12, 1, '#f4d03f');
        break;
      }
      case 'diploma':
        put(9, -3, 30, 30, '#3f2d1e');
        put(10, -2, 28, 1, '#5b4430');
        put(12, 0, 24, 24, '#fdf6e3');
        put(17, 4, 14, 1, '#7a6a58');
        put(15, 8, 18, 1, '#b8a98f');
        put(15, 11, 16, 1, '#b8a98f');
        put(15, 14, 18, 1, '#b8a98f');
        put(14, 19, 8, 1, '#7a6a58');
        put(27, 17, 6, 6, '#dc2626'); // wax seal and ribbon tails
        put(28, 18, 2, 2, '#f87171');
        put(28, 23, 2, 4, '#b91c1c');
        put(31, 23, 2, 3, '#b91c1c');
        break;
      case 'fence':
        // white picket fence segment: two rails behind three pointed pickets
        put(0, 18, FT, 5, '#b08a5a');
        put(0, 18, FT, 1, '#c9a576');
        put(0, 33, FT, 5, '#b08a5a');
        put(0, 33, FT, 1, '#c9a576');
        for (const fx of [3, 18, 33]) {
          put(fx, 9, 12, 36, '#8a6f4d');
          put(fx + 2, 6, 8, 3, '#8a6f4d');
          put(fx + 4, 4, 4, 2, '#8a6f4d');
          put(fx + 1, 9, 10, 35, '#efe3c6');
          put(fx + 3, 7, 6, 2, '#efe3c6');
          put(fx + 5, 5, 2, 2, '#efe3c6');
          put(fx + 9, 9, 2, 35, '#d6c8a8');
        }
        put(0, 45, FT, 3, 'rgba(30,61,40,0.25)');
        break;
      case 'flowers': {
        // raised bed: dark soil with a lit rim, six blooms on stems with a leaf each
        put(3, 9, 42, 36, '#4a2e17');
        put(4, 10, 40, 34, '#6b4423');
        put(4, 10, 40, 2, '#8a5a2b');
        for (let i = 0; i < 5; i++) put(6 + i * 8, 38 - (i % 2) * 4, 2, 1, '#5b3a1e');
        const blooms = ['#f87171', '#fbbf24', '#f9a8d4', '#fef3c7'];
        for (let i = 0; i < 6; i++) {
          const row = Math.floor(i / 3);
          const fx = 9 + (i % 3) * 12 + row * 6;
          const fy = 16 + row * 14;
          put(fx + 1, fy + 3, 1, 8, '#3c8a31');
          put(fx + 2, fy + 7, 3, 2, '#4f9a3a');
          const col = blooms[(i + d.x) % blooms.length];
          put(fx, fy - 3, 3, 3, col);
          put(fx, fy + 3, 3, 2, col);
          put(fx - 3, fy, 3, 3, col);
          put(fx + 3, fy, 3, 3, col);
          put(fx, fy, 3, 3, '#fbbf24');
          put(fx, fy, 1, 1, '#fde68a');
        }
        break;
      }
    }
  });
  void kind;
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 5 — WORLD MAPS
   ═══════════════════════════════════════════════════════════════════════════ */

type Warp = { x: number; y: number; toMap: string; toX: number; toY: number; facing: Dir };
type NPCDef = {
  id: string; name: string; palette: string;
  x: number; y: number; facing: Dir;
  wander?: { r: number };
  important?: boolean;
  dialogueId: string;
  trainer?: string; // key into TRAINERS: talking (or being spotted) starts a trainer battle
};
type GameMap = {
  id: string; name: string; kind: MapKind;
  rows: string[];
  buildings: Building[];
  decor: Decor[];
  npcs: NPCDef[];
  warps: Warp[];
};

// A north corridor at column 14 (between the Gallery and the Heal Center) opens
// through the treeline to the DEBUG MEADOW route; the warp sits at (14,2).
// The east end (columns 34-43) holds the CAREER HALL and a small flower garden.
const TOWN_ROWS = [
  'TTTTTTTTTTTTTTPTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'TTTTTTTTTTTTTTPTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGPGGGGPGGGPGGGGGGGGPGGGGGGGGGPGGGGGGTT',
  'TTGGGGGGGPGGGGPGGGPGGGGGGGGPGGGGGGGGGPGGGGGGTT',
  'TTGGPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPGGTT',
  'TTGGPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPGGTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGWWWWWGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGWWWWWGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGWWWWWGGtttttttGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGWWWWWGGtttttttGGGGGGGGGGGGGTT',
  'TTGGGGGGGPPPPPPGGGGGGGGGtttttttGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGtttttttGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGtttttttGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
];

// Plain interior: two wall rows on top, a door mat ('M') in the bottom wall,
// an optional rug rectangle. Used by rooms whose width follows the data.
function roomRows(w: number, h: number, doorX: number, rug?: { x: number; y: number; w: number; h: number }): string[] {
  const rows: string[] = [];
  for (let y = 0; y < h; y++) {
    if (y < 2) {
      rows.push('W'.repeat(w));
    } else if (y === h - 1) {
      rows.push('W'.repeat(doorX) + 'M' + 'W'.repeat(w - doorX - 1));
    } else {
      let r = 'W';
      for (let x = 1; x < w - 1; x++) {
        const onRug = rug && x >= rug.x && x < rug.x + rug.w && y >= rug.y && y < rug.y + rug.h;
        r += onRug ? 'R' : 'F';
      }
      rows.push(r + 'W');
    }
  }
  return rows;
}

// One exhibit per project / one plaque per job, two tiles apart, so both rooms
// grow with portfolioData instead of overflowing a fixed width.
const GALLERY_W = Math.max(17, 3 + portfolioData.projects.length * 2);
const GALLERY_DOOR = Math.floor(GALLERY_W / 2);
const CAREER_W = Math.max(11, 3 + portfolioData.experience.length * 2);
const CAREER_H = 10;
const CAREER_DOOR = Math.floor(CAREER_W / 2);

const MAPS: Record<string, GameMap> = {
  town: {
    id: 'town',
    name: 'PORTFOLIO TOWN',
    kind: 'town',
    rows: TOWN_ROWS,
    buildings: [
      { x: 5, y: 4, w: 9, h: 6, roof: '#2dd4bf', roofDark: '#14877a', wall: '#efe6d2', door: { x: 9, y: 9 } },
      { x: 15, y: 4, w: 7, h: 6, roof: '#ef4444', roofDark: '#991b1b', wall: '#f1f5f9', door: { x: 18, y: 9 }, heal: true },
      { x: 23, y: 4, w: 9, h: 6, roof: '#818cf8', roofDark: '#4f46b8', wall: '#e8e2f2', door: { x: 27, y: 9 } },
      { x: 6, y: 15, w: 6, h: 5, roof: '#f87171', roofDark: '#b83f3f', wall: '#f3ead4', door: { x: 9, y: 19 } },
      { x: 34, y: 4, w: 8, h: 6, roof: '#3b5b92', roofDark: '#1f3a66', wall: '#e6e9ef', door: { x: 37, y: 9 } },
    ],
    decor: [
      { type: 'sign', x: 11, y: 10, solid: true, dialogueId: 'sign_gallery' },
      { type: 'sign', x: 16, y: 10, solid: true, dialogueId: 'sign_heal' },
      { type: 'sign', x: 29, y: 10, solid: true, dialogueId: 'sign_gym' },
      { type: 'sign', x: 39, y: 10, solid: true, dialogueId: 'sign_career' },
      { type: 'sign', x: 16, y: 21, solid: true, dialogueId: 'sign_welcome' },
      { type: 'sign', x: 13, y: 3, solid: true, dialogueId: 'sign_meadow' },
      { type: 'mailbox', x: 7, y: 20, solid: true, dialogueId: 'mailbox' },
      // east-end garden: two flower beds behind a picket fence
      ...[35, 36, 37, 38, 39, 40, 41].flatMap((x): Decor[] => [
        { type: 'flowers', x, y: 16, solid: true },
        { type: 'flowers', x, y: 17, solid: true },
        { type: 'fence', x, y: 18, solid: true },
      ]),
    ],
    npcs: [
      { id: 'guide', name: 'GUIDE', palette: 'guide', x: 12, y: 19, facing: 'down', wander: { r: 2 }, important: true, dialogueId: 'npc_guide' },
      { id: 'recruiter', name: 'RECRUITER', palette: 'recruiter', x: 20, y: 12, facing: 'left', wander: { r: 4 }, important: true, dialogueId: 'npc_recruiter' },
      { id: 'curator', name: 'CURATOR', palette: 'curator', x: 13, y: 11, facing: 'down', wander: { r: 2 }, dialogueId: 'npc_curator_out' },
      { id: 'fan', name: 'GYM FAN', palette: 'fan', x: 24, y: 11, facing: 'right', wander: { r: 2 }, dialogueId: 'npc_fan' },
      { id: 'kid', name: 'KID', palette: 'kid', x: 26, y: 21, facing: 'down', wander: { r: 3 }, dialogueId: 'npc_kid' },
    ],
    warps: [
      { x: 9, y: 9, toMap: 'gallery', toX: GALLERY_DOOR, toY: 9, facing: 'up' },
      { x: 18, y: 9, toMap: 'heal', toX: 5, toY: 7, facing: 'up' },
      { x: 27, y: 9, toMap: 'gym', toX: 7, toY: 9, facing: 'up' },
      { x: 37, y: 9, toMap: 'career', toX: CAREER_DOOR, toY: CAREER_H - 2, facing: 'up' },
      { x: 9, y: 19, toMap: 'house', toX: 5, toY: 8, facing: 'up' },
      { x: 14, y: 2, toMap: 'meadow', toX: 10, toY: 15, facing: 'up' },
    ],
  },

  house: {
    id: 'house',
    name: 'ABOUT-ME HOUSE',
    kind: 'house',
    rows: [
      'WWWWWWWWWWW',
      'WWWWWWWWWWW',
      'WFFFFFFFFFW',
      'WFFFFFFFFFW',
      'WFFFFFFFFFW',
      'WFFFRRRFFFW',
      'WFFFRRRFFFW',
      'WFFFFFFFFFW',
      'WFFFFFFFFFW',
      'WWWWWMWWWWW',
    ],
    buildings: [],
    decor: [
      { type: 'bed', x: 1, y: 2, solid: true, dialogueId: 'bed' },
      { type: 'bookshelf', x: 3, y: 2, solid: true, dialogueId: 'bookshelf' },
      { type: 'bookshelf', x: 4, y: 2, solid: true, dialogueId: 'bookshelf' },
      { type: 'desk', x: 7, y: 2, solid: true, dialogueId: 'pc' },
      { type: 'desk', x: 8, y: 2, solid: true, dialogueId: 'pc' },
      { type: 'diploma', x: 6, y: 1, dialogueId: 'diploma' }, // hangs on the wall face
      { type: 'tv', x: 2, y: 5, solid: true, dialogueId: 'tv' },
      { type: 'sofa', x: 2, y: 6, solid: true, dialogueId: 'sofa' },
      { type: 'plant', x: 9, y: 8, solid: true, dialogueId: 'plant' },
    ],
    npcs: [],
    warps: [{ x: 5, y: 9, toMap: 'town', toX: 9, toY: 20, facing: 'down' }],
  },

  gym: {
    id: 'gym',
    name: 'SKILLS GYM',
    kind: 'gym',
    rows: [
      'WWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWW',
      'WFFFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFW',
      'WFFRRRFFFRRRFFW',
      'WFFRRRFFFRRRFFW',
      'WFFRRRFFFRRRFFW',
      'WFFFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFW',
      'WWWWWWWMWWWWWWW',
    ],
    buildings: [],
    decor: [
      { type: 'platform', x: 7, y: 2 },
      { type: 'weights', x: 1, y: 2, solid: true, dialogueId: 'weights' },
      { type: 'weights', x: 13, y: 2, solid: true, dialogueId: 'weights' },
    ],
    npcs: [
      { id: 'leader', name: 'GYM LEADER', palette: 'leader', x: 7, y: 2, facing: 'down', important: true, dialogueId: 'npc_leader_done', trainer: 'leader' },
      { id: 'sensei', name: 'BACKEND SENSEI', palette: 'sensei', x: 4, y: 5, facing: 'right', wander: { r: 1 }, important: true, dialogueId: 'npc_sensei' },
      { id: 'sergeant', name: 'DEVOPS SGT.', palette: 'sergeant', x: 10, y: 5, facing: 'left', wander: { r: 1 }, important: true, dialogueId: 'npc_sergeant' },
      { id: 'rookie', name: 'FRONTEND ROOKIE', palette: 'rookie', x: 7, y: 7, facing: 'down', wander: { r: 1 }, dialogueId: 'npc_rookie' },
    ],
    warps: [{ x: 7, y: 10, toMap: 'town', toX: 27, toY: 10, facing: 'down' }],
  },

  gallery: {
    id: 'gallery',
    name: 'PROJECT GALLERY',
    kind: 'gallery',
    rows: roomRows(GALLERY_W, 11, GALLERY_DOOR),
    buildings: [],
    decor: [
      ...portfolioData.projects.map((p, i): Decor => ({
        type: 'exhibit',
        x: 2 + i * 2,
        y: 2,
        solid: true,
        color: p.screenColor,
        dialogueId: `project_${i}`,
        label: `VIEW: ${p.title.toUpperCase()}`,
      })),
      { type: 'bench', x: 4, y: 7, solid: true },
      { type: 'bench', x: GALLERY_W - 5, y: 7, solid: true },
      { type: 'plant', x: 1, y: 9, solid: true },
      { type: 'plant', x: GALLERY_W - 2, y: 9, solid: true },
    ],
    npcs: [
      { id: 'curator_in', name: 'CURATOR', palette: 'curator', x: 11, y: 5, facing: 'down', wander: { r: 2 }, important: true, dialogueId: 'npc_curator_in' },
    ],
    warps: [{ x: GALLERY_DOOR, y: 10, toMap: 'town', toX: 9, toY: 10, facing: 'down' }],
  },

  // ——— CAREER HALL: one wall plaque per job in portfolioData.experience ———
  career: {
    id: 'career',
    name: 'CAREER HALL',
    kind: 'office',
    rows: roomRows(CAREER_W, CAREER_H, CAREER_DOOR, { x: CAREER_DOOR - 1, y: 4, w: 3, h: 4 }),
    buildings: [],
    decor: [
      ...portfolioData.experience.map((e, i): Decor => ({
        type: 'plaque',
        x: 2 + i * 2,
        y: 1, // on the wall face; read it from the floor tile below
        color: e.color,
        dialogueId: `job_${i}`,
        label: `READ: ${e.company.split(' ')[0].toUpperCase()}`,
      })),
      { type: 'plant', x: 1, y: CAREER_H - 2, solid: true, dialogueId: 'plant' },
      { type: 'plant', x: CAREER_W - 2, y: CAREER_H - 2, solid: true, dialogueId: 'plant' },
    ],
    npcs: [
      { id: 'mentor', name: 'MENTOR', palette: 'mentor', x: CAREER_W - 3, y: 5, facing: 'left', wander: { r: 1 }, important: true, dialogueId: 'npc_mentor' },
    ],
    warps: [{ x: CAREER_DOOR, y: CAREER_H - 1, toMap: 'town', toX: 37, toY: 10, facing: 'down' }],
  },

  // ——— HEAL CENTER interior: talk to the NURSE to fully restore the party ———
  heal: {
    id: 'heal',
    name: 'HEAL CENTER',
    kind: 'gallery',
    rows: [
      'WWWWWWWWWWW',
      'WWWWWWWWWWW',
      'WFFFFFFFFFW',
      'WFFFFFFFFFW',
      'WFFFFFFFFFW',
      'WFFFFFFFFFW',
      'WFFFFFFFFFW',
      'WFFFFFFFFFW',
      'WWWWWMWWWWW',
    ],
    buildings: [],
    decor: [
      { type: 'healmachine', x: 5, y: 2, solid: true },
      { type: 'plant', x: 1, y: 7, solid: true, dialogueId: 'plant' },
      { type: 'plant', x: 9, y: 7, solid: true, dialogueId: 'plant' },
    ],
    npcs: [{ id: 'nurse', name: 'NURSE', palette: 'nurse', x: 5, y: 3, facing: 'down', important: true, dialogueId: 'npc_nurse' }],
    warps: [{ x: 5, y: 8, toMap: 'town', toX: 18, toY: 10, facing: 'down' }],
  },

  // ——— DEBUG MEADOW (north route): tall grass with new low-level bugs ———
  meadow: {
    id: 'meadow',
    name: 'DEBUG MEADOW',
    kind: 'town',
    rows: [
      'TTTTTTTTTTPPTTTTTTTTTT',
      'TTGGGGGGGGPPGGGGGGGGTT',
      'TTGtttttGGPPGGtttttGTT',
      'TTGtttttGGPPGGtttttGTT',
      'TTGtttttGGPPGGtttttGTT',
      'TTGGGGGGGGPPGGGGGGGGTT',
      'TTGGGGGGGGPPGGGGGGGGTT',
      'TTGtttttGGPPGGtttttGTT',
      'TTGtttttGGPPGGtttttGTT',
      'TTGtttttGGPPGGtttttGTT',
      'TTGGGGGGGGPPGGGGGGGGTT',
      'TTGGGGGGGGPPGGGGGGGGTT',
      'TTGttttttGPPGttttttGTT',
      'TTGttttttGPPGttttttGTT',
      'TTGGGGGGGGPPGGGGGGGGTT',
      'TTGGGGGGGGPPGGGGGGGGTT',
      'TTGGGGGGGGPPGGGGGGGGTT',
      'TTTTTTTTTTPPTTTTTTTTTT',
    ],
    buildings: [],
    decor: [
      { type: 'sign', x: 12, y: 16, solid: true, dialogueId: 'sign_meadow_in' },
    ],
    // The HIKER watches the north path: walk past at row 6 and they come over to battle.
    npcs: [{ id: 'hiker', name: 'HIKER', palette: 'hiker', x: 6, y: 6, facing: 'right', dialogueId: 'npc_hiker', trainer: 'hiker' }],
    warps: [
      { x: 10, y: 17, toMap: 'town', toX: 14, toY: 3, facing: 'down' },
      { x: 11, y: 17, toMap: 'town', toX: 14, toY: 3, facing: 'down' },
      { x: 10, y: 0, toMap: 'forest', toX: 9, toY: 14, facing: 'up' },
      { x: 11, y: 0, toMap: 'forest', toX: 10, toY: 14, facing: 'up' },
    ],
  },

  // ——— TANGLED FOREST (deep route): dense trees, tougher bugs ———
  forest: {
    id: 'forest',
    name: 'TANGLED FOREST',
    kind: 'town',
    rows: [
      'TTTTTTTTTTTTTTTTTTTT',
      'TTGGGGGGGGGGGGGGGGTT',
      'TTGtttttGGGGtttttGTT',
      'TTGtttttGGGGtttttGTT',
      'TTGtttttGPPGtttttGTT',
      'TTGGGGGGGPPGGGGGGGTT',
      'TTTTGGGGGPPGGGGGTTTT',
      'TTGGGGGGGPPGGGGGGGTT',
      'TTGtttttGPPGtttttGTT',
      'TTGtttttGPPGtttttGTT',
      'TTGtttttGPPGtttttGTT',
      'TTGGGGGGGPPGGGGGGGTT',
      'TTGGGGGGGPPGGGGGGGTT',
      'TTTTTTTTGPPGTTTTTTTT',
      'TTTTTTTTTPPTTTTTTTTT',
      'TTTTTTTTTPPTTTTTTTTT',
    ],
    buildings: [],
    decor: [
      { type: 'sign', x: 12, y: 12, solid: true, dialogueId: 'sign_forest' },
    ],
    npcs: [{ id: 'catcher', name: 'BUG CATCHER', palette: 'catcher', x: 7, y: 7, facing: 'right', dialogueId: 'npc_catcher', trainer: 'catcher' }],
    warps: [
      { x: 9, y: 15, toMap: 'meadow', toX: 10, toY: 1, facing: 'down' },
      { x: 10, y: 15, toMap: 'meadow', toX: 10, toY: 1, facing: 'down' },
    ],
  },
};

function isSolid(m: GameMap, x: number, y: number): boolean {
  if (x < 0 || y < 0 || y >= m.rows.length || x >= m.rows[0].length) return true;
  const ch = m.rows[y][x];
  if (m.kind === 'town') {
    if (ch === 'T' || ch === 'W') return true;
  } else if (ch === 'W') {
    return true;
  }
  for (const b of m.buildings) {
    if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
      return !(x === b.door.x && y === b.door.y);
    }
  }
  for (const dec of m.decor) {
    if (dec.solid && dec.x === x && dec.y === y) return true;
  }
  return false;
}

/* Zoom: device pixels per art pixel. 2-5 CSS px per art pixel so about 24x16
   tiles fit, rounded to a whole number of device pixels so every art pixel is
   the same size on screen (Retina, 125% Windows scaling...). */
const isOutdoor = (m: GameMap) => m.kind === 'town';

function zoomFor(vw: number, vh: number, dpr: number): number {
  const css = Math.max(2, Math.min(5, Math.floor(Math.min(vw / (24 * TILE), vh / (16 * TILE))) || 2));
  return Math.round(css * dpr);
}

// Outdoor maps get a ring of forest this many tiles deep, so a screen wider
// than the map shows trees instead of the void.
const OUTDOOR_PAD = 12;

// Pads a map with trees; a path that runs off an edge keeps going into the
// ring so route exits still read as roads.
function padRows(rows: string[], pad: number): string[] {
  const h = rows.length;
  const w = rows[0].length;
  const out: string[] = [];
  for (let y = -pad; y < h + pad; y++) {
    let r = '';
    for (let x = -pad; x < w + pad; x++) {
      if (x >= 0 && x < w && y >= 0 && y < h) {
        r += rows[y][x];
        continue;
      }
      const cx = Math.min(w - 1, Math.max(0, x));
      const cy = Math.min(h - 1, Math.max(0, y));
      r += rows[cy][cx] === 'P' && (x === cx || y === cy) ? 'P' : 'T';
    }
    out.push(r);
  }
  return out;
}

// Dev-time sanity checks: every map row must match its width, warps must land on open tiles.
if (import.meta.env.DEV) {
  for (const m of Object.values(MAPS)) {
    const w = m.rows[0].length;
    m.rows.forEach((r, i) => {
      if (r.length !== w) console.error(`[maps] ${m.id} row ${i} has length ${r.length}, expected ${w}`);
    });
    for (const wp of m.warps) {
      const to = MAPS[wp.toMap];
      if (!to) console.error(`[maps] ${m.id} warp at ${wp.x},${wp.y} points to missing map ${wp.toMap}`);
      else if (isSolid(to, wp.toX, wp.toY)) console.error(`[maps] ${m.id} warp at ${wp.x},${wp.y} lands on solid ${wp.toMap} ${wp.toX},${wp.toY}`);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 6 — DIALOGUE CONTENT (generated from portfolioData)
   ═══════════════════════════════════════════════════════════════════════════ */

type DialogueAction = { label: string; href?: string; grantBadge?: string; heal?: boolean; startTrainer?: string };
type DialogueSpec = { speaker: string; pages: string[]; actions?: DialogueAction[] };

function paginate(text: string, max = 96): string[] {
  const words = text.split(/\s+/);
  const pages: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) {
      if (cur) pages.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) pages.push(cur.trim());
  return pages;
}
const flatten = (texts: string[], max = 96) => texts.flatMap((t) => paginate(t, max));

const d = portfolioData;

function buildDialogues(): Record<string, () => DialogueSpec> {
  const jobDialogues: Record<string, () => DialogueSpec> = {};
  d.experience.forEach((e, i) => {
    jobDialogues[`job_${i}`] = () => ({
      speaker: e.company.toUpperCase(),
      pages: flatten([`${e.role.toUpperCase()} — ${e.period}.`, ...e.highlights.map((h) => `* ${h}`)]),
    });
  });
  const projectDialogues: Record<string, () => DialogueSpec> = {};
  d.projects.forEach((p, i) => {
    projectDialogues[`project_${i}`] = () => ({
      speaker: `EXHIBIT No.${i + 1}`,
      pages: flatten([
        `${p.title.toUpperCase()} — ${p.subtitle}.`,
        p.blurb,
        ...p.achievements.map((a) => `* ${a}`),
        `Built with: ${p.tech.join(', ')}.`,
      ]),
      actions: [
        ...(p.github ? [{ label: 'VIEW ON GITHUB', href: p.github }] : []),
        ...(p.live ? [{ label: 'OPEN LIVE DEMO', href: p.live }] : []),
        { label: 'CLOSE' },
      ],
    });
  });

  return {
    ...projectDialogues,
    ...jobDialogues,

    intro: () => ({
      speaker: 'NARRATOR',
      pages: [
        `Welcome to PORTFOLIO TOWN! This whole world is the portfolio of ${d.name} — ${d.role}.`,
        'Walk with WASD or ARROW KEYS. Hold SHIFT to run. Press E to talk, read and interact.',
        'Exit the house to explore. Want a route? Press M: the BACKPACK has a TASKS list, and the CV.',
      ],
    }),

    sign_welcome: () => ({
      speaker: 'TOWN SIGN',
      pages: [`WELCOME TO PORTFOLIO TOWN! Population: 1 developer, infinite ideas.`, d.tagline],
    }),
    sign_gallery: () => ({
      speaker: 'SIGN',
      pages: ['PROJECT GALLERY — Interactive exhibits of shipped work inside. Press E at any screen!'],
    }),
    sign_gym: () => ({
      speaker: 'SIGN',
      pages: ['SKILLS GYM — Where tech stacks are trained daily. The LEADER awaits challengers.'],
    }),
    sign_heal: () => ({
      speaker: 'SIGN',
      pages: ['♥ HEAL CENTER — Step inside and the NURSE will patch your skill party back to full HP, free of charge.'],
    }),
    sign_career: () => ({
      speaker: 'SIGN',
      pages: ['CAREER HALL — Every job so far, one plaque each. Newest on the left.'],
    }),
    sign_meadow: () => ({
      speaker: 'SIGN',
      pages: ['↑ NORTH — DEBUG MEADOW. Wild bugs roam the tall grass up ahead. Heal up before you go!'],
    }),
    sign_meadow_in: () => ({
      speaker: 'SIGN',
      pages: ['DEBUG MEADOW. Home of the OFF-BY-ONE and the MEMORY LEAK. The path north leads deeper into the TANGLED FOREST.'],
    }),
    sign_forest: () => ({
      speaker: 'SIGN',
      pages: ['TANGLED FOREST — Beware: STACK OVERFLOW and DEADLOCK lurk here. Tough catches, but worth filing to your BUGDEX!'],
    }),

    npc_nurse: () => ({
      speaker: 'NURSE',
      pages: ['Welcome to the HEAL CENTER! Shall I restore your skill party to full HP?'],
      actions: [
        { label: 'YES, PLEASE', heal: true },
        { label: 'NO THANKS' },
      ],
    }),
    npc_hiker: () => ({
      speaker: 'HIKER',
      pages: [
        'Whew! Long climb up from town. The tall grass here is crawling with fresh bugs I have never seen down south.',
        'Weaken them first, then lob a DEBUGGER from your BAG to file them into your BUGDEX!',
      ],
    }),
    npc_catcher: () => ({
      speaker: 'BUG CATCHER',
      pages: [
        'Heh! You made it to the TANGLED FOREST. The bugs here hit HARD — a STACK OVERFLOW nearly wiped my whole party.',
        'If you black out, no worries: you wake up fully healed. But keep a HEAL CENTER trip handy anyway!',
      ],
    }),

    mailbox: () => ({
      speaker: 'MAILBOX',
      pages: [
        `${d.name} — open to backend roles, collaborations, and the occasional interesting challenge.`,
        `Email: ${d.contact.email} ... Replies usually within a day!`,
      ],
      actions: [
        { label: 'SEND EMAIL', href: `mailto:${d.contact.email}` },
        ...d.contact.socials.map((s) => ({ label: s.label.toUpperCase(), href: s.href })),
        { label: 'CLOSE' },
      ],
    }),

    npc_guide: () => ({
      speaker: 'GUIDE',
      pages: [
        `Hey! You must be new here. This is PORTFOLIO TOWN — everything you see is the work of ${d.name}.`,
        'The RED-ROOF house is home base. Up north: the TEAL roof is the PROJECT GALLERY, the PURPLE roof the SKILLS GYM.',
        'The NAVY roof at the east end is the CAREER HALL, where the work history hangs on the wall.',
        'Talk to everyone! Oh — and press M anytime to open the BACKPACK. The CV is in there.',
      ],
    }),

    npc_recruiter: () => {
      const cur = d.experience[0];
      return {
        speaker: 'RECRUITER',
        pages: flatten([
          'Psst... looking for the work history?',
          `Right now: ${cur.role} at ${cur.company} (${cur.period}). ${cur.summary}`,
          `Every role has its own plaque in the CAREER HALL, east end of town. The full CV is in the BACKPACK, or write to ${d.contact.email}.`,
        ]),
      };
    },

    npc_mentor: () => ({
      speaker: 'MENTOR',
      pages: flatten([
        `${d.name} has 4+ years in software: backend APIs, web search, EV charging and route planning, plus game development.`,
        `There are ${d.experience.length} plaques on this wall, newest on the left. Stand below one and press E to read it.`,
      ]),
    }),

    diploma: () => {
      const ed = d.education[0];
      return {
        speaker: 'DIPLOMA',
        pages: [`${ed.degree.toUpperCase()} — ${ed.school}, ${ed.period}.`, `Languages: ${d.languages.join(', ')}.`],
      };
    },

    npc_curator_out: () => ({
      speaker: 'CURATOR',
      pages: [`The GALLERY holds ${d.projects.length} exhibits — every one of them shipped and open-source. Come inside!`],
    }),
    npc_curator_in: () => ({
      speaker: 'CURATOR',
      pages: [
        `Welcome to the PROJECT GALLERY! We currently display ${d.projects.length} works: ${d.projects.map((p) => p.title).join(', ')}.`,
        'Walk up to any screen and press E. Most exhibits link straight to their GitHub source!',
      ],
    }),

    npc_fan: () => ({
      speaker: 'GYM FAN',
      pages: ['The LEADER inside trains SYSTEM DESIGN every single day... They say nobody has out-scaled a database with them and won!'],
    }),

    npc_kid: () => ({
      speaker: 'KID',
      pages: ['Careful in the tall grass! Wild BUGS live there... but the dev squashes every one before release. Hi hi hi!'],
    }),

    npc_sensei: () => ({
      speaker: 'BACKEND SENSEI',
      pages: flatten([
        `Backend is the way of this dojo. Level: ${d.skills.groups.backend.level.toUpperCase()}.`,
        `My techniques: ${d.skills.groups.backend.items.join(', ')}.`,
        'A thousand requests per second flow like water when the architecture is sound.',
      ]),
    }),
    npc_sergeant: () => ({
      speaker: 'DEVOPS SGT.',
      pages: flatten([
        `LISTEN UP! DevOps discipline level: ${d.skills.groups.devops.level.toUpperCase()}!`,
        `Drills mastered: ${d.skills.groups.devops.items.join(', ')}.`,
        'A pipeline that is not automated is a pipeline that FAILS INSPECTION!',
      ]),
    }),
    npc_rookie: () => ({
      speaker: 'FRONTEND ROOKIE',
      pages: flatten([
        `I handle the frontend around here. Level: ${d.skills.groups.frontend.level} — and improving!`,
        `Current toolkit: ${d.skills.groups.frontend.items.join(', ')}.`,
        'Honestly? This entire town is a React component. Do not tell anyone.',
      ]),
    }),

    // Shown only before the leader is beaten; afterwards TRAINERS.leader.after is used.
    npc_leader: () => ({
      speaker: 'GYM LEADER',
      pages: flatten([
        'So, a challenger. This gym trains what the whole town runs on: BACKEND ENGINEERING.',
        `The disciplines here: ${d.skills.competencies.join('; ')}.`,
        'Talk is cheap. My team is three bugs straight out of a bad on-call week. Beat them and the BACKEND BADGE is yours.',
      ]),
      actions: [{ label: 'ACCEPT CHALLENGE', startTrainer: 'leader' }, { label: 'NOT YET' }],
    }),
    npc_leader_done: () => ({
      speaker: 'GYM LEADER',
      pages: [
        'You already hold the BACKEND BADGE. Wear it well.',
        'Remember: boring tech, good tests, and a rollback plan. That is how incidents end early.',
      ],
    }),

    pc: () => ({
      speaker: `${d.name.split(' ')[0].toUpperCase()}'S PC`,
      pages: flatten([`BOOTING PROFILE.SYS ... ${d.name} — ${d.role}.`, ...d.about]),
    }),
    bookshelf: () => {
      const idx = Math.floor(hash2(Date.now() % 977, 7) * d.funFacts.length) % d.funFacts.length;
      return { speaker: 'BOOKSHELF', pages: paginate(d.funFacts[idx]) };
    },
    tv: () => ({
      speaker: 'TV',
      pages: flatten([
        'The evening news is on. Tonight: a career in headlines.',
        ...d.experience.map((e) => `${e.company.toUpperCase()}, ${e.period}: ${e.summary}`),
        'More details at the CAREER HALL, east end of town.',
      ]),
    }),
    sofa: () => ({ speaker: 'SOFA', pages: ['A comfy spot for debugging marathons. The cushions have permanent dents.'] }),
    bed: () => ({ speaker: 'BED', pages: ['Neatly made. Good sleep, clean code — the two pillars of reliability.'] }),
    plant: () => ({ speaker: 'PLANT', pages: ['It is thriving. Somebody here clearly keeps things alive in production.'] }),
    weights: () => ({ speaker: 'WEIGHT RACK', pages: ['Heavy lifting equipment. The plates are labeled "LEGACY MIGRATIONS".'] }),
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 6B — BATTLE DATA & BUG SPRITE (turn-based encounters, original creatures)
   Wild "bugs" — software-bug word-play monsters, NOT Pokémon — live in the
   tall grass. Skills fight them with flavor "moves" drawn from the same
   portfolioData.skills.party list used by the overworld HUD.
   ═══════════════════════════════════════════════════════════════════════════ */

type Move = { name: string; power: [number, number] };
// weakTo lists party skill types (BACKEND / DEVOPS / DATA / FRONTEND) that hit
// this bug for 1.5x damage, so picking the right skill from PARTY pays off.
type BugSpecies = { id: string; name: string; color: string; accent: string; dark: string; maxHp: number; power: [number, number]; intro: string; weakTo?: string[] };

const BUG_SPECIES: BugSpecies[] = [
  // Town tall grass — the common starters
  { id: 'syntax', name: 'SYNTAX BUG', color: '#ef4444', accent: '#fecaca', dark: '#7f1d1d', maxHp: 26, power: [3, 7], intro: 'A wild SYNTAX BUG appeared!', weakTo: ['BACKEND'] },
  { id: 'null', name: 'NULL BUG', color: '#a78bfa', accent: '#ede9fe', dark: '#4c1d95', maxHp: 30, power: [4, 8], intro: 'A wild NULL BUG appeared out of nowhere!', weakTo: ['DATA'] },
  { id: 'merge', name: 'MERGE CONFLICT', color: '#22c55e', accent: '#dcfce7', dark: '#14532d', maxHp: 34, power: [4, 9], intro: 'A wild MERGE CONFLICT blocks the path!', weakTo: ['DEVOPS'] },
  { id: 'race', name: 'RACE CONDITION', color: '#fbbf24', accent: '#fef9c3', dark: '#78350f', maxHp: 28, power: [3, 8], intro: 'A wild RACE CONDITION flickers into view!', weakTo: ['DATA'] },
  // Debug Meadow (north route)
  { id: 'offbyone', name: 'OFF-BY-ONE', color: '#22d3ee', accent: '#cffafe', dark: '#0e7490', maxHp: 24, power: [3, 7], intro: 'A wild OFF-BY-ONE skittered in — one step too far!', weakTo: ['FRONTEND'] },
  { id: 'memleak', name: 'MEMORY LEAK', color: '#84cc16', accent: '#ecfccb', dark: '#3f6212', maxHp: 33, power: [4, 8], intro: 'A wild MEMORY LEAK is slowly spreading!', weakTo: ['BACKEND'] },
  // Tangled Forest (deep region — tougher)
  { id: 'stackoverflow', name: 'STACK OVERFLOW', color: '#f97316', accent: '#fed7aa', dark: '#7c2d12', maxHp: 40, power: [5, 9], intro: 'A wild STACK OVERFLOW towers over you!', weakTo: ['DEVOPS'] },
  { id: 'deadlock', name: 'DEADLOCK', color: '#64748b', accent: '#e2e8f0', dark: '#1e293b', maxHp: 46, power: [5, 10], intro: 'A wild DEADLOCK blocks the way — nobody moves!', weakTo: ['DATA'] },
];

// The GYM LEADER's team. Never found in tall grass and can't be caught, so
// they stay out of the BUGDEX; ?sheet=1 shows them in their own row.
const BOSS_SPECIES: BugSpecies[] = [
  { id: 'scopecreep', name: 'SCOPE CREEP', color: '#7c3aed', accent: '#ddd6fe', dark: '#1e1033', maxHp: 34, power: [5, 9], intro: '', weakTo: ['FRONTEND', 'DATA'] },
  { id: 'outage', name: 'PROD OUTAGE', color: '#dc2626', accent: '#fee2e2', dark: '#2a0a0a', maxHp: 40, power: [5, 9], intro: '', weakTo: ['BACKEND'] },
  { id: 'monolith', name: 'LEGACY MONOLITH', color: '#8b90a0', accent: '#c9ccd6', dark: '#1f2430', maxHp: 46, power: [6, 10], intro: '', weakTo: ['DEVOPS'] },
];

const SPECIES_BY_ID: Record<string, BugSpecies> = Object.fromEntries([...BUG_SPECIES, ...BOSS_SPECIES].map((s) => [s.id, s]));

// Trainer battles: a fixed team fought in order, no running, no catching.
// `sight` > 0 makes the NPC spot the player along its facing line and walk
// over; `challengeDialogue` instead opens a dialogue whose action starts the
// fight (the GYM LEADER). After a win the NPC falls back to its dialogueId.
type TrainerDef = {
  id: string;
  name: string;
  team: string[];
  sight: number;
  challenge: string[];
  challengeDialogue?: string;
  win: string[];
  badge?: string;
  music: 'battle' | 'boss';
};

const TRAINERS: Record<string, TrainerDef> = {
  leader: {
    id: 'leader',
    name: 'GYM LEADER',
    team: ['scopecreep', 'outage', 'monolith'],
    sight: 0,
    challenge: [],
    challengeDialogue: 'npc_leader',
    win: ['Clean rollback, zero downtime. That is how it is done.', 'The BACKEND BADGE is yours!'],
    badge: 'BACKEND BADGE',
    music: 'boss',
  },
  hiker: {
    id: 'hiker',
    name: 'HIKER',
    team: ['offbyone', 'memleak'],
    sight: 5,
    challenge: ['Hey! You look like someone who can handle a few bugs.', 'Let me see what your party can do!'],
    win: ['Whoa, my bugs are squashed! You are ready for the forest up north.'],
    music: 'battle',
  },
  catcher: {
    id: 'catcher',
    name: 'BUG CATCHER',
    team: ['merge', 'stackoverflow'],
    sight: 4,
    challenge: ['A trainer! My bugs have been itching for a real fight!'],
    win: ['Argh! My STACK OVERFLOW overflowed the wrong way...'],
    music: 'battle',
  },
};

// Which species can appear in each map's tall grass. Keeps regions distinct so
// exploring new areas means meeting (and catching) new bugs.
const ENCOUNTER_TABLES: Record<string, string[]> = {
  town: ['syntax', 'null', 'race'],
  meadow: ['offbyone', 'memleak', 'syntax', 'race'],
  forest: ['stackoverflow', 'deadlock', 'merge', 'memleak'],
};

const SKILL_MOVES: Record<string, Move[]> = {
  PYTHON: [{ name: 'REFACTOR', power: [5, 9] }, { name: 'LIST COMPREHENSION', power: [4, 8] }, { name: 'ASYNC AWAIT', power: [6, 10] }],
  JAVA: [{ name: 'DEPENDENCY INJECTION', power: [5, 9] }, { name: 'ENTERPRISE PATTERN', power: [6, 10] }, { name: 'GARBAGE COLLECT', power: [4, 8] }],
  DOCKER: [{ name: 'CONTAINERIZE', power: [5, 9] }, { name: 'MULTI-STAGE BUILD', power: [6, 10] }, { name: 'COMPOSE UP', power: [4, 8] }],
  K8S: [{ name: 'AUTO-SCALE', power: [5, 9] }, { name: 'ROLLING UPDATE', power: [4, 8] }, { name: 'POD RESTART', power: [6, 10] }],
  POSTGRES: [{ name: 'INDEX SCAN', power: [5, 9] }, { name: 'ACID COMMIT', power: [6, 10] }, { name: 'QUERY OPTIMIZE', power: [4, 8] }],
  REACT: [{ name: 'RE-RENDER', power: [4, 8] }, { name: 'HOOK INTO STATE', power: [5, 9] }, { name: 'VIRTUAL DOM DIFF', power: [6, 10] }],
};
const DEFAULT_MOVES: Move[] = [{ name: 'DEBUG', power: [4, 8] }];

// Party HP persists between battles (damage carries over) so the HEAL CENTER
// actually matters. Max HP scales with each skill's level.
const skillMaxHp = (lv: number) => 20 + Math.round(lv / 2);
const fullPartyHp = (): Record<string, number> =>
  Object.fromEntries(portfolioData.skills.party.map((s) => [s.name, skillMaxHp(s.lv)]));

type BattlePartyMember = { name: string; abbr: string; color: string; type: string; maxHp: number; hp: number; moves: Move[] };
type BattlePhase = 'text' | 'menu' | 'fight' | 'party' | 'bag';
type BattleNext = 'menu' | 'enemyTurn' | 'victory' | 'defeat' | 'runSuccess' | 'caught' | 'trainerNext' | 'trainerWin';
type BattleState = {
  // null for wild encounters; idx is the team member currently out
  trainer: { def: TrainerDef; idx: number } | null;
  enemy: BugSpecies;
  enemyHp: number;
  party: BattlePartyMember[];
  active: number;
  phase: BattlePhase;
  msgs: string[];
  msgIdx: number;
  typed: boolean;
  next: BattleNext;
  cursor: number;
  hitEnemy: number;
  hitPlayer: number;
  // Catch animation: throwSeq increments each DEBUGGER toss so BattleScreen can
  // (re)play the throw→absorb→wobble sequence; catchWillSucceed tells it whether
  // to settle (caught) or burst open (broke free) at the end.
  throwSeq: number;
  catchWillSucceed: boolean;
};

const BUG_W = 24;
const BUG_H = 20;
// Hand-authored matrix art per creature id ('bug_*' / 'skill_*'); anything
// missing falls back to the procedural painters. Each is an original design:
// software-bug monsters and skill mascots drawn as 24x20 shaded pixel matrices.
type MatrixArt = { rows: string[]; palette: Record<string, string> };
const MATRIX_ART: Record<string, MatrixArt> = {
  bug_syntax: {
    rows: [
      '....OO............OO....',
      '......O..........O......',
      '.......O........O.......',
      '........O......O........',
      '........OOOOOOOO........',
      '......OOHHHLLLRROO......',
      '.....OCHHHCLLLCRRDO.....',
      '....OCHCLCLCLCRCRCDO....',
      '...OCLLLCRRRCRRRCDCDO...',
      '...OLLLORRRRRRRODDDDO...',
      '...OLLLROORRROORDDDDO...',
      '...OLLLRKWRRRKWRDDDDO...',
      '...OLLRRKWRRRKWRDDDDO...',
      '....ORRRRRROORRRDDDO....',
      '....ORRRRRORRODDDDDO....',
      '....OOOOOOOOOOOOOOOO....',
      '...DD.DD.DD..DD.DD.DD...',
      '...DD.DD.DD..DD.DD.DD...',
      '...OO.OO.OO..OO.OO.OO...',
      '........................',
    ],
    palette: { O: '#5a0e1c', D: '#b91c1c', R: '#ef4444', L: '#f87171', H: '#fecaca', C: '#f7e8b0', K: '#2b060d', W: '#fff3e0' },
  },
  bug_null: {
    rows: [
      '............OOOO........',
      '...........OHLLO........',
      '...........OLLO.........',
      '.........OOOOOO.........',
      '.......OOHHLLLMOO.......',
      '......OHHHLLLLMMDO......',
      '.....OHEEELLEEEMMDO.....',
      '.....OLE.ELLE.EMMDO.....',
      '.....OLEEELMEEEMDDO.....',
      '.....OLLMMMMMMMMDDO.....',
      '.....OLMMMEMMMMMDDO.....',
      '.....OMMMMMMMMDDDDO.....',
      '......OMMMMMMDDDDO......',
      '......OMMMMMDDDDDO......',
      '......OMMDOMDDODDO......',
      '.......ODO.ODO.OO.......',
      '.......OO..OO..O........',
      '.......O...OO...........',
      '............O...........',
      '........................',
    ],
    palette: { O: '#372462', E: '#241640', D: '#7a5fd0', M: '#a78bfa', L: '#c6b3fd', H: '#e9e0ff' },
  },
  bug_merge: {
    rows: [
      '......NO.......NO.......',
      '.....ONO......ONO.......',
      '.....OOOOOOOOOOOOO......',
      '....OLhLLggGZllddDO.....',
      '...OLhhLLgGZlldddDDO....',
      '..OLLWWLgggGZlddddDDO...',
      '..OLgOWgggggGZddddDDO...',
      '..OggggggggGZddWWddDDO..',
      '..OggggggGGZdddOWddDDO..',
      '..OgggggGGZZddddddDDDO..',
      '..OgOOOOOOOGZdddddDDDO..',
      '..OgGWGWGWGGGZOOOODDDO..',
      '...OGgggggGGZDWDWDDDO...',
      '...OGggggGGZddddDDDDO...',
      '....OGgggGGGZddDDDDO....',
      '.....OOOOOOOOOOOOOO.....',
      '...OgO..OgO..OdO.ODO....',
      '..OggO..OgO.OddO.ODO....',
      '..OOOO..OOO.OOOO.OOO....',
      '........................',
    ],
    palette: { O: '#123c1c', N: '#e0d29e', L: '#4ade80', h: '#bbf7d0', g: '#22c55e', G: '#15803d', Z: '#ffd94a', l: '#7d9884', d: '#5a7561', D: '#3c523f', W: '#f2f7ea' },
  },
  bug_race: {
    rows: [
      '........................',
      '........................',
      '........................',
      '........DD..............',
      '.......D.DD.WWWWW.......',
      '......D.D.WWWWWW........',
      '....OOOD.WWWWOOOOOO.....',
      '...ODHYOOHYYOHSYASAO.HH.',
      '..OeeYYOHYYYOYSYASDDO...',
      '..OYYADDYAADODSDDSOO..HH',
      '..OSDDOOAADDOOOOOO......',
      '...OOO..ODDO........HH..',
      '....ODDDOOOO............',
      '.....ODO.O..O...........',
      '.........O...O..........',
      '........O.....O.........',
      '........O......O........',
      '........O.......O.......',
      '.......OO.......OO......',
      '........................',
    ],
    palette: { O: '#4a2410', D: '#b45309', A: '#f59e0b', Y: '#fbbf24', H: '#fde68a', S: '#6b3a12', W: '#f4e9c8', e: '#7f1d1d' },
  },
  skill_PYTHON: {
    rows: [
      '........................',
      '................OOOO....',
      '...............OLHLBO...',
      '..............OLBBEEBO.P',
      '..............OLBBEOBOP.',
      '..............OBBBDBOO.P',
      '..............OBBDOOO...',
      '.............OLBDO......',
      '............OYYGO.......',
      '...........OLBDO........',
      '.....OOOOOOLBBDO........',
      '....OLHWYLBBYYDO........',
      '...OLBBYGBDDYGDO........',
      '..OLBDOOOOOOOOOO........',
      '..OLBDOOOOOOOOOOOOOO....',
      '..OLHLLBWYBBBYYBBDYDOO..',
      '.OLLBBBBYGBBBYGBDDGDDDO.',
      '.ODBBBDDGGDDDGGDDDGOOO..',
      '..OOOOOOOOOOOOOOOOO.....',
      '........................',
    ],
    palette: { O: '#1b2e52', D: '#2b5d8c', B: '#3776ab', L: '#5d9fd6', H: '#a9d6f5', Y: '#ffd43b', G: '#cf9e2b', W: '#ffea9a', E: '#f0f6fc', P: '#f473a8' },
  },
  skill_JAVA: {
    rows: [
      '...........S............',
      '.......S....S..S........',
      '........s..s..s.........',
      '.......s....s..s........',
      '......OOOOOOOOOO........',
      '.....OLLbbbbbbBBO.......',
      '.....OHHCCCCCCccO.......',
      '.....OHHCCCCCCccO.......',
      '.....OHHCCCCCCccOOOO....',
      '.....OHHOOCCOOccOcccO...',
      '.....OHpCCCCCCpcO..OcO..',
      '.....OCCCOCCOcccO..OcO..',
      '.....OCCCCOOCcccOcccO...',
      '.....OCCCCCCCcccOOOO....',
      '.....OCCCCCCCcccO.......',
      '.....OccccccccccO.......',
      '......OOOOOOOOOO........',
      '.......OCO..OcO.........',
      '.......OOO..OOO.........',
      '........................',
    ],
    palette: { O: '#3b1c0f', H: '#fffbf0', C: '#f5f0e6', c: '#d9c9ab', L: '#a3492a', b: '#7c2d12', B: '#571c0b', S: '#eef4f4', s: '#c2d2d4', p: '#efb2a0' },
  },
  skill_DOCKER: {
    rows: [
      '........................',
      '.................WWs....',
      '........OOOO....sWWWs...',
      '.OOO....OeGOOOOO.sWs....',
      '.OllO...OGgOOmNO..s.....',
      '.OlbO...OggOONnO..s.....',
      '..ObbO.OOOOOOOOOOOOO....',
      '...ObdOlhhhhhhllllllO...',
      '....OOllllllllbbbOOObO..',
      '....OllbbbbbbbbbOWWOObO.',
      '....OlbbbbbbbbbbOWWOOdO.',
      '....ObbbbbbbbbbbbOOObdO.',
      '....ObbbbbOOObbbbbbbbdO.',
      '....ObbbbOddObbbbbbObOO.',
      '....OYYYYOdOYYYYYYYYOyO.',
      '.....OYYYYOYYYYYYyyyyO..',
      '......OYYYyyyyyyyyyyO...',
      '.......OuuuuuuuuuuuO....',
      '........OOOOOOOOOOO.....',
      '........................',
    ],
    palette: { O: '#0d3b66', d: '#0a86c2', b: '#0db7ed', l: '#53d1f9', h: '#b8ecff', Y: '#f2fbff', y: '#c6e8f4', u: '#a8d4e6', e: '#8ce39b', G: '#3fb35f', g: '#1e6f3a', m: '#ffc574', N: '#ef8f2e', n: '#a5520f', W: '#ffffff', s: '#dcf4fd' },
  },
  skill_K8S: {
    rows: [
      '............GC..........',
      '............CC..........',
      '............O...........',
      '.........OOOOOO.........',
      '.......OOHHLLMMOO.......',
      '......OHHLLLMMMMDO......',
      '.....OHLLLGCMMMGCDO.....',
      '....OLLLMMCCMMMCCDDO....',
      '....OLLMMMMMOOOMMDDO....',
      '....ODODDDWDDDWDDODO....',
      '....OLMMMMMWWWMMMDDO....',
      '....OLMMMMWWWWWMMDDO....',
      '....OMOMMWWWDWWWMODO....',
      '.....OMMMMWWWWHMDDO.....',
      '......OMMMMHHHMDDO......',
      '.......OMMWMWMWDO.......',
      '........ODDOODDO........',
      '.......OMMO..ODDO.......',
      '.......OOOO..OOOO.......',
      '........................',
    ],
    palette: { O: '#1e2a66', D: '#24509f', M: '#326ce5', L: '#6598f0', H: '#9dc2fb', W: '#cfe4ff', C: '#46e8dc', G: '#cdfff7' },
  },
  skill_POSTGRES: {
    rows: [
      '........................',
      '..................OOO...',
      '.................OLLMO..',
      '.........OOOO.OOOHOLMO..',
      '.......OOLLMMOLLOOOLMO..',
      '......OLLEEEMOHLLMOLMO..',
      '.....OLEEEEEMOLLLMOLMO..',
      '.....OLEEEEEMOLWOMOLMO..',
      '....OOLEEEEEMOLLMMMMMO..',
      '...OLOMEEEEEMOLMMMMOMO..',
      '..OLLMOMEEEMMOOOWOWOO...',
      '..OLMMMOMEEMOMMMMMO.....',
      '..OLMMMMOOMOMMMMMEO.....',
      '..OMMMMMMMOMOLMMOEO.....',
      '...OLMMOMEEEOLMMOEO.....',
      '...OLMMOOOOOOLMMOEO.....',
      '...OLMMO....OLMMOEO.....',
      '...OLMWO....OLMWOOO.....',
      '....OOO......OOO........',
      '........................',
    ],
    palette: { O: '#1d3557', E: '#274e78', M: '#336791', L: '#4a86b4', H: '#85bce0', W: '#f2f6fa' },
  },
  skill_REACT: {
    rows: [
      '........................',
      '........................',
      '.................CC.....',
      '...............CC..C....',
      '............DCC....E....',
      '..........OOOOO....C....',
      '........OOHHSSMOO..C....',
      '.......OSHHSSMMMBOC.....',
      '......OSSHSECMECMBC.....',
      '..CECCOSSSMCDMCDMCODDD..',
      '.C....OSMMMMMMMBBCO...D.',
      '.D....OMMMMMOOOBCBO...D.',
      '..CCC.OMMMBBBBBCBBO.ED..',
      '.....CCCCCCCCCCCCCDD....',
      '.....D..OMBCCBBBO.......',
      '.....D..CCCOOOOO........',
      '......CC.OSO.OSO........',
      '.........OBO.OBO........',
      '.........OOO.OOO........',
      '........................',
    ],
    palette: { O: '#1c1233', B: '#20232a', M: '#2b2f39', S: '#363b47', H: '#4b5464', D: '#2a7fa6', C: '#61dafb', E: '#d9f8ff' },
  },
  bug_offbyone: {
    rows: [
      '........................',
      '...................1....',
      '........O.........1.....',
      '.......OCO....O.........',
      '.......OCOOOOOCO........',
      '......OHHLLCCCCDO.......',
      '.....OHOWWOLCCCCDO......',
      '.....OHWPPWLCCCCDO......',
      '.....OLWPPWCCWPCDO......',
      '......OOWWOCCCCDO.......',
      '......OLCOTTMTODO.......',
      '....OLCCCOMMMMODOLCO....',
      '...OCC.OLLCCCCCDODO.....',
      '..OLC..OHLLCCCCDO.......',
      '..OCO...OLLCCCDO........',
      '........OLCCCCDO........',
      '......OCCCCCCCCDO.......',
      '......OCO.OCO.OCO.......',
      '......OCO.OCO.OCO.......',
      '......OOO.OOO.OOO.......',
    ],
    palette: { '1': '#5eead4', O: '#0b3a44', D: '#0e7490', C: '#22d3ee', L: '#67e8f9', H: '#a5f3fc', W: '#ecfeff', P: '#083344', M: '#4d2436', T: '#f5feff' },
  },
  bug_memleak: {
    rows: [
      '........................',
      '.........oooooo.........',
      '.......oHHLLLggdo.......',
      '......oHHLLLggggdo......',
      '.....oHHHLLLggggddo.....',
      '....oHHLLLLgggggdddo....',
      '...oHLLggggggggggdddo...',
      '...oLLggggggggggggddo...',
      '...oLgooooggggoooogdo...',
      '...oggwppwggggwppwgdo...',
      '...oggdwwdggggdwwdgdo...',
      '...oggggggggggggggddo...',
      '...ogggggggoogggggddo...',
      '...oggggggoggoggggddo...',
      '...oggggggggggggddddo...',
      '....oggggggggddddddo....',
      '.....gd..gd..gd..gd.....',
      '......d.......d..d......',
      '.........oLgo...........',
      '..........oo............',
    ],
    palette: { o: '#2f4d0f', d: '#4d7c0f', g: '#84cc16', L: '#a3e635', H: '#d9f99d', w: '#ecfccb', p: '#1a2e05' },
  },
  bug_stackoverflow: {
    rows: [
      '........................',
      '..........OOOOOOOOOOO...',
      '..........OhwwoowwssO.L.',
      '..........OhOwoowOosOLL.',
      '..........OooOwOwOssO.L.',
      '.........OOOOOOOOOOOO...',
      '.........OhhoooooosO....',
      '.........OhooooooosO....',
      '.........OssssssssdO....',
      '.......OOOOOOOOOOOOO....',
      '.......OhhoooooosO......',
      '.......OhooooooosO......',
      '.......OssssssssdO......',
      '......OOOOOOOOOOOO......',
      '......OhhoooooosO.......',
      '......OhooooooosO.......',
      '......OssssssssdO.......',
      '......OOOOOOOOOOO.......',
      '........ss...ss.........',
      '........OO...OO.........',
    ],
    palette: { O: '#4a1e05', h: '#fed7aa', o: '#f97316', s: '#c2410c', d: '#7c2d12', w: '#fff7ed', L: '#fdba74' },
  },
  bug_deadlock: {
    rows: [
      '........................',
      '........oooooooo........',
      '.......ohhlssllgo.......',
      '......ooollssllooo......',
      '......olssoooosslo......',
      '......osRrooooRrso......',
      '......ogrgssssgrgo......',
      '......ogohohohohgo......',
      '...osgogssgssgssgogso...',
      '..osglgggllsslgggglgso..',
      '..ollhlggggssgggggllgo..',
      '..osglgogglssgggggggso..',
      '..ogggggssssssglllgggo..',
      '..osggggggsssggoglglso..',
      '...ogglggsollosgglggo...',
      '....ogggsdykkydsgggo....',
      '....oglgsdkddkdsglgo....',
      '....osgggggssgggggso....',
      '....oglggso..oglggso....',
      '...oglggggo..ogggglgo...',
    ],
    palette: { o: '#1f2735', s: '#3d4a5f', g: '#64748b', l: '#94a3b8', h: '#cbd5e1', r: '#dc2626', R: '#f87171', d: '#7a6a2e', k: '#b3a04a', y: '#e6d98a' },
  },
  // ——— GYM LEADER bosses ———
  // A sticky-note-waving vine blob that keeps growing new arms.
  bug_scopecreep: {
    rows: [
      '..nn................nn..',
      '..nN................Nn..',
      '...O................O...',
      '....Op............pO....',
      '.....Op..........pO.....',
      '......OpOOOOOOOOpO......',
      '.....OPPhhPPPPPPPPO.....',
      '....OPPhPPPPPPPPPppO....',
      '....OPPekPPPPPPekPpO....',
      '...OPPPkkPPPPPPkkPppO...',
      '...OPPPPPPPPPPPPPPppO...',
      '..OPPPPPkkkkkkPPPPpppO..',
      '..OPPPPPPkkkkPPPPPpppO..',
      '.OpPPPPPPPPPPPPPPPppppO.',
      '.OpPPPPPPPPPPPPPPPppppO.',
      'OppPPPPPPPPPPPPPPPpppppO',
      'OppppppppppppppppppppppO',
      'OOOOOOOOOOOOOOOOOOOOOOOO',
      '..Op....Op....Op....Op..',
      '...O.....O....O.....O...',
    ],
    palette: { O: '#1e1033', p: '#5b21b6', P: '#8b5cf6', h: '#ddd6fe', n: '#fde047', N: '#ca8a04', e: '#ffffff', k: '#111827' },
  },
  // A server rack with a spinning siren, X-ed out status lights and sparks.
  bug_outage: {
    rows: [
      '...........OO...........',
      '..y.......OwRO.......y..',
      '...y.....ORRrrO.....y...',
      '....y....OrrrrO....y....',
      '.....OOOOOOOOOOOOOO.....',
      '.....OBBBBBBBBBBBBO.....',
      '.....OBxBxBBBBxBxBO.....',
      '.....OBBxBBBBBBxBBO.....',
      '.....OBxBxBBBBxBxBO.....',
      '...y.OBBBBBBBBBBBBO.y...',
      '..y..ObbbbbbbbbbbbO..y..',
      '.....ObRbRbRbgbgbbO.....',
      '.....OBBBBBBBBBBBBO.....',
      '.....OBllllllllllBO.....',
      '.....OBlwllllllRlBO.....',
      '.....OBBBBBBBBBBBBO.....',
      '.....ObbbbbbbbbbbbO.....',
      '.....OOOOOOOOOOOOOO.....',
      '......OBO......OBO......',
      '......OOO......OOO......',
    ],
    palette: { O: '#2a0a0a', r: '#dc2626', R: '#f87171', w: '#fee2e2', B: '#374151', b: '#1f2937', l: '#6b7280', x: '#fca5a5', y: '#fbbf24', g: '#22c55e' },
  },
  // A cracked, moss-capped stone slab with stubby arms and amber eyes.
  bug_monolith: {
    rows: [
      '.......OOOOOOOOOO.......',
      '......OMMhhhhhhhhO......',
      '......OmMgggggggsO......',
      '......OhmggggkggsO......',
      '......OhggggggkgsO......',
      '......OhgyYggyYgsO......',
      '......OhgyyggyygsO......',
      '......OhggggggggsO......',
      '......OhggddddggsO......',
      '...OOOOhgkggggggsOOOO...',
      '...OggOhggkgggggsOggO...',
      '...OgsOhgggggggksOsdO...',
      '...OOOOhggggggkgsOOOO...',
      '......OhggggggggsO......',
      '......OsggggggggdO......',
      '......OssggggggddO......',
      '......OdssssssssdO......',
      '......OOOOOOOOOOOO......',
      '.......OdO....OdO.......',
      '.......OOO....OOO.......',
    ],
    palette: { O: '#1f2430', h: '#c9ccd6', g: '#8b90a0', s: '#5b6070', d: '#3d414d', y: '#f59e0b', Y: '#fde68a', k: '#2a2e38', m: '#4d7c0f', M: '#84cc16' },
  },
};

if (import.meta.env.DEV) {
  for (const [id, art] of Object.entries(MATRIX_ART)) {
    if (art.rows.length !== 20 || art.rows.some((r) => r.length !== 24)) console.error(`[art] ${id} is not 24x20`);
  }
}

const bugSpriteCache = new Map<string, HTMLCanvasElement>();
function getBugSprite(species: BugSpecies): HTMLCanvasElement {
  const cached = bugSpriteCache.get(species.id);
  if (cached) return cached;
  const c = document.createElement('canvas');
  c.width = BUG_W;
  c.height = BUG_H;
  const ctx = c.getContext('2d')!;
  const art = MATRIX_ART[`bug_${species.id}`];
  if (art) {
    drawMatrix(ctx, art.rows, art.palette, 0, 0);
    return finishBugSprite(species.id, c);
  }
  const { color: col, accent: a, dark: d2 } = species;
  px(ctx, 5, 6, 14, 9, d2);
  px(ctx, 7, 4, 10, 3, d2);
  px(ctx, 6, 7, 12, 7, col);
  px(ctx, 8, 5, 8, 3, col);
  px(ctx, 8, 9, 8, 3, a);
  px(ctx, 8, 6, 2, 2, '#ffffff');
  px(ctx, 14, 6, 2, 2, '#ffffff');
  px(ctx, 8, 7, 1, 1, '#1a1a1a');
  px(ctx, 14, 7, 1, 1, '#1a1a1a');
  px(ctx, 7, 2, 1, 3, d2);
  px(ctx, 16, 2, 1, 3, d2);
  px(ctx, 4, 14, 2, 3, d2);
  px(ctx, 18, 14, 2, 3, d2);
  px(ctx, 5, 16, 2, 2, d2);
  px(ctx, 17, 16, 2, 2, d2);
  return finishBugSprite(species.id, c);
}

// Upscale to HD (BUG_W*HD x BUG_H*HD), shade at that resolution, cache.
function finishBugSprite(id: string, c: HTMLCanvasElement): HTMLCanvasElement {
  const hd = upscale3(c);
  paintTopLightShade(hd.getContext('2d')!, hd.width, hd.height);
  bugSpriteCache.set(id, hd);
  return hd;
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 6C — SKILL CREATURES (original designs, one per party member)
   Each skill fights as its own little creature instead of a generic stand-in —
   a snake for PYTHON, a mug for JAVA, a whale for DOCKER, etc. These are
   original silhouettes only loosely evoking the public idea behind each skill
   (snake↔Python, elephant↔Postgres…), not reproductions of any brand's logo art.
   ═══════════════════════════════════════════════════════════════════════════ */

const CREATURE_W = 24;
const CREATURE_H = 20;

function paintCritterBase(ctx: Ctx, main: string, dark: string, accent: string) {
  px(ctx, 5, 6, 14, 9, dark);
  px(ctx, 7, 4, 10, 3, dark);
  px(ctx, 6, 7, 12, 7, main);
  px(ctx, 8, 5, 8, 3, main);
  px(ctx, 8, 9, 8, 3, accent);
  px(ctx, 8, 6, 2, 2, '#ffffff');
  px(ctx, 14, 6, 2, 2, '#ffffff');
  px(ctx, 8, 7, 1, 1, '#1a1a1a');
  px(ctx, 14, 7, 1, 1, '#1a1a1a');
  px(ctx, 6, 14, 3, 3, dark);
  px(ctx, 15, 14, 3, 3, dark);
}

function paintPythonCreature(ctx: Ctx) {
  paintCritterBase(ctx, '#3776ab', '#16324f', '#ffd43b');
  // curled tail sweeping off the right side
  px(ctx, 19, 10, 3, 3, '#16324f');
  px(ctx, 21, 8, 2, 3, '#3776ab');
  // small forked tongue
  px(ctx, 9, 12, 1, 2, '#ef4444');
  px(ctx, 11, 12, 1, 2, '#ef4444');
}

function paintJavaCreature(ctx: Ctx) {
  paintCritterBase(ctx, '#f5f0e6', '#7c2d12', '#ea580c');
  // mug handle
  px(ctx, 18, 8, 3, 5, '#7c2d12');
  px(ctx, 19, 9, 2, 3, '#f5f0e6');
  // steam wisps
  px(ctx, 8, 1, 2, 2, '#e5e7eb');
  px(ctx, 12, 0, 2, 2, '#e5e7eb');
}

function paintDockerCreature(ctx: Ctx) {
  paintCritterBase(ctx, '#0db7ed', '#055a78', '#e0f6ff');
  // cargo boxes riding on its back
  px(ctx, 7, 2, 4, 3, '#22c55e');
  px(ctx, 12, 1, 4, 4, '#f59e0b');
  // small tail fin
  px(ctx, 19, 12, 3, 2, '#055a78');
}

function paintK8sCreature(ctx: Ctx) {
  paintCritterBase(ctx, '#326ce5', '#1a3f8f', '#dbeafe');
  // antenna with glowing tip
  px(ctx, 11, 0, 1, 3, '#1a3f8f');
  px(ctx, 10, 0, 3, 2, '#67e8f9');
  // gear-notch ears
  px(ctx, 3, 8, 2, 2, '#1a3f8f');
  px(ctx, 19, 8, 2, 2, '#1a3f8f');
}

function paintPostgresCreature(ctx: Ctx) {
  paintCritterBase(ctx, '#336791', '#1c3a52', '#a8c5da');
  // big elephant ears
  px(ctx, 2, 5, 4, 6, '#1c3a52');
  px(ctx, 3, 6, 2, 4, '#336791');
  px(ctx, 18, 5, 4, 6, '#1c3a52');
  px(ctx, 19, 6, 2, 4, '#336791');
  // trunk curl
  px(ctx, 10, 12, 2, 3, '#1c3a52');
  px(ctx, 8, 14, 2, 2, '#336791');
}

function paintReactCreature(ctx: Ctx) {
  paintCritterBase(ctx, '#20232a', '#0b0d10', '#282c34');
  const cx = 12, cy = 10;
  const rings: Array<[number, number]> = [
    [10, 4],
    [8, 5],
  ];
  for (const [rx, ry] of rings) {
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const x = Math.round(cx + Math.cos(a) * rx);
      const y = Math.round(cy + Math.sin(a) * ry * 0.5);
      if (y < 2 || y > 17) continue; // keep clear of the face
      px(ctx, x, y, 1, 1, '#61dafb');
    }
  }
  px(ctx, cx - 1, 2, 2, 2, '#61dafb');
  px(ctx, cx + 6, 15, 2, 2, '#61dafb');
}

const SKILL_CREATURE_PAINTERS: Record<string, (ctx: Ctx) => void> = {
  PYTHON: paintPythonCreature,
  JAVA: paintJavaCreature,
  DOCKER: paintDockerCreature,
  K8S: paintK8sCreature,
  POSTGRES: paintPostgresCreature,
  REACT: paintReactCreature,
};

const creatureSpriteCache = new Map<string, HTMLCanvasElement>();
function getSkillCreatureSprite(skillName: string): HTMLCanvasElement {
  const cached = creatureSpriteCache.get(skillName);
  if (cached) return cached;
  const c = document.createElement('canvas');
  c.width = CREATURE_W;
  c.height = CREATURE_H;
  const ctx = c.getContext('2d')!;
  const art = MATRIX_ART[`skill_${skillName}`];
  if (art) {
    drawMatrix(ctx, art.rows, art.palette, 0, 0);
  } else {
    const paint = SKILL_CREATURE_PAINTERS[skillName] ?? ((ctxx: Ctx) => paintCritterBase(ctxx, '#94a3b8', '#334155', '#e2e8f0'));
    paint(ctx);
  }
  // returned at HD resolution, shaded after upscaling
  const hd = upscale3(c);
  paintTopLightShade(hd.getContext('2d')!, hd.width, hd.height);
  creatureSpriteCache.set(skillName, hd);
  return hd;
}

/* Battle backdrop: one 640x360 pixel painting stretched to fill the screen —
   layered sky, clouds, a two-row treeline and grassy combat platforms under
   each fighter. Everything is drawn as whole pixels (no antialiased curves),
   so it stays crisp when scaled up. */
const BACKDROP_W = 640;
const BACKDROP_H = 360;
// Platform centres in backdrop pixels; BattleScreen stands the fighters on them.
const ENEMY_PAD = { x: 496, y: 132 };
const PLAYER_PAD = { x: 170, y: 260 };

// Where the backdrop sits on screen: c = CSS px per backdrop px, (ox, oy) =
// its top-left corner. One uniform scale in whole device pixels, never a
// stretch. Landscape covers the screen; portrait fits the strip holding both
// platforms (backdrop x 54..600) to the width, centred above the text box.
function backdropLayout(vw: number, vh: number, dpr: number) {
  if (vw >= vh) {
    const c = Math.ceil(Math.max(vw / BACKDROP_W, vh / BACKDROP_H) * dpr) / dpr;
    return { c, ox: (vw - BACKDROP_W * c) / 2, oy: (vh - BACKDROP_H * c) / 2 };
  }
  const c = Math.max(1, Math.floor((vw / 550) * dpr)) / dpr;
  return { c, ox: vw / 2 - 327 * c, oy: Math.max(0, (vh - 140 - BACKDROP_H * c) / 2) };
}

// Filled pixel ellipse/circle, one horizontal span per row (no antialiasing).
function pxEllipse(ctx: Ctx, cx: number, cy: number, rx: number, ry: number, c: string) {
  for (let dy = -ry; dy <= ry; dy++) {
    const half = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy / ry) ** 2)));
    if (half > 0) px(ctx, cx - half, cy + dy, half * 2, 1, c);
  }
}

// Two rows of checkerboard where one colour band meets the next, the classic
// pixel-art stand-in for a gradient.
function ditherSeam(ctx: Ctx, y: number, w: number, c: string) {
  for (let x = 0; x < w; x += 2) {
    px(ctx, x, y - 2, 1, 1, c);
    px(ctx, x + 1, y - 1, 1, 1, c);
  }
}

let battleBackdropCache: HTMLCanvasElement | null = null;
function getBattleBackdrop(): HTMLCanvasElement {
  if (battleBackdropCache) return battleBackdropCache;
  const W = BACKDROP_W, H = BACKDROP_H;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  // sky bands, light at the horizon, dithered where they meet
  const sky: Array<[number, string]> = [[0, '#8ecdec'], [80, '#9dd6ef'], [140, '#b3e1f4'], [180, '#cceaf7']];
  sky.forEach(([y, col], i) => px(ctx, 0, y, W, (sky[i + 1]?.[0] ?? 200) - y, col));
  sky.slice(1).forEach(([y, col]) => ditherSeam(ctx, y, W, col));
  // sun with a soft halo, upper left
  pxEllipse(ctx, 76, 46, 22, 22, '#fdf3c4');
  pxEllipse(ctx, 76, 46, 16, 16, '#fff7cf');
  pxEllipse(ctx, 76, 46, 11, 11, '#ffeda8');
  // pixel clouds: three puffs on a flat base, a shaded underside, a lit top edge
  const cloud = (cx: number, cy: number, s: number) => {
    const puffs: Array<[number, number, number]> = [[10, 8, 8], [22, 4, 11], [35, 8, 8]];
    for (const [ox, oy, r] of puffs) pxEllipse(ctx, cx + ox * s, cy + oy * s, r * s, r * s, '#ffffff');
    px(ctx, cx + 2 * s, cy + 8 * s, 41 * s, 7 * s, '#ffffff');
    px(ctx, cx + 3 * s, cy + 15 * s, 39 * s, 2 * s, '#dceef8');
    px(ctx, cx + 18 * s, cy - 6 * s, 6 * s, 1, '#ffffff');
  };
  cloud(186, 30, 2);
  cloud(420, 66, 1);
  cloud(520, 18, 2);
  cloud(36, 104, 1);
  // treeline: a pale far row, then a darker near row of rounded crowns
  for (let x = -4; x < W; x += 9) {
    const h = 14 + Math.floor(hash2(x, 7) * 12);
    pxEllipse(ctx, x + 5, 200 - h, 6, 6, '#7bb487');
    px(ctx, x, 200 - h, 11, h, '#7bb487');
  }
  for (let x = -6; x < W; x += 12) {
    const h = 8 + Math.floor(hash2(x, 19) * 10);
    pxEllipse(ctx, x + 7, 202 - h, 8, 7, '#5e9e6b');
    px(ctx, x, 202 - h, 15, h, '#5e9e6b');
    px(ctx, x + 3, 202 - h - 5, 4, 1, '#79bb86'); // sunlit crown edge
  }
  px(ctx, 0, 198, W, 4, '#6fae76');
  // ground: banded grass, darker toward the bottom edge
  const ground: Array<[number, string]> = [[200, '#8fc95e'], [252, '#7fbc52'], [308, '#6bb246']];
  ground.forEach(([y, col], i) => px(ctx, 0, y, W, (ground[i + 1]?.[0] ?? H) - y, col));
  ground.slice(1).forEach(([y, col]) => ditherSeam(ctx, y, W, col));
  // grass tufts: two blades and a root pixel, darker on the lower bands
  for (let i = 0; i < 140; i++) {
    const gx = Math.floor(hash2(i * 13, 3) * W);
    const gy = 206 + Math.floor(hash2(i * 7, 11) * 148);
    const col = gy < 252 ? '#7fbc52' : gy < 308 ? '#6aa947' : '#5da03c';
    px(ctx, gx, gy, 1, 3, col);
    px(ctx, gx + 2, gy + 1, 1, 2, col);
    px(ctx, gx + 1, gy + 2, 1, 1, col);
  }
  // combat platforms: dark rim, light pad, a lit patch and a rim highlight
  const platform = (cx: number, cy: number, rx: number, ry: number) => {
    pxEllipse(ctx, cx, cy + 3, rx, ry, '#4f8f33');
    pxEllipse(ctx, cx, cy + 1, rx, ry, '#5da03c');
    pxEllipse(ctx, cx, cy, rx - 4, ry - 4, '#a4d970');
    pxEllipse(ctx, cx - Math.round(rx * 0.15), cy - 2, Math.round(rx * 0.6), Math.round(ry * 0.5), '#b8e386');
    px(ctx, cx - Math.round(rx * 0.5), cy - ry + 3, Math.round(rx * 0.7), 1, '#c9eb9d');
  };
  platform(ENEMY_PAD.x, ENEMY_PAD.y, 104, 24); // enemy pad, floats against the horizon
  platform(PLAYER_PAD.x, PLAYER_PAD.y, 116, 28); // player pad, lower-left (above the text box)
  battleBackdropCache = c;
  return c;
}

// The backdrop at HD resolution (Scale3x), which is what the battle shows.
let battleBackdropHdCache: HTMLCanvasElement | null = null;
function getBattleBackdropHD(): HTMLCanvasElement {
  battleBackdropHdCache ??= upscale3(getBattleBackdrop());
  return battleBackdropHdCache;
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 7 — SOUND (tiny WebAudio chiptune blips)
   ═══════════════════════════════════════════════════════════════════════════ */

type MusicTrack = 'overworld' | 'battle' | 'boss';

/* Music loops. Notes are semitones from `lead` (melody, chord stabs) or
   `bass` (bassline); null = rest. Drums: one character per step, k kick ·
   s snare · h hat · . rest. Shorter parts repeat under longer ones. */
type MusicTrackDef = {
  bpm: number;
  lead: number;
  bass: number;
  melody: (number | null)[];
  bassline: (number | null)[];
  chords?: (number[] | null)[];
  drums?: string;
};

// Chord stabs on beats 2 and 4 of a bar of eighths.
const stabs = (...chords: number[][]) => chords.flatMap((c) => [null, null, c, null, null, null, c, null]);

const MUSIC_TRACKS: Record<MusicTrack, MusicTrackDef> = {
  // Town theme: an easygoing F major tune over I-vi-IV-V, soft stabs and hats.
  overworld: {
    bpm: 104,
    lead: 349.23, // F4
    bass: 87.31, // F2
    melody: [
      7, null, 4, 5, 7, null, 12, null,
      9, null, 7, 5, 4, null, 2, null,
      5, null, 2, 5, 9, null, 7, 5,
      4, null, 7, null, 2, null, null, null,
      7, null, 4, 5, 7, null, 12, 14,
      16, null, 14, 12, 9, null, 12, null,
      17, null, 14, 12, 14, null, 9, null,
      11, null, 12, null, 7, null, null, null,
    ],
    bassline: [
      0, null, 12, null, 7, null, 12, null,
      -3, null, 9, null, 4, null, 9, null,
      -7, null, 5, null, 0, null, 5, null,
      -5, null, 7, null, 2, null, 7, null,
    ],
    // F, Dm, Bb, C voiced close around F3-D4
    chords: stabs([-12, -8, -5], [-12, -8, -3], [-12, -7, -3], [-13, -10, -5]),
    drums: 'kh.hkh.h',
  },
  // Wild battle: an A minor riff over a pedal, climbing each bar, with a backbeat.
  battle: {
    bpm: 150,
    lead: 220, // A3
    bass: 110, // A2
    melody: [
      12, 0, 12, 10, 12, 7, 8, 7,
      12, 0, 12, 10, 12, 15, 14, 12,
      17, 5, 17, 15, 17, 12, 14, 15,
      19, 7, 19, 17, 15, 14, 12, 11,
    ],
    bassline: [
      0, null, 0, 12, 0, null, 0, 12,
      0, null, 0, 12, 0, null, 0, 12,
      5, null, 5, 17, 5, null, 5, 17,
      7, null, 7, 19, 7, null, 7, 19,
    ],
    drums: 'khshkhsh',
  },
  // GYM LEADER fight: faster, lower, a descending minor run over a driving bass
  boss: {
    bpm: 168,
    lead: 196, // G3
    bass: 98, // G2
    melody: [0, 3, 7, 10, 12, 10, 7, 3, 0, 3, 8, 7, 5, 3, 2, -2],
    bassline: [0, 0, 0, 12, -2, -2, -2, 10, -4, -4, -4, 8, -5, -5, 7, -5],
    drums: 'kkshkhsh',
  },
};

class SFX {
  private ctx: AudioContext | null = null;
  muted = false;
  private ensure(): AudioContext | null {
    if (this.muted) return null;
    try {
      if (!this.ctx) this.ctx = new AudioContext();
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }
  private tone(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.04, when = 0) {
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
  blip() { this.tone(1250, 0.035, 'square', 0.02); }
  select() { this.tone(880, 0.03, 'square', 0.025); }
  confirm() { this.tone(660, 0.06); this.tone(990, 0.08, 'square', 0.04, 0.06); }
  bump() { this.tone(110, 0.07, 'triangle', 0.06); }
  door() { this.tone(520, 0.07); this.tone(330, 0.1, 'square', 0.04, 0.07); }
  rustle() { this.tone(220, 0.04, 'triangle', 0.03); this.tone(180, 0.04, 'triangle', 0.03, 0.04); }
  badge() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.12, 'square', 0.05, i * 0.11)); }
  save() { this.tone(784, 0.08); this.tone(1175, 0.14, 'square', 0.04, 0.09); }
  encounter() { [220, 180, 140].forEach((f, i) => this.tone(f, 0.1, 'square', 0.05, i * 0.09)); }
  hit() { this.tone(140, 0.05, 'square', 0.07); }
  // Two-part attack: a quick sawtooth "whoosh" (wind-up) then a punchy low
  // "crack" ~120ms later, timed to land with the lunge's contact frame.
  attack() {
    this.tone(720, 0.05, 'sawtooth', 0.03);
    this.tone(520, 0.05, 'sawtooth', 0.03, 0.045);
    this.tone(165, 0.09, 'square', 0.08, 0.12);
    this.tone(90, 0.12, 'triangle', 0.06, 0.14);
  }
  faint() { [330, 262, 196, 131].forEach((f, i) => this.tone(f, 0.12, 'triangle', 0.05, i * 0.1)); }
  catchStart() { this.tone(440, 0.06, 'square', 0.04); this.tone(392, 0.06, 'square', 0.04, 0.08); }
  catchThrow() { this.tone(340, 0.05, 'square', 0.04); this.tone(520, 0.06, 'square', 0.04, 0.05); this.tone(720, 0.06, 'square', 0.04, 0.1); }
  catchTick() { this.tone(900, 0.03, 'square', 0.045); this.tone(600, 0.03, 'square', 0.03, 0.02); }
  catchWin() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, 0.13, 'square', 0.05, i * 0.1)); }
  catchFail() { this.tone(300, 0.1, 'square', 0.05); this.tone(180, 0.16, 'square', 0.05, 0.09); }
  // a trainer locks eyes with you: two sharp rising stabs
  spotted() { this.tone(988, 0.07, 'square', 0.05); this.tone(1319, 0.12, 'square', 0.05, 0.08); }

  /* ——— Background music: original chiptune loops on an eighth-note grid,
     scheduled with a lookahead clock. Voices: a soft 25% pulse lead, a
     triangle bass, quiet pulse chord stabs and a small noise/sine drum kit
     (see MUSIC_TRACKS). ——— */
  private musicTimer: number | null = null;
  private musicTrack: MusicTrack | null = null;
  private musicGain: GainNode | null = null;
  private pulseWave: PeriodicWave | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private step = 0;
  private nextNoteTime = 0;

  // 25% duty pulse: rounder and softer than a plain square wave
  private pulse(ctx: AudioContext): PeriodicWave {
    if (!this.pulseWave) {
      const n = 32;
      const real = new Float32Array(n);
      const imag = new Float32Array(n);
      for (let k = 1; k < n; k++) real[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * 0.25);
      this.pulseWave = ctx.createPeriodicWave(real, imag);
    }
    return this.pulseWave;
  }

  private playAt(freq: number, dur: number, type: OscillatorType | 'pulse', vol: number, at: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    if (type === 'pulse') osc.setPeriodicWave(this.pulse(ctx));
    else osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(vol, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    // Route music voices through the per-track master gain so stopMusic can
    // silence the whole loop (including the ~130ms lookahead already queued)
    // in one ramp; SFX one-shots still go straight to the destination.
    osc.connect(gain).connect(this.musicGain ?? ctx.destination);
    osc.start(at);
    osc.stop(at + dur + 0.02);
  }

  // k: sine kick swept down in pitch · s: band-passed noise snare · h: high-passed noise hat
  private drum(kind: string, at: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const out = this.musicGain ?? ctx.destination;
    if (kind === 'k') {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, at);
      osc.frequency.exponentialRampToValueAtTime(45, at + 0.12);
      g.gain.setValueAtTime(0.07, at);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
      osc.connect(g).connect(out);
      osc.start(at);
      osc.stop(at + 0.18);
      return;
    }
    if (!this.noiseBuffer) {
      const len = Math.floor(ctx.sampleRate * 0.3);
      this.noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      const rnd = mulberry32(0x5eed);
      for (let i = 0; i < len; i++) data[i] = rnd() * 2 - 1;
    }
    const hat = kind === 'h';
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = hat ? 'highpass' : 'bandpass';
    filter.frequency.setValueAtTime(hat ? 7000 : 1800, at);
    const g = ctx.createGain();
    const len = hat ? 0.04 : 0.12;
    g.gain.setValueAtTime(hat ? 0.012 : 0.035, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    src.connect(filter).connect(g).connect(out);
    src.start(at);
    src.stop(at + len + 0.02);
  }

  private scheduler = () => {
    const ctx = this.ctx;
    if (!ctx || this.musicTrack === null || this.muted) return;
    const t = MUSIC_TRACKS[this.musicTrack];
    const stepDur = 60 / t.bpm / 2; // eighth-note grid
    // If the tab was throttled, don't schedule a burst of notes in the past.
    if (this.nextNoteTime < ctx.currentTime) this.nextNoteTime = ctx.currentTime + 0.02;
    while (this.nextNoteTime < ctx.currentTime + 0.13) {
      const at = this.nextNoteTime;
      const i = this.step % t.melody.length;
      const m = t.melody[i];
      if (m !== null) this.playAt(t.lead * 2 ** (m / 12), stepDur * 0.9, 'pulse', 0.032, at);
      const b = t.bassline[i % t.bassline.length];
      if (b !== null) this.playAt(t.bass * 2 ** (b / 12), stepDur * 1.4, 'triangle', 0.055, at);
      const chord = t.chords?.[i % t.chords.length];
      if (chord) for (const n of chord) this.playAt(t.lead * 2 ** (n / 12), stepDur * 1.6, 'pulse', 0.011, at);
      const hit = t.drums?.[i % t.drums.length];
      if (hit && hit !== '.') this.drum(hit, at);
      this.nextNoteTime += stepDur;
      this.step += 1;
    }
  };

  startMusic(track: MusicTrack) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    if (this.musicTrack === track && this.musicTimer !== null) return;
    this.stopMusic();
    this.musicTrack = track;
    this.musicGain = ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.9, ctx.currentTime);
    this.musicGain.connect(ctx.destination);
    this.step = 0;
    this.nextNoteTime = ctx.currentTime + 0.06;
    this.musicTimer = window.setInterval(this.scheduler, 25);
  }

  stopMusic() {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    this.musicTrack = null;
    // Fade the master node to zero over 30ms so already-queued lookahead notes
    // are cut cleanly (no click), then disconnect it.
    const g = this.musicGain;
    this.musicGain = null;
    if (g && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        g.gain.cancelScheduledValues(now);
        g.gain.setValueAtTime(g.gain.value, now);
        g.gain.linearRampToValueAtTime(0, now + 0.03);
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        try {
          g.disconnect();
        } catch {
          /* ignore */
        }
      }, 80);
    }
  }

  get currentTrack() {
    return this.musicTrack;
  }
}
const sfx = new SFX();

/* ═══════════════════════════════════════════════════════════════════════════
   § 8 — SAVE / LOAD
   ═══════════════════════════════════════════════════════════════════════════ */

const SAVE_KEY = 'portfolio-town-save-v1';
// Fields added after v1 shipped are optional so older saves still load.
type SaveData = {
  map: string; x: number; y: number; facing: Dir;
  badges: string[]; muted: boolean; bugsDefeated: number; caughtBugs: string[];
  partyHp?: Record<string, number>;
  defeatedTrainers?: string[];
  seen?: string[]; // dialogue ids opened at least once (drives TOWN TASKS)
};

function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as SaveData;
    if (!MAPS[s.map]) return null;
    return s;
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 9 — RUNTIME ENTITY STATE (mutated in refs, rendered imperatively)
   ═══════════════════════════════════════════════════════════════════════════ */

type MoveTween = { from: Vec; to: Vec; start: number; dur: number } | null;
type Entity = {
  tile: Vec;
  facing: Dir;
  move: MoveTween;
  stepParity: number;
};
// approachSteps > 0: a trainer that spotted the player is walking over; when the
// last step lands the main loop calls back to open the challenge.
type NPCRuntime = Entity & { def: NPCDef; home: Vec; nextThink: number; paused: boolean; approachSteps: number; approaching: boolean };
type EntityEls = { el: HTMLDivElement | null; canvas: HTMLCanvasElement | null };

function makeEntity(x: number, y: number, facing: Dir): Entity {
  return { tile: { x, y }, facing, move: null, stepParity: 0 };
}

function entityPixelPos(e: Entity, now: number): Vec {
  if (!e.move) return { x: e.tile.x * TILE, y: e.tile.y * TILE };
  const p = Math.min(1, (now - e.move.start) / e.move.dur);
  return {
    x: (e.move.from.x + (e.move.to.x - e.move.from.x) * p) * TILE,
    y: (e.move.from.y + (e.move.to.y - e.move.from.y) * p) * TILE,
  };
}

// zoom = device pixels per art pixel; mid-step positions snap to that grid so
// a walking sprite never lands between screen pixels.
function blitEntity(e: Entity, els: EntityEls, palette: string, now: number, zoom: number) {
  if (!els.el || !els.canvas) return;
  const pos = entityPixelPos(e, now);
  const snap = (v: number) => Math.round(v * zoom) / zoom;
  // sprite is 20px tall on a 16px tile — anchor feet to the tile bottom
  els.el.style.transform = `translate3d(${snap(pos.x)}px, ${snap(pos.y - 4)}px, 0)`;
  els.el.style.zIndex = String(10 + Math.round(pos.y / TILE));
  let frame = 0;
  if (e.move) {
    const p = (now - e.move.start) / e.move.dur;
    frame = p < 0.6 ? (e.stepParity % 2 === 0 ? 1 : 2) : 0;
  }
  const key = `${palette}|${e.facing}|${frame}`;
  // The frame key lives on the canvas element itself, so a freshly remounted
  // (blank) canvas is always redrawn even if the entity state didn't change.
  if (els.canvas.dataset.frame !== key) {
    els.canvas.dataset.frame = key;
    const ctx = els.canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
      ctx.drawImage(getSpriteFrame(palette, e.facing, frame), 0, 0);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 10 — UI COMPONENTS (Tailwind, pixel-styled)
   ═══════════════════════════════════════════════════════════════════════════ */

function TypewriterPage({ text, done, onDone }: { text: string; done: boolean; onDone: () => void }) {
  const [count, setCount] = useState(done || reducedMotion ? text.length : 0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    if (done) {
      setCount(text.length);
      return;
    }
    setCount(reducedMotion ? text.length : 0);
    if (reducedMotion) {
      onDoneRef.current();
      return;
    }
    let i = 0;
    const iv = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i % 3 === 0) sfx.blip();
      if (i >= text.length) {
        window.clearInterval(iv);
        onDoneRef.current();
      }
    }, 24);
    return () => window.clearInterval(iv);
  }, [text, done]);
  return <span>{text.slice(0, count)}</span>;
}

function DialogueBox({
  spec,
  page,
  typed,
  setTyped,
  actionIdx,
  onAdvance,
  onAction,
  touchMode,
}: {
  spec: DialogueSpec;
  page: number;
  typed: boolean;
  setTyped: (b: boolean) => void;
  actionIdx: number;
  onAdvance: () => void;
  onAction: (a: DialogueAction) => void;
  touchMode: boolean;
}) {
  const isLast = page >= spec.pages.length - 1;
  const showActions = isLast && typed && (spec.actions?.length ?? 0) > 0;
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 38 }}
      className={`absolute inset-x-2 sm:inset-x-0 sm:mx-auto sm:w-[620px] max-w-full z-30 ${touchMode ? 'bottom-36' : 'bottom-4'}`}
      onClick={onAdvance}
      role="dialog"
      aria-label={`${spec.speaker} says`}
    >
      <div className="rpg-frame px-5 py-4 cursor-pointer selectable">
        <div className="inline-block -mt-8 mb-1 px-3 py-1.5 text-[9px] sm:text-[10px] bg-[#2b2340] text-amber-300 border-2 border-[#f8f6ee] shadow-[3px_3px_0_rgba(11,15,20,0.5)]">
          {spec.speaker}
        </div>
        <p className="text-[10px] sm:text-[11px] leading-[1.9] min-h-[5.7em] sm:min-h-[3.8em]">
          <TypewriterPage text={spec.pages[page]} done={typed} onDone={() => setTyped(true)} />
        </p>
        <div className="flex items-end justify-between gap-2 mt-1">
          {showActions ? (
            <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
              {spec.actions!.map((a, i) => (
                <button
                  key={a.label}
                  onClick={() => onAction(a)}
                  className={`px-2.5 py-1.5 text-[9px] border-2 transition-none ${
                    i === actionIdx
                      ? 'bg-[#2b2340] text-amber-300 border-[#2b2340]'
                      : 'bg-transparent text-[#2b2340] border-[#2b2340] hover:bg-[#2b234015]'
                  }`}
                >
                  {i === actionIdx ? '▶ ' : ''}{a.label}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-[8px] text-[#2b234088]">{touchMode ? 'TAP' : 'E'} ▸</span>
          )}
          {typed && !showActions && (
            <motion.span
              animate={reducedMotion ? undefined : { opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.9 }}
              className="text-[12px] text-[#2b2340]"
            >
              ▼
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function PartyHUD({ onOpen, partyHp }: { onOpen: () => void; partyHp: Record<string, number> }) {
  const hurt = portfolioData.skills.party.some((s) => (partyHp[s.name] ?? skillMaxHp(s.lv)) < skillMaxHp(s.lv));
  return (
    <div className="absolute left-2 top-2 z-20 flex flex-col gap-1" aria-label="Skill party">
      {portfolioData.skills.party.map((s) => {
        const max = skillMaxHp(s.lv);
        const hp = Math.max(0, Math.min(max, partyHp[s.name] ?? max));
        const frac = (hp / max) * 100;
        const fainted = hp <= 0;
        return (
          <button
            key={s.name}
            onClick={onOpen}
            className={`group flex items-center gap-1.5 rpg-frame-dark px-1.5 py-1 hover:brightness-125 cursor-pointer ${fainted ? 'opacity-45' : ''}`}
            title={`${s.name} — Lv.${s.lv} ${s.type} — HP ${hp}/${max}`}
          >
            <span
              className="w-5 h-5 grid place-items-center text-[7px] border-2"
              style={{ background: s.color, borderColor: '#10131c', color: '#10131c' }}
            >
              {s.abbr}
            </span>
            <span className="hidden md:flex flex-col w-20">
              <span className="text-[7px] text-left leading-tight">
                {s.name} {fainted ? <span className="text-red-400">KO</span> : <span className="text-amber-300">{hp}/{max}</span>}
              </span>
              <span className="h-1.5 mt-0.5 w-full bg-[#10131c] border border-[#3d4663]">
                <span className="block h-full transition-all" style={{ width: `${frac}%`, background: frac > 50 ? '#4ade80' : frac > 20 ? '#fbbf24' : '#f87171' }} />
              </span>
            </span>
          </button>
        );
      })}
      {hurt && (
        <div className="rpg-frame-dark px-1.5 py-1 text-[6px] text-red-300 md:w-[104px] leading-tight">♥ party hurt — visit HEAL CENTER</div>
      )}
    </div>
  );
}

// TOWN TASKS: a suggested route through the portfolio, shown in the BACKPACK
// and as a HUD counter. Progress is derived from what the player has opened.
type TaskProgress = { seen: string[]; badges: string[]; caughtBugs: string[] };
const TOWN_TASKS: { label: string; done: (p: TaskProgress) => boolean }[] = [
  { label: 'Read the PC in the ABOUT-ME HOUSE', done: (p) => p.seen.includes('pc') },
  { label: 'View an exhibit in the PROJECT GALLERY', done: (p) => p.seen.some((s) => s.startsWith('project_')) },
  { label: 'Read a plaque in the CAREER HALL', done: (p) => p.seen.some((s) => s.startsWith('job_')) },
  { label: 'Beat the GYM LEADER for the BACKEND BADGE', done: (p) => p.badges.includes('BACKEND BADGE') },
  { label: 'File 3 bugs in your BUGDEX', done: (p) => p.caughtBugs.length >= 3 },
  { label: 'Check the MAILBOX outside the house', done: (p) => p.seen.includes('mailbox') },
];

const BACKPACK_TABS = ['PROFILE', 'TASKS', 'SKILLS', 'PROJECTS', 'BUGDEX', 'CONTACT'] as const;
type BackpackTab = (typeof BACKPACK_TABS)[number];

function Backpack({
  onClose,
  initialTab,
  tasks,
  badges,
  bugsDefeated,
  caughtBugs,
  muted,
  onToggleMute,
  onSave,
  onClassicView,
}: {
  onClose: () => void;
  initialTab?: BackpackTab;
  tasks: { label: string; done: boolean }[];
  badges: string[];
  bugsDefeated: number;
  caughtBugs: string[];
  muted: boolean;
  onToggleMute: () => void;
  onSave: () => void;
  onClassicView: () => void;
}) {
  const tabs = BACKPACK_TABS;
  const [tab, setTab] = useState<BackpackTab>(initialTab ?? 'PROFILE');
  const cvHref = import.meta.env.BASE_URL + portfolioData.contact.cvFile;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 bg-[#0b0f14cc] grid place-items-center p-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 12 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="rpg-frame w-full max-w-2xl max-h-[86vh] flex flex-col selectable"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Backpack menu"
      >
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="text-[11px]">🎒 BACKPACK</span>
          <button onClick={onClose} className="px-2 py-1 text-[9px] border-2 border-[#2b2340] hover:bg-[#2b2340] hover:text-amber-300">
            ✕ CLOSE
          </button>
        </div>
        <div className="flex gap-1 px-4 pt-3 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2.5 py-1.5 text-[9px] border-2 border-[#2b2340] ${tab === t ? 'bg-[#2b2340] text-amber-300' : 'hover:bg-[#2b234015]'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="rpg-scroll p-4 text-[10px] leading-[1.9] grow">
          {tab === 'PROFILE' && (
            <div>
              <p className="text-[12px]">{portfolioData.name}</p>
              <p className="text-[9px] text-[#2b2340aa] mt-1">{portfolioData.role}</p>
              <p className="mt-3">{portfolioData.about.join(' ')}</p>
              <p className="mt-4 text-[9px]">🐛 BUGS SQUASHED: <span className="text-amber-600">{bugsDefeated}</span></p>
              <p className="mt-4 text-[9px]">BADGES EARNED:</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {badges.length === 0 && <span className="text-[9px] text-[#2b234088]">None yet — challenge the SKILLS GYM leader!</span>}
                {badges.map((b) => (
                  <span key={b} className="px-2 py-1 text-[8px] bg-amber-400 border-2 border-[#2b2340]">★ {b}</span>
                ))}
              </div>
              <p className="mt-4 text-[9px]">EXPERIENCE:</p>
              {portfolioData.experience.map((e) => (
                <p key={e.role + e.company} className="mt-1">▸ {e.role} @ {e.company} <span className="text-[#2b234088]">({e.period})</span></p>
              ))}
              <p className="mt-4 text-[9px]">EDUCATION:</p>
              {portfolioData.education.map((ed) => (
                <p key={ed.school} className="mt-1">▸ {ed.degree}, {ed.school} <span className="text-[#2b234088]">({ed.period})</span></p>
              ))}
              <p className="mt-4 text-[9px]">LANGUAGES:</p>
              <p className="mt-1">{portfolioData.languages.join(' · ')}</p>
              <a
                href={cvHref}
                download={portfolioData.contact.cvFile}
                className="inline-block mt-4 px-3 py-2 text-[9px] bg-amber-400 border-2 border-[#2b2340] shadow-[3px_3px_0_#2b2340] active:translate-y-0.5 active:shadow-none"
              >
                ⬇ DOWNLOAD CV (PDF)
              </a>
            </div>
          )}
          {tab === 'TASKS' && (
            <div>
              <p className="text-[9px]">
                TOWN TASKS: <span className="text-amber-600">{tasks.filter((t) => t.done).length}/{tasks.length}</span>
              </p>
              <p className="text-[8px] text-[#2b234088] mt-1">A suggested route through the portfolio. Short on time? The PROFILE tab has the CV download.</p>
              <ul className="mt-3 grid gap-2.5">
                {tasks.map((t) => (
                  <li key={t.label} className={`flex items-start gap-2 text-[9px] ${t.done ? 'text-[#2b234088]' : ''}`}>
                    <span
                      className="shrink-0 w-3.5 h-3.5 border-2 border-[#2b2340] grid place-items-center text-[7px] leading-none"
                      style={{ background: t.done ? '#fbbf24' : 'transparent' }}
                      aria-label={t.done ? 'done' : 'not done'}
                    >
                      {t.done ? '✓' : ''}
                    </span>
                    <span className={t.done ? 'line-through' : ''}>{t.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'SKILLS' && (
            <div>
              {Object.entries(portfolioData.skills.groups).map(([k, g]) => (
                <div key={k} className="mb-3">
                  <p className="text-[10px]">{k.toUpperCase()} <span className="text-amber-600">[{g.level}]</span></p>
                  <p className="text-[9px] mt-0.5">{g.items.join(' · ')}</p>
                </div>
              ))}
              <p className="text-[9px] mt-4">KEY COMPETENCIES:</p>
              <ul className="mt-1">
                {portfolioData.skills.competencies.map((c) => (
                  <li key={c} className="text-[9px]">▸ {c}</li>
                ))}
              </ul>
              <div className="flex gap-1.5 flex-wrap mt-3">
                {portfolioData.skills.badges.map((b) => (
                  <span key={b} className="px-1.5 py-0.5 text-[8px] border border-[#2b2340]">{b}</span>
                ))}
              </div>
            </div>
          )}
          {tab === 'PROJECTS' && (
            <div className="grid gap-3">
              {portfolioData.projects.map((p) => (
                <div key={p.title} className="border-2 border-[#2b2340] p-3">
                  <p className="text-[10px]" style={{ color: '#2b2340' }}>
                    <span className="inline-block w-2.5 h-2.5 mr-1.5 border border-[#2b2340] align-middle" style={{ background: p.screenColor }} />
                    {p.title} <span className="text-[8px] text-[#2b234088]">— {p.subtitle}</span>
                  </p>
                  <p className="text-[9px] mt-1.5">{p.blurb}</p>
                  <p className="text-[8px] mt-1.5 text-[#2b2340aa]">{p.tech.join(' · ')}</p>
                  <div className="flex gap-2 mt-2">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-[8px] border-2 border-[#2b2340] hover:bg-[#2b2340] hover:text-amber-300">
                        GITHUB ↗
                      </a>
                    )}
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-[8px] border-2 border-[#2b2340] hover:bg-[#2b2340] hover:text-amber-300">
                        LIVE ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'BUGDEX' && (
            <div>
              <p className="text-[9px]">
                WILD BUGS PATCHED: <span className="text-amber-600">{caughtBugs.length}/{BUG_SPECIES.length}</span>
              </p>
              <p className="text-[8px] text-[#2b234088] mt-1">Weaken a wild bug in the tall grass, then toss a DEBUGGER from your BAG to file it here.</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {BUG_SPECIES.map((s) => {
                  const owned = caughtBugs.includes(s.id);
                  return (
                    <div key={s.id} className={`flex items-center gap-2 border-2 p-2 ${owned ? 'border-[#2b2340]' : 'border-[#2b234040]'}`}>
                      <canvas
                        ref={(el) => {
                          const ctx = el?.getContext('2d');
                          if (ctx && el && el.dataset.painted !== '1') {
                            el.dataset.painted = '1';
                            ctx.drawImage(getBugSprite(s), 0, 0);
                            if (!owned) {
                              // silhouette: darken un-filed entries
                              ctx.globalCompositeOperation = 'source-atop';
                              ctx.fillStyle = 'rgba(43,35,64,0.86)';
                              ctx.fillRect(0, 0, BUG_W * HD, BUG_H * HD);
                            }
                          }
                        }}
                        width={BUG_W * HD}
                        height={BUG_H * HD}
                        className="pixelated shrink-0"
                        style={{ width: BUG_W * HD, height: BUG_H * HD }}
                      />
                      <span className="text-[8px] leading-tight">
                        {owned ? s.name : '???'}
                        {owned && s.weakTo && <span className="block text-[7px] text-[#2b234099] mt-0.5">WEAK: {s.weakTo.join('/')}</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {tab === 'CONTACT' && (
            <div>
              <p>Open to backend roles, collaborations, and interesting challenges. Usually replies within a day.</p>
              <a href={`mailto:${portfolioData.contact.email}`} className="inline-block mt-3 px-3 py-2 text-[9px] bg-amber-400 border-2 border-[#2b2340] shadow-[3px_3px_0_#2b2340] active:translate-y-0.5 active:shadow-none">
                ✉ {portfolioData.contact.email}
              </a>
              <div className="flex gap-2 mt-3">
                {portfolioData.contact.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 text-[9px] border-2 border-[#2b2340] hover:bg-[#2b2340] hover:text-amber-300">
                    {s.label.toUpperCase()} ↗
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 px-4 pb-3 pt-2 border-t-2 border-[#2b234030]">
          <button onClick={onSave} className="px-2.5 py-1.5 text-[9px] border-2 border-[#2b2340] hover:bg-[#2b2340] hover:text-amber-300">
            ◼ SAVE GAME
          </button>
          <button onClick={onToggleMute} className="px-2.5 py-1.5 text-[9px] border-2 border-[#2b2340] hover:bg-[#2b2340] hover:text-amber-300">
            {muted ? '🔇 SOUND: OFF' : '🔊 SOUND: ON'}
          </button>
          <button onClick={onClassicView} className="px-2.5 py-1.5 text-[9px] border-2 border-[#2b2340] hover:bg-[#2b2340] hover:text-amber-300" title="Read as a plain page">
            📄 CLASSIC VIEW
          </button>
          <span className="ml-auto text-[8px] text-[#2b234066]">M / ESC to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Compact sound on/off toggle, reused on the title, HUD and battle screen so
// audio can always be silenced from wherever the player is.
function MuteButton({ muted, onToggle, className }: { muted: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      onClick={onToggle}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      title={muted ? 'Sound off — click to unmute' : 'Sound on — click to mute'}
      className={`rpg-frame-dark px-2.5 py-2 text-[11px] leading-none hover:brightness-125 ${className ?? ''}`}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}

// Recruiter escape hatch: a readable, non-game "classic" portfolio page over
// the whole app. Uses a legible sans-serif for long-form copy (Press Start 2P
// is exhausting past a headline), with pixel-styled section chips for accent.
function ClassicView({ onClose }: { onClose: () => void }) {
  const d = portfolioData;
  const cvHref = import.meta.env.BASE_URL + d.contact.cvFile;
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  // Move focus into the overlay on open and close it with Escape, so keyboard
  // users aren't stranded tabbing through controls hidden behind it.
  useEffect(() => {
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const Chip = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-block px-2 py-1 text-[9px] bg-[#2b2340] text-amber-300 border-2 border-[#f8f6ee] shadow-[2px_2px_0_rgba(11,15,20,0.4)]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      {children}
    </span>
  );
  return (
    <motion.div
      // Opaque on mount (no entrance opacity fade) so the game/title behind
      // never bleeds through; only the exit fades back to the game.
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-[60] bg-[#0b0f14] overflow-y-auto rpg-scroll selectable"
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" }}
      role="dialog"
      aria-label="Classic portfolio view"
    >
      <div className="max-w-3xl mx-auto px-5 py-8 text-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{d.name}</h1>
            <p className="mt-1 text-amber-300 text-base sm:text-lg">{d.role}</p>
            <p className="mt-1 text-slate-400 text-sm">{d.tagline}</p>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="shrink-0 px-3 py-2 text-[9px] bg-[#1c2233] text-amber-300 border-2 border-[#3d4663] hover:brightness-125"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
            aria-label="Close and return to the game"
          >
            ✕ GAME
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a href={cvHref} download={d.contact.cvFile} className="px-4 py-2.5 rounded bg-amber-400 text-[#1a1526] font-semibold text-sm hover:bg-amber-300">
            ⬇ Download CV (PDF)
          </a>
          <a href={`mailto:${d.contact.email}`} className="px-4 py-2.5 rounded border border-[#3d4663] text-slate-200 text-sm hover:bg-[#1c2233]">
            ✉ {d.contact.email}
          </a>
          {d.contact.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded border border-[#3d4663] text-slate-200 text-sm hover:bg-[#1c2233]">
              {s.label} ↗
            </a>
          ))}
        </div>

        <section className="mt-9">
          <Chip>ABOUT</Chip>
          <div className="mt-3 space-y-2 text-slate-300 text-sm leading-relaxed">
            {d.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section className="mt-9">
          <Chip>EXPERIENCE</Chip>
          <div className="mt-3 space-y-4">
            {d.experience.map((e) => (
              <div key={e.role + e.company} className="border-l-2 border-amber-400/60 pl-4">
                <p className="text-white font-semibold text-sm">
                  {e.role} <span className="text-slate-400 font-normal">— {e.company}</span>
                </p>
                <p className="text-slate-500 text-xs">{e.period}</p>
                <ul className="mt-1 space-y-1 text-slate-300 text-sm leading-relaxed">
                  {e.highlights.map((h) => (
                    <li key={h}>• {h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-9">
          <Chip>EDUCATION</Chip>
          <div className="mt-3 space-y-2">
            {d.education.map((ed) => (
              <p key={ed.school} className="text-sm text-slate-300">
                <span className="text-white font-semibold">{ed.degree}</span> — {ed.school} <span className="text-slate-500 text-xs">· {ed.period}</span>
              </p>
            ))}
          </div>
          <div className="mt-4">
            <Chip>LANGUAGES</Chip>
            <p className="mt-3 text-sm text-slate-300">{d.languages.join(' · ')}</p>
          </div>
        </section>

        <section className="mt-9">
          <Chip>SKILLS</Chip>
          <div className="mt-3 grid sm:grid-cols-3 gap-4">
            {Object.entries(d.skills.groups).map(([k, g]) => (
              <div key={k} className="rounded border border-[#3d4663] p-3">
                <p className="text-white font-semibold text-sm capitalize">
                  {k} <span className="text-amber-400 text-xs">· {g.level}</span>
                </p>
                <ul className="mt-2 space-y-1 text-slate-300 text-xs leading-relaxed">
                  {g.items.map((it) => (
                    <li key={it}>› {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {d.skills.badges.map((b) => (
              <span key={b} className="px-2.5 py-1 rounded-full text-xs bg-[#1c2233] border border-[#3d4663] text-slate-300">
                {b}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-9">
          <Chip>PROJECTS</Chip>
          <div className="mt-3 grid sm:grid-cols-2 gap-4">
            {d.projects.map((p) => (
              <div key={p.title} className="rounded border border-[#3d4663] p-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm border border-[#3d4663]" style={{ background: p.screenColor }} />
                  <p className="text-white font-semibold text-sm">{p.title}</p>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">{p.subtitle}</p>
                <p className="mt-2 text-slate-300 text-sm leading-relaxed">{p.blurb}</p>
                <ul className="mt-2 space-y-1 text-slate-400 text-xs leading-relaxed">
                  {p.achievements.map((a) => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
                <p className="mt-2 text-slate-500 text-xs">{p.tech.join(' · ')}</p>
                <div className="mt-2 flex gap-3">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-amber-300 text-xs hover:underline">
                      GitHub ↗
                    </a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-amber-300 text-xs hover:underline">
                      Live demo ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-slate-500 text-xs">
          Prefer the fun way? <button onClick={onClose} className="text-amber-300 hover:underline">Play the portfolio →</button>
        </p>
      </div>
    </motion.div>
  );
}

function TitleScreen({
  hasSave,
  onStart,
  onClassicView,
  muted,
  onToggleMute,
}: {
  hasSave: boolean;
  onStart: (cont: boolean) => void;
  onClassicView: () => void;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const options = hasSave ? ['CONTINUE', 'NEW GAME'] : ['NEW GAME'];
  const [idx, setIdx] = useState(0);
  const spriteRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    let f = 0;
    const iv = window.setInterval(() => {
      f = (f + 1) % 4;
      const ctx = spriteRef.current?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, SPRITE_W * HD, SPRITE_H * HD);
        ctx.drawImage(getSpriteFrame('player', 'down', f === 1 ? 1 : f === 3 ? 2 : 0), 0, 0);
      }
    }, 220);
    return () => window.clearInterval(iv);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setIdx((i) => Math.max(0, i - 1));
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') setIdx((i) => Math.min(options.length - 1, i + 1));
      else if (e.key === 'Enter' || e.key === 'e' || e.key === 'E' || e.key === ' ') {
        e.preventDefault();
        sfx.confirm();
        onStart(options[idx] === 'CONTINUE');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, options, onStart]);
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-50 bg-[#0b0f14] grid place-items-center p-4"
    >
      <div className="absolute right-3 top-3">
        <MuteButton muted={muted} onToggle={onToggleMute} />
      </div>
      <div className="text-center">
        <motion.p
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-amber-300 text-[10px] tracking-widest"
        >
          {portfolioData.name.toUpperCase()} PRESENTS
        </motion.p>
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 22 }}
          className="mt-4 text-2xl sm:text-4xl text-white leading-snug [text-shadow:4px_4px_0_#14877a]"
        >
          PORTFOLIO
          <br />
          TOWN
        </motion.h1>
        <p className="mt-3 text-[8px] sm:text-[9px] text-slate-400">A PLAYABLE PORTFOLIO — {portfolioData.role.toUpperCase()}</p>
        <canvas ref={spriteRef} width={SPRITE_W * HD} height={SPRITE_H * HD} className="pixelated mx-auto mt-6 w-24 h-[120px]" />
        <div className="mt-6 inline-block rpg-frame-dark px-6 py-4 text-left">
          {options.map((o, i) => (
            <button
              key={o}
              className="block text-[10px] py-1.5 w-full text-left"
              onClick={() => {
                sfx.confirm();
                onStart(o === 'CONTINUE');
              }}
              onMouseEnter={() => setIdx(i)}
            >
              <span className={i === idx ? 'text-amber-300' : 'text-transparent'}>▶ </span>
              <span className={i === idx ? 'text-amber-300' : 'text-slate-300'}>{o}</span>
            </button>
          ))}
        </div>
        <motion.p
          animate={reducedMotion ? undefined : { opacity: [1, 0.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="mt-5 text-[8px] text-slate-500"
        >
          PRESS ENTER / TAP TO START
        </motion.p>
        <p className="mt-4 text-[7px] text-slate-600 leading-relaxed">
          WASD / ARROWS — MOVE · E — INTERACT · SHIFT — RUN · M — BACKPACK
        </p>
        <button
          onClick={onClassicView}
          className="mt-5 text-[9px] text-amber-300 hover:text-amber-200 underline underline-offset-4 decoration-dotted"
        >
          In a hurry? View as a classic CV page →
        </button>
      </div>
    </motion.div>
  );
}

function DPad({ onDir, onStop, onA, onB }: { onDir: (d: Dir) => void; onStop: (d: Dir) => void; onA: () => void; onB: (down: boolean) => void }) {
  const btn = 'absolute grid place-items-center bg-[#1c2233ee] border-2 border-[#3d4663] text-slate-300 text-[12px] active:bg-[#3d4663] select-none touch-none';
  const hold = (dir: Dir) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      // Movement must register even if pointer capture isn't available/throws
      // (seen on some mobile browsers) — capture is a nice-to-have (keeps this
      // button receiving pointerup/cancel if the finger drifts off it), not a
      // prerequisite for the direction actually taking effect.
      onDir(dir);
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore — see above
      }
    },
    onPointerUp: () => onStop(dir),
    onPointerCancel: () => onStop(dir),
  });
  return (
    <div className="absolute inset-x-0 bottom-0 z-[35] h-36 pointer-events-none select-none">
      <div className="absolute left-4 bottom-5 w-32 h-32 pointer-events-auto">
        <button aria-label="Up" className={`${btn} left-11 top-0 w-10 h-10`} {...hold('up')}>▲</button>
        <button aria-label="Left" className={`${btn} left-0 top-11 w-10 h-10`} {...hold('left')}>◀</button>
        <button aria-label="Right" className={`${btn} left-[88px] top-11 w-10 h-10`} {...hold('right')}>▶</button>
        <button aria-label="Down" className={`${btn} left-11 top-[88px] w-10 h-10`} {...hold('down')}>▼</button>
      </div>
      <div className="absolute right-4 bottom-6 pointer-events-auto flex items-end gap-3">
        <button
          aria-label="Run (hold)"
          className="w-11 h-11 rounded-full bg-[#1c2233ee] border-2 border-[#3d4663] text-slate-300 text-[9px] active:bg-[#3d4663] touch-none"
          onPointerDown={(e) => { e.preventDefault(); onB(true); }}
          onPointerUp={() => onB(false)}
          onPointerCancel={() => onB(false)}
        >
          B
        </button>
        <button
          aria-label="Interact"
          className="w-14 h-14 rounded-full bg-amber-400 border-2 border-amber-600 text-[#2b2340] text-[11px] active:brightness-90 touch-none"
          onPointerDown={(e) => { e.preventDefault(); onA(); }}
        >
          A
        </button>
      </div>
    </div>
  );
}

// A quick impact flourish over a struck fighter: an expanding ring + shards.
function ImpactBurst({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center pointer-events-none" style={{ zIndex: 5 }}>
      <motion.div
        initial={{ scale: 0.2, opacity: 0.9 }}
        animate={{ scale: 2.3, opacity: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        className="absolute w-10 h-10 rounded-full"
        style={{ border: `3px solid ${color}` }}
      />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(a) * 36, y: Math.sin(a) * 36, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="absolute w-2 h-2"
            style={{ background: color }}
          />
        );
      })}
    </div>
  );
}

// The thrown DEBUGGER device (a little pixel gadget). Animation stage is driven
// by the `phase` prop; it flies in from the player side, wobbles, then settles
// or bursts. Rendered centered over the enemy sprite.
function CatchDevice({ phase }: { phase: 'throw' | 'wobble' | 'done' | 'break' }) {
  const anim =
    phase === 'throw'
      ? { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }
      : phase === 'wobble'
        ? { x: 0, y: 8, scale: 1, rotate: [0, -16, 12, -8, 4, 0], opacity: 1 }
        : phase === 'done'
          ? { x: 0, y: 8, scale: [1, 1.25, 1], rotate: 0, opacity: 1 }
          : { x: 0, y: 8, scale: 1.8, rotate: 0, opacity: 0 };
  const duration = phase === 'throw' ? 0.42 : phase === 'wobble' ? 1.1 : phase === 'done' ? 0.28 : 0.3;
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ zIndex: 6 }}
      initial={{ x: -230, y: 190, scale: 0.5, rotate: -120, opacity: 1 }}
      animate={anim}
      transition={{ duration, ease: phase === 'throw' ? 'easeIn' : 'easeInOut' }}
    >
      <div className="w-8 h-8 rounded bg-[#1c2233] border-2 border-[#e2e8f0] grid place-items-center shadow-[2px_2px_0_rgba(0,0,0,0.45)]">
        <span className="text-[8px] text-cyan-300" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          &lt;/&gt;
        </span>
      </div>
      {phase === 'done' && (
        <motion.span
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute -top-2 -right-2 text-amber-300 text-[10px]"
        >
          ✦
        </motion.span>
      )}
    </motion.div>
  );
}

function BattleScreen({
  battle,
  onAdvance,
  onTypedDone,
  onSelectMenu,
  onChooseMove,
  onSwitchActive,
  onUseCoffee,
  onUseDebugger,
  onBack,
  caughtBugs,
  muted,
  onToggleMute,
}: {
  battle: BattleState;
  onAdvance: () => void;
  onTypedDone: () => void;
  onSelectMenu: (i: number) => void;
  onChooseMove: (i: number) => void;
  onSwitchActive: (i: number) => void;
  onUseCoffee: () => void;
  onUseDebugger: () => void;
  onBack: () => void;
  caughtBugs: string[];
  muted: boolean;
  onToggleMute: () => void;
}) {
  const enemyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const enemyShakeRef = useRef<HTMLDivElement | null>(null);
  const playerShakeRef = useRef<HTMLDivElement | null>(null);
  const prevHitEnemy = useRef(battle.hitEnemy);
  const prevHitPlayer = useRef(battle.hitPlayer);
  const prevThrow = useRef(battle.throwSeq);
  const active = battle.party[battle.active];
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const dpr = window.devicePixelRatio || 1;
  const layout = backdropLayout(vp.w, vp.h, dpr);
  // Sprite pixels are ~2.5 backdrop pixels, so fighters keep their size
  // relative to the platforms on any screen; rounded to whole device pixels so
  // every sprite pixel is the same size.
  // (a multiple of HD device pixels, so each HD sprite pixel maps to whole pixels)
  const spriteScale = (HD * Math.max(Math.ceil((3 * dpr) / HD), Math.floor((2.5 * layout.c * dpr) / HD))) / dpr;
  // CSS position of a backdrop point
  const anchor = (pt: { x: number; y: number }) => ({ left: layout.ox + pt.x * layout.c, top: layout.oy + pt.y * layout.c });
  const backdropRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const el = backdropRef.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    // drawn at device resolution, so the browser never rescales it
    el.width = Math.round(vp.w * dpr);
    el.height = Math.round(vp.h * dpr);
    const k = layout.c * dpr;
    const top = Math.round(layout.oy * dpr);
    const bottom = top + Math.round(BACKDROP_H * k);
    ctx.imageSmoothingEnabled = false;
    // sky above and grass below the painting, for screens taller than it
    px(ctx, 0, 0, el.width, top, '#8ecdec');
    px(ctx, 0, bottom, el.width, el.height - bottom, '#6bb246');
    ctx.drawImage(getBattleBackdropHD(), Math.round(layout.ox * dpr), top, Math.round(BACKDROP_W * k), bottom - top);
  }, [vp, dpr, layout.c, layout.ox, layout.oy]);

  // Impact burst on hit (star + shards over the struck fighter), keyed by seq.
  const [impact, setImpact] = useState<{ seq: number; side: 'enemy' | 'player' } | null>(null);
  // Catch animation stages, driven by throwSeq.
  const [catchPhase, setCatchPhase] = useState<'idle' | 'throw' | 'wobble' | 'done' | 'break'>('idle');
  const [enemyVisible, setEnemyVisible] = useState(true);

  useEffect(() => {
    const ctx = enemyCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, BUG_W * HD, BUG_H * HD);
      ctx.drawImage(getBugSprite(battle.enemy), 0, 0);
    }
  }, [battle.enemy]);

  useEffect(() => {
    const ctx = playerCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, CREATURE_W * HD, CREATURE_H * HD);
      ctx.drawImage(getSkillCreatureSprite(active.name), 0, 0);
    }
  }, [active.name]);

  // Hit-shake (reaction) and attack-lunge (action) are both played
  // imperatively (Web Animations API) on persistent nodes rather than via a
  // framer-motion `key` remount, which would blank the sprite canvas
  // underneath every time it fires. A single turn drives both: whoever's
  // counter changed lunges forward; the other side flinches.
  const LUNGE_TOWARD_ENEMY: Keyframe[] = [{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(14px,-10px) scale(1.08)' }, { transform: 'translate(0,0) scale(1)' }];
  const LUNGE_TOWARD_PLAYER: Keyframe[] = [{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(-14px,10px) scale(1.08)' }, { transform: 'translate(0,0) scale(1)' }];

  useEffect(() => {
    if (battle.hitEnemy !== prevHitEnemy.current) {
      prevHitEnemy.current = battle.hitEnemy;
      // the impact burst is timed ~150ms in, to land with the lunge's contact
      window.setTimeout(() => setImpact({ seq: battle.hitEnemy, side: 'enemy' }), reducedMotion ? 0 : 150);
      if (!reducedMotion) {
        enemyShakeRef.current?.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }],
          { duration: 400, easing: 'ease-out' }
        );
        playerShakeRef.current?.animate(LUNGE_TOWARD_ENEMY, { duration: 320, easing: 'ease-out' });
      }
    }
  }, [battle.hitEnemy]);

  useEffect(() => {
    if (battle.hitPlayer !== prevHitPlayer.current) {
      prevHitPlayer.current = battle.hitPlayer;
      window.setTimeout(() => setImpact({ seq: battle.hitPlayer + 100000, side: 'player' }), reducedMotion ? 0 : 150);
      if (!reducedMotion) {
        playerShakeRef.current?.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }],
          { duration: 400, easing: 'ease-out' }
        );
        enemyShakeRef.current?.animate(LUNGE_TOWARD_PLAYER, { duration: 320, easing: 'ease-out' });
      }
    }
  }, [battle.hitPlayer]);

  // Catch sequence: throw the device in, absorb the bug, wobble, then settle
  // (success) or burst open with the bug reappearing (failure).
  useEffect(() => {
    if (battle.throwSeq === prevThrow.current) return;
    prevThrow.current = battle.throwSeq;
    const success = battle.catchWillSucceed;
    if (reducedMotion) {
      setEnemyVisible(!success ? true : false);
      return;
    }
    const timers: number[] = [];
    setCatchPhase('throw');
    setEnemyVisible(true);
    timers.push(
      window.setTimeout(() => {
        setEnemyVisible(false); // absorbed
        setCatchPhase('wobble');
        sfx.catchTick();
      }, 440)
    );
    timers.push(window.setTimeout(() => sfx.catchTick(), 940));
    timers.push(window.setTimeout(() => sfx.catchTick(), 1340));
    timers.push(
      window.setTimeout(() => {
        if (success) {
          setCatchPhase('done');
        } else {
          setCatchPhase('break');
          setEnemyVisible(true); // wriggles back out
          sfx.catchFail();
          timers.push(window.setTimeout(() => setCatchPhase('idle'), 320));
        }
      }, 1640)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [battle.throwSeq, battle.catchWillSucceed]);

  const pct = (hp: number, max: number) => Math.max(0, Math.min(100, (hp / max) * 100));
  const barColor = (p: number) => (p > 50 ? '#4ade80' : p > 20 ? '#fbbf24' : '#f87171');
  const optionCls = (selected: boolean, disabled?: boolean) =>
    `px-2 py-2 text-[9px] border-2 text-left ${
      disabled ? 'opacity-40 border-[#2b234055]' : selected ? 'bg-[#2b2340] text-amber-300 border-[#2b2340]' : 'border-[#2b2340] hover:bg-[#2b234015]'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-[#8ecdec]"
      role="dialog"
      aria-label="Battle"
    >
      <canvas ref={backdropRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute left-2 top-2 z-20">
        <MuteButton muted={muted} onToggle={onToggleMute} />
      </div>
      {/* Fighters, each standing on its platform: the column's bottom edge
          (the sprite's feet) sits on the platform centre. */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute flex flex-col items-center gap-1.5" style={{ ...anchor(ENEMY_PAD), transform: 'translate(-50%, -100%)' }}>
          <div className="rpg-frame px-2.5 py-1.5 text-[9px] min-w-[150px]">
            <div className="flex items-center justify-between gap-2">
              <span>{battle.enemy.name}</span>
              {battle.trainer && (
                // one pip per team member: hollow once fainted
                <span className="text-[8px] tracking-[0.2em]" aria-label="Trainer team">
                  {battle.trainer.def.team
                    .map((_, i) => (i < battle.trainer!.idx || (i === battle.trainer!.idx && battle.enemyHp <= 0) ? '○' : '●'))
                    .join('')}
                </span>
              )}
            </div>
            <div className="h-2 mt-1.5 w-full bg-[#2b2340] border border-[#2b2340]">
              <motion.span
                className="block h-full"
                animate={{ width: `${pct(battle.enemyHp, battle.enemy.maxHp)}%` }}
                transition={{ duration: 0.35 }}
                style={{ background: barColor(pct(battle.enemyHp, battle.enemy.maxHp)) }}
              />
            </div>
          </div>
          <motion.div animate={reducedMotion ? undefined : { y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}>
            <div ref={enemyShakeRef} className="relative">
              <div
                className="absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-black/20"
                style={{ bottom: -spriteScale, width: BUG_W * spriteScale * 0.7, height: spriteScale * 3 }}
              />
              <canvas
                ref={enemyCanvasRef}
                width={BUG_W * HD}
                height={BUG_H * HD}
                className="pixelated block"
                style={{ width: BUG_W * spriteScale, height: BUG_H * spriteScale, opacity: enemyVisible && battle.enemyHp > 0 ? 1 : 0, transition: 'opacity 0.35s' }}
              />
              {impact?.side === 'enemy' && <ImpactBurst key={impact.seq} color="#fff7cf" />}
              {catchPhase !== 'idle' && <CatchDevice key={battle.throwSeq} phase={catchPhase} />}
            </div>
          </motion.div>
        </div>

        <div className="absolute flex flex-col items-center gap-1.5" style={{ ...anchor(PLAYER_PAD), transform: 'translate(-50%, -100%)' }}>
          <div className="rpg-frame px-2.5 py-1.5 text-[9px] min-w-[160px]">
            <div className="flex items-center justify-between gap-2">
              <span style={{ color: active.color }}>● {active.name}</span>
              <span>{active.hp}/{active.maxHp}</span>
            </div>
            <div className="h-2 mt-1.5 w-full bg-[#2b2340] border border-[#2b2340]">
              <motion.span
                className="block h-full"
                animate={{ width: `${pct(active.hp, active.maxHp)}%` }}
                transition={{ duration: 0.35 }}
                style={{ background: barColor(pct(active.hp, active.maxHp)) }}
              />
            </div>
          </div>
          <motion.div animate={reducedMotion ? undefined : { y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
            <div ref={playerShakeRef} className="relative">
              <div
                className="absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-black/20"
                style={{ bottom: -spriteScale, width: CREATURE_W * spriteScale * 0.7, height: spriteScale * 3 }}
              />
              <canvas
                ref={playerCanvasRef}
                width={CREATURE_W * HD}
                height={CREATURE_H * HD}
                className="pixelated block"
                style={{ width: CREATURE_W * spriteScale, height: CREATURE_H * spriteScale }}
              />
              {impact?.side === 'player' && <ImpactBurst key={impact.seq} color="#f87171" />}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="flex-1" />

      {/* Bottom text / menu box */}
      <div className="rpg-frame relative z-10 mx-2 mb-2 sm:mx-3 sm:mb-3 p-3 min-h-[112px] selectable">
        {battle.phase === 'text' && (
          <div className="flex flex-col justify-between h-full cursor-pointer" onClick={onAdvance}>
            <p className="text-[10px] sm:text-[11px] leading-[1.9] min-h-[3.8em]">
              <TypewriterPage text={battle.msgs[battle.msgIdx]} done={battle.typed} onDone={onTypedDone} />
            </p>
            <div className="text-right">
              {battle.typed && (
                <motion.span animate={reducedMotion ? undefined : { opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.9 }} className="text-[12px]">
                  ▼
                </motion.span>
              )}
            </div>
          </div>
        )}

        {battle.phase === 'menu' && (
          <div>
            <p className="text-[10px] mb-2">What will {active.name} do?</p>
            <div className="grid grid-cols-2 gap-2">
              {['FIGHT', 'BAG', 'PARTY', 'RUN'].map((label, i) => (
                <button key={label} onClick={() => onSelectMenu(i)} className={optionCls(i === battle.cursor)}>
                  {i === battle.cursor ? '▶ ' : ''}{label}
                </button>
              ))}
            </div>
          </div>
        )}

        {battle.phase === 'fight' && (
          <div>
            <div className="grid grid-cols-2 gap-2">
              {active.moves.map((m, i) => (
                <button key={m.name} onClick={() => onChooseMove(i)} className={optionCls(i === battle.cursor)}>
                  {i === battle.cursor ? '▶ ' : ''}{m.name}
                </button>
              ))}
            </div>
            <button onClick={onBack} className="mt-2 px-2 py-1 text-[8px] border-2 border-[#2b2340] hover:bg-[#2b234015]">◀ BACK</button>
          </div>
        )}

        {battle.phase === 'party' && (
          <div className="rpg-scroll max-h-[112px]">
            {battle.party.map((m, i) => (
              <button
                key={m.name}
                onClick={() => onSwitchActive(i)}
                disabled={m.hp <= 0}
                className={`w-full flex items-center gap-2 mb-1 ${optionCls(i === battle.cursor, m.hp <= 0)}`}
              >
                <span className="w-4 h-4 shrink-0 grid place-items-center text-[6px] border" style={{ background: m.color, borderColor: '#2b2340' }}>{m.abbr}</span>
                <span className="flex-1">{m.name}{i === battle.active ? ' (ACTIVE)' : ''}</span>
                <span>{m.hp}/{m.maxHp}</span>
              </button>
            ))}
            <button onClick={onBack} className="mt-1 px-2 py-1 text-[8px] border-2 border-[#2b2340] hover:bg-[#2b234015]">◀ BACK</button>
          </div>
        )}

        {battle.phase === 'bag' && (
          <div>
            <button onClick={onUseCoffee} className={`w-full mb-2 ${optionCls(battle.cursor === 0)}`}>☕ COFFEE — restore 40% HP</button>
            <button onClick={onUseDebugger} className={`w-full mb-2 ${optionCls(battle.cursor === 1)}`}>
              🐞 DEBUGGER — try to patch &amp; catch{caughtBugs.includes(battle.enemy.id) ? ' (already filed)' : ''}
            </button>
            <button onClick={onBack} className={`w-full ${optionCls(battle.cursor === 2)}`}>◀ BACK</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 11 — THE GAME
   ═══════════════════════════════════════════════════════════════════════════ */

type Particle = { id: number; x: number; y: number; seed: number };
type DialogueState = { spec: DialogueSpec; page: number; typed: boolean; actionIdx: number } | null;

// `?boot=<mapId>[&x=&y=]` skips the title screen entirely (headless testing hook).
// Resolved once at module load so the title never mounts on boot runs.
const BOOT_SPAWNS: Record<string, Vec> = {
  house: { x: 5, y: 5 },
  town: { x: 9, y: 20 },
  gym: { x: 7, y: 9 },
  gallery: { x: GALLERY_DOOR, y: 9 },
  career: { x: CAREER_DOOR, y: CAREER_H - 2 },
  heal: { x: 5, y: 6 },
  meadow: { x: 10, y: 15 },
  forest: { x: 9, y: 13 },
};
const BOOT: { map: string; x: number; y: number } | null = (() => {
  if (typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search);
  const boot = q.get('boot');
  if (!boot) return null;
  const map = MAPS[boot] ? boot : 'town';
  const sp = BOOT_SPAWNS[map];
  const bx = Number(q.get('x'));
  const by = Number(q.get('y'));
  return {
    map,
    x: q.get('x') !== null && Number.isFinite(bx) ? bx : sp.x,
    y: q.get('y') !== null && Number.isFinite(by) ? by : sp.y,
  };
})();
// `?battle=1` force-opens a wild encounter right after boot (headless testing hook).
const FORCE_BATTLE = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('battle') === '1';
// `?trainer=leader|hiker|catcher` force-opens that trainer battle (headless testing hook).
const FORCE_TRAINER = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('trainer') : null;

// `?sheet=1` renders every generated asset in a labelled grid instead of the
// game — a living sprite sheet used to review art quality at a glance.
const SHEET_MODE = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('sheet') === '1';

function SheetCanvas({ draw, w, h, zoom = 4, label }: { draw: (ctx: Ctx) => void; w: number; h: number; zoom?: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <canvas
        ref={(el) => {
          const ctx = el?.getContext('2d');
          if (ctx && el && el.dataset.painted !== '1') {
            el.dataset.painted = '1';
            ctx.setTransform(HD, 0, 0, HD, 0, 0); // draw in art pixels at HD resolution
            draw(ctx);
          }
        }}
        width={w * HD}
        height={h * HD}
        className="pixelated bg-[#2a3244] border border-[#3d4663]"
        style={{ width: w * zoom, height: h * zoom }}
      />
      <span className="text-[7px] text-slate-400">{label}</span>
    </div>
  );
}

function SpriteSheetView() {
  const facings: Dir[] = ['down', 'left', 'up'];
  const terrainSample = (chars: string[][]) => (ctx: Ctx) => {
    const rows = chars.map((r) => r.join(''));
    for (let y = 0; y < rows.length; y++)
      for (let x = 0; x < rows[0].length; x++) paintTerrainTile(ctx, rows[y][x], x, y, 'town', 0, rows);
  };
  return (
    <div className="min-h-screen overflow-auto bg-[#0b0f14] p-6 text-slate-200" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <h1 className="text-[12px] mb-4 text-amber-300">ASSET SHEET</h1>
      <h2 className="text-[9px] mb-2 text-slate-400">CHARACTERS (down/left/up)</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.keys(PALETTES).map((p) => (
          <SheetCanvas
            key={p}
            label={p}
            w={SPRITE_W * 3 + 8}
            h={SPRITE_H}
            draw={(ctx) => facings.forEach((f, i) => ctx.drawImage(getSpriteFrame(p, f, 0), i * (SPRITE_W + 4), 0, SPRITE_W, SPRITE_H))}
          />
        ))}
      </div>
      <h2 className="text-[9px] mb-2 text-slate-400">WILD BUGS</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {BUG_SPECIES.map((s) => (
          <SheetCanvas key={s.id} label={s.name} w={BUG_W} h={BUG_H} zoom={5} draw={(ctx) => ctx.drawImage(getBugSprite(s), 0, 0, BUG_W, BUG_H)} />
        ))}
      </div>
      <h2 className="text-[9px] mb-2 text-slate-400">GYM LEADER BOSSES</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {BOSS_SPECIES.map((s) => (
          <SheetCanvas key={s.id} label={s.name} w={BUG_W} h={BUG_H} zoom={5} draw={(ctx) => ctx.drawImage(getBugSprite(s), 0, 0, BUG_W, BUG_H)} />
        ))}
      </div>
      <h2 className="text-[9px] mb-2 text-slate-400">SKILL CREATURES</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {portfolioData.skills.party.map((s) => (
          <SheetCanvas key={s.name} label={s.name} w={CREATURE_W} h={CREATURE_H} zoom={5} draw={(ctx) => ctx.drawImage(getSkillCreatureSprite(s.name), 0, 0, CREATURE_W, CREATURE_H)} />
        ))}
      </div>
      <h2 className="text-[9px] mb-2 text-slate-400">TERRAIN & TREE</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        <SheetCanvas
          label="grass/path"
          w={4 * TILE}
          h={3 * TILE}
          draw={terrainSample([
            ['G', 'G', 'G', 'G'],
            ['G', 'P', 'P', 'G'],
            ['G', 'P', 'P', 'G'],
          ])}
        />
        <SheetCanvas
          label="pond"
          w={4 * TILE}
          h={3 * TILE}
          draw={terrainSample([
            ['G', 'G', 'G', 'G'],
            ['G', 'W', 'W', 'G'],
            ['G', 'W', 'W', 'G'],
          ])}
        />
        <SheetCanvas
          label="tall grass"
          w={3 * TILE}
          h={2 * TILE}
          draw={terrainSample([
            ['t', 't', 't'],
            ['t', 't', 't'],
          ])}
        />
        <SheetCanvas
          label="trees"
          w={4 * TILE}
          h={3 * TILE}
          draw={terrainSample([
            ['G', 'G', 'G', 'G'],
            ['T', 'T', 'T', 'T'],
            ['G', 'G', 'G', 'G'],
          ])}
        />
      </div>
      <h2 className="text-[9px] mb-2 text-slate-400">BATTLE BACKDROP</h2>
      <SheetCanvas label={`backdrop ${BACKDROP_W}x${BACKDROP_H}`} w={BACKDROP_W} h={BACKDROP_H} zoom={2} draw={(ctx) => ctx.drawImage(getBattleBackdropHD(), 0, 0, BACKDROP_W, BACKDROP_H)} />
    </div>
  );
}

export default function App() {
  // Asset-review mode replaces the whole game. SHEET_MODE is a module constant
  // (never changes within a session), so hook order stays consistent.
  if (SHEET_MODE) return <SpriteSheetView />;
  return <Game />;
}

function Game() {
  /* ——— React state (UI-triggering only) ——— */
  const [phase, setPhase] = useState<'title' | 'playing'>(BOOT ? 'playing' : 'title');
  const [mapId, setMapId] = useState(BOOT?.map ?? 'house');
  const [dialogue, setDialogue] = useState<DialogueState>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fade, setFade] = useState(false);
  // Iris-wipe warp transition: a circular "hole" in a black overlay, radius in
  // vmax (100 = comfortably covers every corner regardless of aspect ratio).
  const irisRadius = useMotionValue(100);
  const irisMask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent 0, transparent ${irisRadius}vmax, white ${irisRadius}vmax)`;
  const [banner, setBanner] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [muted, setMuted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [facedHint, setFacedHint] = useState<string | null>(null); // e.g. 'TALK: GUIDE'
  const [emoteNpc, setEmoteNpc] = useState<string | null>(null);
  const [viewport, setViewport] = useState({ w: 800, h: 600, dpr: 1 });
  const [animFrame, setAnimFrame] = useState(0);
  const [inTallGrass, setInTallGrass] = useState(false);
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [battleFlash, setBattleFlash] = useState(false);
  const [bugsDefeated, setBugsDefeated] = useState(0);
  const [caughtBugs, setCaughtBugs] = useState<string[]>([]);
  const [partyHp, setPartyHp] = useState<Record<string, number>>(() => fullPartyHp());
  const [defeatedTrainers, setDefeatedTrainers] = useState<string[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  // A trainer spotted the player and is walking over: input is frozen.
  const [cutscene, setCutscene] = useState(false);
  const [menuTab, setMenuTab] = useState<BackpackTab | undefined>(undefined);
  // `?classic=1` opens the readable CV page directly — a shareable deep-link
  // for recruiters who'd rather not play through the game.
  const [classicView, setClassicView] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('classic') === '1'
  );

  const touchMode = useMemo(
    () => typeof window !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) && window.matchMedia('(pointer: coarse)').matches,
    []
  );

  /* ——— Refs (mutable engine state) ——— */
  const map = MAPS[mapId];
  const mapRef = useRef(map);
  mapRef.current = map;
  const zoom = zoomFor(viewport.w, viewport.h, viewport.dpr);
  const playerRef = useRef<Entity>(makeEntity(BOOT?.x ?? 5, BOOT?.y ?? 5, 'down'));
  const playerElsRef = useRef<EntityEls>({ el: null, canvas: null });
  const npcsRef = useRef<NPCRuntime[]>([]);
  const npcElsRef = useRef<Record<string, EntityEls>>({});
  const heldRef = useRef<Dir[]>([]);
  const runRef = useRef(false);
  const turnDeadlineRef = useRef(0);
  const blockedRef = useRef(true);
  const warpingRef = useRef(false);
  const lastBumpRef = useRef(0);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const mapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleIdRef = useRef(0);
  const rngRef = useRef(mulberry32(0xc0ffee));
  const badgesRef = useRef(badges);
  badgesRef.current = badges;
  const dialogueRef = useRef(dialogue);
  dialogueRef.current = dialogue;
  const menuRef = useRef(menuOpen);
  menuRef.current = menuOpen;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const battleRef = useRef(battle);
  battleRef.current = battle;
  const bugsDefeatedRef = useRef(bugsDefeated);
  bugsDefeatedRef.current = bugsDefeated;
  const caughtBugsRef = useRef(caughtBugs);
  caughtBugsRef.current = caughtBugs;
  const partyHpRef = useRef(partyHp);
  partyHpRef.current = partyHp;
  const classicViewRef = useRef(classicView);
  classicViewRef.current = classicView;
  const defeatedTrainersRef = useRef(defeatedTrainers);
  defeatedTrainersRef.current = defeatedTrainers;
  const seenRef = useRef(seen);
  seenRef.current = seen;
  const cutsceneRef = useRef(cutscene);
  cutsceneRef.current = cutscene;
  // Trainer whose battle starts as soon as the current dialogue closes.
  const pendingTrainerRef = useRef<string | null>(null);
  const trainerArriveRef = useRef<(n: NPCRuntime) => void>(() => {});
  // null until the first count after start/load, so loading a finished save doesn't celebrate.
  const prevTasksDoneRef = useRef<number | null>(null);

  blockedRef.current = phase !== 'playing' || dialogue !== null || menuOpen || fade || battle !== null || classicView || cutscene;

  const dialogues = useMemo(() => buildDialogues(), []);

  /* ——— Helpers ——— */
  const showToast = useCallback((text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const warpAt = useCallback((m: GameMap, x: number, y: number) => m.warps.find((w) => w.x === x && w.y === y), []);

  const npcAt = useCallback((x: number, y: number): NPCRuntime | undefined => {
    return npcsRef.current.find((n) => (n.tile.x === x && n.tile.y === y) || (n.move && n.move.to.x === x && n.move.to.y === y));
  }, []);

  const decorAt = useCallback((m: GameMap, x: number, y: number) => m.decor.find((dec) => dec.x === x && dec.y === y), []);

  const facedTile = useCallback((): Vec => {
    const p = playerRef.current;
    const delta = DELTA[p.facing];
    return { x: p.tile.x + delta.x, y: p.tile.y + delta.y };
  }, []);

  const facedInteractable = useCallback((): { npc?: NPCRuntime; decor?: Decor } | null => {
    const m = mapRef.current;
    const f = facedTile();
    const npc = npcAt(f.x, f.y);
    if (npc) return { npc };
    const dec = decorAt(m, f.x, f.y);
    if (dec?.dialogueId) return { decor: dec };
    return null;
  }, [facedTile, npcAt, decorAt]);

  const refreshFacedHint = useCallback(() => {
    const target = facedInteractable();
    setFacedHint(
      target?.npc ? `TALK: ${target.npc.def.name}` : target?.decor ? target.decor.label ?? DECOR_HINTS[target.decor.type] ?? 'INSPECT' : null
    );
    if (target?.npc && !dialogueRef.current) {
      setEmoteNpc(target.npc.def.id);
      window.setTimeout(() => setEmoteNpc((cur) => (cur === target.npc!.def.id ? null : cur)), 900);
    }
  }, [facedInteractable]);

  /* ——— Dialogue control ——— */
  const openDialogue = useCallback((spec: DialogueSpec) => {
    sfx.confirm();
    setDialogue({ spec, page: 0, typed: false, actionIdx: 0 });
  }, []);

  const grantBadge = useCallback(
    (b: string) => {
      if (!badgesRef.current.includes(b)) {
        setBadges((prev) => [...prev, b]);
        sfx.badge();
        showToast(`★ You received the ${b}!`);
      }
    },
    [showToast]
  );

  const markSeen = useCallback((id: string) => {
    setSeen((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  // The GYM LEADER also counts as beaten for saves that got the badge before
  // the leader battle existed.
  const trainerBeaten = useCallback((id: string) => {
    const t = TRAINERS[id];
    return defeatedTrainersRef.current.includes(id) || (!!t?.badge && badgesRef.current.includes(t.badge));
  }, []);

  const handleDialogueAction = useCallback(
    (a: DialogueAction) => {
      if (a.startTrainer) pendingTrainerRef.current = a.startTrainer; // starts once the dialogue closes
      if (a.grantBadge) grantBadge(a.grantBadge);
      if (a.href) window.open(a.href, a.href.startsWith('mailto:') ? '_self' : '_blank', 'noopener');
      if (a.heal) {
        setPartyHp(fullPartyHp());
        sfx.catchWin();
        showToast('♥ Your skill party was restored to full HP!');
      }
      setDialogue(null);
    },
    [grantBadge, showToast]
  );

  const advanceDialogue = useCallback(() => {
    setDialogue((cur) => {
      if (!cur) return cur;
      if (!cur.typed) return { ...cur, typed: true };
      const isLast = cur.page >= cur.spec.pages.length - 1;
      if (!isLast) {
        sfx.blip();
        return { ...cur, page: cur.page + 1, typed: false };
      }
      if (cur.spec.actions && cur.spec.actions.length > 0) return cur; // wait for action selection
      return null;
    });
  }, []);

  /* ——— Interaction (E / A button) ——— */
  const interact = useCallback(() => {
    if (blockedRef.current) return;
    const target = facedInteractable();
    if (!target) return;
    if (target.npc) {
      const n = target.npc;
      if (n.move) return; // mid-step, try again when they land
      n.paused = true;
      const p = playerRef.current;
      const dx = p.tile.x - n.tile.x;
      const dy = p.tile.y - n.tile.y;
      n.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
      const tid = n.def.trainer;
      if (tid && !trainerBeaten(tid)) {
        const t = TRAINERS[tid];
        const challenge = t.challengeDialogue ? dialogues[t.challengeDialogue] : undefined;
        if (challenge) {
          openDialogue(challenge());
        } else {
          pendingTrainerRef.current = tid;
          openDialogue({ speaker: t.name, pages: t.challenge });
        }
        return;
      }
      const make = dialogues[n.def.dialogueId];
      if (make) {
        markSeen(n.def.dialogueId);
        openDialogue(make());
      }
    } else if (target.decor?.dialogueId) {
      const make = dialogues[target.decor.dialogueId];
      if (make) {
        markSeen(target.decor.dialogueId);
        openDialogue(make());
      }
    }
  }, [dialogues, facedInteractable, markSeen, openDialogue, trainerBeaten]);

  const handleActionButton = useCallback(() => {
    const cur = dialogueRef.current;
    if (cur) {
      if (cur.typed && cur.page >= cur.spec.pages.length - 1 && cur.spec.actions?.length) {
        handleDialogueAction(cur.spec.actions[cur.actionIdx]);
      } else {
        advanceDialogue();
      }
      return;
    }
    interact();
  }, [advanceDialogue, handleDialogueAction, interact]);

  /* ——— Warping between maps ——— */
  const doWarp = useCallback(
    (w: Warp) => {
      if (warpingRef.current) return;
      warpingRef.current = true;
      sfx.door();
      setFade(true);
      window.setTimeout(() => {
        const p = playerRef.current;
        p.tile = { x: w.toX, y: w.toY };
        p.move = null;
        p.facing = w.facing;
        heldRef.current = [];
        setMapId(w.toMap);
        setInTallGrass(false);
        setFacedHint(null);
        window.setTimeout(() => {
          setFade(false);
          warpingRef.current = false;
        }, 260);
      }, 260);
    },
    []
  );

  // Drive the iris-wipe radius whenever a warp opens/closes the transition.
  useEffect(() => {
    const controls = animateValue(irisRadius, fade ? 0 : 100, { duration: reducedMotion ? 0 : 0.26, ease: 'easeInOut' });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fade]);

  /* ——— Battle system (turn-based, triggered by tall-grass encounters) ——— */
  const ENCOUNTER_CHANCE = 0.14;

  // The overworld party HP, as battle members. If somehow the whole party is
  // down, start everyone at full (defeat already full-heals, so this is just a
  // safety net against an unwinnable encounter).
  const buildParty = useCallback((): { party: BattlePartyMember[]; active: number } => {
    const persisted = partyHpRef.current;
    const anyAlive = portfolioData.skills.party.some((s) => (persisted[s.name] ?? skillMaxHp(s.lv)) > 0);
    const party: BattlePartyMember[] = portfolioData.skills.party.map((s) => {
      const maxHp = skillMaxHp(s.lv);
      const hp = anyAlive ? Math.max(0, Math.min(maxHp, persisted[s.name] ?? maxHp)) : maxHp;
      return { name: s.name, abbr: s.abbr, color: s.color, type: s.type, maxHp, hp, moves: SKILL_MOVES[s.name] ?? DEFAULT_MOVES };
    });
    return { party, active: Math.max(0, party.findIndex((m) => m.hp > 0)) };
  }, []);

  const startBattle = useCallback(() => {
    const table = ENCOUNTER_TABLES[mapRef.current.id] ?? ENCOUNTER_TABLES.town;
    const pool = table.map((id) => BUG_SPECIES.find((s) => s.id === id)).filter((s): s is BugSpecies => !!s);
    const species = pool[Math.floor(rngRef.current() * pool.length)];
    const { party, active } = buildParty();
    sfx.encounter();
    setBattleFlash(true);
    window.setTimeout(() => setBattleFlash(false), 180);
    setBattle({
      trainer: null,
      enemy: species,
      enemyHp: species.maxHp,
      party,
      active,
      phase: 'text',
      msgs: [species.intro],
      msgIdx: 0,
      typed: false,
      next: 'menu',
      cursor: 0,
      hitEnemy: 0,
      hitPlayer: 0,
      throwSeq: 0,
      catchWillSucceed: false,
    });
  }, [buildParty]);

  const startTrainerBattle = useCallback(
    (id: string) => {
      const def = TRAINERS[id];
      if (!def) return;
      const first = SPECIES_BY_ID[def.team[0]];
      const { party, active } = buildParty();
      setEmoteNpc(null);
      sfx.encounter();
      setBattleFlash(true);
      window.setTimeout(() => setBattleFlash(false), 180);
      setBattle({
        trainer: { def, idx: 0 },
        enemy: first,
        enemyHp: first.maxHp,
        party,
        active,
        phase: 'text',
        msgs: [`${def.name} wants to battle!`, `${def.name} sent out ${first.name}!`],
        msgIdx: 0,
        typed: false,
        next: 'menu',
        cursor: 0,
        hitEnemy: 0,
        hitPlayer: 0,
        throwSeq: 0,
        catchWillSucceed: false,
      });
    },
    [buildParty]
  );

  // A trainer's challenge dialogue (or the leader's ACCEPT CHALLENGE) queues
  // the battle; it starts the moment that dialogue closes.
  useEffect(() => {
    if (dialogue !== null || !pendingTrainerRef.current) return;
    const id = pendingTrainerRef.current;
    pendingTrainerRef.current = null;
    startTrainerBattle(id);
  }, [dialogue, startTrainerBattle]);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (FORCE_TRAINER && TRAINERS[FORCE_TRAINER]) startTrainerBattle(FORCE_TRAINER);
    else if (FORCE_BATTLE) startBattle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Persist the surviving battle HP back to the overworld party record.
  const commitBattleHp = useCallback((party: BattlePartyMember[]) => {
    setPartyHp((prev) => {
      const next = { ...prev };
      for (const m of party) next[m.name] = m.hp;
      return next;
    });
  }, []);

  const runBattleTransition = useCallback(
    (b: BattleState) => {
      switch (b.next) {
        case 'menu':
          setBattle({ ...b, phase: 'menu', cursor: 0 });
          return;
        case 'enemyTurn': {
          const dmg = randInt(rngRef.current, b.enemy.power[0], b.enemy.power[1]);
          const activeMember = b.party[b.active];
          const hp = Math.max(0, activeMember.hp - dmg);
          const party = b.party.map((m, i) => (i === b.active ? { ...m, hp } : m));
          sfx.attack();
          if (hp === 0) {
            sfx.faint();
            const aliveIdx = party.findIndex((m) => m.hp > 0);
            const baseMsgs = [`${b.enemy.name} hits ${activeMember.name} for ${dmg}!`, `${activeMember.name} can't continue!`];
            if (aliveIdx === -1) {
              setBattle({ ...b, party, phase: 'text', msgs: baseMsgs, msgIdx: 0, typed: false, next: 'defeat', hitPlayer: b.hitPlayer + 1 });
            } else {
              setBattle({
                ...b,
                party,
                active: aliveIdx,
                phase: 'text',
                msgs: [...baseMsgs, `Go, ${party[aliveIdx].name}!`],
                msgIdx: 0,
                typed: false,
                next: 'menu',
                hitPlayer: b.hitPlayer + 1,
              });
            }
          } else {
            setBattle({
              ...b,
              party,
              phase: 'text',
              msgs: [`${b.enemy.name} hits ${activeMember.name} for ${dmg}!`],
              msgIdx: 0,
              typed: false,
              next: 'menu',
              hitPlayer: b.hitPlayer + 1,
            });
          }
          return;
        }
        case 'victory':
          commitBattleHp(b.party);
          setBugsDefeated((n) => n + 1);
          sfx.badge();
          showToast(`★ Squashed the ${b.enemy.name}!`);
          setBattle(null);
          return;
        case 'trainerNext': {
          const t = b.trainer!;
          const idx = t.idx + 1;
          const nextUp = SPECIES_BY_ID[t.def.team[idx]];
          setBattle({
            ...b,
            trainer: { ...t, idx },
            enemy: nextUp,
            enemyHp: nextUp.maxHp,
            phase: 'text',
            msgs: [`${t.def.name} sent out ${nextUp.name}!`],
            msgIdx: 0,
            typed: false,
            next: 'menu',
            cursor: 0,
          });
          return;
        }
        case 'trainerWin': {
          const def = b.trainer!.def;
          commitBattleHp(b.party);
          setDefeatedTrainers((prev) => (prev.includes(def.id) ? prev : [...prev, def.id]));
          if (def.badge) {
            grantBadge(def.badge);
          } else {
            sfx.badge();
            showToast(`★ You beat the ${def.name}!`);
          }
          setBattle(null);
          return;
        }
        case 'caught':
          commitBattleHp(b.party);
          setCaughtBugs((prev) => (prev.includes(b.enemy.id) ? prev : [...prev, b.enemy.id]));
          sfx.catchWin();
          showToast(`✔ ${b.enemy.name} patched & filed to your BUGDEX!`);
          setBattle(null);
          return;
        case 'defeat':
          // Whiting-out fully restores the party (matches the "no harm done"
          // copy) so a wipe can never soft-lock the player.
          setPartyHp(fullPartyHp());
          showToast(
            b.trainer
              ? `You blacked out and recover fully. The ${b.trainer.def.name} is still waiting!`
              : 'Your skills black out and recover fully. Find a HEAL CENTER next time!'
          );
          setBattle(null);
          return;
        case 'runSuccess':
          commitBattleHp(b.party);
          showToast('Got away safely!');
          setBattle(null);
          return;
        default:
          setBattle({ ...b, phase: 'menu', cursor: 0 });
      }
    },
    [showToast, commitBattleHp, grantBadge]
  );

  const advanceBattleText = useCallback(() => {
    const b = battleRef.current;
    if (!b || b.phase !== 'text') return;
    if (!b.typed) {
      setBattle({ ...b, typed: true });
      return;
    }
    if (b.msgIdx < b.msgs.length - 1) {
      sfx.blip();
      setBattle({ ...b, msgIdx: b.msgIdx + 1, typed: false });
      return;
    }
    runBattleTransition(b);
  }, [runBattleTransition]);

  const chooseMove = useCallback((moveIdx: number) => {
    const b = battleRef.current;
    if (!b || b.phase !== 'fight') return;
    const attacker = b.party[b.active];
    const move = attacker.moves[moveIdx];
    if (!move) return;
    const weak = b.enemy.weakTo?.includes(attacker.type) ?? false;
    const dmg = Math.round(randInt(rngRef.current, move.power[0], move.power[1]) * (weak ? 1.5 : 1));
    const enemyHp = Math.max(0, b.enemyHp - dmg);
    const used = [`${attacker.name} used ${move.name}!`, ...(weak ? ["It's super effective!"] : [])];
    sfx.attack();
    if (enemyHp <= 0 && b.trainer) {
      const last = b.trainer.idx >= b.trainer.def.team.length - 1;
      setBattle({
        ...b,
        enemyHp,
        phase: 'text',
        msgs: last
          ? [...used, `${b.enemy.name} fainted!`, `You defeated the ${b.trainer.def.name}!`, ...b.trainer.def.win]
          : [...used, `${b.enemy.name} fainted!`],
        msgIdx: 0,
        typed: false,
        next: last ? 'trainerWin' : 'trainerNext',
        hitEnemy: b.hitEnemy + 1,
      });
    } else if (enemyHp <= 0) {
      setBattle({
        ...b,
        enemyHp,
        phase: 'text',
        msgs: [...used, `The wild ${b.enemy.name} was defeated!`],
        msgIdx: 0,
        typed: false,
        next: 'victory',
        hitEnemy: b.hitEnemy + 1,
      });
    } else {
      setBattle({
        ...b,
        enemyHp,
        phase: 'text',
        msgs: used,
        msgIdx: 0,
        typed: false,
        next: 'enemyTurn',
        hitEnemy: b.hitEnemy + 1,
      });
    }
  }, []);

  const useCoffee = useCallback(() => {
    const b = battleRef.current;
    if (!b || b.phase !== 'bag') return;
    const active = b.party[b.active];
    const heal = Math.round(active.maxHp * 0.4);
    const party = b.party.map((m, i) => (i === b.active ? { ...m, hp: Math.min(m.maxHp, m.hp + heal) } : m));
    sfx.confirm();
    setBattle({ ...b, party, phase: 'text', msgs: [`Drank a COFFEE! ${active.name} recovered ${heal} HP!`], msgIdx: 0, typed: false, next: 'enemyTurn' });
  }, []);

  // Throw a DEBUGGER to catch (patch) the wild bug. Classic-style catch rate:
  // the weaker the bug's remaining HP, the higher the chance. Already-filed
  // species are near-guaranteed. On failure the bug gets its turn.
  const useDebugger = useCallback(() => {
    const b = battleRef.current;
    if (!b || b.phase !== 'bag') return;
    if (b.trainer) {
      // trainers' bugs can't be caught; no turn is spent
      setBattle({
        ...b,
        phase: 'text',
        msgs: [`The ${b.trainer.def.name} blocked the DEBUGGER!`, "You can't patch someone else's bug!"],
        msgIdx: 0,
        typed: false,
        next: 'menu',
      });
      return;
    }
    const frac = b.enemyHp / b.enemy.maxHp;
    const already = caughtBugsRef.current.includes(b.enemy.id);
    const chance = already ? 0.9 : Math.max(0.15, Math.min(0.92, 0.3 + 0.6 * (1 - frac)));
    const caught = rngRef.current() < chance;
    sfx.catchThrow();
    // throwSeq++ triggers the throw→absorb→wobble animation in BattleScreen;
    // catchWillSucceed tells it how to end. Result SFX: the win jingle plays in
    // runBattleTransition('caught') (battle unmounts, so it must live in logic);
    // the fail buzz plays from the animation (battle stays mounted on failure).
    if (caught) {
      setBattle({
        ...b,
        phase: 'text',
        msgs: ['You tossed a DEBUGGER...', '. . . . . .', `Gotcha! The ${b.enemy.name} was patched!`],
        msgIdx: 0,
        typed: false,
        next: 'caught',
        throwSeq: b.throwSeq + 1,
        catchWillSucceed: true,
      });
    } else {
      setBattle({
        ...b,
        phase: 'text',
        msgs: ['You tossed a DEBUGGER...', `Argh! The ${b.enemy.name} wriggled free!`],
        msgIdx: 0,
        typed: false,
        next: 'enemyTurn',
        throwSeq: b.throwSeq + 1,
        catchWillSucceed: false,
      });
    }
  }, []);

  const switchActive = useCallback((idx: number) => {
    const b = battleRef.current;
    if (!b || b.phase !== 'party') return;
    if (idx === b.active || b.party[idx].hp <= 0) return;
    setBattle({ ...b, active: idx, phase: 'text', msgs: [`Go, ${b.party[idx].name}!`], msgIdx: 0, typed: false, next: 'enemyTurn' });
  }, []);

  const attemptRun = useCallback(() => {
    const b = battleRef.current;
    if (!b || b.phase !== 'menu') return;
    if (b.trainer) {
      setBattle({ ...b, phase: 'text', msgs: ['No running from a trainer battle!'], msgIdx: 0, typed: false, next: 'menu' });
      return;
    }
    if (rngRef.current() < 0.85) {
      setBattle({ ...b, phase: 'text', msgs: ['Got away safely!'], msgIdx: 0, typed: false, next: 'runSuccess' });
    } else {
      setBattle({ ...b, phase: 'text', msgs: ["Couldn't get away!"], msgIdx: 0, typed: false, next: 'enemyTurn' });
    }
  }, []);

  const selectMenuOption = useCallback(
    (cursor: number) => {
      const b = battleRef.current;
      if (!b || b.phase !== 'menu') return;
      if (cursor === 0) setBattle({ ...b, phase: 'fight', cursor: 0 });
      else if (cursor === 1) setBattle({ ...b, phase: 'bag', cursor: 0 });
      else if (cursor === 2) setBattle({ ...b, phase: 'party', cursor: b.active });
      else attemptRun();
    },
    [attemptRun]
  );

  const handleBattleKey = useCallback(
    (e: KeyboardEvent) => {
      const b = battleRef.current;
      if (!b || e.repeat) return;
      const go = ['e', 'E', 'Enter', ' ', 'z', 'Z'];
      const back = ['Escape', 'x', 'X'];
      const up = ['ArrowUp', 'w', 'W'];
      const down = ['ArrowDown', 's', 'S'];
      const left = ['ArrowLeft', 'a', 'A'];
      const right = ['ArrowRight', 'd', 'D'];

      if (b.phase === 'text') {
        if (go.includes(e.key)) advanceBattleText();
        return;
      }
      // cursor-move blip for the interactive menus
      if ([...up, ...down, ...left, ...right].includes(e.key)) sfx.select();
      if (b.phase === 'menu') {
        if (up.includes(e.key)) setBattle({ ...b, cursor: b.cursor >= 2 ? b.cursor - 2 : b.cursor });
        else if (down.includes(e.key)) setBattle({ ...b, cursor: b.cursor < 2 ? b.cursor + 2 : b.cursor });
        else if (left.includes(e.key)) setBattle({ ...b, cursor: b.cursor % 2 === 1 ? b.cursor - 1 : b.cursor });
        else if (right.includes(e.key)) setBattle({ ...b, cursor: b.cursor % 2 === 0 ? b.cursor + 1 : b.cursor });
        else if (go.includes(e.key)) selectMenuOption(b.cursor);
        return;
      }
      if (b.phase === 'fight') {
        const moves = b.party[b.active].moves;
        if (up.includes(e.key)) setBattle({ ...b, cursor: Math.max(0, b.cursor - 1) });
        else if (down.includes(e.key)) setBattle({ ...b, cursor: Math.min(moves.length - 1, b.cursor + 1) });
        else if (go.includes(e.key)) chooseMove(b.cursor);
        else if (back.includes(e.key)) setBattle({ ...b, phase: 'menu', cursor: 0 });
        return;
      }
      if (b.phase === 'party') {
        const n = b.party.length;
        if (up.includes(e.key)) setBattle({ ...b, cursor: (b.cursor + n - 1) % n });
        else if (down.includes(e.key)) setBattle({ ...b, cursor: (b.cursor + 1) % n });
        else if (go.includes(e.key)) switchActive(b.cursor);
        else if (back.includes(e.key)) setBattle({ ...b, phase: 'menu', cursor: 0 });
        return;
      }
      if (b.phase === 'bag') {
        if (up.includes(e.key)) setBattle({ ...b, cursor: Math.max(0, b.cursor - 1) });
        else if (down.includes(e.key)) setBattle({ ...b, cursor: Math.min(2, b.cursor + 1) });
        else if (go.includes(e.key)) {
          if (b.cursor === 0) useCoffee();
          else if (b.cursor === 1) useDebugger();
          else setBattle({ ...b, phase: 'menu', cursor: 0 });
        } else if (back.includes(e.key)) setBattle({ ...b, phase: 'menu', cursor: 0 });
        return;
      }
    },
    [advanceBattleText, chooseMove, selectMenuOption, switchActive, useCoffee, useDebugger]
  );

  /* ——— Trainers spotting the player ——— */
  // An unbeaten trainer sees `sight` tiles straight ahead; walls, solid decor
  // and other NPCs block the line.
  const spotTrainer = useCallback(
    (m: GameMap, p: Entity): NPCRuntime | undefined =>
      npcsRef.current.find((n) => {
        const t = n.def.trainer ? TRAINERS[n.def.trainer] : undefined;
        if (!t || t.sight <= 0 || n.move || n.approaching || trainerBeaten(t.id)) return false;
        const dv = DELTA[n.facing];
        for (let i = 1; i <= t.sight; i++) {
          const tx = n.tile.x + dv.x * i;
          const ty = n.tile.y + dv.y * i;
          if (tx === p.tile.x && ty === p.tile.y) return true;
          if (isSolid(m, tx, ty) || npcAt(tx, ty)) return false;
        }
        return false;
      }),
    [npcAt, trainerBeaten]
  );

  // Freeze input, pop the "!" over the trainer, then walk them up to the
  // player; the main loop calls trainerArriveRef when the last step lands.
  const beginTrainerApproach = useCallback((n: NPCRuntime) => {
    const p = playerRef.current;
    heldRef.current = [];
    blockedRef.current = true;
    setCutscene(true);
    setFacedHint(null);
    setEmoteNpc(n.def.id);
    sfx.spotted();
    p.facing = OPPOSITE[n.facing];
    const steps = Math.abs(p.tile.x - n.tile.x) + Math.abs(p.tile.y - n.tile.y) - 1;
    window.setTimeout(() => {
      if (steps > 0) {
        n.approachSteps = steps;
        n.approaching = true;
      } else {
        trainerArriveRef.current(n);
      }
    }, reducedMotion ? 0 : 700);
  }, []);

  const trainerArrive = useCallback(
    (n: NPCRuntime) => {
      const t = TRAINERS[n.def.trainer!];
      setEmoteNpc(null);
      setCutscene(false);
      pendingTrainerRef.current = t.id;
      openDialogue({ speaker: t.name, pages: t.challenge });
    },
    [openDialogue]
  );
  trainerArriveRef.current = trainerArrive;

  /* ——— Landing on a tile ——— */
  const onPlayerLand = useCallback(() => {
    const m = mapRef.current;
    const p = playerRef.current;
    const ch = m.rows[p.tile.y]?.[p.tile.x];
    const tall = m.kind === 'town' && ch === 't';
    setInTallGrass(tall);
    if (tall) {
      sfx.rustle();
      if (!reducedMotion) {
        const id = particleIdRef.current++;
        setParticles((prev) => [...prev.slice(-14), { id, x: p.tile.x * TILE, y: p.tile.y * TILE, seed: Math.floor(rngRef.current() * 1e9) }]);
        window.setTimeout(() => setParticles((prev) => prev.filter((pt) => pt.id !== id)), 520);
      }
    }
    const spotter = spotTrainer(m, p);
    if (spotter) {
      beginTrainerApproach(spotter);
      return;
    }
    if (tall && rngRef.current() < ENCOUNTER_CHANCE) {
      startBattle();
      return;
    }
    const w = warpAt(m, p.tile.x, p.tile.y);
    if (w) {
      doWarp(w);
      return;
    }
    refreshFacedHint();
  }, [beginTrainerApproach, doWarp, refreshFacedHint, spotTrainer, startBattle, warpAt]);

  const onPlayerLandRef = useRef(onPlayerLand);
  onPlayerLandRef.current = onPlayerLand;

  /* ——— Keyboard input ——— */
  useEffect(() => {
    const dirFor = (key: string): Dir | null => {
      switch (key) {
        case 'ArrowUp': case 'w': case 'W': return 'up';
        case 'ArrowDown': case 's': case 'S': return 'down';
        case 'ArrowLeft': case 'a': case 'A': return 'left';
        case 'ArrowRight': case 'd': case 'D': return 'right';
        default: return null;
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (phaseRef.current === 'title') return; // TitleScreen handles its own keys
      // Classic view sits above the game: let the browser scroll it natively
      // and never let game keys mutate the world behind it.
      if (classicViewRef.current) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();

      // Battle takes over all input while active — no pausing mid-fight.
      if (battleRef.current) {
        handleBattleKey(e);
        return;
      }
      // A trainer is walking over: hold every key until their challenge opens.
      if (cutsceneRef.current) return;

      // Menu keys
      if (e.key === 'm' || e.key === 'M') {
        if (!dialogueRef.current) setMenuOpen((o) => !o);
        return;
      }
      if (e.key === 'Escape') {
        if (menuRef.current) setMenuOpen(false);
        else if (dialogueRef.current) setDialogue(null);
        return;
      }
      if (menuRef.current) return;

      // Dialogue keys
      const cur = dialogueRef.current;
      if (cur) {
        if (e.repeat) return;
        const showActions = cur.typed && cur.page >= cur.spec.pages.length - 1 && (cur.spec.actions?.length ?? 0) > 0;
        if (showActions) {
          const n = cur.spec.actions!.length;
          if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'ArrowUp')
            setDialogue((c) => (c ? { ...c, actionIdx: (c.actionIdx + n - 1) % n } : c));
          else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'ArrowDown')
            setDialogue((c) => (c ? { ...c, actionIdx: (c.actionIdx + 1) % n } : c));
          else if (['e', 'E', 'Enter', ' ', 'z', 'Z'].includes(e.key)) handleDialogueAction(cur.spec.actions![cur.actionIdx]);
          return;
        }
        if (['e', 'E', 'Enter', ' ', 'z', 'Z'].includes(e.key)) advanceDialogue();
        return;
      }

      // World keys
      if (e.key === 'Shift') { runRef.current = true; return; }
      if (['e', 'E', 'Enter', ' ', 'z', 'Z'].includes(e.key)) {
        if (!e.repeat) interact();
        return;
      }
      const dir = dirFor(e.key);
      if (dir) {
        const held = heldRef.current;
        if (!held.includes(dir)) {
          held.unshift(dir);
          const p = playerRef.current;
          if (!p.move && p.facing !== dir) {
            p.facing = dir;
            turnDeadlineRef.current = performance.now() + TURN_MS;
            refreshFacedHint();
          }
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') { runRef.current = false; return; }
      const dir = dirFor(e.key);
      if (dir) heldRef.current = heldRef.current.filter((d2) => d2 !== dir);
    };
    const onBlur = () => {
      heldRef.current = [];
      runRef.current = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [advanceDialogue, handleBattleKey, handleDialogueAction, interact, refreshFacedHint]);

  /* ——— Viewport size & pixel ratio (zoomFor turns these into the zoom) ——— */
  useEffect(() => {
    let dprQuery: MediaQueryList | null = null;
    const measure = () => {
      const dpr = window.devicePixelRatio || 1;
      setViewport({ w: window.innerWidth, h: window.innerHeight, dpr });
      // Dragging the window to a screen with another pixel ratio (laptop <->
      // monitor) doesn't always fire resize, so watch the ratio itself.
      dprQuery?.removeEventListener('change', measure);
      dprQuery = window.matchMedia(`(resolution: ${dpr}dppx)`);
      dprQuery.addEventListener('change', measure);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      dprQuery?.removeEventListener('change', measure);
    };
  }, []);

  /* ——— Map canvas rendering (terrain + buildings + decor) ———
     The canvas holds HD fine pixels per art pixel but is laid out in art
     pixels, so the world's zoom transform shows the extra detail. */
  const animFrameRef = useRef(animFrame);
  animFrameRef.current = animFrame;
  const paintedRowsRef = useRef<string[] | null>(null);
  useEffect(() => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const m = MAPS[mapId];
    // Outdoor maps carry a forest ring; the canvas is shifted up-left by it so
    // map tile (0,0) still sits at world (0,0).
    const pad = isOutdoor(m) ? OUTDOOR_PAD : 0;
    const rows = pad ? padRows(m.rows, pad) : m.rows;
    const w = rows[0].length * TILE;
    const h = rows.length * TILE;
    if (canvas.width !== w * HD) canvas.width = w * HD;
    if (canvas.height !== h * HD) canvas.height = h * HD;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.style.left = `${-pad * TILE}px`;
    canvas.style.top = `${-pad * TILE}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(HD, 0, 0, HD, 0, 0);
    ctx.imageSmoothingEnabled = false;
    for (let y = 0; y < rows.length; y++)
      for (let x = 0; x < rows[0].length; x++)
        paintTerrainTile(ctx, rows[y][x], x, y, m.kind, animFrameRef.current, rows);
    ctx.translate(pad * TILE, pad * TILE);
    for (const b of m.buildings) paintBuilding(ctx, b);
    for (const dec of m.decor) paintDecor(ctx, dec, m.kind);
    paintedRowsRef.current = rows;
  }, [mapId]);

  // Water is the only animated terrain: each frame repaints just its tiles.
  useEffect(() => {
    const ctx = mapCanvasRef.current?.getContext('2d');
    const rows = paintedRowsRef.current;
    if (!ctx || !rows || !isOutdoor(MAPS[mapId])) return;
    ctx.setTransform(HD, 0, 0, HD, 0, 0);
    for (let y = 0; y < rows.length; y++)
      for (let x = 0; x < rows[0].length; x++)
        if (rows[y][x] === 'W') paintWater(ctx, x, y, animFrame, rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animFrame]);

  // Animate water on the town map.
  useEffect(() => {
    if (MAPS[mapId].kind !== 'town' || reducedMotion) return;
    const iv = window.setInterval(() => setAnimFrame((f) => (f + 1) % 2), 600);
    return () => window.clearInterval(iv);
  }, [mapId]);

  // Background music: overworld theme while exploring, battle theme during an
  // encounter; silent on the title screen, the classic CV overlay, or when
  // muted. The cleanup stops the scheduler on unmount / HMR so the interval and
  // its WebAudio voices never orphan (and two loops can't stack on Fast Refresh).
  const musicTrack: MusicTrack = battle ? battle.trainer?.def.music ?? 'battle' : 'overworld';
  useEffect(() => {
    if (phase !== 'playing' || muted || classicView) {
      sfx.stopMusic();
      return;
    }
    sfx.startMusic(musicTrack);
    return () => sfx.stopMusic();
  }, [phase, muted, musicTrack, classicView]);

  /* ——— Town tasks ——— */
  const tasks = TOWN_TASKS.map((t) => ({ label: t.label, done: t.done({ seen, badges, caughtBugs }) }));
  const tasksDone = tasks.filter((t) => t.done).length;
  useEffect(() => {
    const prev = prevTasksDoneRef.current;
    prevTasksDoneRef.current = tasksDone;
    if (prev === null || prev >= TOWN_TASKS.length || tasksDone < TOWN_TASKS.length) return;
    // let the toast for the final task (badge, catch...) finish first
    const t = window.setTimeout(() => {
      sfx.catchWin();
      showToast('★ All TOWN TASKS done — thanks for exploring! The MAILBOX is always open.');
    }, 2800);
    return () => window.clearTimeout(t);
  }, [tasksDone, showToast]);

  useEffect(() => {
    if (!menuOpen) setMenuTab(undefined);
  }, [menuOpen]);

  /* ——— Resume NPC wandering after a conversation ends ——— */
  useEffect(() => {
    if (dialogue === null) {
      for (const n of npcsRef.current) n.paused = false;
    }
  }, [dialogue]);

  /* ——— NPC runtime setup per map ——— */
  useEffect(() => {
    npcsRef.current = MAPS[mapId].npcs.map((def) => ({
      ...makeEntity(def.x, def.y, def.facing),
      def,
      home: { x: def.x, y: def.y },
      nextThink: performance.now() + 800 + rngRef.current() * 2000,
      paused: false,
      approachSteps: 0,
      approaching: false,
    }));
    setBanner(MAPS[mapId].name);
    const t = window.setTimeout(() => setBanner(null), 2200);
    return () => window.clearTimeout(t);
  }, [mapId]);

  /* ——— Main loop ——— */
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const m = mapRef.current;
      const p = playerRef.current;

      // Player movement
      if (p.move) {
        if (now - p.move.start >= p.move.dur) {
          p.tile = { ...p.move.to };
          p.move = null;
          onPlayerLandRef.current();
        }
      }
      if (!p.move && !blockedRef.current && !warpingRef.current) {
        const dir = heldRef.current[0];
        if (dir) {
          if (p.facing !== dir) {
            p.facing = dir;
            turnDeadlineRef.current = now + TURN_MS;
            refreshFacedHint();
          } else if (now >= turnDeadlineRef.current) {
            const delta = DELTA[dir];
            const tx = p.tile.x + delta.x;
            const ty = p.tile.y + delta.y;
            if (!isSolid(m, tx, ty) && !npcAt(tx, ty)) {
              p.stepParity += 1;
              p.move = { from: { ...p.tile }, to: { x: tx, y: ty }, start: now, dur: runRef.current ? RUN_MS : WALK_MS };
            } else if (now - lastBumpRef.current > 380) {
              lastBumpRef.current = now;
              sfx.bump();
            }
          }
        }
      }

      // NPC movement
      for (const n of npcsRef.current) {
        if (n.move && now - n.move.start >= n.move.dur) {
          n.tile = { ...n.move.to };
          n.move = null;
          if (n.approaching && n.approachSteps === 0) {
            n.approaching = false;
            trainerArriveRef.current(n);
          }
        }
        if (!n.move && n.approachSteps > 0) {
          // walking over to a spotted player; the line was clear when spotted
          const dv = DELTA[n.facing];
          n.stepParity += 1;
          n.move = { from: { ...n.tile }, to: { x: n.tile.x + dv.x, y: n.tile.y + dv.y }, start: now, dur: NPC_MS };
          n.approachSteps -= 1;
        }
        if (!n.move && !n.paused && n.def.wander && now >= n.nextThink) {
          n.nextThink = now + 1400 + rngRef.current() * 2200;
          const dirs: Dir[] = ['up', 'down', 'left', 'right'];
          const dir = dirs[Math.floor(rngRef.current() * 4)];
          const delta = DELTA[dir];
          const tx = n.tile.x + delta.x;
          const ty = n.tile.y + delta.y;
          const withinZone = Math.abs(tx - n.home.x) <= n.def.wander.r && Math.abs(ty - n.home.y) <= n.def.wander.r;
          const playerThere = (p.tile.x === tx && p.tile.y === ty) || (p.move && p.move.to.x === tx && p.move.to.y === ty);
          if (rngRef.current() < 0.35) {
            n.facing = dir; // sometimes just look around
          } else if (withinZone && !isSolid(m, tx, ty) && !npcAt(tx, ty) && !playerThere && !warpAt(m, tx, ty)) {
            n.facing = dir;
            n.stepParity += 1;
            n.move = { from: { ...n.tile }, to: { x: tx, y: ty }, start: now, dur: NPC_MS };
          } else {
            n.facing = dir;
          }
        }
        const els = npcElsRef.current[n.def.id];
        if (els) blitEntity(n, els, n.def.palette, now, zoom);
      }

      blitEntity(p, playerElsRef.current, 'player', now, zoom);

      // Camera
      const world = worldRef.current;
      if (world) {
        const dpr = viewport.dpr;
        const s = zoom / dpr; // CSS px per art px
        const mapW = m.rows[0].length * TILE;
        const mapH = m.rows.length * TILE;
        const pos = entityPixelPos(p, now);
        const viewW = viewport.w / s;
        const viewH = viewport.h / s;
        let camX = pos.x + TILE / 2 - viewW / 2;
        let camY = pos.y + TILE / 2 - viewH / 2;
        if (mapW <= viewW) camX = (mapW - viewW) / 2;
        else camX = Math.max(0, Math.min(mapW - viewW, camX));
        if (mapH <= viewH) camY = (mapH - viewH) / 2;
        else camY = Math.max(0, Math.min(mapH - viewH, camY));
        // whole device pixels, so the map and the sprites share one pixel grid
        world.style.transform = `translate3d(${Math.round(-camX * zoom) / dpr}px, ${Math.round(-camY * zoom) / dpr}px, 0) scale(${s})`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [npcAt, refreshFacedHint, zoom, viewport, warpAt]);

  /* ——— Start / save / load ——— */
  const startGame = useCallback(
    (cont: boolean) => {
      // The title screen lingers for its 0.5s exit fade after the classic-view
      // link is clicked; ignore any stray keypress that reaches it so the game
      // can't boot up behind the overlay.
      if (classicViewRef.current) return;
      const save = cont ? loadSave() : null;
      prevTasksDoneRef.current = null;
      if (save) {
        playerRef.current = makeEntity(save.x, save.y, save.facing);
        setBadges(save.badges);
        setMuted(save.muted);
        sfx.muted = save.muted;
        setBugsDefeated(save.bugsDefeated ?? 0);
        setCaughtBugs(save.caughtBugs ?? []);
        setPartyHp({ ...fullPartyHp(), ...(save.partyHp ?? {}) });
        setDefeatedTrainers(save.defeatedTrainers ?? []);
        setSeen(save.seen ?? []);
        setMapId(save.map);
      } else {
        playerRef.current = makeEntity(5, 5, 'down');
        setPartyHp(fullPartyHp());
        setMapId('house');
        window.setTimeout(() => {
          const make = dialogues.intro;
          if (make) setDialogue({ spec: make(), page: 0, typed: false, actionIdx: 0 });
        }, 700);
      }
      setPhase('playing');
    },
    [dialogues]
  );

  const saveGame = useCallback(() => {
    const p = playerRef.current;
    const data: SaveData = {
      map: mapRef.current.id,
      x: p.tile.x,
      y: p.tile.y,
      facing: p.facing,
      badges: badgesRef.current,
      muted: sfx.muted,
      bugsDefeated: bugsDefeatedRef.current,
      caughtBugs: caughtBugsRef.current,
      partyHp: partyHpRef.current,
      defeatedTrainers: defeatedTrainersRef.current,
      seen: seenRef.current,
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      sfx.save();
      showToast('Progress saved!');
    } catch {
      showToast('Could not save (storage unavailable).');
    }
  }, [showToast]);

  const toggleMute = useCallback(() => {
    setMuted((m2) => {
      sfx.muted = !m2;
      return !m2;
    });
  }, []);

  /* ——— Touch handlers ——— */
  const touchDir = useCallback((dir: Dir) => {
    if (!heldRef.current.includes(dir)) {
      heldRef.current.unshift(dir);
      const p = playerRef.current;
      if (!p.move && p.facing !== dir) {
        p.facing = dir;
        turnDeadlineRef.current = performance.now() + TURN_MS;
      }
    }
  }, []);
  const touchStop = useCallback((dir: Dir) => {
    heldRef.current = heldRef.current.filter((d2) => d2 !== dir);
  }, []);

  /* ——— Render ——— */
  const hasSave = useMemo(() => loadSave() !== null, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0b0f14]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      {/* ——— World viewport ——— */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={worldRef} className="absolute left-0 top-0" style={{ transformOrigin: '0 0', willChange: 'transform' }}>
          <canvas ref={mapCanvasRef} className="pixelated absolute left-0 top-0" />

          {/* NPCs */}
          {map.npcs.map((def) => (
            <div
              key={`${mapId}:${def.id}`}
              ref={(el) => {
                npcElsRef.current[def.id] = { ...(npcElsRef.current[def.id] ?? { canvas: null }), el };
              }}
              className="absolute left-0 top-0"
              style={{ width: SPRITE_W, height: SPRITE_H }}
            >
              <canvas
                ref={(el) => {
                  npcElsRef.current[def.id] = { ...(npcElsRef.current[def.id] ?? { el: null }), canvas: el };
                }}
                width={SPRITE_W * HD}
                height={SPRITE_H * HD}
                className="pixelated block"
                style={{ width: SPRITE_W, height: SPRITE_H }}
              />
              {(def.important || emoteNpc === def.id) && (
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.1 }}
                  className="absolute -top-[9px] left-[4.5px] w-[7px] h-[8px]"
                >
                  <div className="w-full h-full bg-[#f8f6ee] border border-[#241d33] grid place-items-center">
                    <span className="text-[5px] leading-none text-[#b91c1c] font-bold">!</span>
                  </div>
                </motion.div>
              )}
            </div>
          ))}

          {/* Player */}
          <div
            ref={(el) => { playerElsRef.current.el = el; }}
            className="absolute left-0 top-0"
            style={{ width: SPRITE_W, height: SPRITE_H }}
          >
            <canvas
              ref={(el) => { playerElsRef.current.canvas = el; }}
              width={SPRITE_W * HD}
              height={SPRITE_H * HD}
              className="pixelated block"
              style={{ width: SPRITE_W, height: SPRITE_H }}
            />
            {inTallGrass && (
              <div className="absolute bottom-0 left-0 w-full h-[6px]" style={{ background: '#57a844' }}>
                <div className="absolute -top-[2px] left-[2px] w-[2px] h-[4px] bg-[#3c8a31]" />
                <div className="absolute -top-[3px] left-[7px] w-[2px] h-[5px] bg-[#3c8a31]" />
                <div className="absolute -top-[2px] left-[12px] w-[2px] h-[4px] bg-[#3c8a31]" />
              </div>
            )}
          </div>

          {/* Grass shuffle particles */}
          <AnimatePresence>
            {particles.map((pt) => (
              <div key={pt.id} className="absolute left-0 top-0 pointer-events-none" style={{ transform: `translate(${pt.x}px, ${pt.y}px)`, zIndex: 60 }}>
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const ang = (i / 6) * Math.PI * 2 + (pt.seed % 10) / 10;
                  return (
                    <motion.span
                      key={i}
                      initial={{ x: 7, y: 10, opacity: 1, scale: 1 }}
                      animate={{ x: 7 + Math.cos(ang) * 9, y: 10 + Math.sin(ang) * 6 - 5, opacity: 0, scale: 0.6 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="absolute w-[3px] h-[3px]"
                      style={{ background: i % 2 ? '#3c8a31' : '#6ab54f' }}
                    />
                  );
                })}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ——— HUD ——— */}
      {phase === 'playing' && !classicView && (
        <>
          <PartyHUD onOpen={() => setMenuOpen(true)} partyHp={partyHp} />
          <div className="absolute right-2 top-2 z-20 flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5">
              <MuteButton muted={muted} onToggle={toggleMute} />
              <button
                onClick={() => setMenuOpen(true)}
                className="rpg-frame-dark px-3 py-2 text-[9px] text-amber-300 hover:brightness-125"
                aria-label="Open backpack menu"
              >
                🎒 BACKPACK <span className="hidden sm:inline text-slate-400">[M]</span>
              </button>
            </div>
            {badges.length > 0 && (
              <div className="rpg-frame-dark px-2 py-1 text-[8px] text-amber-300" title={badges.join(', ')}>
                ★ ×{badges.length}
              </div>
            )}
            <button
              onClick={() => {
                setMenuTab('TASKS');
                setMenuOpen(true);
              }}
              className="rpg-frame-dark px-2 py-1 text-[8px] text-amber-300 hover:brightness-125"
              aria-label={`Town tasks: ${tasksDone} of ${tasks.length} done`}
            >
              TASKS {tasksDone}/{tasks.length}
            </button>
          </div>

          {/* Interact hint */}
          <AnimatePresence>
            {facedHint && !dialogue && !menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className={`absolute inset-x-0 mx-auto w-fit z-20 ${touchMode ? 'bottom-40' : 'bottom-16'}`}
              >
                <div className="rpg-frame-dark px-3 py-1.5 text-[9px] text-amber-300">
                  {touchMode ? 'TAP A' : 'PRESS E'} — {facedHint}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Location banner */}
          <AnimatePresence>
            {banner && (
              <motion.div
                initial={{ x: -140, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -140, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className="absolute inset-x-0 mx-auto w-fit top-16 md:top-4 md:left-auto md:right-40 md:mx-0 z-20"
              >
                <div className="rpg-frame px-4 py-2 text-[10px]">{banner}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                className="absolute top-3 inset-x-0 mx-auto w-fit z-40"
              >
                <div className="rpg-frame px-4 py-2 text-[9px]">{toast}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dialogue */}
          <AnimatePresence>
            {dialogue && (
              <DialogueBox
                spec={dialogue.spec}
                page={dialogue.page}
                typed={dialogue.typed}
                setTyped={(b) => setDialogue((cur) => (cur && !cur.typed && b ? { ...cur, typed: true } : cur))}
                actionIdx={dialogue.actionIdx}
                onAdvance={advanceDialogue}
                onAction={handleDialogueAction}
                touchMode={touchMode}
              />
            )}
          </AnimatePresence>

          {/* Menu */}
          <AnimatePresence>
            {menuOpen && (
              <Backpack
                onClose={() => setMenuOpen(false)}
                initialTab={menuTab}
                tasks={tasks}
                badges={badges}
                bugsDefeated={bugsDefeated}
                caughtBugs={caughtBugs}
                muted={muted}
                onToggleMute={toggleMute}
                onSave={saveGame}
                onClassicView={() => {
                  setMenuOpen(false);
                  setClassicView(true);
                }}
              />
            )}
          </AnimatePresence>

          {/* Battle */}
          <AnimatePresence>
            {battle && (
              <BattleScreen
                battle={battle}
                onAdvance={advanceBattleText}
                onTypedDone={() => setBattle((cur) => (cur && !cur.typed ? { ...cur, typed: true } : cur))}
                onSelectMenu={selectMenuOption}
                onChooseMove={chooseMove}
                onSwitchActive={switchActive}
                onUseCoffee={useCoffee}
                onUseDebugger={useDebugger}
                onBack={() => setBattle((cur) => (cur ? { ...cur, phase: 'menu', cursor: 0 } : cur))}
                caughtBugs={caughtBugs}
                muted={muted}
                onToggleMute={toggleMute}
              />
            )}
          </AnimatePresence>

          {/* Touch controls */}
          {touchMode && !menuOpen && !battle && (
            <DPad onDir={touchDir} onStop={touchStop} onA={handleActionButton} onB={(b) => { runRef.current = b; }} />
          )}

          {/* Desktop key legend */}
          {!touchMode && !dialogue && !battle && (
            <div className="absolute bottom-2 right-2 z-10 text-[7px] text-slate-500 rpg-frame-dark px-2.5 py-1.5 opacity-80">
              WASD MOVE · E TALK · SHIFT RUN · M BAG
            </div>
          )}
        </>
      )}

      {/* ——— Iris-wipe transition for warps ——— */}
      <motion.div
        className="absolute inset-0 z-[45] bg-black pointer-events-none"
        style={{ WebkitMaskImage: irisMask, maskImage: irisMask }}
      />

      {/* ——— Battle-start flash ——— */}
      {battleFlash && <div className="absolute inset-0 z-[55] bg-white pointer-events-none" />}

      {/* ——— Title (hidden while the classic view is open, so it can't bleed
             through the overlay's entrance fade) ——— */}
      <AnimatePresence>
        {phase === 'title' && !classicView && (
          <TitleScreen hasSave={hasSave} onStart={startGame} onClassicView={() => setClassicView(true)} muted={muted} onToggleMute={toggleMute} />
        )}
      </AnimatePresence>

      {/* ——— Classic (recruiter) view — sits above everything, including title ——— */}
      <AnimatePresence>{classicView && <ClassicView onClose={() => setClassicView(false)} />}</AnimatePresence>
    </div>
  );
}
