import React, { PropsWithChildren } from 'react';

type Props = {
  className?: string;
};

// Frosted content panel. Deliberately plain — its only job is to keep text
// perfectly readable over the live 3D scene behind it.
export default function Panel({ children, className }: PropsWithChildren<Props>) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md p-6 md:p-8 ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
