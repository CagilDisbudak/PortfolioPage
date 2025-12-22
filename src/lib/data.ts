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
  achievements?: string[];
  isFeatured?: boolean;
};

export const projects: Project[] = [
  {
    title: 'BookSwap',
    subtitle: 'Peer-to-Peer Book Exchange Platform',
    tech: ['JavaScript', 'HTML/CSS', 'LocalStorage'],
    github: 'https://github.com/CagilDisbudak/BookSwap',
    live: '#',
    blurb: 'A fully functional book exchange platform enabling users to list, discover, and swap books locally.',
    achievements: [
      'Designed a responsive UI with a focus on ease of use for non-technical users.',
      'Implemented local storage caching to persist user preferences and cart data without a backend.',
      'Optimized asset loading to ensure sub-1s initial render time on mobile devices.',
    ],
    isFeatured: true,
  },
  {
    title: 'MoviePage',
    subtitle: 'Movie Discovery Interface',
    tech: ['TypeScript', 'React', 'TMDB API'],
    github: 'https://github.com/CagilDisbudak/MoviePage',
    live: '#',
    blurb: 'A clean, responsive interface for browsing movie metadata using the TMDB API.',
    achievements: [
      'Built a type-safe data layer using TypeScript to handle complex API responses reliably.',
      'Implemented client-side filtering and sorting to reduce unnecessary network requests.',
    ],
    isFeatured: false,
  },
  {
    title: 'Decentralized Voting Prototype',
    subtitle: 'Blockchain-based Voting System',
    tech: ['JavaScript', 'Solidity', 'Web3.js'],
    github: 'https://github.com/CagilDisbudak/A-Decentralized-Voting-App-using-Blockchain',
    live: '#',
    blurb: 'Proof-of-concept dApp demonstrating secure, immutable voting mechanisms on the blockchain.',
    achievements: [
      'Developed smart contracts to ensure vote immutability and prevent double-voting.',
      'Integrated Web3 wallet connection flows for secure user authentication.',
    ],
    isFeatured: false,
  },
  {
    title: 'Plant Pathology 2020',
    subtitle: 'AI-Based Leaf Disease Classification',
    tech: ['Python', 'TensorFlow', 'Keras', 'OpenCV'],
    github: 'https://github.com/CagilDisbudak/Plant-Pathology-2020',
    live: '#',
    blurb: 'Deep learning solution for automating the diagnosis of foliar diseases in apple leaves.',
    achievements: [
      'Developed deep learning models (CNNs) to classify apple leaf diseases with high accuracy.',
      'Iterated through 6 architectural variations to optimize performance and reduce overfitting.',
      'Implemented advanced data preprocessing pipelines including augmentation and normalization.',
    ],
    isFeatured: false,
  },
];

export const techBadges = [
  'Python',
  'Django',
  'Java',
  'Spring Boot',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'Redis',
  'AWS',
  'CI/CD',
];

export const keyCompetencies = [
  'Scalable Backend Systems',
  'Microservices Architecture',
  'Database Design & Optimization',
  'RESTful & GraphQL API Development',
  'Cloud Infrastructure (AWS/GCP)',
  'Containerization & Orchestration',
];

export const skills = {
  backend: {
    level: 'Expert',
    items: ['Python (Django/FastAPI)', 'Java (Spring Boot)', 'System Design', 'PostgreSQL/Redis'],
  },
  devops: {
    level: 'Solid',
    items: ['Docker & Kubernetes', 'CI/CD Pipelines', 'AWS Services', 'Datadog/Prometheus'],
  },
  frontend: {
    level: 'Functional',
    items: ['React & TypeScript', 'Tailwind CSS', 'Next.js', 'Modern UI/UX Principles'],
  },
};

