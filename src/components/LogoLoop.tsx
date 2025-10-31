import React from 'react';

const items = [
  'Python',
  'Django',
  'Java',
  'Spring',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'Redis',
];

export default function LogoLoop() {
  return (
    <div className="logo-loop mx-auto mt-10">
      <div className="logo-loop-ring glass goo">
        {items.map((label, i) => (
          <span key={label} style={{ ['--i' as any]: i }} className="logo-chip">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

