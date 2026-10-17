'use client';

// ===================================================================
// app/page.tsx
// Framer Motion animated single-page: Hero + Form + Result + History
// ===================================================================

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { CBC_FIELDS, type Gender } from '@/types';
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  History as HistoryIcon,
  RefreshCcw,
  CheckCircle2,
} from 'lucide-react';

// ---------- Reusable animation variants (typed) ----------
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function HomePage() {
  const {
    formData,
    updateField,
    resetForm,
    submitPrediction,
    isPredicting,
    predictionError,
    result,
    clearResult,
    history,
    isHistoryLoading,
    historyError,
    loadHistory,
  } = useData();

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (showHistory) {
      loadHistory();
    }
  }, [showHistory, loadHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPrediction();
    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const riskColor =
    result?.risk_group === 'High'
      ? 'text-rose-600 bg-rose-50 border-rose-200'
      : result?.risk_group === 'Moderate'
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-emerald-600 bg-emerald-50 border-emerald-200';

  const barColor =
    result && result.probability_percent >= 60
      ? 'bg-rose-500'
      : result && result.probability_percent >= 35
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <div>
      {/* =============================================================== */}
      {/* HERO SECTION */}
      {/* =============================================================== */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white"
      >
        {/* ---------- Animated background blobs ---------- */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute -left-20 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute right-0 top-32 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6"
        >
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-medium text-sky-700"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <Activity size={14} />
            </motion.span>
            Pure Python • Explainable • Calibrated Probability
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
          >
            CBC রিপোর্ট থেকে{' '}
            <span className="bg-gradient-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent">
              ডেঙ্গু ঝুঁকির সম্ভাবনা
            </span>{' '}
            জানুন
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg"
          >
            শুধু "হ্যাঁ/না" উত্তর নয় — D-CHSS মডেল আপনাকে দেখাবে{' '}
            <span className="font-semibold text-slate-700">probability percentage</span>,{' '}
            <span className="font-semibold text-slate-700">ঝুঁকির মাত্রা (Low/Moderate/High)</span>, এবং{' '}
            <span className="font-semibold text-slate-700">কোন কোন CBC মান এই ফলাফলে প্রভাব ফেলেছে</span> তার বিস্তারিত ব্যাখ্যা।
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-4">
            <motion.a
              href="#predict"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(2,132,199,0.35)' }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-sky-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-sky-200"
            >
              প্রেডিকশন শুরু করুন
            </motion.a>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.05, backgroundColor: '#f8fafc' }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-600"
            >
              আরও জানুন
            </motion.a>
          </motion.div>

          {/* feature highlight cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-3"
          >
            <FeatureCard
              icon={<HeartPulse size={20} />}
              title="Probability-based"
              desc="বাইনারি ফলাফল না দিয়ে % আকারে ঝুঁকি দেখানো হয়"
            />
            <FeatureCard
              icon={<ShieldCheck size={20} />}
              title="Explainable"
              desc="প্রতিটি CBC ফিচারের প্রভাব আলাদাভাবে দেখানো হয়"
            />
            <FeatureCard
              icon={<AlertTriangle size={20} />}
              title="গবেষণা উদ্দেশ্যে"
              desc="মেডিকেল ডায়াগনোসিস নয়, শুধুই একটি research demo"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* =============================================================== */}
      {/* PREDICTION FORM SECTION */}
      {/* =============================================================== */}
      <motion.section
        id="predict"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="mx-auto max-w-5xl px-4 py-16 sm:px-6"
      >
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            আপনার CBC রিপোর্টের তথ্য দিন
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            নিচের সব ঘর পূরণ করুন — আপনার Complete Blood Count (CBC) রিপোর্ট থেকে মান বসান
          </p>
        </motion.div>

        <motion.form
          variants={scaleIn}
          initial="hidden"
          animate="show"
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* ---------- Gender & Age ---------- */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-6 grid gap-5 sm:grid-cols-2"
          >
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Gender
              </label>
              <motion.select
                value={formData.gender}
                onChange={(e) => updateField('gender', e.target.value as Gender)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </motion.select>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Age (বছর)
              </label>
              <motion.input
                type="number"
                min={0}
                max={120}
                value={formData.age || ''}
                onChange={(e) => updateField('age', parseFloat(e.target.value) || 0)}
                placeholder="যেমন: 25"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                required
              />
            </motion.div>
          </motion.div>

          {/* ---------- CBC fields grid ---------- */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {CBC_FIELDS.map((field) => (
              <motion.div key={field.key} variants={fadeUp} initial="hidden" animate="show">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {field.label}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    ({field.unit})
                  </span>
                </label>
                <motion.input
                  type="number"
                  step={field.step}
                  min={field.min}
                  max={field.max}
                  value={formData[field.key] || ''}
                  onChange={(e) =>
                    updateField(field.key, parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  required
                />
              </motion.div>
            ))}
          </motion.div>

          {/* ---------- Error ---------- */}
          <AnimatePresence>
            {predictionError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex items-start gap-2 overflow-hidden rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>{predictionError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------- Actions ---------- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                resetForm();
                clearResult();
              }}
              className="flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <motion.span
                animate={isPredicting ? {} : { rotate: 0 }}
                whileHover={{ rotate: -180 }}
                transition={{ duration: 0.4 }}
              >
                <RefreshCcw size={15} />
              </motion.span>
              রিসেট করুন
            </motion.button>
            <motion.button
              whileHover={{ scale: isPredicting ? 1 : 1.05 }}
              whileTap={{ scale: isPredicting ? 1 : 0.95 }}
              type="submit"
              disabled={isPredicting}
              className="flex items-center justify-center gap-2 rounded-full bg-sky-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <AnimatePresence mode="wait">
                {isPredicting ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 size={16} className="animate-spin" /> প্রসেস হচ্ছে...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    প্রেডিক্ট করুন
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.section>

      {/* =============================================================== */}
      {/* RESULT SECTION */}
      {/* =============================================================== */}
      <section id="result" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-400"
            >
              <p className="text-sm">
                এখনো কোনো ফলাফল নেই — উপরের ফর্ম পূরণ করে "প্রেডিক্ট করুন" বাটনে ক্লিক করুন।
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 flex items-center justify-center gap-2 text-center text-2xl font-bold text-slate-900"
              >
                <CheckCircle2 className="text-emerald-500" size={24} />
                প্রেডিকশন ফলাফল
              </motion.h2>

              {/* ---------- Top summary cards ---------- */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid gap-5 sm:grid-cols-3"
              >
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="show"
                  whileHover={{ y: -4 }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Prediction
                  </p>
                  <motion.p
                    key={result.prediction}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className={`mt-2 text-2xl font-extrabold ${
                      result.prediction === 'Positive' ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {result.prediction}
                  </motion.p>
                </motion.div>

                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="show"
                  whileHover={{ y: -4 }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Risk Group
                  </p>
                  <motion.p
                    key={result.risk_group}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className={`mt-2 inline-block rounded-full border px-4 py-1 text-lg font-bold ${riskColor}`}
                  >
                    {result.risk_group}
                  </motion.p>
                </motion.div>

                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="show"
                  whileHover={{ y: -4 }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    D-CHSS Score
                  </p>
                  <motion.p
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="mt-2 text-2xl font-extrabold text-slate-700"
                  >
                    {result.dchss_score}
                  </motion.p>
                </motion.div>
              </motion.div>

              {/* ---------- Probability bar ---------- */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">
                    Dengue হওয়ার সম্ভাবনা (Calibrated Probability)
                  </span>
                  <AnimatedNumber value={result.probability_percent} />
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(result.probability_percent, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className={`relative h-full overflow-hidden rounded-full ${barColor}`}
                  >
                    <span className="shimmer absolute inset-0" />
                  </motion.div>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Decision Threshold: {result.threshold_used_percent}% — এর উপরে হলে Positive ধরা হয়
                </p>
              </motion.div>

              {/* ---------- Feature explanations ---------- */}
              <div className="mt-10">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4 text-lg font-semibold text-slate-800"
                >
                  কোন কোন ফিচার ফলাফলে প্রভাব ফেলেছে
                </motion.h3>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {result.top_feature_explanations.map((feat, idx) => {
                    const isPositive = feat.contribution > 0;
                    const magnitude = Math.min(Math.abs(feat.contribution) * 40, 100);
                    return (
                      <motion.div
                        key={idx}
                        variants={fadeUp}
                        className="flex items-center gap-3"
                      >
                        <span className="w-36 shrink-0 text-xs font-medium text-slate-600 sm:w-44">
                          {feat.feature}
                        </span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${magnitude}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + idx * 0.08, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              isPositive ? 'bg-rose-400' : 'bg-emerald-400'
                            }`}
                          />
                        </div>
                        <span
                          className={`w-40 shrink-0 text-right text-xs font-medium ${
                            isPositive ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {feat.effect}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* ---------- Disclaimer ---------- */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700"
              >
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>{result.disclaimer}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* =============================================================== */}
      {/* HISTORY SECTION */}
      {/* =============================================================== */}
      <motion.section
        id="history"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUp}
        className="mx-auto max-w-5xl px-4 pb-20 sm:px-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <HistoryIcon size={22} className="text-sky-600" />
            </motion.span>
            পূর্ববর্তী ফলাফলসমূহ
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistory((prev) => !prev)}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {showHistory ? 'লুকান' : 'দেখুন'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            >
              {isHistoryLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
                  <Loader2 size={18} className="animate-spin" /> লোড হচ্ছে...
                </div>
              ) : historyError ? (
                <p className="py-10 text-center text-sm text-rose-600">{historyError}</p>
              ) : history.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">
                  এখনো কোনো হিস্টোরি নেই।
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Gender</th>
                        <th className="py-2 pr-4">Age</th>
                        <th className="py-2 pr-4">Probability</th>
                        <th className="py-2 pr-4">Prediction</th>
                        <th className="py-2 pr-4">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((record, idx) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.04 }}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-2.5 pr-4 text-slate-500">
                            {new Date(record.created_at).toLocaleString()}
                          </td>
                          <td className="py-2.5 pr-4 capitalize text-slate-600">
                            {record.gender}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-600">{record.age}</td>
                          <td className="py-2.5 pr-4 font-medium text-slate-700">
                            {record.probability_percent}%
                          </td>
                          <td
                            className={`py-2.5 pr-4 font-semibold ${
                              record.prediction === 'Positive'
                                ? 'text-rose-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {record.prediction}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-600">{record.risk_group}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </div>
  );
}

// ---------------------------------------------------------------------
// Animated percentage counter
// ---------------------------------------------------------------------
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (prevValue === value) return;

    const duration = 1000;
    const startTime = performance.now();
    let rafId: number;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round((prevValue + (value - prevValue) * progress) * 100) / 100);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    }
    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [value, prevValue]);

  useEffect(() => {
    setPrevValue(value);
  }, [value]);

  return <span className="font-bold text-slate-800">{display}%</span>;
}

// ---------------------------------------------------------------------
// Small presentational helper component
// ---------------------------------------------------------------------
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, boxShadow: '0 12px 24px rgba(15,23,42,0.08)' }}
      className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-shadow"
    >
      <motion.span
        whileHover={{ rotate: 15, scale: 1.1 }}
        className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600"
      >
        {icon}
      </motion.span>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
    </motion.div>
  );
}
