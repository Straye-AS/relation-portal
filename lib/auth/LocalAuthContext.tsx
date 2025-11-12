"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { User } from "@/types";
import { TEST_USER } from "./localAuthConfig";

interface LocalAuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const LocalAuthContext = createContext<LocalAuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = "straye_local_auth";

interface LocalAuthProviderProps {
    children: ReactNode;
}

/**
 * Local authentication provider for development
 * Simulates authentication without requiring Microsoft account
 */
export function LocalAuthProvider({ children }: LocalAuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const checkAuth = () => {
            if (typeof window === "undefined") return;

            const stored = localStorage.getItem(LOCAL_AUTH_KEY);
            if (stored === "true") {
                setUser(TEST_USER);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = useCallback(async () => {
        setIsLoading(true);
        // Simulate a brief network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        localStorage.setItem(LOCAL_AUTH_KEY, "true");
        setUser(TEST_USER);
        setIsLoading(false);
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        // Simulate a brief network delay
        await new Promise(resolve => setTimeout(resolve, 200));

        localStorage.removeItem(LOCAL_AUTH_KEY);
        setUser(null);
        setIsLoading(false);
    }, []);

    const value: LocalAuthContextType = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
    };

    return (
        <LocalAuthContext.Provider value={value}>
            {children}
        </LocalAuthContext.Provider>
    );
}

/**
 * Hook to use local authentication context
 */
export function useLocalAuth(): LocalAuthContextType {
    const context = useContext(LocalAuthContext);
    if (context === undefined) {
        throw new Error("useLocalAuth must be used within LocalAuthProvider");
    }
    return context;
}

