// ===================================================================
// lib/api.ts
// Django backend এর সাথে কথা বলার জন্য centralized API client।
// কোনো auth token/header লাগবে না - backend পুরোপুরি public (AllowAny)।
// ===================================================================

import type {
    DengueInputPayload,
    DenguePredictionResult,
    DenguePredictionRecord,
    ApiErrorResponse,
} from '@/types';

// .env.local এ NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 সেট করবে
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const PREDICT_ENDPOINT = `${API_BASE_URL}/api/dengues/predict/`;
const HISTORY_ENDPOINT = `${API_BASE_URL}/api/dengues/history/`;

// ---------- Custom error class ----------
export class ApiError extends Error {
    status: number;
    payload: ApiErrorResponse | null;

    constructor(message: string, status: number, payload: ApiErrorResponse | null = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.payload = payload;
    }
}

// ---------- Generic fetch wrapper ----------
async function request<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    let response: Response;

    try {
        response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            // login নাই, তাই credentials/cookies পাঠানোর দরকার নেই
            cache: 'no-store',
        });
    } catch (networkErr) {
        throw new ApiError(
            'Server এর সাথে connect করা যাচ্ছে না। Backend চালু আছে কিনা চেক করো।',
            0,
            null
        );
    }

    let data: any = null;
    try {
        data = await response.json();
    } catch {
        // body খালি থাকলে বা JSON না হলে ignore
    }

    if (!response.ok) {
        const message = data?.error || data?.detail || (data ? JSON.stringify(data) : 'Unknown error occurred');
        throw new ApiError(message, response.status, data);
    }

    return data as T;
}

// ===================================================================
// ⭐ Public API functions
// ===================================================================

/**
 * POST /api/dengues/predict/
 * CBC input পাঠিয়ে probability %, risk group, explanation পাওয়া যাবে।
 */
export async function predictDengue(
    payload: DengueInputPayload
): Promise<DenguePredictionResult> {
    return request<DenguePredictionResult>(PREDICT_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

/**
 * GET /api/dengues/history/
 * সাম্প্রতিক prediction history list (সর্বোচ্চ ৫০টা, backend থেকেই limited)।
 */
export async function fetchPredictionHistory(): Promise<
    DenguePredictionRecord[]
> {
    return request<DenguePredictionRecord[]>(HISTORY_ENDPOINT, {
        method: 'GET',
    });
}

const api = {
    predictDengue,
    fetchPredictionHistory,
};

export default api;