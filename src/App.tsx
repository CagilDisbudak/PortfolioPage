import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, animate as animateValue } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════════════
   § 1 — PORTFOLIO DATA
   Everything the game displays comes from this object. Edit text here only —
   the world, NPCs, exhibits and menus all read from it.
   ═══════════════════════════════════════════════════════════════════════════ */

const portfolioData = {
  name: 'Çağıl Dişbudak',
  role: 'Backend-focused Software Engineer',
  tagline: 'Building scalable backend systems & resilient infrastructure.',

  about: [
    'Backend engineer crafting reliable systems with a playful touch.',
    'I love shaping APIs, data flows, and infrastructure that scale, while sprinkling in delightful UX.',
    'When not building services, I tinker with animations and micro-interactions.',
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
      backend: { level: 'Expert', items: ['Python (Django/FastAPI)', 'Java (Spring Boot)', 'System Design', 'PostgreSQL/Redis'] },
      devops: { level: 'Solid', items: ['Docker & Kubernetes', 'CI/CD Pipelines', 'AWS Services', 'Datadog/Prometheus'] },
      frontend: { level: 'Functional', items: ['React & TypeScript', 'Tailwind CSS', 'Next.js', 'Modern UI/UX Principles'] },
    },
    competencies: [
      'Scalable Backend Systems',
      'Microservices Architecture',
      'Database Design & Optimization',
      'RESTful & GraphQL API Development',
      'Cloud Infrastructure (AWS/GCP)',
      'Containerization & Orchestration',
    ],
    badges: ['Python', 'Django', 'Java', 'Spring Boot', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'AWS', 'CI/CD'],
  },

  // TODO: paste your real work history here — the Recruiter NPC and the
  // backpack PROFILE tab render whatever is in this array.
  experience: [
    {
      role: 'Backend Engineer',
      company: 'Your Company',
      period: '20XX — Present',
      summary: 'Designing and scaling backend services, APIs and infrastructure.',
    },
  ],

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
      title: 'BookSwap',
      subtitle: 'Peer-to-Peer Book Exchange Platform',
      tech: ['JavaScript', 'HTML/CSS', 'LocalStorage'],
      github: 'https://github.com/CagilDisbudak/BookSwap',
      live: '',
      blurb: 'A fully functional book exchange platform enabling users to list, discover, and swap books locally.',
      achievements: [
        'Designed a responsive UI with a focus on ease of use for non-technical users.',
        'Implemented local storage caching to persist user preferences without a backend.',
        'Optimized asset loading for sub-1s initial render time on mobile devices.',
      ],
      screenColor: '#fbbf24',
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

  testimonials: [
    { name: 'Tech Lead', content: 'Exceptional backend engineering skills. The microservices architecture implemented was robust and scalable.' },
    { name: 'Project Manager', content: 'Reliable, efficient, and always delivers high-quality code.' },
    { name: 'CTO', content: 'Built our entire backend infrastructure from scratch. The system handles scale beautifully.' },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   § 2 — CORE TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */

type Dir = 'up' | 'down' | 'left' | 'right';
type Vec = { x: number; y: number };

const TILE = 16; // native pixels per tile
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

const HEAD_DOWN = [
  '................',
  '....OOOOOOOO....',
  '..OOAAAAAAAAOO..',
  '..OAAAAAAAAAAO..',
  '.OAAAAAAAAAAAAO.',
  '.OAAAAAAAAAAAAO.',
  '.OHHHHHHHHHHHHO.',
  '.OSSESSSSSSESSO.',
  '.OSSESSSSSSESSO.',
  '.OSSSSSSSSSSSSO.',
  '..OSSSSSSSSSSO..',
  '...OOSSSSSSOO...',
];
const HEAD_UP = [
  '................',
  '....OOOOOOOO....',
  '..OOAAAAAAAAOO..',
  '..OAAAAAAAAAAO..',
  '.OAAAAAAAAAAAAO.',
  '.OAAAAAAAAAAAAO.',
  '.OHHHHHHHHHHHHO.',
  '.OHHHHHHHHHHHHO.',
  '.OHHHHHHHHHHHHO.',
  '.OHHHHHHHHHHHHO.',
  '..OHHHHHHHHHHO..',
  '...OOHHHHHHOO...',
];
const HEAD_SIDE = [
  '................',
  '....OOOOOOOO....',
  '..OOAAAAAAAAOO..',
  '..OAAAAAAAAAAO..',
  '.OAAAAAAAAAAAAO.',
  '.OAAAAAAAAAAAAO.',
  '.OHHHHHHHHHHHHO.',
  '.OSESSHHHHHHHHO.',
  '.OSESSHHHHHHHHO.',
  '.OSSSSHHHHHHHHO.',
  '..OSSSHHHHHHHO..',
  '...OOSSSSSSOO...',
];

const TORSO_FRONT = ['..OCCCCCCCCCCO..', '.OSOCCCCCCCCOSO.', '.OSOCDCCCCDCOSO.'];
const TORSO_BACK = ['..OCCCCCCCCCCO..', '.OSOCAAAAAACOSO.', '.OSOCAAAAAACOSO.'];
const TORSO_SIDE = ['..OCCCCCCCCCCO..', '..OCCOSSOCCCCO..', '..OCDOSSODCCCO..'];

const LEGS_STAND = ['...OPPPPPPPPO...', '....OPPOOPPO....', '....OBBOOBBO....', '....OOO..OOO....', '................'];
const LEGS_WALK = ['...OPPPPPPPPO...', '....OPPOOBBO....', '....OBBO..OO....', '....OOO.........', '................'];
const LEGS_SIDE_STAND = ['...OPPPPPPPPO...', '....OPPPPPPO....', '....OBBBBBBO....', '....OOOOOOOO....', '................'];
const LEGS_SIDE_WALK = ['...OPPPPPPPPO...', '...OPPO..OPPO...', '...OBBO..OBBO...', '...OOO....OOO...', '................'];

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
  const colors: Record<string, string> = { O: OUTLINE, E: EYE, ...pal };
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
  paintTopLightShade(ctx, SPRITE_W, SPRITE_H);
  spriteCache.set(key, c);
  return c;
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
  // sparse blade specks, deterministic per tile
  for (let i = 0; i < 4; i++) {
    const rx = Math.floor(hash2(tx * 7 + i, ty * 13 + i) * 14) + 1;
    const ry = Math.floor(hash2(tx * 17 + i, ty * 5 - i) * 14) + 1;
    px(ctx, x + rx, y + ry, 2, 1, '#6ab54f');
  }
  if (r > 0.97) {
    // occasional wildflower
    const fx = x + 6, fy = y + 6;
    const col = r > 0.985 ? '#fef3c7' : '#fda4af';
    px(ctx, fx, fy - 1, 2, 1, col);
    px(ctx, fx, fy + 1, 2, 1, col);
    px(ctx, fx - 1, fy, 1, 2, col);
    px(ctx, fx + 2, fy, 1, 2, col);
    px(ctx, fx, fy, 2, 2, '#fbbf24');
  } else if (r > 0.93) {
    // small rock cluster
    px(ctx, x + 5, y + 8, 5, 3, '#8a8a7a');
    px(ctx, x + 5, y + 8, 5, 1, '#9c9c8c');
    px(ctx, x + 6, y + 10, 3, 1, '#6f6f61');
  } else if (r > 0.88) {
    // bare dirt patch
    px(ctx, x + 4, y + 5, 8, 6, '#b5905c');
    px(ctx, x + 5, y + 6, 2, 1, '#9c7a4c');
    px(ctx, x + 9, y + 8, 2, 1, '#9c7a4c');
  }
}

