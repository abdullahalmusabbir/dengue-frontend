"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

// ============================================================
// Types
// ============================================================

interface AuthContextType {
    sessionId: string | null;
    isAuthenticated: boolean; // login না থাকায় সবসময় true
    isReady: boolean; // session initialize হয়েছে কিনা
    resetSession: () => void;
}

// ============================================================
// Context Setup
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = "dengue_session_id";

function generateSessionId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    // fallback (খুব পুরনো ব্রাউজারের জন্য)
    return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ============================================================
// Provider
// ============================================================

export function AuthProvider({ children }: { children: ReactNode }) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // শুধু browser এ চলবে (SSR এ localStorage নেই)
        let existing = localStorage.getItem(SESSION_STORAGE_KEY);
        if (!existing) {
            existing = generateSessionId();
            localStorage.setItem(SESSION_STORAGE_KEY, existing);
        }
        setSessionId(existing);
        setIsReady(true);
    }, []);

    const resetSession = () => {
        const newId = generateSessionId();
        localStorage.setItem(SESSION_STORAGE_KEY, newId);
        setSessionId(newId);
    };

    const value: AuthContextType = {
        sessionId,
        isAuthenticated: true, // Login প্রয়োজন নেই — সবাই অ্যাক্সেস পাবে
        isReady,
        resetSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================
// Hook
// ============================================================

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}