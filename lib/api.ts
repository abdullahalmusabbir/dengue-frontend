import axios, { AxiosError, AxiosInstance } from "axios";
import type {
    DenguePredictionInput,
    PredictApiResponse,
    HistoryApiResponse,
    DetailApiResponse,
    HealthCheckResponse,
    ApiError,
} from "@/types";

// ============================================================
// Axios Instance Configuration
// ============================================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://dengue-backend-2v0q.onrender.com/api/dengue";

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 120000, // ML inference একটু সময় নিতে পারে
});

// ------------------------------------------------------------
// Request Interceptor — anonymous session id attach করা (login নেই)
// ------------------------------------------------------------
apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const sessionId = localStorage.getItem("dengue_session_id");
        if (sessionId) {
            config.headers["X-Session-Id"] = sessionId;
        }
    }
    return config;
});

// ------------------------------------------------------------
// Error Normalizer
// ------------------------------------------------------------
function normalizeError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<{
            error?: string;
            errors?: Record<string, string[]>;
        }>;

        const status = axiosErr.response?.status;
        const data = axiosErr.response?.data;

        if (data?.errors) {
            return {
                message: "Validation failed. Please check your input.",
                status,
                fieldErrors: data.errors,
            };
        }

        if (data?.error) {
            return { message: data.error, status };
        }

        if (axiosErr.code === "ECONNABORTED") {
            return { message: "Request timed out. Please try again.", status };
        }

        if (!axiosErr.response) {
            return { message: "Cannot connect to server. Please check your connection." };
        }

        return { message: axiosErr.message || "Something went wrong.", status };
    }

    return { message: "An unexpected error occurred." };
}

// ============================================================
// API Functions
// ============================================================

/**
 * CBC ডেটা পাঠিয়ে dengue prediction, explanation এবং probability% পাওয়া
 */
export async function predictDengue(
    payload: DenguePredictionInput
): Promise<PredictApiResponse> {
    try {
        const { data } = await apiClient.post<PredictApiResponse>(
            "/predict/",
            payload
        );
        return data;
    } catch (error) {
        throw normalizeError(error);
    }
}

/**
 * সর্বশেষ prediction history (সর্বোচ্চ ৫০টি রেকর্ড)
 */
export async function getPredictionHistory(): Promise<HistoryApiResponse> {
    try {
        const { data } = await apiClient.get<HistoryApiResponse>("/history/");
        return data;
    } catch (error) {
        throw normalizeError(error);
    }
}

/**
 * নির্দিষ্ট একটি prediction রেকর্ডের বিস্তারিত তথ্য
 */
export async function getPredictionDetail(
    id: string
): Promise<DetailApiResponse> {
    try {
        const { data } = await apiClient.get<DetailApiResponse>(
            `/history/${id}/`
        );
        return data;
    } catch (error) {
        throw normalizeError(error);
    }
}

/**
 * ব্যাকএন্ড মডেল ঠিকভাবে লোড হয়েছে কিনা চেক করা
 */
export async function checkHealth(): Promise<HealthCheckResponse> {
    try {
        const { data } = await apiClient.get<HealthCheckResponse>("/health/");
        return data;
    } catch (error) {
        throw normalizeError(error);
    }
}

export default apiClient;