function paintPath(ctx: Ctx, tx: number, ty: number, rows: string[]) {
  const x = tx * TILE, y = ty * TILE;
  px(ctx, x, y, TILE, TILE, '#e5cf9a');
  for (let i = 0; i < 5; i++) {
    const rx = Math.floor(hash2(tx * 11 + i, ty * 3 + i) * 14) + 1;
    const ry = Math.floor(hash2(tx * 5 - i, ty * 19 + i) * 14) + 1;
    px(ctx, x + rx, y + ry, 1, 1, '#d3b87e');
  }
  px(ctx, x, y, TILE, 1, '#d8c188');
  // Neighbor-aware edge trim: where the path meets grass, a darker rim plus a
  // bright inner line — reads as a slightly sunken dirt road instead of a
  // hard-cut sand rectangle.
  const isP = (xx: number, yy: number) => rows[yy]?.[xx] === 'P';
  if (!isP(tx, ty - 1)) {
    px(ctx, x, y, TILE, 2, '#c4a76e');
    px(ctx, x, y + 2, TILE, 1, '#f2e2b6');
  }
  if (!isP(tx, ty + 1)) {
    px(ctx, x, y + TILE - 2, TILE, 2, '#c4a76e');
    px(ctx, x, y + TILE - 3, TILE, 1, '#d8c188');
  }
  if (!isP(tx - 1, ty)) {
    px(ctx, x, y, 2, TILE, '#c4a76e');
    px(ctx, x + 2, y, 1, TILE, '#f2e2b6');
  }
  if (!isP(tx + 1, ty)) {
    px(ctx, x + TILE - 2, y, 2, TILE, '#c4a76e');
  }
  const r2 = hash2(tx * 31, ty * 13);
  if (r2 > 0.94) {
    // small pebble cluster
    px(ctx, x + 6, y + 7, 2, 2, '#c2a877');
    px(ctx, x + 9, y + 9, 2, 1, '#c2a877');
  } else if (r2 > 0.9) {
    // hairline crack
    px(ctx, x + 4, y + 5, 1, 3, '#c9b077');
    px(ctx, x + 5, y + 8, 4, 1, '#c9b077');
    px(ctx, x + 9, y + 6, 1, 3, '#c9b077');
  }
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

function paintTree(ctx: Ctx, tx: number, ty: number) {
  const x = tx * TILE, y = ty * TILE;
  paintGrass(ctx, tx, ty);
  // soft contact shadow so the trunk sits IN the grass rather than on it
  px(ctx, x + 3, y + 13, 10, 2, 'rgba(30,61,40,0.25)');
  drawMatrix(ctx, TREE_ROWS, TREE_PALETTE, x, y - 8, hash2(tx * 3, ty * 5) > 0.5);
}

function paintWater(ctx: Ctx, tx: number, ty: number, frame: number, rows: string[]) {
  const x = tx * TILE, y = ty * TILE;
  // Checkerboard water base (swaps with the animation frame, GBA-style ripple).
  const checker = (tx + ty + frame) % 2 === 0;
  px(ctx, x, y, TILE, TILE, checker ? '#3f97d9' : '#3d8fcc');
  const off = frame % 2 === 0 ? 0 : 2;
  for (let i = 0; i < 3; i++) {
    const rx = Math.floor(hash2(tx * 3 + i, ty * 7 + i) * 10) + 2;
    const ry = ((Math.floor(hash2(tx * 9 + i, ty * 2 + i) * 12) + off) % 12) + 2;
    px(ctx, x + rx, y + ry, 3, 1, '#7cc0ec');
  }
  // Neighbor-aware shoreline: sandy lip + animated foam dashes where the pond
  // touches land, dark depth line along the bottom and inner sides.
  const isW = (xx: number, yy: number) => rows[yy]?.[xx] === 'W';
  const foamShift = frame % 2 === 0 ? 0 : 3;
  if (!isW(tx, ty - 1)) {
    px(ctx, x, y, TILE, 2, '#e5cf9a');
    px(ctx, x, y + 2, TILE, 1, '#bfe6f4');
    for (let fx = foamShift; fx < TILE; fx += 6) px(ctx, x + fx, y + 3, 3, 1, '#e8f6fb');
  } else {
    px(ctx, x, y, TILE, 1, '#5fb0e6');
  }
  if (!isW(tx, ty + 1)) {
    px(ctx, x, y + TILE - 2, TILE, 2, '#2b6ea6');
    px(ctx, x, y + TILE - 3, TILE, 1, '#357fbd');
  }
  if (!isW(tx - 1, ty)) {
    px(ctx, x, y, 2, TILE, '#357fbd');
    px(ctx, x + 2, y + foamShift + 4, 1, 2, '#bfe6f4');
  }
  if (!isW(tx + 1, ty)) {
    px(ctx, x + TILE - 2, y, 2, TILE, '#357fbd');
    px(ctx, x + TILE - 3, y + (TILE - foamShift - 6), 1, 2, '#bfe6f4');
  }
  if (hash2(tx * 53, ty * 29) > 0.92) {
    // lily pad, gently bobs with the water animation frame
    const ly = y + 6 + (frame % 2 === 0 ? 0 : 1);
    px(ctx, x + 5, ly, 6, 5, '#3f8f4f');
    px(ctx, x + 6, ly + 1, 4, 3, '#4aa85c');
    px(ctx, x + 7, ly + 2, 2, 1, '#2f7a3d');
  }
}

function paintTallGrass(ctx: Ctx, tx: number, ty: number) {
  const x = tx * TILE, y = ty * TILE;
  px(ctx, x, y, TILE, TILE, '#57a844');
  for (let b = 0; b < 5; b++) {
    const bx = x + 1 + b * 3;
    px(ctx, bx, y + 4, 2, 11, '#3c8a31');
    px(ctx, bx + 1, y + 2, 1, 4, '#2f7a27');
  }
  px(ctx, x, y + 14, TILE, 2, '#478f38');
  if (hash2(tx * 71, ty * 41) > 0.9) {
    // a small flower peeking through the blades
    px(ctx, x + 7, y + 3, 2, 2, '#fef3c7');
  }
}

function paintFloor(ctx: Ctx, tx: number, ty: number, kind: string) {
  const x = tx * TILE, y = ty * TILE;
  const base = kind === 'gym' ? '#cbb9a2' : kind === 'gallery' ? '#ded7c8' : '#dcb079';
  const line = kind === 'gym' ? '#b7a48c' : kind === 'gallery' ? '#c9c1b0' : '#c49a64';
  px(ctx, x, y, TILE, TILE, base);
  px(ctx, x, y + 15, TILE, 1, line); // plank seams
  if ((tx + ty) % 2 === 0) px(ctx, x + 8, y, 1, TILE, line);
  else px(ctx, x, y, 1, TILE, line);
}

function paintWall(ctx: Ctx, tx: number, ty: number, kind: string, isFace: boolean) {
  const x = tx * TILE, y = ty * TILE;
  const tone = kind === 'gym' ? ['#5b6478', '#6d7890', '#49505f'] : kind === 'gallery' ? ['#7a6a58', '#8d7c68', '#5f5344'] : ['#8a6f4d', '#9c805c', '#6d5639'];
  if (isFace) {
    px(ctx, x, y, TILE, TILE, tone[1]);
    px(ctx, x, y + 12, TILE, 4, tone[2]); // baseboard
    px(ctx, x, y, TILE, 2, tone[0]);
  } else {
    px(ctx, x, y, TILE, TILE, tone[0]);
    px(ctx, x, y + 14, TILE, 2, tone[2]);
  }
}

function paintRug(ctx: Ctx, tx: number, ty: number, kind: string) {
  const x = tx * TILE, y = ty * TILE;
  paintFloor(ctx, tx, ty, kind);
  const main = kind === 'gym' ? '#4f7cd1' : '#c2564b';
  const trim = kind === 'gym' ? '#3a5ea6' : '#9c4038';
  px(ctx, x + 1, y + 1, 14, 14, main);
  px(ctx, x + 1, y + 1, 14, 2, trim);
  px(ctx, x + 1, y + 13, 14, 2, trim);
}

function paintMat(ctx: Ctx, tx: number, ty: number) {
  const x = tx * TILE, y = ty * TILE;
  px(ctx, x, y, TILE, TILE, '#3e4757');
  px(ctx, x + 2, y + 2, 12, 12, '#59657c');
  px(ctx, x + 4, y + 4, 8, 8, '#6f7d99');
}

type MapKind = 'town' | 'house' | 'gym' | 'gallery';

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
      const below = rows[ty + 1]?.[tx];
      paintWall(ctx, tx, ty, kind, below !== undefined && below !== 'W');
      return;
    }
    case 'R': paintRug(ctx, tx, ty, kind); return;
    case 'M': paintMat(ctx, tx, ty); return;
    default: paintFloor(ctx, tx, ty, kind); return;
  }
}

