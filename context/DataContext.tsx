'use client';

// ===================================================================
// context/DataContext.tsx
// Dengue prediction form state, API call, result, এবং history
// সবকিছু centralized ভাবে manage করার জন্য context।
// ===================================================================

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from 'react';
import { predictDengue, fetchPredictionHistory, ApiError } from '@/lib/api';
import type {
    DengueInputPayload,
    DenguePredictionResult,
    DenguePredictionRecord,
} from '@/types';

// ---------- Default empty form state ----------
const emptyPayload: DengueInputPayload = {
    gender: 'male',
    age: 0,
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

interface DataContextValue {
    // ---- Form state ----
    formData: DengueInputPayload;
    setFormData: (data: DengueInputPayload) => void;
    updateField: <K extends keyof DengueInputPayload>(
        key: K,
        value: DengueInputPayload[K]
    ) => void;
    resetForm: () => void;

    // ---- Prediction result ----
    result: DenguePredictionResult | null;
    isPredicting: boolean;
    predictionError: string | null;
    submitPrediction: () => Promise<void>;
    clearResult: () => void;

    // ---- History ----
    history: DenguePredictionRecord[];
    isHistoryLoading: boolean;
    historyError: string | null;
    loadHistory: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    // ---------------- Form state ----------------
    const [formData, setFormData] = useState<DengueInputPayload>(emptyPayload);

    const updateField = useCallback(
        <K extends keyof DengueInputPayload>(
            key: K,
            value: DengueInputPayload[K]
        ) => {
            setFormData((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const resetForm = useCallback(() => {
        setFormData(emptyPayload);
    }, []);

    // ---------------- Prediction state ----------------
    const [result, setResult] = useState<DenguePredictionResult | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [predictionError, setPredictionError] = useState<string | null>(null);

    const submitPrediction = useCallback(async () => {
        setIsPredicting(true);
        setPredictionError(null);
        setResult(null);

        try {
            const response = await predictDengue(formData);
            setResult(response);
        } catch (err) {
            if (err instanceof ApiError) {
                setPredictionError(err.message);
            } else {
                setPredictionError('Prediction করতে সমস্যা হয়েছে। আবার চেষ্টা করো।');
            }
        } finally {
            setIsPredicting(false);
        }
    }, [formData]);

    const clearResult = useCallback(() => {
        setResult(null);
        setPredictionError(null);
    }, []);

    // ---------------- History state ----------------
    const [history, setHistory] = useState<DenguePredictionRecord[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const loadHistory = useCallback(async () => {
        setIsHistoryLoading(true);
        setHistoryError(null);

        try {
            const records = await fetchPredictionHistory();
            setHistory(records);
        } catch (err) {
            if (err instanceof ApiError) {
                setHistoryError(err.message);
            } else {
                setHistoryError('History load করতে সমস্যা হয়েছে।');
            }
        } finally {
            setIsHistoryLoading(false);
        }
    }, []);

    const value: DataContextValue = {
        formData,
        setFormData,
        updateField,
        resetForm,

        result,
        isPredicting,
        predictionError,
        submitPrediction,
        clearResult,

        history,
        isHistoryLoading,
        historyError,
        loadHistory,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
    const ctx = useContext(DataContext);
    if (!ctx) {
        throw new Error('useData অবশ্যই <DataProvider> এর ভিতরে ব্যবহার করতে হবে');
    }
    return ctx;
}