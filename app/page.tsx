"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Brain,
  Zap,
  ShieldCheck,
  Gauge,
  FileSearch,
  Droplets,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import type { DenguePredictionInput } from "@/types";

// ============================================================
// Static Content
// ============================================================

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Detection",
    description:
      "Calibrated XGBoost model trained on real clinical hematological data to detect Dengue patterns with high sensitivity.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: FileSearch,
    title: "Explainable Results",
    description:
      "Every prediction comes with a clear explanation — which CBC parameters were abnormal and why they matter.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description:
      "Get your prediction, risk classification, and probability percentage in seconds — no waiting, no login required.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Gauge,
    title: "D-CHSS Risk Scoring",
    description:
      "A novel composite hematological score (Thrombocytopenia + Leukocyte + Hemoconcentration) for layered risk grouping.",
    color: "from-rose-500 to-pink-500",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Enter CBC Report Values",
    desc: "Fill in your Complete Blood Count parameters from your lab report.",
  },
  {
    step: "02",
    title: "AI Processes Your Data",
    desc: "Our calibrated ML model analyzes deviations from clinical reference ranges.",
  },
  {
    step: "03",
    title: "Get Explained Results",
    desc: "Receive a prediction, probability %, risk group, and plain-language explanation.",
  },
];

const FORM_FIELDS: {
  key: keyof Omit<DenguePredictionInput, "gender">;
  label: string;
  unit: string;
  placeholder: string;
}[] = [
  { key: "age", label: "Age", unit: "years", placeholder: "28" },
  { key: "hemoglobin", label: "Hemoglobin", unit: "g/dL", placeholder: "13.5" },
  { key: "neutrophils", label: "Neutrophils", unit: "%", placeholder: "65" },
  { key: "lymphocytes", label: "Lymphocytes", unit: "%", placeholder: "25" },
  { key: "monocytes", label: "Monocytes", unit: "%", placeholder: "6" },
  { key: "eosinophils", label: "Eosinophils", unit: "%", placeholder: "2" },
  { key: "rbc", label: "RBC", unit: "mill/cumm", placeholder: "4.8" },
  { key: "hct", label: "HCT", unit: "%", placeholder: "42" },
  { key: "mcv", label: "MCV", unit: "fL", placeholder: "88" },
  { key: "mch", label: "MCH", unit: "pg", placeholder: "29" },
  { key: "mchc", label: "MCHC", unit: "g/dL", placeholder: "33" },
  { key: "rdw_cv", label: "RDW-CV", unit: "%", placeholder: "13.2" },
  { key: "platelet", label: "Platelet Count", unit: "/cumm", placeholder: "95000" },
  { key: "mpv", label: "MPV", unit: "fL", placeholder: "9.5" },
  { key: "pdw", label: "PDW", unit: "%", placeholder: "14" },
  { key: "pct", label: "PCT", unit: "%", placeholder: "0.15" },
  { key: "wbc", label: "Total WBC Count", unit: "/cumm", placeholder: "4200" },
];

const EMPTY_FORM: DenguePredictionInput = {
  age: 0,
  gender: "Male",
  hemoglobin: 0,
  neutrophils: 0,
  lymphocytes: 0,
  monocytes: 0,
  eosinophils: 0,
  rbc: 0,
  hct: 0,
  mcv: 0,
  mch: 0,
  mchc: 0,
  rdw_cv: 0,
  platelet: 0,
  mpv: 0,
  pdw: 0,
  pct: 0,
  wbc: 0,
};

// ============================================================
// Circular Probability Gauge (animated)
// ============================================================

