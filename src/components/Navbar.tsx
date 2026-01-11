import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Work' },
    { href: '#skills', label: 'Skills' },
    { href: '#terminal', label: 'Terminal' },
    { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] w-fit">
                <nav className="relative flex items-center gap-1 p-1 md:p-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg shadow-black/20">

                    {/* Logo / Home Name */}
                    <a
                        href="#"
                        className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold tracking-wide text-white hover:text-cyan-400 transition-colors whitespace-nowrap flex-shrink-0"
                        onClick={() => setMobileOpen(false)}
                    >
                        Çağıl Dişbudak
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center">
                        <div className="w-px h-4 bg-white/10 mx-2" />
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-1.5 rounded-full hover:bg-white/10 text-white/80 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </nav>

                {/* Mobile Dropdown Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 left-0 mt-2 p-2 rounded-2xl border border-white/10 bg-[#0b0b0d]/90 backdrop-blur-xl shadow-xl flex flex-col gap-1 overflow-hidden origin-top md:hidden"
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="px-4 py-3 text-sm text-center text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
