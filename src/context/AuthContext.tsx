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

        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");

        if (urlToken) {
            localStorage.setItem("github_token", urlToken);
            window.history.replaceState({}, document.title, window.location.pathname);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
        }

        async function checkAuth() {
            const token = localStorage.getItem("github_token");
            if (!token) {
                if (mounted) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                }
                return;
            }

            try {
                const res = await fetch(`${API_URL}/auth/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (mounted) {
                        setIsAuthenticated(!!data.authenticated);
                    }
                } else {
                    localStorage.removeItem("github_token");
                    if (mounted) setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem("github_token");
                if (mounted) setIsAuthenticated(false);
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
    }, [API_URL]);

    const logout = async () => {
        try {
            const token = localStorage.getItem("github_token");
            if (token) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem("github_token");
            setIsAuthenticated(false);
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
