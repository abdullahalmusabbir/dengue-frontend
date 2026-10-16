"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Menu, X, Circle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { checkHealth } from "@/lib/api";

const NAV_LINKS = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "Check Now", href: "#predict-form" },
    { label: "How It Works", href: "#how-it-works" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [modelOnline, setModelOnline] = useState<boolean | null>(null);
    const { isReady } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!isReady) return;

        let cancelled = false;
        const runCheck = () => {
            if (cancelled) return;
            checkHealth()
                .then((res) => !cancelled && setModelOnline(res.model_loaded))
                .catch(() => !cancelled && setModelOnline(false));
        };

        runCheck();
        const retry = setTimeout(runCheck, 8000);
        return () => {
            cancelled = true;
            clearTimeout(retry);
        };
    }, [isReady]);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100"
                    : "bg-transparent"
                }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                {/* Logo */}
                <a href="#home" className="flex items-center gap-2 group">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-200"
                    >
                        <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </motion.div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-lg font-bold text-slate-800">D-CHSS</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-teal-600">
                            Dengue AI Detector
                        </span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="relative text-sm font-medium text-slate-600 transition-colors hover:text-teal-600 group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-teal-500 transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </nav>

                {/* Right side */}
                <div className="hidden items-center gap-4 md:flex">
                    <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                        <Circle
                            className={`h-2 w-2 ${modelOnline === null
                                    ? "fill-slate-400 text-slate-400"
                                    : modelOnline
                                        ? "fill-green-500 text-green-500 animate-pulse"
                                        : "fill-red-500 text-red-500"
                                }`}
                        />
                        <span className="text-xs font-medium text-slate-500">
                            {modelOnline === null
                                ? "Checking..."
                                : modelOnline
                                    ? "Model Online"
                                    : "Model Offline"}
                        </span>
                    </div>
                    <a
                        href="#predict-form"
                        className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-200 transition-transform hover:scale-105 active:scale-95"
                    >
                        Check Now
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 md:hidden"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-slate-100 bg-white md:hidden"
                    >
                        <div className="flex flex-col gap-1 px-6 py-4">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-600"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="#predict-form"
                                onClick={() => setIsOpen(false)}
                                className="mt-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-center text-sm font-semibold text-white"
                            >
                                Check Now
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}