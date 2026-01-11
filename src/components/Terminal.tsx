import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { revealParent, revealChild } from '../lib/motion';

interface Command {
  command: string;
  output: string[];
  delay?: number;
}

const autoCommands: Command[] = [
  {
    command: 'whoami',
    output: ['Çağıl Dişbudak - Backend Engineer'],
  },
  {
    command: 'skills --show',
    output: [
      'Backend: Python (Django/FastAPI), Java (Spring Boot)',
      'DevOps: Docker, Kubernetes, AWS, CI/CD',
      'Database: PostgreSQL, Redis',
      'Tools: Git, Linux, RESTful APIs',
    ],
  },
  {
    command: 'projects --list',
    output: [
      '✨ DragMate - Multiplayer Chess & Backgammon Platform',
      '🎬 MoviePage - Movie Discovery Interface',
      '📚 BookSwap - Peer-to-Peer Book Exchange',
      '🗳️  Decentralized Voting Prototype',
      '🌿 Plant Pathology 2020 - AI Classification',
    ],
  },
  {
    command: 'contact',
    output: [
      '📧 Email: cdisbudak24@gmail.com',
      '💼 LinkedIn: linkedin.com/in/cagildisbudak',
      '🐙 GitHub: github.com/CagilDisbudak',
    ],
  },
];

interface HistoryItem {
  command: string;
  output: string[];
  type: 'auto' | 'user';
}

export default function Terminal() {
  const [autoMode, setAutoMode] = useState(true);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedOutput, setDisplayedOutput] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
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
    setDisplayedOutput([]);

    // İlk komut için daha hızlı başlat (500ms), diğerleri için 1.5 saniye
    const delay = currentCommandIndex === 0 ? 500 : (currentCommand.delay || 1500);
    const timer = setTimeout(() => {
      setIsTyping(false);
      const newHistoryItem = { command: currentCommand.command, output: currentCommand.output, type: 'auto' as const };
      setHistory((prev) => [...prev, newHistoryItem]);
      setDisplayedOutput([]); // History'ye ekledikten sonra displayedOutput'u temizle
    }, delay);

    const nextTimer = setTimeout(() => {
      setCurrentCommandIndex((prev) => {
        if (prev + 1 >= autoCommands.length) {
          setAutoMode(false);
          return prev;
        }
        return prev + 1;
      });
    }, delay + 3500); // Output gösterildikten 3.5 saniye sonra bir sonraki komuta geç

    return () => {
      clearTimeout(timer);
      clearTimeout(nextTimer);
    };
  }, [currentCommandIndex, autoMode]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, displayedOutput]);

  const executeCommand = (cmd: string): string[] => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (trimmedCmd === 'help' || trimmedCmd === 'h') {
      return [
        'Available commands:',
        '  help, h          - Show this help message',
        '  whoami           - Display identity',
        '  skills           - Show technical skills',
        '  projects         - List projects',
        '  contact          - Show contact information',
        '  clear, cls       - Clear terminal',
        '  auto             - Enable auto mode',
        '',
        'Tip: You can type commands manually or wait for auto mode.',
      ];
    }

    if (trimmedCmd === 'clear' || trimmedCmd === 'cls') {
      setHistory([]);
      setDisplayedOutput([]);
      return [];
    }

    if (trimmedCmd === 'auto') {
      setAutoMode(true);
      setCurrentCommandIndex(0);
      return ['Auto mode enabled. Commands will run automatically...'];
    }

    if (trimmedCmd === 'whoami') {
      return ['Çağıl Dişbudak - Backend Engineer'];
    }

    if (trimmedCmd === 'skills' || trimmedCmd.startsWith('skills ')) {
      return [
        'Backend: Python (Django/FastAPI), Java (Spring Boot)',
        'DevOps: Docker, Kubernetes, AWS, CI/CD',
        'Database: PostgreSQL, Redis',
        'Tools: Git, Linux, RESTful APIs',
      ];
    }

    if (trimmedCmd === 'projects' || trimmedCmd.startsWith('projects ')) {
      return [
        '✨ DragMate - Multiplayer Chess & Backgammon Platform',
        '🎬 MoviePage - Movie Discovery Interface',
        '📚 BookSwap - Peer-to-Peer Book Exchange',
        '🗳️  Decentralized Voting Prototype',
        '🌿 Plant Pathology 2020 - AI Classification',
      ];
    }

    if (trimmedCmd === 'contact') {
      return [
        '📧 Email: cdisbudak24@gmail.com',
        '💼 LinkedIn: linkedin.com/in/cagildisbudak',
        '🐙 GitHub: github.com/CagilDisbudak',
      ];
    }

    if (trimmedCmd === '') {
      return [];
    }

    return [`Command not found: ${cmd}. Type 'help' for available commands.`];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    setIsProcessing(true);
    const output = executeCommand(inputValue);

    if (output.length > 0 || inputValue.trim() === 'clear' || inputValue.trim() === 'cls') {
      setHistory((prev) => [...prev, { command: inputValue, output, type: 'user' }]);
    }

    setInputValue('');
    setIsProcessing(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const currentCommand = autoCommands[currentCommandIndex];

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
            className="p-4 font-mono text-sm min-h-[300px] max-h-[400px] overflow-y-auto bg-black/20"
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
                        <div key={i} className="text-white/70">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

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

              {/* Input line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="text-cyan-400">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-transparent text-white/90 outline-none font-mono"
                  placeholder="Type a command... (try 'help')"
                  disabled={isProcessing}
                  autoFocus
                />
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
