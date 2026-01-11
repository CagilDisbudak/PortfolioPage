import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { revealParent, revealChild } from '../lib/motion';

interface Command {
  command: string;
  output: OutputLine[];
  delay?: number;
}

type OutputLine = {
  text: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'default' | 'cyan';
};

interface HistoryItem {
  command: string;
  output: OutputLine[];
  type: 'auto' | 'user';
}

// Available commands for tab completion
const availableCommands = [
  'help', 'whoami', 'skills', 'projects', 'contact', 'clear', 'cls', 'auto',
  'neofetch', 'ls', 'date', 'time', 'weather', 'cat', 'joke', 'coffee',
  'quote', 'sudo', 'matrix', 'hack', 'history', 'echo', 'pwd', 'env',
  'alias', 'grep', 'wc', 'tail', 'head', 'uname', 'who', 'ps', 'df', 'tree'
];

const autoCommands: Command[] = [
  {
    command: 'whoami',
    output: [{ text: 'Çağıl Dişbudak - Backend Engineer', type: 'info' }],
  },
  {
    command: 'skills --show',
    output: [
      { text: 'Backend: Python (Django/FastAPI), Java (Spring Boot)', type: 'default' },
      { text: 'DevOps: Docker, Kubernetes, AWS, CI/CD', type: 'default' },
      { text: 'Database: PostgreSQL, Redis', type: 'default' },
      { text: 'Tools: Git, Linux, RESTful APIs', type: 'default' },
    ],
  },
  {
    command: 'projects --list',
    output: [
      { text: '✨ DragMate - Multiplayer Chess & Backgammon Platform', type: 'success' },
      { text: '🎬 MoviePage - Movie Discovery Interface', type: 'success' },
      { text: '📚 BookSwap - Peer-to-Peer Book Exchange', type: 'success' },
      { text: '🗳️  Decentralized Voting Prototype', type: 'success' },
      { text: '🌿 Plant Pathology 2020 - AI Classification', type: 'success' },
    ],
  },
  {
    command: 'contact',
    output: [
      { text: '📧 Email: cdisbudak24@gmail.com', type: 'info' },
      { text: '💼 LinkedIn: linkedin.com/in/cagildisbudak', type: 'info' },
      { text: '🐙 GitHub: github.com/CagilDisbudak', type: 'info' },
    ],
  },
];

// ASCII Art
const neofetchArt = [
  '        ___          ',
  '       (  _`\\        ',
  '       | | ) |  _ _  ',
  "       | | | )/' _`\\ ",
  "       | |_) | ( ) | |",
  "       (____/'\'__\\ |",
  '                      ',
];

const coffeeArt = [
  '     ( (',
  '      ) )',
  '   ..........',
  '   |        |]',
  "   \\        /",
  "    `------'",
  '',
  '  ☕ Coffee break!',
];

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "How do you comfort a JavaScript bug? You console it! 😂",
  "Why don't programmers like nature? It has too many bugs! 🐞",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍺",
  "Why did the developer go broke? Because he used up all his cache! 💰",
  "What's a programmer's favorite hangout place? Foo Bar! 🍻",
  "Why did the programmer quit his job? He didn't get arrays! 📊",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
];

const quotes = [
  "Code is like humor. When you have to explain it, it's bad. - Cory House",
  "First, solve the problem. Then, write the code. - John Johnson",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
  "The best way to get a project done faster is to start sooner. - Jim Highsmith",
  "The only way to learn a new programming language is by writing programs in it. - Dennis Ritchie",
  "Programming isn't about what you know; it's about what you can figure out. - Chris Pine",
];

const files = {
  'README.md': 'Welcome to my portfolio terminal!\n\nAvailable commands:\n- Type "help" to see all commands\n- Use Tab for autocompletion\n- Use ↑/↓ arrows for command history\n\nEnjoy exploring! 🚀',
  'projects.txt': 'DragMate - Multiplayer Chess & Backgammon\nMoviePage - Movie Discovery\nBookSwap - Book Exchange\nDecentralized Voting\nPlant Pathology AI',
  'skills.txt': 'Backend: Python, Java\nDevOps: Docker, K8s, AWS\nDatabase: PostgreSQL, Redis\nFrontend: React, TypeScript',
  'contact.txt': 'Email: cdisbudak24@gmail.com\nLinkedIn: linkedin.com/in/cagildisbudak\nGitHub: github.com/CagilDisbudak',
};

