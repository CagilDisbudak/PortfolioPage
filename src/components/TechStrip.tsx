import React from 'react';

type IconProps = { className?: string };

const Python = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <rect x="8" y="10" rx="8" ry="8" width="30" height="22" fill="#22d3ee" opacity="0.7" />
    <rect x="26" y="32" rx="8" ry="8" width="30" height="22" fill="#14b8a6" opacity="0.7" />
  </svg>
);

const Django = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <text x="12" y="44" fontFamily="monospace" fontWeight="700" fontSize="36" fill="#cdeffd">dj</text>
  </svg>
);

const Java = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <path d="M22 40c0 4 6 6 10 6s10-2 10-6" stroke="#cdeffd" strokeWidth="3" fill="none" />
    <path d="M24 26c6 4 10-2 16 2" stroke="#22d3ee" strokeWidth="3" fill="none" />
    <rect x="20" y="40" width="24" height="4" rx="2" fill="#14b8a6" />
  </svg>
);

const Spring = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <path d="M50 28c0 12-10 22-22 22C16 50 8 42 8 32S16 14 28 14c7 0 13 3 17 8" fill="none" stroke="#22d3ee" strokeWidth="3" />
    <path d="M54 22c-6 2-10 2-14-2" fill="none" stroke="#14b8a6" strokeWidth="3" />
  </svg>
);

const Docker = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <rect x="10" y="34" width="10" height="8" fill="#22d3ee" />
    <rect x="22" y="34" width="10" height="8" fill="#22d3ee" />
    <rect x="34" y="34" width="10" height="8" fill="#22d3ee" />
    <rect x="22" y="24" width="10" height="8" fill="#14b8a6" />
    <path d="M8 44c4 6 16 8 28 8 12 0 18-2 20-8" stroke="#cdeffd" strokeWidth="3" fill="none" />
  </svg>
);

const K8s = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <polygon points="32,8 52,20 46,44 18,44 12,20" fill="none" stroke="#22d3ee" strokeWidth="3" />
    <circle cx="32" cy="30" r="6" fill="#14b8a6" />
  </svg>
);

const Postgres = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <path d="M20 24c2-6 10-10 16-8 10 3 10 12 8 18-2 6-6 10-12 12-8 2-12-2-12-8" fill="none" stroke="#cdeffd" strokeWidth="3" />
    <circle cx="24" cy="28" r="2" fill="#22d3ee" />
  </svg>
);

const Redis = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <rect x="14" y="22" width="36" height="8" rx="2" fill="#22d3ee" />
    <rect x="16" y="32" width="32" height="8" rx="2" fill="#14b8a6" />
    <rect x="18" y="42" width="28" height="8" rx="2" fill="#22d3ee" />
  </svg>
);

const items = [
  { name: 'Python', Icon: Python },
  { name: 'Django', Icon: Django },
  { name: 'Java', Icon: Java },
  { name: 'Spring', Icon: Spring },
  { name: 'Docker', Icon: Docker },
  { name: 'Kubernetes', Icon: K8s },
  { name: 'PostgreSQL', Icon: Postgres },
  { name: 'Redis', Icon: Redis },
];

export default function TechStrip() {
  const doubled = [...items, ...items];
  return (
    <div className="tech-strip-container mt-8">
      <div className="tech-strip-track">
        {doubled.map(({ name, Icon }, i) => (
          <span key={`${name}-${i}`} className="tech-chip" aria-label={name} title={name}>
            <Icon className="size-6" />
            <span className="text-xs text-white/80">{name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

