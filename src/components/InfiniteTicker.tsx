import React from 'react';
import { techBadges } from '../lib/data';

export default function InfiniteTicker() {
  const items = [...techBadges, ...techBadges];
  return (
    <div className="mt-10">
      <div className="marquee-container">
        <div className="marquee-track marquee-left">
          {items.map((t, i) => (
            <span key={`top-${t}-${i}`} className="marquee-pill">{t}</span>
          ))}
        </div>
        <div className="marquee-track marquee-right">
          {items.map((t, i) => (
            <span key={`bottom-${t}-${i}`} className="marquee-pill">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

