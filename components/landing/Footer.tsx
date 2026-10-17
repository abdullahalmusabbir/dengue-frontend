'use client';

// ===================================================================
// components/landing/Footer.tsx
// Scroll-triggered fade-in animation for footer sections।
// ===================================================================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
export default function Footer() {
    const [year, setYear] = useState<number>(0);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer id="about" className="border-t border-slate-200 bg-white">
            {/* ---------- Disclaimer banner ---------- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="border-b border-amber-200 bg-amber-50"
            >
                <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-4 sm:px-6">
                    <motion.span
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    >
                        <ShieldAlert className="mt-0.5 shrink-0 text-amber-500" size={20} />
                    </motion.span>
                    <p className="text-sm leading-relaxed text-amber-800">
                        <span className="font-semibold">⚠ Disclaimer: </span>
                        এই টুলটি একটি <span className="font-semibold">গবেষণা প্রদর্শনী (research demonstration)</span> মাত্র —
                        এটি কোনো মেডিকেল ডায়াগনোসিস টুল নয়। কোনো স্বাস্থ্য সিদ্ধান্তের জন্য অবশ্যই একজন যোগ্য চিকিৎসকের পরামর্শ নিন।
                        <br className="hidden sm:block" />
                        <span className="italic">
                            Research demonstration only — NOT a medical diagnosis tool.
                        </span>
                    </p>
                </div>
            </motion.div>

            {/* ---------- Main footer content ---------- */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, staggerChildren: 0.15 }}
                className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3"
            >
                {/* Brand */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                            <Activity size={18} />
                        </span>
                        <span className="text-base font-bold text-slate-800">D-CHSS</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">
                        Dengue Clinical Hematological Signature Score — CBC রিপোর্ট থেকে
                        ইন্টারপ্রিটেবল, probability-ভিত্তিক ডেঙ্গু ঝুঁকি নির্ণয়ের একটি গবেষণা প্রজেক্ট।
                    </p>
                </motion.div>

                {/* Quick links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h4 className="text-sm font-semibold text-slate-700">দ্রুত লিংক</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-500">
                        {[
                            { label: 'হোম', href: '#home' },
                            { label: 'প্রেডিকশন ফর্ম', href: '#predict' },
                            { label: 'ফলাফল ও ব্যাখ্যা', href: '#result' },
                            { label: 'পূর্ববর্তী ফলাফল', href: '#history' },
                        ].map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-sky-600"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Model info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h4 className="text-sm font-semibold text-slate-700">মডেল সম্পর্কে</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-500">
                        <li>Pure Python লজিস্টিক রিগ্রেশন</li>
                        <li>Isotonic Regression ক্যালিব্রেশন</li>
                        <li>Feature-wise Contribution ব্যাখ্যা</li>
                        <li>কোনো external ML library ছাড়াই তৈরি</li>
                    </ul>
                </motion.div>
            </motion.div>

            {/* ---------- Bottom bar ---------- */}
            <div className="border-t border-slate-100 py-5">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-400 sm:flex-row sm:px-6">
                    <p>© {year} D-CHSS Dengue Predictor. সর্বস্বত্ব সংরক্ষিত।</p>
                    <motion.a
                        href="#"
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-1 hover:text-slate-600"
                    >
                        <FaGithub size={14} /> Open Research Project
                    </motion.a>
                </div>
            </div>
        </footer>
    );
}