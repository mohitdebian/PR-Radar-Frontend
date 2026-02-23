import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    return (
        <header className="relative z-10 border-b border-surface-700/30 bg-surface-900/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-3.5">
                {/* Radar icon with glow */}
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 text-accent ring-1 ring-accent/10">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-[18px] w-[18px]"
                    >
                        <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" />
                        <path d="M4 6h.01" />
                        <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" />
                        <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" />
                        <path d="M12 18H12.01" />
                        <path d="M17.99 11.66A6 6 0 0 1 15.77 16.22" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="m13.41 10.59 5.66-5.66" />
                    </svg>
                    <div className="absolute inset-0 rounded-xl bg-accent/5 blur-md" />
                </div>
                <div>
                    <h1 className="text-base font-bold tracking-tight text-white">
                        PR Radar
                    </h1>
                    <p className="text-[11px] text-slate-500">
                        Open-source contribution scanner
                    </p>
                </div>

                {/* GitHub Auth Section */}
                <div className="ml-auto flex items-center gap-3">
                    {isLoading ? (
                        <div className="h-8 w-24 animate-pulse rounded-lg bg-surface-800/50" />
                    ) : isAuthenticated ? (
                        <button
                            onClick={() => void logout()}
                            className="flex items-center gap-1.5 rounded-lg border border-surface-600/30 bg-surface-800/50
                                       px-3 py-1.5 text-[11px] font-medium text-slate-400 transition-all
                                       hover:border-surface-600/60 hover:text-slate-200"
                        >
                            Sign out
                        </button>
                    ) : (
                        <a
                            href={`${API_URL}/auth/login`}
                            className="flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10
                                       px-3 py-1.5 text-[11px] font-medium text-accent transition-all
                                       hover:border-accent/60 hover:bg-accent/20"
                        >
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                            Login with GitHub
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
}