/* Buildings (town only) — drawn over terrain. */
type Building = {
  x: number; y: number; w: number; h: number;
  roof: string; roofDark: string; wall: string;
  door: Vec; // tile within the building footprint
};

function paintBuilding(ctx: Ctx, b: Building) {
  const x = b.x * TILE, y = b.y * TILE, w = b.w * TILE, h = b.h * TILE;
  const wallRows = 2 * TILE;
  const roofH = h - wallRows;
  // roof
  px(ctx, x, y, w, roofH, b.roof);
  for (let ry = 4; ry < roofH; ry += 4) px(ctx, x, y + ry, w, 1, b.roofDark);
  // ridge cap: dark crown with a bright sunlit line beneath it
  px(ctx, x - 1, y, w + 2, 3, b.roofDark);
  px(ctx, x, y + 3, w, 1, '#ffffff50' as string);
  px(ctx, x - 2, y + roofH - 4, w + 4, 4, b.roofDark); // eaves overhang
  px(ctx, x, y, 2, roofH, b.roofDark);
  px(ctx, x + w - 2, y, 2, roofH, b.roofDark);
  // chimney with a lazy puff of smoke drifting above the ridge
  const chimX = x + w - 10;
  px(ctx, chimX, y - 6, 6, 10, b.roofDark);
  px(ctx, chimX + 1, y - 6, 4, 8, b.roof);
  px(ctx, chimX + 1, y - 9, 2, 2, 'rgba(226,232,240,0.65)');
  px(ctx, chimX + 2, y - 12, 3, 3, 'rgba(241,245,249,0.55)');
  // walls
  const wy = y + roofH;
  px(ctx, x, wy, w, wallRows, b.wall);
  px(ctx, x, wy + wallRows - 3, w, 3, '#00000035');
  px(ctx, x, wy, 2, wallRows, '#00000025');
  px(ctx, x + w - 2, wy, 2, wallRows, '#00000025');
  // windows on the upper wall row, skipping the door column
  for (let cx = b.x + 1; cx < b.x + b.w - 1; cx += 2) {
    if (Math.abs(cx - b.door.x) <= 0) continue;
    const wxp = cx * TILE + 4;
    px(ctx, wxp - 1, wy + 4, 10, 10, '#241d33');
    px(ctx, wxp, wy + 5, 8, 8, '#9fd8f0');
    px(ctx, wxp, wy + 5, 8, 3, '#c9ecf9');
    px(ctx, wxp + 3, wy + 5, 2, 8, '#241d33');
    // flower box under the sill
    px(ctx, wxp - 2, wy + 14, 12, 3, '#8a5a2b');
    px(ctx, wxp - 2, wy + 14, 12, 1, '#a06c36');
    px(ctx, wxp - 1, wy + 12, 2, 2, '#f87171');
    px(ctx, wxp + 3, wy + 12, 2, 2, '#fbbf24');
    px(ctx, wxp + 7, wy + 12, 2, 2, '#f87171');
  }
  // door (fills its tile)
  const dx = b.door.x * TILE, dy = b.door.y * TILE;
  px(ctx, dx, dy - 4, TILE, 4, '#241d33');
  px(ctx, dx + 1, dy, 14, TILE, '#241d33');
  px(ctx, dx + 3, dy + 2, 10, 14, '#6b4423');
  px(ctx, dx + 3, dy + 2, 10, 2, '#845733');
  px(ctx, dx + 11, dy + 8, 2, 2, '#e5cf9a');
  // welcome mat on the ground just outside the door
  px(ctx, dx + 2, dy + TILE, TILE - 4, 3, '#8a5a2b');
  px(ctx, dx + 3, dy + TILE + 1, TILE - 6, 1, '#a06c36');
}

/* Decor painters — furniture, signs, exhibits. Painted onto the map canvas. */
type DecorType =
  | 'sign' | 'mailbox' | 'bed' | 'desk' | 'bookshelf' | 'tv' | 'sofa'
  | 'plant' | 'exhibit' | 'bench' | 'weights' | 'platform';

type Decor = {
  type: DecorType;
  x: number; y: number;
  solid?: boolean;
  color?: string;
  dialogueId?: string; // key into the dialogue registry
};

