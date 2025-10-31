import React from 'react';

type Props = React.PropsWithChildren<{ href: string; label?: string; } & React.AnchorHTMLAttributes<HTMLAnchorElement>>;

export default function NavAnchor({ href, children, label, ...rest }: Props) {
  return (
    <a
      href={href}
      aria-label={label}
      className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400/80"
      {...rest}
    >
      {children}
    </a>
  );
}

