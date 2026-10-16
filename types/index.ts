// ============================================================
// Dengue D-CHSS Prediction — Shared TypeScript Types
// ============================================================

export type Gender = "Male" | "Female" | "male" | "female" | "M" | "F";

export type PredictionLabel = "Positive" | "Negative";

export type RiskGroup = "Low" | "Moderate" | "High";

export type ParameterState = "LOW" | "NORMAL" | "HIGH";

// ------------------------------------------------------------
// Input: Patient CBC Data (frontend form -> backend predict API)
// ------------------------------------------------------------
export interface DenguePredictionInput {
    age: number;
    gender: Gender;
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

// ------------------------------------------------------------
// Explanation item returned by backend (why the model predicted this)
// ------------------------------------------------------------
export interface ExplanationItem {
    parameter: string;
    state: ParameterState | "NORMAL";
    deviation_score: number;
    importance: number;
    message: string;
}

export type ParameterStatesMap = Record<string, ParameterState>;

// ------------------------------------------------------------
// Output: Prediction Result (from /predict/ endpoint)
// ------------------------------------------------------------
export interface DenguePredictionResult {
    prediction: PredictionLabel;
    probability_percentage: number;
    confidence_percentage: number;
    risk_group: RiskGroup;
    dchss_score: number;
    classification_threshold: number;
    explanation: ExplanationItem[];
    parameter_states: ParameterStatesMap;
}

// ------------------------------------------------------------
// API Response Wrappers
// ------------------------------------------------------------
export interface PredictApiResponse {
    success: boolean;
    id?: string;
    result?: DenguePredictionResult;
    error?: string;
    errors?: Record<string, string[]>;
}

export interface DenguePredictionRecord extends DenguePredictionInput {
    id: string;
    prediction_label: PredictionLabel;
    probability_percentage: number;
    confidence_percentage: number;
    risk_group: RiskGroup;
    dchss_score: number;
    classification_threshold: number;
    explanation: ExplanationItem[];
    raw_response: DenguePredictionResult;
    created_at: string;
}

export interface HistoryApiResponse {
    success: boolean;
    count: number;
    results: DenguePredictionRecord[];
    error?: string;
}

export interface DetailApiResponse {
    success: boolean;
    result?: DenguePredictionRecord;
    error?: string;
}

export interface HealthCheckResponse {
    status: "ok" | "error";
    model_loaded: boolean;
    error?: string;
}

// ------------------------------------------------------------
// Generic API error shape (normalized in lib/api.ts)
// ------------------------------------------------------------
export interface ApiError {
    message: string;
    status?: number;
    fieldErrors?: Record<string, string[]>;
}