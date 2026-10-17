'use client';

// ===================================================================
// components/landing/Navbar.tsx
// Framer Motion animated navbar - slide down on load, animated mobile menu,
// hover/tap micro-interactions, scroll-based shadow effect।
// ===================================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X } from 'lucide-react';

const NAV_LINKS = [
    { label: 'হোম', href: '#home' },
    { label: 'প্রেডিক্ট করুন', href: '#predict' },
    { label: 'ফলাফল', href: '#result' },
    { label: 'হিস্টোরি', href: '#history' },
    { label: 'সম্পর্কে', href: '#about' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300 ${scrolled
                    ? 'border-slate-200 bg-white/90 shadow-sm'
                    : 'border-transparent bg-white/60'
                }`}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                {/* ---------- Logo ---------- */}
                <motion.a
                    href="#home"
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <motion.span
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600"
                    >
                        <Activity size={20} strokeWidth={2.4} />
                    </motion.span>
                    <span className="text-lg font-bold tracking-tight text-slate-800">
                        D-CHSS
                        <span className="ml-1 font-normal text-slate-400">| Dengue Predictor</span>
                    </span>
                </motion.a>

                {/* ---------- Desktop links ---------- */}
                <nav className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link, i) => (
                        <motion.a
                            key={link.href}
                            href={link.href}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                            className="relative text-sm font-medium text-slate-600 transition-colors hover:text-sky-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-sky-500 after:transition-all after:duration-300 hover:after:w-full"
                        >
                            {link.label}
                        </motion.a>
                    ))}
                </nav>

                {/* ---------- CTA (desktop) ---------- */}
                <motion.a
                    href="#predict"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(2,132,199,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm md:inline-block"
                >
                    এখনই চেক করুন
                </motion.a>

                {/* ---------- Mobile menu button ---------- */}
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                    aria-label="Toggle menu"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isOpen ? (
                            <motion.span
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={22} />
                            </motion.span>
                        ) : (
                            <motion.span
                                key="open"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu size={22} />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* ---------- Mobile menu panel ---------- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-slate-200 bg-white md:hidden"
                    >
                        <nav className="flex flex-col gap-1 px-4 pb-4 pt-2">
                            {NAV_LINKS.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-sky-600"
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.a
                                href="#predict"
                                onClick={() => setIsOpen(false)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: NAV_LINKS.length * 0.05 }}
                                className="mt-2 rounded-full bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white"
                            >
                                এখনই চেক করুন
                            </motion.a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}