function paintDecor(ctx: Ctx, d: Decor, kind: MapKind) {
  const x = d.x * TILE, y = d.y * TILE;
  switch (d.type) {
    case 'sign':
      px(ctx, x + 7, y + 8, 2, 7, '#6b4423');
      px(ctx, x + 2, y + 2, 12, 7, '#8a5a2b');
      px(ctx, x + 3, y + 3, 10, 5, '#c89858');
      px(ctx, x + 4, y + 4, 8, 1, '#7a4c22');
      px(ctx, x + 4, y + 6, 6, 1, '#7a4c22');
      break;
    case 'mailbox':
      px(ctx, x + 7, y + 8, 2, 7, '#57534e');
      px(ctx, x + 3, y + 2, 10, 7, '#dc2626');
      px(ctx, x + 3, y + 2, 10, 2, '#f87171');
      px(ctx, x + 11, y + 4, 2, 3, '#fbbf24');
      break;
    case 'bed':
      px(ctx, x + 1, y + 1, 14, 30, '#8a5a2b');
      px(ctx, x + 2, y + 2, 12, 28, '#e2e8f0');
      px(ctx, x + 2, y + 2, 12, 8, '#f8fafc');
      px(ctx, x + 2, y + 12, 12, 18, '#38bdf8');
      px(ctx, x + 2, y + 12, 12, 2, '#0ea5e9');
      break;
    case 'desk':
      px(ctx, x + 1, y + 6, 30, 9, '#8a5a2b');
      px(ctx, x + 1, y + 6, 30, 2, '#a06c36');
      px(ctx, x + 3, y - 4, 12, 10, '#241d33'); // monitor
      px(ctx, x + 4, y - 3, 10, 7, '#38bdf8');
      px(ctx, x + 5, y - 2, 6, 1, '#e0f2fe');
      px(ctx, x + 5, y, 8, 1, '#e0f2fe');
      px(ctx, x + 20, y + 1, 8, 5, '#475569'); // books
      break;
    case 'bookshelf':
      px(ctx, x + 1, y - 6, 14, 21, '#6b4423');
      px(ctx, x + 2, y - 5, 12, 5, '#241d33');
      px(ctx, x + 2, y + 2, 12, 5, '#241d33');
      px(ctx, x + 2, y + 9, 12, 5, '#241d33');
      const cols = ['#dc2626', '#2563eb', '#16a34a', '#f59e0b'];
      for (let s = 0; s < 3; s++)
        for (let i = 0; i < 4; i++)
          px(ctx, x + 3 + i * 3, y - 4 + s * 7, 2, 4, cols[(i + s) % 4]);
      break;
    case 'tv':
      px(ctx, x + 1, y + 3, 14, 10, '#241d33');
      px(ctx, x + 2, y + 4, 12, 7, '#94a3b8');
      px(ctx, x + 3, y + 5, 4, 2, '#e2e8f0');
      px(ctx, x + 5, y + 13, 6, 2, '#0f172a');
      break;
    case 'sofa':
      px(ctx, x + 1, y + 4, 14, 10, '#b91c1c');
      px(ctx, x + 1, y + 4, 14, 3, '#dc2626');
      px(ctx, x + 1, y + 2, 3, 12, '#991b1b');
      px(ctx, x + 12, y + 2, 3, 12, '#991b1b');
      break;
    case 'plant':
      px(ctx, x + 5, y + 9, 6, 6, '#b45309');
      px(ctx, x + 4, y + 9, 8, 2, '#92400e');
      px(ctx, x + 4, y + 1, 8, 8, '#16a34a');
      px(ctx, x + 6, y - 1, 4, 4, '#22c55e');
      px(ctx, x + 2, y + 4, 3, 4, '#15803d');
      px(ctx, x + 11, y + 4, 3, 4, '#15803d');
      break;
    case 'exhibit': {
      // pedestal + glowing project screen
      px(ctx, x + 2, y + 10, 12, 6, '#8d7c68');
      px(ctx, x + 2, y + 10, 12, 2, '#a5947e');
      px(ctx, x + 1, y - 6, 14, 16, '#241d33');
      px(ctx, x + 2, y - 5, 12, 12, d.color ?? '#38bdf8');
      px(ctx, x + 3, y - 4, 10, 3, '#ffffff88' as string);
      px(ctx, x + 3, y + 1, 7, 1, '#ffffffaa' as string);
      px(ctx, x + 3, y + 3, 9, 1, '#ffffff66' as string);
      break;
    }
    case 'bench':
      px(ctx, x + 1, y + 5, 14, 4, '#8a5a2b');
      px(ctx, x + 1, y + 9, 2, 5, '#6b4423');
      px(ctx, x + 13, y + 9, 2, 5, '#6b4423');
      break;
    case 'weights':
      px(ctx, x + 1, y + 7, 14, 3, '#475569');
      px(ctx, x + 1, y + 4, 3, 9, '#334155');
      px(ctx, x + 12, y + 4, 3, 9, '#334155');
      px(ctx, x + 5, y + 11, 6, 3, '#64748b');
      break;
    case 'platform':
      px(ctx, x, y, TILE, TILE * 2, '#8d7c68');
      px(ctx, x, y, TILE, 3, '#a5947e');
      px(ctx, x, y + TILE * 2 - 3, TILE, 3, '#5f5344');
      break;
  }
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
};
type GameMap = {
  id: string; name: string; kind: MapKind;
  rows: string[];
  buildings: Building[];
  decor: Decor[];
  npcs: NPCDef[];
  warps: Warp[];
};

const TOWN_ROWS = [
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGPGGGGGGGGGGGGGGGGGPGGGGGGTT',
  'TTGGGGGGGPGGGGGGGGGGGGGGGGGPGGGGGGTT',
  'TTGGPPPPPPPPPPPPPPPPPPPPPPPPPPPPGGTT',
  'TTGGPPPPPPPPPPPPPPPPPPPPPPPPPPPPGGTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGWWWWWGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGWWWWWGGGGGGGGGGGGTT',
  'TTGGGGGGGGGGGGPGGWWWWWGGtttttttGGGTT',
  'TTGGGGGGGGGGGGPGGWWWWWGGtttttttGGGTT',
  'TTGGGGGGGPPPPPPGGGGGGGGGtttttttGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGtttttttGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGtttttttGGGTT',
  'TTGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGTT',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
];

