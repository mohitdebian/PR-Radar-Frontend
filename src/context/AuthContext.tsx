import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        let mounted = true;

        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get("token");

        if (urlToken) {
            localStorage.setItem("github_token", urlToken);
            window.history.replaceState({}, document.title, window.location.pathname);
            // Note: We bypass storing the `user` immediately here because we need the backend to give us
            // their exact plan tier. The subsequent `checkAuth` call will fetch and populate it natively.
            setIsLoading(true);
            return;
        }

        async function checkAuth() {
            const token = localStorage.getItem("github_token");
            if (!token) {
                if (mounted) {
                    setUser(null);
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
                    const data = await res.json() as User;
                    if (mounted) {
                        if (data.authenticated) {
                            setUser(data);
                        } else {
                            setUser(null);
                        }
                    }
                } else {
                    localStorage.removeItem("github_token");
                    if (mounted) setUser(null);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem("github_token");
                if (mounted) setUser(null);
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
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, logout }}>
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
