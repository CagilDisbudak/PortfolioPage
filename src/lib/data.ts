export const socials = [
  { label: 'GitHub', href: 'https://github.com/CagilDisbudak', aria: 'GitHub profile' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/cagildisbudak/', aria: 'LinkedIn profile' },
];

export type Project = {
  title: string;
  subtitle?: string;
  tech: string[];
  github?: string;
  live?: string;
  blurb?: string;
};

export const projects: Project[] = [
  {
    title: 'BookSwap',
    subtitle: 'Book exchange platform',
    tech: ['JavaScript'],
    github: 'https://github.com/CagilDisbudak/BookSwap',
    live: '#',
    blurb: 'Peer-to-peer book exchange app for discovering and swapping books.',
  },
  {
    title: 'MoviePage',
    subtitle: 'Movie app UI',
    tech: ['TypeScript'],
    github: 'https://github.com/CagilDisbudak/MoviePage',
    live: '#',
    blurb: 'Simple movie browsing UI built with TypeScript.',
  },
  {
    title: 'A-Decentralized-Voting-App-using-Blockchain',
    subtitle: 'Voting dApp prototype',
    tech: ['JavaScript', 'Blockchain'],
    github: 'https://github.com/CagilDisbudak/A-Decentralized-Voting-App-using-Blockchain',
    live: '#',
    blurb: 'Prototype decentralized voting application showcasing blockchain concepts.',
  },
];

export const techBadges = [
  'Python',
  'Django',
  'Java',
  'Spring',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'Redis',
];

export const skills = {
  backend: {
    level: 'expert',
    items: ['Python/Django', 'Java/Spring', 'REST & GraphQL', 'Auth/JWT/OTP'],
  },
  devops: {
    level: 'solid',
    items: ['Docker', 'Kubernetes', 'CI/CD', 'Observability'],
  },
  frontend: {
    level: 'functional',
    items: ['React/TS', 'Tailwind', 'Accessibility', 'Framer Motion'],
  },
};

