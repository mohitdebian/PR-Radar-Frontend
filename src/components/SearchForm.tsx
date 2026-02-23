import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
    onSubmit: (repoUrl: string) => void;
    isLoading: boolean;
}

export default function SearchForm({ onSubmit, isLoading }: Props) {
    const [url, setUrl] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { isAuthenticated } = useAuth();

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = url.trim();
        if (trimmed) {
            if (!isAuthenticated) {
                setShowLoginModal(true);
                return;
            }
            onSubmit(trimmed);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
            <div className="gradient-border rounded-2xl p-[1px] shadow-lg shadow-accent/5">
                <div className="flex items-center gap-2 rounded-2xl bg-surface-800 px-3 py-2 sm:px-4">
                    {/* GitHub icon */}
                    <svg
                        className="h-5 w-5 shrink-0 text-slate-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>

                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="owner/repo or https://github.com/owner/repo"
                        className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-slate-500"
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !url.trim()}
                        className="btn-glow flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white
                       whitespace-nowrap transition-all duration-200 hover:bg-accent-bright
                       disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent
                       sm:px-5"
                    >
                        {isLoading ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle
                                        className="opacity-25"
                                        cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                <span className="hidden sm:inline">Scanning…</span>
                            </>
                        ) : (
                            <>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                Scan
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Login Required Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 shadow-2xl backdrop-blur-sm card-enter">
                    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-surface-600/30 bg-surface-800 p-6 text-center shadow-2xl">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                            <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-white">GitHub Connection Required</h3>
                        <p className="mb-6 text-sm text-slate-400">
                            To protect against API rate limits and scan large repositories, please safely connect your GitHub account.
                        </p>
                        <div className="flex flex-col gap-3">
                            <a
                                href={`${API_URL}/auth/login`}
                                className="inline-block w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Connect with GitHub
                            </a>
                            <button
                                type="button"
                                onClick={() => setShowLoginModal(false)}
                                className="inline-block w-full rounded-xl px-4 py-3 text-sm font-bold text-slate-400 transition-colors hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
