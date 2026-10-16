"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Mail, Heart, ShieldCheck } from "lucide-react";
import {FaGithub } from "react-icons/fa";

const FOOTER_LINKS = {
    Product: [
        { label: "Features", href: "#features" },
        { label: "Check Now", href: "#predict-form" },
        { label: "How It Works", href: "#how-it-works" },
    ],
    Resources: [
        { label: "About D-CHSS", href: "#about" },
        { label: "Model Explainability", href: "#features" },
        { label: "FAQ", href: "#faq" },
    ],
};

export default function Footer() {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="relative mt-24 border-t border-slate-100 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 gap-10 md:grid-cols-4"
                >
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
                                <Activity className="h-4.5 w-4.5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-slate-800">D-CHSS</span>
                        </div>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
                            An interpretable Clinical Hematological Signature-based machine
                            learning framework for instant, explainable Dengue detection
                            using routine CBC blood reports.
                        </p>
                        <div className="mt-5 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 border border-amber-100">
                            <ShieldCheck className="h-4 w-4 shrink-0" />
                            <span>
                                For screening &amp; research purposes only — not a substitute
                                for professional medical diagnosis.
                            </span>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(FOOTER_LINKS).map(([section, links]) => (
                        <div key={section}>
                            <h4 className="text-sm font-semibold text-slate-800">
                                {section}
                            </h4>
                            <ul className="mt-4 space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-slate-500 transition-colors hover:text-teal-600"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </motion.div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
                    <p className="text-xs text-slate-400">
                        © {year} D-CHSS Dengue Detection Framework. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="#"
                            className="text-slate-400 transition-colors hover:text-teal-600"
                            aria-label="GitHub"
                        >
                            <FaGithub className="h-4.5 w-4.5" />
                        </a>
                        <a
                            href="#"
                            className="text-slate-400 transition-colors hover:text-teal-600"
                            aria-label="Email"
                        >
                            <Mail className="h-4.5 w-4.5" />
                        </a>
                    </div>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                        Built with <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" /> for better healthcare
                    </p>
                </div>
            </div>
        </footer>
    );
}