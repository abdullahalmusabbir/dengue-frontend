"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import {
    predictDengue,
    getPredictionHistory,
    getPredictionDetail,
} from "@/lib/api";
import type {
    DenguePredictionInput,
    DenguePredictionResult,
    DenguePredictionRecord,
    ApiError,
} from "@/types";

// ============================================================
// Types
// ============================================================

interface DataContextType {
    // ---- Current Prediction ----
    currentResult: DenguePredictionResult | null;
    currentRecordId: string | null;
    isPredicting: boolean;
    predictionError: ApiError | null;

    // ---- History ----
    history: DenguePredictionRecord[];
    isHistoryLoading: boolean;
    historyError: ApiError | null;

    // ---- Record Detail ----
    selectedRecord: DenguePredictionRecord | null;
    isDetailLoading: boolean;
    detailError: ApiError | null;

    // ---- Actions ----
    submitPrediction: (payload: DenguePredictionInput) => Promise<boolean>;
    fetchHistory: () => Promise<void>;
    fetchRecordDetail: (id: string) => Promise<void>;
    clearCurrentResult: () => void;
    clearSelectedRecord: () => void;
}

// ============================================================
// Context Setup
// ============================================================

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    // ---- Prediction State ----
    const [currentResult, setCurrentResult] =
        useState<DenguePredictionResult | null>(null);
    const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [predictionError, setPredictionError] = useState<ApiError | null>(
        null
    );

    // ---- History State ----
    const [history, setHistory] = useState<DenguePredictionRecord[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<ApiError | null>(null);

    // ---- Detail State ----
    const [selectedRecord, setSelectedRecord] =
        useState<DenguePredictionRecord | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<ApiError | null>(null);

    // ------------------------------------------------------------
    // Submit a new prediction
    // ------------------------------------------------------------
    const submitPrediction = useCallback(
        async (payload: DenguePredictionInput): Promise<boolean> => {
            setIsPredicting(true);
            setPredictionError(null);
            setCurrentResult(null);

            try {
                const response = await predictDengue(payload);

                if (response.success && response.result) {
                    setCurrentResult(response.result);
                    setCurrentRecordId(response.id ?? null);
                    return true;
                } else {
                    setPredictionError({
                        message: response.error || "Prediction failed.",
                    });
                    return false;
                }
            } catch (error) {
                setPredictionError(error as ApiError);
                return false;
            } finally {
                setIsPredicting(false);
            }
        },
        []
    );

    // ------------------------------------------------------------
    // Fetch prediction history
    // ------------------------------------------------------------
    const fetchHistory = useCallback(async () => {
        setIsHistoryLoading(true);
        setHistoryError(null);

        try {
            const response = await getPredictionHistory();
            if (response.success) {
                setHistory(response.results);
            } else {
                setHistoryError({ message: response.error || "Failed to load history." });
            }
        } catch (error) {
            setHistoryError(error as ApiError);
        } finally {
            setIsHistoryLoading(false);
        }
    }, []);

    // ------------------------------------------------------------
    // Fetch a single record's detail
    // ------------------------------------------------------------
    const fetchRecordDetail = useCallback(async (id: string) => {
        setIsDetailLoading(true);
        setDetailError(null);
        setSelectedRecord(null);

        try {
            const response = await getPredictionDetail(id);
            if (response.success && response.result) {
                setSelectedRecord(response.result);
            } else {
                setDetailError({ message: response.error || "Record not found." });
            }
        } catch (error) {
            setDetailError(error as ApiError);
        } finally {
            setIsDetailLoading(false);
        }
    }, []);

    // ------------------------------------------------------------
    // Clear helpers
    // ------------------------------------------------------------
    const clearCurrentResult = useCallback(() => {
        setCurrentResult(null);
        setCurrentRecordId(null);
        setPredictionError(null);
    }, []);

    const clearSelectedRecord = useCallback(() => {
        setSelectedRecord(null);
        setDetailError(null);
    }, []);

    // ------------------------------------------------------------
    const value: DataContextType = {
        currentResult,
        currentRecordId,
        isPredicting,
        predictionError,

        history,
        isHistoryLoading,
        historyError,

        selectedRecord,
        isDetailLoading,
        detailError,

        submitPrediction,
        fetchHistory,
        fetchRecordDetail,
        clearCurrentResult,
        clearSelectedRecord,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// ============================================================
// Hook
// ============================================================

export function useData(): DataContextType {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}