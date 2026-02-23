import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        let mounted = true;

        async function checkAuth() {
            try {
                const res = await fetch(`${API_URL}/auth/user`, {
                    credentials: "include", // Important: rely on HTTP-only cookie
                });
                if (res.ok) {
                    const data = await res.json();
                    if (mounted) {
                        setIsAuthenticated(!!data.authenticated);
                    }
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        void checkAuth();

        return () => {
            mounted = false;
        };
    }, []);

    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