export default function Terminal() {
  const [autoMode, setAutoMode] = useState(false);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabCompletions, setTabCompletions] = useState<string[]>([]);
  const [showTabCompletions, setShowTabCompletions] = useState(false);
  const [isTypingOutput, setIsTypingOutput] = useState(false);
  const [typingOutput, setTypingOutput] = useState<OutputLine[]>([]);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [currentDir] = useState('/home/portfolio');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto mode effect
  useEffect(() => {
    if (!autoMode) return;

    const currentCommand = autoCommands[currentCommandIndex];
    if (!currentCommand) {
      setAutoMode(false);
      return;
    }

    setIsTyping(true);
    const delay = currentCommandIndex === 0 ? 500 : (currentCommand.delay || 1500);
    
    const timer = setTimeout(() => {
      setIsTyping(false);
      const newHistoryItem: HistoryItem = { 
        command: currentCommand.command, 
        output: currentCommand.output, 
        type: 'auto' 
      };
      setHistory((prev) => [...prev, newHistoryItem]);
    }, delay);

    const nextTimer = setTimeout(() => {
      setCurrentCommandIndex((prev) => {
        if (prev + 1 >= autoCommands.length) {
          setAutoMode(false);
          return prev;
        }
        return prev + 1;
      });
    }, delay + 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(nextTimer);
    };
  }, [currentCommandIndex, autoMode]);

  // Scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, typingOutput]);

  // Tab completion handler
  const handleTabCompletion = useCallback((currentInput: string) => {
    const trimmed = currentInput.trim().toLowerCase();
    if (!trimmed) {
      setTabCompletions(availableCommands);
      setShowTabCompletions(true);
      return;
    }

    const matches = availableCommands.filter(cmd => cmd.startsWith(trimmed));
    if (matches.length === 1) {
      setInputValue(matches[0]);
      setShowTabCompletions(false);
    } else if (matches.length > 1) {
      setTabCompletions(matches);
      setShowTabCompletions(true);
    }
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== inputRef.current) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 
            ? commandHistory.length - 1 
            : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex >= 0) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setInputValue('');
          } else {
            setHistoryIndex(newIndex);
            setInputValue(commandHistory[newIndex]);
          }
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        handleTabCompletion(inputValue);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandHistory, historyIndex, inputValue, handleTabCompletion]);

  // Typewriter effect for output
  useEffect(() => {
    if (!isTypingOutput || typingOutput.length === 0) {
      // When typing is done, update the last history item with the full output
      if (!isTypingOutput && typingOutput.length > 0 && history.length > 0) {
        const lastItem = history[history.length - 1];
        if (lastItem.output.length === 0) {
          setHistory((prev) => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = {
              ...lastItem,
              output: typingOutput,
            };
            return newHistory;
          });
          setTypingOutput([]);
          setCurrentTypingIndex(0);
        }
      }
      return;
    }

    if (currentTypingIndex < typingOutput.length) {
      const timer = setTimeout(() => {
        setCurrentTypingIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsTypingOutput(false);
    }
  }, [isTypingOutput, typingOutput, currentTypingIndex, history]);

  const getOutputColor = (type?: string) => {
    switch (type) {
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-cyan-400';
      case 'cyan': return 'text-cyan-400';
      default: return 'text-white/70';
    }
  };

  const executeCommand = (cmd: string): OutputLine[] => {
    const trimmedCmd = cmd.trim();
    const lowerCmd = trimmedCmd.toLowerCase();

    if (lowerCmd === 'help' || lowerCmd === 'h') {
      return [
        { text: 'Available commands:', type: 'info' },
        { text: '  help, h          - Show this help message', type: 'default' },
        { text: '  whoami           - Display identity', type: 'default' },
        { text: '  skills           - Show technical skills', type: 'default' },
        { text: '  projects         - List projects', type: 'default' },
        { text: '  contact          - Show contact information', type: 'default' },
        { text: '  neofetch         - Display system info', type: 'default' },
        { text: '  ls               - List files', type: 'default' },
        { text: '  date             - Show current date', type: 'default' },
        { text: '  time             - Show current time', type: 'default' },
        { text: '  weather          - Weather information', type: 'default' },
        { text: '  cat [file]       - Display file contents', type: 'default' },
        { text: '  history          - Show command history', type: 'default' },
        { text: '  echo [text]      - Print text', type: 'default' },
        { text: '  pwd              - Print working directory', type: 'default' },
        { text: '  env              - Show environment variables', type: 'default' },
        { text: '  alias            - List aliases', type: 'default' },
        { text: '  grep [pattern]   - Search in files', type: 'default' },
        { text: '  wc [file]        - Word count', type: 'default' },
        { text: '  tail [file]      - Show last lines', type: 'default' },
        { text: '  head [file]      - Show first lines', type: 'default' },
        { text: '  uname            - System information', type: 'default' },
        { text: '  who              - Show logged in users', type: 'default' },
        { text: '  ps               - Show processes', type: 'default' },
        { text: '  df               - Disk usage', type: 'default' },
        { text: '  tree             - Directory tree', type: 'default' },
        { text: '  joke             - Random developer joke', type: 'default' },
        { text: '  coffee           - Coffee break!', type: 'default' },
        { text: '  quote            - Inspirational quote', type: 'default' },
        { text: '  sudo             - Try it! 😏', type: 'default' },
        { text: '  matrix           - Enter the matrix', type: 'default' },
        { text: '  hack             - Hack the system', type: 'default' },
        { text: '  clear, cls       - Clear terminal', type: 'default' },
        { text: '  auto             - Enable auto mode', type: 'default' },
        { text: '', type: 'default' },
        { text: "Tip: Use Tab for autocompletion, ↑/↓ for command history", type: 'info' },
      ];
    }

    if (lowerCmd === 'clear' || lowerCmd === 'cls') {
      setHistory([]);
      setTypingOutput([]);
      return [];
    }

    if (lowerCmd === 'auto') {
      setAutoMode(true);
      setCurrentCommandIndex(0);
      return [{ text: 'Auto mode enabled. Commands will run automatically...', type: 'info' }];
    }

    if (lowerCmd === 'whoami') {
      return [{ text: 'Çağıl Dişbudak - Backend Engineer', type: 'info' }];
    }

    if (lowerCmd === 'skills' || lowerCmd.startsWith('skills ')) {
      return [
        { text: 'Backend: Python (Django/FastAPI), Java (Spring Boot)', type: 'default' },
        { text: 'DevOps: Docker, Kubernetes, AWS, CI/CD', type: 'default' },
        { text: 'Database: PostgreSQL, Redis', type: 'default' },
        { text: 'Tools: Git, Linux, RESTful APIs', type: 'default' },
      ];
    }

    if (lowerCmd === 'projects' || lowerCmd.startsWith('projects ')) {
      return [
        { text: '✨ DragMate - Multiplayer Chess & Backgammon Platform', type: 'success' },
        { text: '🎬 MoviePage - Movie Discovery Interface', type: 'success' },
        { text: '📚 BookSwap - Peer-to-Peer Book Exchange', type: 'success' },
        { text: '🗳️  Decentralized Voting Prototype', type: 'success' },
        { text: '🌿 Plant Pathology 2020 - AI Classification', type: 'success' },
      ];
    }

    if (lowerCmd === 'contact') {
      return [
        { text: '📧 Email: cdisbudak24@gmail.com', type: 'info' },
        { text: '💼 LinkedIn: linkedin.com/in/cagildisbudak', type: 'info' },
        { text: '🐙 GitHub: github.com/CagilDisbudak', type: 'info' },
      ];
    }

    if (lowerCmd === 'neofetch') {
      return [
        { text: '', type: 'default' as const },
        ...neofetchArt.map(line => ({ text: line, type: 'cyan' as const })),
        { text: '', type: 'default' as const },
        { text: '╭─────────────────────────────────────╮', type: 'info' as const },
        { text: '│ Name: Çağıl Dişbudak                │', type: 'default' as const },
        { text: '│ Role: Backend Engineer              │', type: 'default' as const },
        { text: '│ Location: Remote                    │', type: 'default' as const },
        { text: '│ Languages: Python, Java, TypeScript │', type: 'default' as const },
        { text: '│ Skills: Backend, DevOps, System Design │', type: 'default' as const },
        { text: '╰─────────────────────────────────────╯', type: 'info' as const },
      ];
    }

    if (lowerCmd === 'ls') {
      return [
        { text: '📄 README.md', type: 'default' },
        { text: '📄 projects.txt', type: 'default' },
        { text: '📄 skills.txt', type: 'default' },
        { text: '📄 contact.txt', type: 'default' },
        { text: '', type: 'default' },
        { text: "Tip: Use 'cat [filename]' to read files", type: 'info' },
      ];
    }

    if (lowerCmd === 'date') {
      const now = new Date();
      return [{ text: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), type: 'info' }];
    }

    if (lowerCmd === 'time') {
      const now = new Date();
      return [{ text: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), type: 'info' }];
    }

    if (lowerCmd === 'weather') {
      return [
        { text: '🌤️  Weather in Code Space', type: 'info' },
        { text: 'Temperature: 72°F (22°C) - Perfect for coding!', type: 'default' },
        { text: 'Conditions: Clear skies, high productivity', type: 'default' },
        { text: 'Wind: Light breeze of inspiration', type: 'default' },
        { text: 'Forecast: Sunny with a chance of bug fixes', type: 'default' },
      ];
    }

    if (lowerCmd.startsWith('cat ')) {
      const fileName = trimmedCmd.substring(4).trim();
      const file = files[fileName as keyof typeof files];
      if (file) {
        return file.split('\n').map(line => ({ text: line, type: 'default' as const }));
      }
      return [{ text: `cat: ${fileName}: No such file or directory`, type: 'error' }];
    }

    if (lowerCmd === 'joke') {
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      return [{ text: joke, type: 'info' }];
    }

    if (lowerCmd === 'coffee') {
      const coffeeOutput: OutputLine[] = [
        ...coffeeArt.slice(0, -2).map(line => ({ text: line, type: 'warning' as const })),
        ...coffeeArt.slice(-2).map(line => ({ text: line, type: 'info' as const })),
        { text: '', type: 'default' as const },
        { text: 'Time for a break! ☕', type: 'info' as const },
      ];
      return coffeeOutput;
    }

    if (lowerCmd === 'quote') {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      return [{ text: quote, type: 'info' }];
    }

    if (lowerCmd === 'sudo') {
      return [
        { text: "Nice try! 😏", type: 'warning' },
        { text: "But you don't have sudo privileges here.", type: 'default' },
        { text: "Try: sudo make me a sandwich", type: 'info' },
      ];
    }

    if (lowerCmd === 'matrix') {
      return [
        { text: 'Entering the Matrix...', type: 'info' },
        { text: '', type: 'default' },
        { text: '01001000 01100101 01101100 01101100 01101111', type: 'success' },
        { text: '01010111 01101111 01110010 01101100 01100100', type: 'success' },
        { text: '', type: 'default' },
        { text: 'Welcome to the Matrix, Neo.', type: 'info' },
        { text: 'Reality is just a construct. Code is real.', type: 'default' },
      ];
    }

    if (lowerCmd === 'hack') {
      return [
        { text: 'Initializing hack sequence...', type: 'warning' },
        { text: '[░░░░░░░░░░] 0%', type: 'default' },
        { text: '[████░░░░░░] 40%', type: 'default' },
        { text: '[████████░░] 80%', type: 'default' },
        { text: '[██████████] 100%', type: 'success' },
        { text: '', type: 'default' },
        { text: '✅ Hack complete!', type: 'success' },
        { text: 'Just kidding, this is a portfolio site! 😄', type: 'info' },
      ];
    }

    if (lowerCmd === 'history') {
      if (commandHistory.length === 0) {
        return [{ text: 'No command history yet.', type: 'info' }];
      }
      return commandHistory.map((cmd, idx) => ({
        text: `${idx + 1}  ${cmd}`,
        type: 'default' as const
      }));
    }

    if (lowerCmd.startsWith('echo ')) {
      const text = trimmedCmd.substring(5);
      return [{ text: text || '', type: 'default' }];
    }

    if (lowerCmd === 'pwd') {
      return [{ text: currentDir, type: 'info' }];
    }

    if (lowerCmd === 'env') {
      return [
        { text: 'USER=cagil', type: 'default' },
        { text: 'HOME=/home/portfolio', type: 'default' },
        { text: 'SHELL=/bin/bash', type: 'default' },
        { text: 'TERM=xterm-256color', type: 'default' },
        { text: 'LANG=en_US.UTF-8', type: 'default' },
        { text: 'EDITOR=nano', type: 'default' },
        { text: 'PATH=/usr/local/bin:/usr/bin:/bin', type: 'default' },
      ];
    }

    if (lowerCmd === 'alias') {
      return [
        { text: 'Aliases:', type: 'info' },
        { text: "ll='ls -la'", type: 'default' },
        { text: "la='ls -A'", type: 'default' },
        { text: "g='git'", type: 'default' },
        { text: "c='clear'", type: 'default' },
      ];
    }

    if (lowerCmd.startsWith('grep ')) {
      const pattern = trimmedCmd.substring(5).trim();
      if (!pattern) {
        return [{ text: 'grep: missing pattern', type: 'error' }];
      }
      const results: OutputLine[] = [];
      Object.entries(files).forEach(([fileName, content]) => {
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.toLowerCase().includes(pattern.toLowerCase())) {
            results.push({
              text: `${fileName}:${idx + 1}:${line}`,
              type: 'default'
            });
          }
        });
      });
      return results.length > 0 ? results : [{ text: `No matches found for "${pattern}"`, type: 'warning' }];
    }

    if (lowerCmd.startsWith('wc ')) {
      const fileName = trimmedCmd.substring(3).trim();
      const file = files[fileName as keyof typeof files];
      if (file) {
        const lines = file.split('\n').filter(l => l.trim() !== '');
        const words = file.split(/\s+/).filter(w => w.trim() !== '');
        const chars = file.length;
        return [
          { text: `  ${lines.length}  ${words.length}  ${chars} ${fileName}`, type: 'default' },
        ];
      }
      return [{ text: `wc: ${fileName}: No such file or directory`, type: 'error' }];
    }

    if (lowerCmd.startsWith('tail ')) {
      const fileName = trimmedCmd.substring(5).trim();
      const file = files[fileName as keyof typeof files];
      if (file) {
        const lines = file.split('\n');
        const lastLines = lines.slice(-10);
        return lastLines.map(line => ({ text: line, type: 'default' as const }));
      }
      return [{ text: `tail: ${fileName}: No such file or directory`, type: 'error' }];
    }

    if (lowerCmd.startsWith('head ')) {
      const fileName = trimmedCmd.substring(5).trim();
      const file = files[fileName as keyof typeof files];
      if (file) {
        const lines = file.split('\n');
        const firstLines = lines.slice(0, 10);
        return firstLines.map(line => ({ text: line, type: 'default' as const }));
      }
      return [{ text: `head: ${fileName}: No such file or directory`, type: 'error' }];
    }

    if (lowerCmd === 'uname' || lowerCmd.startsWith('uname ')) {
      return [
        { text: 'Linux portfolio 5.15.0-generic #1 SMP', type: 'default' },
        { text: 'Architecture: x86_64', type: 'default' },
        { text: 'Kernel: Linux', type: 'default' },
        { text: 'OS: Portfolio Terminal v1.0', type: 'default' },
      ];
    }

    if (lowerCmd === 'who') {
      return [
        { text: 'USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT', type: 'default' },
        { text: 'cagil    pts/0    portfolio.dev   now      0:00   0.05s  0.01s bash', type: 'info' },
      ];
    }

    if (lowerCmd === 'ps') {
      return [
        { text: 'PID   TTY          TIME CMD', type: 'default' },
        { text: '  1   ?        00:00:01 systemd', type: 'default' },
        { text: ' 42   pts/0    00:00:00 bash', type: 'info' },
        { text: ' 99   pts/0    00:00:00 portfolio', type: 'info' },
        { text: '1337  ?        00:00:05 node', type: 'default' },
      ];
    }

    if (lowerCmd === 'df') {
      return [
        { text: 'Filesystem      Size  Used Avail Use% Mounted on', type: 'default' },
        { text: '/dev/sda1        20G  5.2G   14G  28% /', type: 'default' },
        { text: '/dev/sda2       100G   42G   53G  45% /home', type: 'default' },
        { text: 'tmpfs           2.0G     0  2.0G   0% /dev/shm', type: 'default' },
        { text: 'portfolio      500G  128G  347G  27% /portfolio', type: 'info' },
      ];
    }

    if (lowerCmd === 'tree') {
      return [
        { text: '.', type: 'default' },
        { text: '├── README.md', type: 'default' },
        { text: '├── projects.txt', type: 'default' },
        { text: '├── skills.txt', type: 'default' },
        { text: '└── contact.txt', type: 'default' },
        { text: '', type: 'default' },
        { text: '0 directories, 4 files', type: 'info' },
      ];
    }

    if (trimmedCmd === '') {
      return [];
    }

    return [{ text: `Command not found: ${cmd}. Type 'help' for available commands.`, type: 'error' }];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    setIsProcessing(true);
    setAutoMode(false);
    setShowTabCompletions(false);

    const output = executeCommand(inputValue);

    if (output.length > 0 || inputValue.trim().toLowerCase() === 'clear' || inputValue.trim().toLowerCase() === 'cls') {
      // Add to command history
      if (inputValue.trim()) {
        setCommandHistory((prev) => {
          const newHistory = [...prev];
          if (newHistory[newHistory.length - 1] !== inputValue.trim()) {
            newHistory.push(inputValue.trim());
          }
          return newHistory.slice(-50); // Keep last 50 commands
        });
      }

      // Handle special commands with typewriter effect
      if (output.length > 5 && (inputValue.trim().toLowerCase() === 'neofetch' || inputValue.trim().toLowerCase() === 'matrix' || inputValue.trim().toLowerCase() === 'hack')) {
        setIsTypingOutput(true);
        setTypingOutput(output);
        setCurrentTypingIndex(0);
        setHistory((prev) => [...prev, { command: inputValue, output: [], type: 'user' }]);
      } else {
        setHistory((prev) => [...prev, { command: inputValue, output, type: 'user' }]);
      }
    }

    setInputValue('');
    setHistoryIndex(-1);
    setIsProcessing(false);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  const currentCommand = autoCommands[currentCommandIndex];
  const displayedTypingOutput = typingOutput.slice(0, currentTypingIndex);

  return (
    <section id="terminal" className="relative py-16 md:py-24" aria-label="Terminal">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={revealParent}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={revealChild} className="text-2xl font-semibold mb-6">
          Terminal
        </motion.h2>
        <div className="glass p-0 overflow-hidden">
          {/* Terminal header */}
          <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-xs text-white/40 ml-2">bash</span>
            {autoMode && (
              <span className="ml-auto text-xs text-cyan-400/60">Auto mode</span>
            )}
          </div>

          {/* Terminal content */}
          <div
            ref={terminalRef}
            className="p-4 font-mono text-sm h-[400px] overflow-y-auto bg-black/20 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent cursor-text"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
          >
            <div className="space-y-2">
              {/* History */}
              {history.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">$</span>
                    <span className="text-white/90">{item.command}</span>
                    {item.type === 'auto' && (
                      <span className="text-xs text-white/30">(auto)</span>
                    )}
                  </div>
                  {item.output.length > 0 && (
                    <div className="ml-4 space-y-1">
                      {item.output.map((line, i) => (
                        <div key={i} className={getOutputColor(line.type)}>
                          {line.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing output (for typewriter effect) */}
              {isTypingOutput && typingOutput.length > 0 && (
                <div className="space-y-1">
                  {history.length > 0 && history[history.length - 1].output.length === 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">$</span>
                        <span className="text-white/90">{history[history.length - 1].command}</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        {displayedTypingOutput.map((line, i) => (
                          <div key={i} className={getOutputColor(line.type)}>
                            {line.text}
                          </div>
                        ))}
                        {currentTypingIndex < typingOutput.length && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                            className="inline-block w-2 h-4 bg-cyan-400 ml-1"
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Current auto command - show typing indicator if auto mode is active and typing */}
              {autoMode && currentCommand && isTyping && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">$</span>
                    <span className="text-white/90">{currentCommand.command}</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                      className="w-2 h-4 bg-cyan-400 inline-block"
                    />
                  </div>
                </div>
              )}

              {/* Tab completions */}
              {showTabCompletions && tabCompletions.length > 0 && (
                <div className="ml-4 text-xs text-white/50 border-t border-white/10 pt-2 mt-2">
                  <div className="flex flex-wrap gap-2">
                    {tabCompletions.map((cmd, i) => (
                      <span key={i} className="text-cyan-400/70">{cmd}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Input line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
                <span className="text-cyan-400">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowTabCompletions(false);
                  }}
                  className="flex-1 bg-transparent text-white/90 outline-none focus:outline-none focus:ring-0 border-0 font-mono"
                  placeholder="Type a command... (try 'help')"
                  disabled={isProcessing}
                  autoFocus
                />
                {isProcessing && (
                  <motion.span
                    animate={{ opacity: [0.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                    className="text-cyan-400"
                  >
                    ⏳
                  </motion.span>
                )}
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
