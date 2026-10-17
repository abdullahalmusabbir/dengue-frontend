// ===================================================================
// types/index.ts
// Django backend (dengues app) এর response/request shape অনুযায়ী types
// ===================================================================

// ---------- Gender ----------
export type Gender = 'male' | 'female' | 'other';

// ---------- Prediction & Risk ----------
export type PredictionLabel = 'Positive' | 'Negative';
export type RiskGroup = 'Low' | 'Moderate' | 'High';

// ---------- Request payload (DengueInputSerializer এর সাথে mapping) ----------
export interface DengueInputPayload {
    gender: Gender;
    age: number;

    hemoglobin: number;
    neutrophils: number;
    lymphocytes: number;
    monocytes: number;
    eosinophils: number;
    rbc: number;
    hct: number;
    mcv: number;
    mch: number;
    mchc: number;
    rdw_cv: number;
    platelet: number;
    mpv: number;
    pdw: number;
    pct: number;
    wbc: number;
}

// ---------- Feature explanation (predict_dengue() এর top_feature_explanations) ----------
export interface FeatureExplanation {
    feature: string;
    contribution: number;
    effect: string; // 'dengue risk বাড়াচ্ছে' | 'dengue risk কমাচ্ছে'
}

// ---------- Prediction API response (POST /api/dengues/predict/) ----------
export interface DenguePredictionResult {
    probability_percent: number;
    prediction: PredictionLabel;
    risk_group: RiskGroup;
    dchss_score: number;
    threshold_used_percent: number;
    top_feature_explanations: FeatureExplanation[];
    disclaimer: string;
}

// ---------- History record (GET /api/dengues/history/) ----------
export interface DenguePredictionRecord extends DengueInputPayload {
    id: number;
    probability_percent: number;
    prediction: PredictionLabel;
    risk_group: RiskGroup;
    dchss_score: number;
    threshold_used_percent: number;
    top_feature_explanations: FeatureExplanation[];
    created_at: string; // ISO datetime string
}

// ---------- Generic API error shape ----------
export interface ApiErrorResponse {
    error?: string;
    detail?: string;
    [field: string]: any; // DRF validation errors field-wise আসতে পারে
}

// ---------- Form field metadata (UI তে input render করার জন্য helper) ----------
export interface CbcFieldMeta {
    key: keyof Omit<DengueInputPayload, 'gender' | 'age'>;
    label: string;
    unit: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
}

export const CBC_FIELDS: CbcFieldMeta[] = [
    { key: 'hemoglobin', label: 'Hemoglobin', unit: 'g/dl', step: 0.1, min: 0 },
    { key: 'neutrophils', label: 'Neutrophils', unit: '%', step: 0.1, min: 0, max: 100 },
    { key: 'lymphocytes', label: 'Lymphocytes', unit: '%', step: 0.1, min: 0, max: 100 },
    { key: 'monocytes', label: 'Monocytes', unit: '%', step: 0.1, min: 0, max: 100 },
    { key: 'eosinophils', label: 'Eosinophils', unit: '%', step: 0.1, min: 0, max: 100 },
    { key: 'rbc', label: 'RBC', unit: 'mill/cumm', step: 0.01, min: 0 },
    { key: 'hct', label: 'HCT', unit: '%', step: 0.1, min: 0, max: 100 },
    { key: 'mcv', label: 'MCV', unit: 'fl', step: 0.1, min: 0 },
    { key: 'mch', label: 'MCH', unit: 'pg', step: 0.1, min: 0 },
    { key: 'mchc', label: 'MCHC', unit: 'g/dl', step: 0.1, min: 0 },
    { key: 'rdw_cv', label: 'RDW-CV', unit: '%', step: 0.1, min: 0 },
    { key: 'platelet', label: 'Total Platelet Count', unit: '/cumm', step: 1000, min: 0 },
    { key: 'mpv', label: 'MPV', unit: 'fl', step: 0.1, min: 0 },
    { key: 'pdw', label: 'PDW', unit: '%', step: 0.1, min: 0 },
    { key: 'pct', label: 'PCT', unit: '%', step: 0.01, min: 0 },
    { key: 'wbc', label: 'Total WBC Count', unit: '/cumm', step: 100, min: 0 },
];

// ---------- Placeholder User type (login নেই, তবুও future-proof রাখা হলো) ----------
export interface GuestUser {
    isGuest: true;
    displayName: string;
}