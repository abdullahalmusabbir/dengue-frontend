'use client';

// ===================================================================
// context/AuthContext.tsx
// ⚠️ এই backend এ কোনো login/authentication নেই (সম্পূর্ণ public app)।
// এই context শুধু "guest user" state রাখে যাতে frontend structure
// consistent থাকে এবং ভবিষ্যতে সত্যিকারের auth যোগ করতে চাইলে সহজ হয়।
// কোনো route protect করে না, কোনো API কল করে না।
// ===================================================================

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
} from 'react';
import type { GuestUser } from '@/types';

interface AuthContextValue {
    user: GuestUser;
    isAuthenticated: boolean; // সবসময় true - কারণ login লাগে না, সবাই app ব্যবহার করতে পারবে
    displayName: string;
    setDisplayName: (name: string) => void;
}

const defaultGuestUser: GuestUser = {
    isGuest: true,
    displayName: 'Guest User',
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [displayName, setDisplayName] = useState<string>(
        defaultGuestUser.displayName
    );

    const value = useMemo<AuthContextValue>(
        () => ({
            user: { isGuest: true, displayName },
            isAuthenticated: true, // login নেই, তাই সবসময় access দেওয়া হয়
            displayName,
            setDisplayName,
        }),
        [displayName]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth অবশ্যই <AuthProvider> এর ভিতরে ব্যবহার করতে হবে');
    }
    return ctx;
}