const MAPS: Record<string, GameMap> = {
  town: {
    id: 'town',
    name: 'PORTFOLIO TOWN',
    kind: 'town',
    rows: TOWN_ROWS,
    buildings: [
      { x: 5, y: 4, w: 9, h: 6, roof: '#2dd4bf', roofDark: '#14877a', wall: '#efe6d2', door: { x: 9, y: 9 } },
      { x: 23, y: 4, w: 9, h: 6, roof: '#818cf8', roofDark: '#4f46b8', wall: '#e8e2f2', door: { x: 27, y: 9 } },
      { x: 6, y: 15, w: 6, h: 5, roof: '#f87171', roofDark: '#b83f3f', wall: '#f3ead4', door: { x: 9, y: 19 } },
    ],
    decor: [
      { type: 'sign', x: 11, y: 10, solid: true, dialogueId: 'sign_gallery' },
      { type: 'sign', x: 29, y: 10, solid: true, dialogueId: 'sign_gym' },
      { type: 'sign', x: 16, y: 21, solid: true, dialogueId: 'sign_welcome' },
      { type: 'mailbox', x: 7, y: 20, solid: true, dialogueId: 'mailbox' },
    ],
    npcs: [
      { id: 'guide', name: 'GUIDE', palette: 'guide', x: 12, y: 19, facing: 'down', wander: { r: 2 }, important: true, dialogueId: 'npc_guide' },
      { id: 'recruiter', name: 'RECRUITER', palette: 'recruiter', x: 20, y: 12, facing: 'left', wander: { r: 4 }, important: true, dialogueId: 'npc_recruiter' },
      { id: 'curator', name: 'CURATOR', palette: 'curator', x: 13, y: 11, facing: 'down', wander: { r: 2 }, dialogueId: 'npc_curator_out' },
      { id: 'fan', name: 'GYM FAN', palette: 'fan', x: 24, y: 11, facing: 'right', wander: { r: 2 }, dialogueId: 'npc_fan' },
      { id: 'kid', name: 'KID', palette: 'kid', x: 26, y: 21, facing: 'down', wander: { r: 3 }, dialogueId: 'npc_kid' },
    ],
    warps: [
      { x: 9, y: 9, toMap: 'gallery', toX: 8, toY: 9, facing: 'up' },
      { x: 27, y: 9, toMap: 'gym', toX: 7, toY: 9, facing: 'up' },
      { x: 9, y: 19, toMap: 'house', toX: 5, toY: 8, facing: 'up' },
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
      { id: 'leader', name: 'GYM LEADER', palette: 'leader', x: 7, y: 2, facing: 'down', important: true, dialogueId: 'npc_leader' },
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
    rows: [
      'WWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWW',
      'WFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFFFW',
      'WFFFFFFFFFFFFFFFW',
      'WWWWWWWWMWWWWWWWW',
    ],
    buildings: [],
    decor: [
      ...portfolioData.projects.map((p, i) => ({
        type: 'exhibit' as DecorType,
        x: 2 + i * 3,
        y: 2,
        solid: true,
        color: p.screenColor,
        dialogueId: `project_${i}`,
      })),
      { type: 'bench', x: 4, y: 7, solid: true },
      { type: 'bench', x: 12, y: 7, solid: true },
      { type: 'plant', x: 1, y: 9, solid: true },
      { type: 'plant', x: 15, y: 9, solid: true },
    ],
    npcs: [
      { id: 'curator_in', name: 'CURATOR', palette: 'curator', x: 11, y: 5, facing: 'down', wander: { r: 2 }, important: true, dialogueId: 'npc_curator_in' },
    ],
    warps: [{ x: 8, y: 10, toMap: 'town', toX: 9, toY: 10, facing: 'down' }],
  },
};

// Dev-time sanity checks: every map row must match its width, warps must land on open tiles.
if (import.meta.env.DEV) {
  for (const m of Object.values(MAPS)) {
    const w = m.rows[0].length;
    m.rows.forEach((r, i) => {
      if (r.length !== w) console.error(`[maps] ${m.id} row ${i} has length ${r.length}, expected ${w}`);
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 6 — DIALOGUE CONTENT (generated from portfolioData)
   ═══════════════════════════════════════════════════════════════════════════ */

type DialogueAction = { label: string; href?: string; grantBadge?: string };
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

function buildDialogues(hasBadge: (b: string) => boolean): Record<string, () => DialogueSpec> {
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

    intro: () => ({
      speaker: 'NARRATOR',
      pages: [
        `Welcome to PORTFOLIO TOWN! This whole world is the portfolio of ${d.name} — ${d.role}.`,
        'Walk with WASD or ARROW KEYS. Hold SHIFT to run. Press E to talk, read and interact.',
        'Exit the house to explore. Visit the SKILLS GYM, browse the PROJECT GALLERY, and check the MAILBOX to get in touch!',
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
        'The RED-ROOF house is home base. The TEAL roof up north is the PROJECT GALLERY, and the PURPLE roof is the SKILLS GYM.',
        'Talk to everyone! Oh — and press M anytime to open the BACKPACK menu. The CV is in there.',
      ],
    }),

    npc_recruiter: () => ({
      speaker: 'RECRUITER',
      pages: flatten([
        'Psst... I have the scoop on the work history around here.',
        ...d.experience.map((e) => `${e.role} @ ${e.company} (${e.period}): ${e.summary}`),
        `Want details? The full CV is in the BACKPACK menu, or grab it from the mailbox owner at ${d.contact.email}.`,
      ]),
    }),

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

    npc_leader: () =>
      hasBadge('BACKEND BADGE')
        ? {
            speaker: 'GYM LEADER',
            pages: [
              'You already hold the BACKEND BADGE. Wear it well.',
              `Remember the core disciplines: ${d.skills.competencies.slice(0, 3).join(', ')}...`,
            ],
          }
        : {
            speaker: 'GYM LEADER',
            pages: flatten([
              `So, a challenger. I am the leader of this gym, and my specialty is what this whole town runs on: ${d.role.toUpperCase()}.`,
              `My championship team: ${d.skills.competencies.join(', ')}.`,
              'You listened all the way through... impressive stamina. Very well — take this!',
            ]),
            actions: [{ label: 'ACCEPT THE BACKEND BADGE', grantBadge: 'BACKEND BADGE' }, { label: 'CLOSE' }],
          },

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
        'A documentary about teamwork is on. People are sharing their reviews:',
        ...d.testimonials.map((t) => `"${t.content}" — ${t.name}`),
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
type BugSpecies = { id: string; name: string; color: string; accent: string; dark: string; maxHp: number; power: [number, number]; intro: string };

const BUG_SPECIES: BugSpecies[] = [
  { id: 'syntax', name: 'SYNTAX BUG', color: '#ef4444', accent: '#fecaca', dark: '#7f1d1d', maxHp: 26, power: [3, 7], intro: 'A wild SYNTAX BUG appeared!' },
  { id: 'null', name: 'NULL BUG', color: '#a78bfa', accent: '#ede9fe', dark: '#4c1d95', maxHp: 30, power: [4, 8], intro: 'A wild NULL BUG appeared out of nowhere!' },
  { id: 'merge', name: 'MERGE CONFLICT', color: '#22c55e', accent: '#dcfce7', dark: '#14532d', maxHp: 34, power: [4, 9], intro: 'A wild MERGE CONFLICT blocks the path!' },
  { id: 'race', name: 'RACE CONDITION', color: '#fbbf24', accent: '#fef9c3', dark: '#78350f', maxHp: 28, power: [3, 8], intro: 'A wild RACE CONDITION flickers into view!' },
];

const SKILL_MOVES: Record<string, Move[]> = {
  PYTHON: [{ name: 'REFACTOR', power: [5, 9] }, { name: 'LIST COMPREHENSION', power: [4, 8] }, { name: 'ASYNC AWAIT', power: [6, 10] }],
  JAVA: [{ name: 'DEPENDENCY INJECTION', power: [5, 9] }, { name: 'ENTERPRISE PATTERN', power: [6, 10] }, { name: 'GARBAGE COLLECT', power: [4, 8] }],
  DOCKER: [{ name: 'CONTAINERIZE', power: [5, 9] }, { name: 'MULTI-STAGE BUILD', power: [6, 10] }, { name: 'COMPOSE UP', power: [4, 8] }],
  K8S: [{ name: 'AUTO-SCALE', power: [5, 9] }, { name: 'ROLLING UPDATE', power: [4, 8] }, { name: 'POD RESTART', power: [6, 10] }],
  POSTGRES: [{ name: 'INDEX SCAN', power: [5, 9] }, { name: 'ACID COMMIT', power: [6, 10] }, { name: 'QUERY OPTIMIZE', power: [4, 8] }],
  REACT: [{ name: 'RE-RENDER', power: [4, 8] }, { name: 'HOOK INTO STATE', power: [5, 9] }, { name: 'VIRTUAL DOM DIFF', power: [6, 10] }],
};
const DEFAULT_MOVES: Move[] = [{ name: 'DEBUG', power: [4, 8] }];

type BattlePartyMember = { name: string; abbr: string; color: string; maxHp: number; hp: number; moves: Move[] };
type BattlePhase = 'text' | 'menu' | 'fight' | 'party' | 'bag';
type BattleNext = 'menu' | 'enemyTurn' | 'victory' | 'defeat' | 'runSuccess';
type BattleState = {
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
};

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
    paintTopLightShade(ctx, BUG_W, BUG_H);
    bugSpriteCache.set(species.id, c);
    return c;
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
  paintTopLightShade(ctx, BUG_W, BUG_H);
  bugSpriteCache.set(species.id, c);
  return c;
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
  paintTopLightShade(ctx, CREATURE_W, CREATURE_H);
  creatureSpriteCache.set(skillName, c);
  return c;
}

/* Battle backdrop: one 320x180 pixel painting scaled to fill the screen —
   layered sky, drifting clouds, a distant treeline, and grassy combat
   platforms under each fighter. Replaces the old flat two-color gradient. */
let battleBackdropCache: HTMLCanvasElement | null = null;
function getBattleBackdrop(): HTMLCanvasElement {
  if (battleBackdropCache) return battleBackdropCache;
  const W = 320, H = 180;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  // sky bands, light at the horizon
  px(ctx, 0, 0, W, 40, '#8ecdec');
  px(ctx, 0, 40, W, 30, '#9dd6ef');
  px(ctx, 0, 70, W, 20, '#b3e1f4');
  px(ctx, 0, 90, W, 10, '#cceaf7');
  // sun with a soft halo, upper left
  px(ctx, 34, 16, 12, 12, '#fff7cf');
  px(ctx, 36, 14, 8, 16, '#fff7cf');
  px(ctx, 32, 18, 16, 8, '#fff7cf');
  px(ctx, 37, 17, 6, 10, '#ffeda8');
  px(ctx, 35, 19, 10, 6, '#ffeda8');
  // pixel clouds (flat-bottomed puffs, deterministic placement)
  const cloud = (cx: number, cy: number, s: number) => {
    px(ctx, cx, cy + 3 * s, 16 * s, 4 * s, '#ffffff');
    px(ctx, cx + 2 * s, cy, 7 * s, 4 * s, '#ffffff');
    px(ctx, cx + 8 * s, cy + 1 * s, 6 * s, 3 * s, '#ffffff');
    px(ctx, cx, cy + 6 * s, 16 * s, 1 * s, '#dceef8');
  };
  cloud(96, 18, 2);
  cloud(210, 34, 1);
  cloud(262, 12, 2);
  cloud(20, 52, 1);
  // distant treeline silhouette on the horizon
  for (let x = 0; x < W; x += 10) {
    const h2 = 6 + Math.floor(hash2(x, 7) * 5);
    px(ctx, x, 100 - h2, 10, h2, '#5e9e6b');
    px(ctx, x + 2, 100 - h2 - 2, 6, 2, '#5e9e6b');
  }
  px(ctx, 0, 98, W, 2, '#6fae76');
  // ground: banded grass, darker toward the bottom edge
  px(ctx, 0, 100, W, 26, '#8fc95e');
  px(ctx, 0, 126, W, 28, '#7fbc52');
  px(ctx, 0, 154, W, 26, '#6bb246');
  for (let i = 0; i < 40; i++) {
    const gx = Math.floor(hash2(i * 13, 3) * W);
    const gy = 102 + Math.floor(hash2(i * 7, 11) * 70);
    px(ctx, gx, gy, 2, 1, gy < 130 ? '#7fbc52' : '#5da03c');
  }
  // combat platforms: light oval pads with darker rims
  const platform = (cx: number, cy: number, rx: number, ry: number) => {
    ctx.fillStyle = '#5da03c';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 1, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a4d970';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 2, ry - 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b8e386';
    ctx.beginPath();
    ctx.ellipse(cx - rx * 0.15, cy - 1, rx * 0.6, ry * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  platform(248, 66, 52, 12); // enemy pad, floats against the horizon
  platform(85, 130, 58, 14); // player pad, lower-left (above the text box)
  battleBackdropCache = c;
  return c;
}

/* ═══════════════════════════════════════════════════════════════════════════
   § 7 — SOUND (tiny WebAudio chiptune blips)
   ═══════════════════════════════════════════════════════════════════════════ */

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
  confirm() { this.tone(660, 0.06); this.tone(990, 0.08, 'square', 0.04, 0.06); }
  bump() { this.tone(110, 0.07, 'triangle', 0.06); }
  door() { this.tone(520, 0.07); this.tone(330, 0.1, 'square', 0.04, 0.07); }
  rustle() { this.tone(220, 0.04, 'triangle', 0.03); this.tone(180, 0.04, 'triangle', 0.03, 0.04); }
  badge() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.12, 'square', 0.05, i * 0.11)); }
  save() { this.tone(784, 0.08); this.tone(1175, 0.14, 'square', 0.04, 0.09); }
  encounter() { [220, 180, 140].forEach((f, i) => this.tone(f, 0.1, 'square', 0.05, i * 0.09)); }
  hit() { this.tone(140, 0.05, 'square', 0.07); }
}
const sfx = new SFX();

/* ═══════════════════════════════════════════════════════════════════════════
   § 8 — SAVE / LOAD
   ═══════════════════════════════════════════════════════════════════════════ */

const SAVE_KEY = 'portfolio-town-save-v1';
type SaveData = { map: string; x: number; y: number; facing: Dir; badges: string[]; muted: boolean; bugsDefeated: number };

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
type NPCRuntime = Entity & { def: NPCDef; home: Vec; nextThink: number; paused: boolean };
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

function blitEntity(e: Entity, els: EntityEls, palette: string, now: number) {
  if (!els.el || !els.canvas) return;
  const pos = entityPixelPos(e, now);
  // sprite is 20px tall on a 16px tile — anchor feet to the tile bottom
  els.el.style.transform = `translate3d(${pos.x}px, ${pos.y - 4}px, 0)`;
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
      ctx.clearRect(0, 0, SPRITE_W, SPRITE_H);
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
      className={`absolute inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[620px] max-w-full z-30 ${touchMode ? 'bottom-36' : 'bottom-4'}`}
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

function PartyHUD({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="absolute left-2 top-2 z-20 flex flex-col gap-1" aria-label="Skill party">
      {portfolioData.skills.party.map((s) => (
        <button
          key={s.name}
          onClick={onOpen}
          className="group flex items-center gap-1.5 rpg-frame-dark px-1.5 py-1 hover:brightness-125 cursor-pointer"
          title={`${s.name} — Lv.${s.lv} ${s.type}`}
        >
          <span
            className="w-5 h-5 grid place-items-center text-[7px] border-2"
            style={{ background: s.color, borderColor: '#10131c', color: '#10131c' }}
          >
            {s.abbr}
          </span>
          <span className="hidden md:flex flex-col w-20">
            <span className="text-[7px] text-left leading-tight">{s.name} <span className="text-amber-300">Lv{s.lv}</span></span>
            <span className="h-1.5 mt-0.5 w-full bg-[#10131c] border border-[#3d4663]">
              <span
                className="block h-full"
                style={{ width: `${s.lv}%`, background: s.lv > 75 ? '#4ade80' : s.lv > 45 ? '#fbbf24' : '#f87171' }}
              />
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

function Backpack({
  onClose,
  badges,
  bugsDefeated,
  muted,
  onToggleMute,
  onSave,
}: {
  onClose: () => void;
  badges: string[];
  bugsDefeated: number;
  muted: boolean;
  onToggleMute: () => void;
  onSave: () => void;
}) {
  const tabs = ['PROFILE', 'SKILLS', 'PROJECTS', 'CONTACT'] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>('PROFILE');
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
              <a
                href={cvHref}
                download={portfolioData.contact.cvFile}
                className="inline-block mt-4 px-3 py-2 text-[9px] bg-amber-400 border-2 border-[#2b2340] shadow-[3px_3px_0_#2b2340] active:translate-y-0.5 active:shadow-none"
              >
                ⬇ DOWNLOAD CV (PDF)
              </a>
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
          <span className="ml-auto text-[8px] text-[#2b234066]">M / ESC to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TitleScreen({ hasSave, onStart }: { hasSave: boolean; onStart: (cont: boolean) => void }) {
  const options = hasSave ? ['CONTINUE', 'NEW GAME'] : ['NEW GAME'];
  const [idx, setIdx] = useState(0);
  const spriteRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    let f = 0;
    const iv = window.setInterval(() => {
      f = (f + 1) % 4;
      const ctx = spriteRef.current?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, SPRITE_W, SPRITE_H);
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
        <canvas ref={spriteRef} width={SPRITE_W} height={SPRITE_H} className="pixelated mx-auto mt-6 w-16 h-20" />
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

function BattleScreen({
  battle,
  onAdvance,
  onTypedDone,
  onSelectMenu,
  onChooseMove,
  onSwitchActive,
  onUseCoffee,
  onBack,
}: {
  battle: BattleState;
  onAdvance: () => void;
  onTypedDone: () => void;
  onSelectMenu: (i: number) => void;
  onChooseMove: (i: number) => void;
  onSwitchActive: (i: number) => void;
  onUseCoffee: () => void;
  onBack: () => void;
}) {
  const enemyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const enemyShakeRef = useRef<HTMLDivElement | null>(null);
  const playerShakeRef = useRef<HTMLDivElement | null>(null);
  const prevHitEnemy = useRef(battle.hitEnemy);
  const prevHitPlayer = useRef(battle.hitPlayer);
  const active = battle.party[battle.active];

  useEffect(() => {
    const ctx = enemyCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, BUG_W, BUG_H);
      ctx.drawImage(getBugSprite(battle.enemy), 0, 0);
    }
  }, [battle.enemy]);

  useEffect(() => {
    const ctx = playerCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, CREATURE_W, CREATURE_H);
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
      if (!reducedMotion) {
        playerShakeRef.current?.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }],
          { duration: 400, easing: 'ease-out' }
        );
        enemyShakeRef.current?.animate(LUNGE_TOWARD_PLAYER, { duration: 320, easing: 'ease-out' });
      }
    }
  }, [battle.hitPlayer]);

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
      <canvas
        ref={(el) => {
          const ctx = el?.getContext('2d');
          if (ctx && el && el.dataset.painted !== '1') {
            el.dataset.painted = '1';
            ctx.drawImage(getBattleBackdrop(), 0, 0);
          }
        }}
        width={320}
        height={180}
        className="pixelated absolute inset-0 w-full h-full"
      />
      <div className="relative flex-1 overflow-hidden">
        {/* Enemy platform */}
        <div className="absolute right-[13%] top-[19%] flex flex-col items-end gap-1.5">
          <div className="rpg-frame px-2.5 py-1.5 text-[9px] min-w-[150px]">
            <span>{battle.enemy.name}</span>
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
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-[50%] bg-black/20" />
              <canvas ref={enemyCanvasRef} width={BUG_W} height={BUG_H} className="pixelated" style={{ width: BUG_W * 4.5, height: BUG_H * 4.5 }} />
            </div>
          </motion.div>
        </div>

        {/* Player platform */}
        <div className="absolute left-[18%] bottom-[10%] flex flex-col items-start gap-1.5">
          <motion.div animate={reducedMotion ? undefined : { y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }} className="order-2">
            <div ref={playerShakeRef} className="relative">
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 h-4 rounded-[50%] bg-black/20" />
              <canvas ref={playerCanvasRef} width={CREATURE_W} height={CREATURE_H} className="pixelated" style={{ width: CREATURE_W * 4.5, height: CREATURE_H * 4.5 }} />
            </div>
          </motion.div>
          <div className="rpg-frame px-2.5 py-1.5 text-[9px] min-w-[160px] order-1">
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
        </div>
      </div>

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
            <button onClick={onBack} className={`w-full ${optionCls(battle.cursor === 1)}`}>◀ BACK</button>
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
  gallery: { x: 8, y: 9 },
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
            draw(ctx);
          }
        }}
        width={w}
        height={h}
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
            draw={(ctx) => facings.forEach((f, i) => ctx.drawImage(getSpriteFrame(p, f, 0), i * (SPRITE_W + 4), 0))}
          />
        ))}
      </div>
      <h2 className="text-[9px] mb-2 text-slate-400">WILD BUGS</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {BUG_SPECIES.map((s) => (
          <SheetCanvas key={s.id} label={s.name} w={BUG_W} h={BUG_H} zoom={5} draw={(ctx) => ctx.drawImage(getBugSprite(s), 0, 0)} />
        ))}
      </div>
      <h2 className="text-[9px] mb-2 text-slate-400">SKILL CREATURES</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {portfolioData.skills.party.map((s) => (
          <SheetCanvas key={s.name} label={s.name} w={CREATURE_W} h={CREATURE_H} zoom={5} draw={(ctx) => ctx.drawImage(getSkillCreatureSprite(s.name), 0, 0)} />
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
      <SheetCanvas label="backdrop 320x180" w={320} h={180} zoom={2} draw={(ctx) => ctx.drawImage(getBattleBackdrop(), 0, 0)} />
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
  const [facedHint, setFacedHint] = useState(false);
  const [emoteNpc, setEmoteNpc] = useState<string | null>(null);
  const [scale, setScale] = useState(3);
  const [viewport, setViewport] = useState({ w: 800, h: 600 });
  const [animFrame, setAnimFrame] = useState(0);
  const [inTallGrass, setInTallGrass] = useState(false);
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [battleFlash, setBattleFlash] = useState(false);
  const [bugsDefeated, setBugsDefeated] = useState(0);

  const touchMode = useMemo(
    () => typeof window !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) && window.matchMedia('(pointer: coarse)').matches,
    []
  );

  /* ——— Refs (mutable engine state) ——— */
  const map = MAPS[mapId];
  const mapRef = useRef(map);
  mapRef.current = map;
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

  blockedRef.current = phase !== 'playing' || dialogue !== null || menuOpen || fade || battle !== null;

  const dialogues = useMemo(() => buildDialogues((b) => badgesRef.current.includes(b)), []);

  /* ——— Helpers ——— */
  const showToast = useCallback((text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const isSolid = useCallback((m: GameMap, x: number, y: number): boolean => {
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
    setFacedHint(target !== null);
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

  const handleDialogueAction = useCallback(
    (a: DialogueAction) => {
      if (a.grantBadge) grantBadge(a.grantBadge);
      if (a.href) window.open(a.href, a.href.startsWith('mailto:') ? '_self' : '_blank', 'noopener');
      setDialogue(null);
    },
    [grantBadge]
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
      const make = dialogues[n.def.dialogueId];
      if (make) openDialogue(make());
    } else if (target.decor?.dialogueId) {
      const make = dialogues[target.decor.dialogueId];
      if (make) openDialogue(make());
    }
  }, [dialogues, facedInteractable, openDialogue]);

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
        setFacedHint(false);
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

  const startBattle = useCallback(() => {
    const species = BUG_SPECIES[Math.floor(rngRef.current() * BUG_SPECIES.length)];
    const party: BattlePartyMember[] = portfolioData.skills.party.map((s) => {
      const maxHp = 20 + Math.round(s.lv / 2);
      return { name: s.name, abbr: s.abbr, color: s.color, maxHp, hp: maxHp, moves: SKILL_MOVES[s.name] ?? DEFAULT_MOVES };
    });
    sfx.encounter();
    setBattleFlash(true);
    window.setTimeout(() => setBattleFlash(false), 180);
    setBattle({
      enemy: species,
      enemyHp: species.maxHp,
      party,
      active: 0,
      phase: 'text',
      msgs: [species.intro],
      msgIdx: 0,
      typed: false,
      next: 'menu',
      cursor: 0,
      hitEnemy: 0,
      hitPlayer: 0,
    });
  }, []);

  useEffect(() => {
    if (FORCE_BATTLE && phase === 'playing') startBattle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

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
          sfx.hit();
          if (hp === 0) {
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
          setBugsDefeated((n) => n + 1);
          sfx.badge();
          showToast(`★ Squashed the ${b.enemy.name}!`);
          setBattle(null);
          return;
        case 'defeat':
          showToast('Your skills retreat to patch things up. No harm done!');
          setBattle(null);
          return;
        case 'runSuccess':
          showToast('Got away safely!');
          setBattle(null);
          return;
        default:
          setBattle({ ...b, phase: 'menu', cursor: 0 });
      }
    },
    [showToast]
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
    const dmg = randInt(rngRef.current, move.power[0], move.power[1]);
    const enemyHp = Math.max(0, b.enemyHp - dmg);
    sfx.hit();
    if (enemyHp <= 0) {
      setBattle({
        ...b,
        enemyHp,
        phase: 'text',
        msgs: [`${attacker.name} used ${move.name}!`, `The wild ${b.enemy.name} was defeated!`],
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
        msgs: [`${attacker.name} used ${move.name}!`],
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

  const switchActive = useCallback((idx: number) => {
    const b = battleRef.current;
    if (!b || b.phase !== 'party') return;
    if (idx === b.active || b.party[idx].hp <= 0) return;
    setBattle({ ...b, active: idx, phase: 'text', msgs: [`Go, ${b.party[idx].name}!`], msgIdx: 0, typed: false, next: 'enemyTurn' });
  }, []);

  const attemptRun = useCallback(() => {
    const b = battleRef.current;
    if (!b || b.phase !== 'menu') return;
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
        else if (down.includes(e.key)) setBattle({ ...b, cursor: Math.min(1, b.cursor + 1) });
        else if (go.includes(e.key)) {
          if (b.cursor === 0) useCoffee();
          else setBattle({ ...b, phase: 'menu', cursor: 0 });
        } else if (back.includes(e.key)) setBattle({ ...b, phase: 'menu', cursor: 0 });
        return;
      }
    },
    [advanceBattleText, chooseMove, selectMenuOption, switchActive, useCoffee]
  );

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
      if (rngRef.current() < ENCOUNTER_CHANCE) {
        startBattle();
        return;
      }
    }
    const w = warpAt(m, p.tile.x, p.tile.y);
    if (w) {
      doWarp(w);
      return;
    }
    refreshFacedHint();
  }, [doWarp, refreshFacedHint, startBattle, warpAt]);

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
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();

      // Battle takes over all input while active — no pausing mid-fight.
      if (battleRef.current) {
        handleBattleKey(e);
        return;
      }

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

  /* ——— Viewport scale ——— */
  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setViewport({ w, h });
      setScale(Math.max(2, Math.min(5, Math.floor(Math.min(w / (24 * TILE), h / (16 * TILE))) || 2)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* ——— Map canvas rendering (terrain + buildings + decor) ——— */
  useEffect(() => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const m = MAPS[mapId];
    const w = m.rows[0].length * TILE;
    const h = m.rows.length * TILE;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    for (let y = 0; y < m.rows.length; y++)
      for (let x = 0; x < m.rows[0].length; x++)
        paintTerrainTile(ctx, m.rows[y][x], x, y, m.kind, animFrame, m.rows);
    for (const b of m.buildings) paintBuilding(ctx, b);
    for (const dec of m.decor) paintDecor(ctx, dec, m.kind);
  }, [mapId, animFrame]);

  // Animate water on the town map.
  useEffect(() => {
    if (MAPS[mapId].kind !== 'town' || reducedMotion) return;
    const iv = window.setInterval(() => setAnimFrame((f) => (f + 1) % 2), 600);
    return () => window.clearInterval(iv);
  }, [mapId]);

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
        if (els) blitEntity(n, els, n.def.palette, now);
      }

      blitEntity(p, playerElsRef.current, 'player', now);

      // Camera
      const world = worldRef.current;
      if (world) {
        const s = scale;
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
        world.style.transform = `translate3d(${Math.round(-camX * s)}px, ${Math.round(-camY * s)}px, 0) scale(${s})`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isSolid, npcAt, refreshFacedHint, scale, viewport, warpAt]);

  /* ——— Start / save / load ——— */
  const startGame = useCallback(
    (cont: boolean) => {
      const save = cont ? loadSave() : null;
      if (save) {
        playerRef.current = makeEntity(save.x, save.y, save.facing);
        setBadges(save.badges);
        setMuted(save.muted);
        sfx.muted = save.muted;
        setBugsDefeated(save.bugsDefeated ?? 0);
        setMapId(save.map);
      } else {
        playerRef.current = makeEntity(5, 5, 'down');
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
          <canvas ref={mapCanvasRef} className="pixelated block" />

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
                width={SPRITE_W}
                height={SPRITE_H}
                className="pixelated block"
              />
              {(def.important || emoteNpc === def.id) && (
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.1 }}
                  className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-[7px] h-[8px]"
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
              width={SPRITE_W}
              height={SPRITE_H}
              className="pixelated block"
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
      {phase === 'playing' && (
        <>
          <PartyHUD onOpen={() => setMenuOpen(true)} />
          <div className="absolute right-2 top-2 z-20 flex flex-col items-end gap-1.5">
            <button
              onClick={() => setMenuOpen(true)}
              className="rpg-frame-dark px-3 py-2 text-[9px] text-amber-300 hover:brightness-125"
              aria-label="Open backpack menu"
            >
              🎒 BACKPACK <span className="hidden sm:inline text-slate-400">[M]</span>
            </button>
            {badges.length > 0 && (
              <div className="rpg-frame-dark px-2 py-1 text-[8px] text-amber-300" title={badges.join(', ')}>
                ★ ×{badges.length}
              </div>
            )}
          </div>

          {/* Interact hint */}
          <AnimatePresence>
            {facedHint && !dialogue && !menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className={`absolute left-1/2 -translate-x-1/2 z-20 ${touchMode ? 'bottom-40' : 'bottom-16'}`}
              >
                <div className="rpg-frame-dark px-3 py-1.5 text-[9px] text-amber-300">
                  {touchMode ? 'TAP A' : 'PRESS E'} — INTERACT
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
                className="absolute left-1/2 -translate-x-1/2 top-16 md:top-4 md:left-auto md:right-40 md:translate-x-0 z-20"
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
                className="absolute top-3 left-1/2 -translate-x-1/2 z-40"
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
                badges={badges}
                bugsDefeated={bugsDefeated}
                muted={muted}
                onToggleMute={toggleMute}
                onSave={saveGame}
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
                onBack={() => setBattle((cur) => (cur ? { ...cur, phase: 'menu', cursor: 0 } : cur))}
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

      {/* ——— Title ——— */}
      <AnimatePresence>{phase === 'title' && <TitleScreen hasSave={hasSave} onStart={startGame} />}</AnimatePresence>
    </div>
  );
}