function ProbabilityGauge({
  percentage,
  isPositive,
}: {
  percentage: number;
  isPositive: boolean;
}) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = isPositive ? "#ef4444" : "#22c55e";

  return (
    <div className="relative flex h-44 w-44 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-3xl font-bold text-slate-800"
        >
          {percentage.toFixed(1)}%
        </motion.span>
        <span className="text-xs font-medium text-slate-400">Probability</span>
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function HomePage() {
  const { submitPrediction, currentResult, isPredicting, predictionError, clearCurrentResult } =
    useData();

  const [formData, setFormData] = useState<DenguePredictionInput>(EMPTY_FORM);

  const handleChange = (
    key: keyof DenguePredictionInput,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: key === "gender" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPrediction(formData);

    // Result সেকশনে স্মুথলি স্ক্রল করা
    setTimeout(() => {
      document.getElementById("result-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    clearCurrentResult();
  };

  const isPositive = currentResult?.prediction === "Positive";

  return (
    <>
      {/* ===================== HERO SECTION ===================== */}
      <section
        id="home"
        className="relative overflow-hidden px-6 pt-20 pb-28 lg:px-8"
      >
        {/* Animated Blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl animate-blob" />
          <div className="absolute top-40 -right-20 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700"
          >
            <Sparkles className="h-4 w-4" />
            Powered by Explainable Machine Learning
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Detect Dengue from your{" "}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              CBC Report
            </span>{" "}
            Instantly
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500"
          >
            D-CHSS uses a clinically-grounded hematological signature and a
            calibrated AI model to predict Dengue infection risk — complete
            with a probability score and a human-readable explanation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#predict-form"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-200 transition-transform hover:scale-105 active:scale-95"
            >
              Check Your Risk Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              How It Works
            </a>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-slate-400"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-500" /> Privacy-first, no login
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-teal-500" /> Results in seconds
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-teal-500" /> Clinically grounded model
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== FEATURES SECTION ===================== */}
      <section id="features" className="relative px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Why D-CHSS?
            </h2>
            <p className="mt-4 text-slate-500">
              A hematology-aware, explainable approach to Dengue screening —
              built on real clinical reference ranges and calibrated AI.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-teal-100"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-md`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section id="how-it-works" className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              How It Works
            </h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((s, idx) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-xl font-bold text-white shadow-lg shadow-teal-200">
                  {s.step}
                </div>
                <h3 className="text-base font-semibold text-slate-800">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PREDICTION FORM SECTION ===================== */}
      <section
        id="predict-form"
        className="relative px-6 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-200">
              <Droplets className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Enter Your CBC Report
            </h2>
            <p className="mt-3 text-slate-500">
              Fill in the values exactly as shown in your lab report for the
              most accurate analysis.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10"
          >
            {/* Gender & Age row */}
            <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none ring-teal-500/30 transition focus:border-teal-400 focus:ring-4"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                  Age (years)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={120}
                  placeholder="28"
                  value={formData.age || ""}
                  onChange={(e) => handleChange("age", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none ring-teal-500/30 transition focus:border-teal-400 focus:ring-4"
                />
              </div>
            </div>

            {/* CBC fields grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FORM_FIELDS.filter((f) => f.key !== "age").map((field) => (
                <div key={field.key}>
                  <label className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-slate-600">
                    {field.label}
                    <span className="text-xs font-normal text-slate-400">
                      {field.unit}
                    </span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min={0}
                    placeholder={field.placeholder}
                    value={(formData[field.key] as number) || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none ring-teal-500/30 transition focus:border-teal-400 focus:ring-4"
                  />
                </div>
              ))}
            </div>

            {predictionError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {predictionError.message}
              </motion.div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isPredicting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-200 transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isPredicting ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Activity className="h-4.5 w-4.5" />
                    Analyze & Predict
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-600 transition-colors hover:bg-slate-50 sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* ===================== RESULT SECTION ===================== */}
      <section id="result-section" className="px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            {currentResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`overflow-hidden rounded-3xl border p-6 shadow-xl sm:p-10 ${
                  isPositive
                    ? "border-red-100 bg-gradient-to-br from-red-50 to-white shadow-red-100"
                    : "border-green-100 bg-gradient-to-br from-green-50 to-white shadow-green-100"
                }`}
              >
                <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
                  {/* Left: Verdict */}
                  <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${
                        isPositive
                          ? "bg-red-500 shadow-red-200"
                          : "bg-green-500 shadow-green-200"
                      }`}
                    >
                      {isPositive ? (
                        <XCircle className="h-9 w-9 text-white" />
                      ) : (
                        <CheckCircle2 className="h-9 w-9 text-white" />
                      )}
                    </motion.div>

                    <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                      Dengue {currentResult.prediction}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-slate-500">
                      {isPositive
                        ? "The model has detected hematological patterns consistent with Dengue infection. Please consult a healthcare professional promptly."
                        : "The model did not detect strong hematological indicators of Dengue infection. Continue monitoring your symptoms."}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                      <span
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                          currentResult.risk_group === "High"
                            ? "bg-red-100 text-red-700"
                            : currentResult.risk_group === "Moderate"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        Risk: {currentResult.risk_group}
                      </span>
                      <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600">
                        Confidence: {currentResult.confidence_percentage.toFixed(1)}%
                      </span>
                      <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600">
                        D-CHSS Score: {currentResult.dchss_score.toFixed(3)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Gauge */}
                  <ProbabilityGauge
                    percentage={currentResult.probability_percentage}
                    isPositive={isPositive}
                  />
                </div>

                {/* Explanation list */}
                <div className="mt-10 border-t border-slate-200/60 pt-8">
                  <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-800">
                    <FileSearch className="h-4.5 w-4.5 text-teal-600" />
                    Why this result?
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {currentResult.explanation.map((item, idx) => (
                      <motion.div
                        key={item.parameter + idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1, duration: 0.4 }}
                        className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4"
                      >
                        <span
                          className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                            item.state === "HIGH"
                              ? "bg-red-500"
                              : item.state === "LOW"
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {item.message}
                          </p>
                          {item.importance > 0 && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              Model importance: {(item.importance * 100).toFixed(1)}%
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Check Another Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
