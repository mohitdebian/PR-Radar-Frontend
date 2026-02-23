import SearchForm from "../components/SearchForm";
import ResultsPanel from "../components/ResultsPanel";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { analyzeRepo } from "../api";
import { useScan } from "../context/ScanContext";

export default function HomePage() {
    const { data, setData, isLoading, setIsLoading, error, setError } = useScan();

    const handleSubmit = async (repoUrl: string) => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const result = await analyzeRepo(repoUrl);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex flex-1 flex-col px-6 py-10">
            {/* Hero / search area */}
            <div
                className={`flex flex-col items-center gap-6 transition-all duration-500
            ${data || isLoading ? "mb-10" : "my-auto"}`}
            >
                {!data && !isLoading && !error && (
                    <div className="mb-6 text-center card-enter">
                        {/* Floating badge */}
                        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/5 px-4 py-1.5 text-[11px] font-medium text-accent-bright">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                                <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
                            </span>
                            AI-powered issue analysis
                        </div>

                        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                            Spot the best issues to{" "}
                            <span className="bg-gradient-to-r from-accent via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                contribute
                            </span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
                            Paste a public GitHub repo URL and we'll score every open issue
                            based on merge probability — so you can skip the noise and land
                            your first PR.
                        </p>

                        {/* Feature pills */}
                        <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-3">
                            {[
                                { icon: "🎯", text: "Smart scoring" },
                                { icon: "🤖", text: "AI analysis" },
                                { icon: "⚡", text: "Instant results" },
                            ].map((feat) => (
                                <span
                                    key={feat.text}
                                    className="flex items-center gap-1.5 rounded-full bg-surface-800/60 px-3 py-1.5 text-xs text-slate-400 ring-1 ring-surface-600/20"
                                >
                                    {feat.icon} {feat.text}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <SearchForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Error */}
            {error && (
                <div className="mx-auto mt-6 w-full max-w-2xl rounded-2xl border border-rose-500/20 bg-rose-500/5 px-5 py-4 text-sm text-rose-400 card-enter">
                    <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <p className="font-semibold">Analysis failed</p>
                    </div>
                    <p className="mt-1.5 text-xs opacity-80">{error}</p>
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="mt-6">
                    <LoadingSkeleton />
                </div>
            )}

            {/* Results */}
            {data && !isLoading && (
                <div className="mt-2">
                    <ResultsPanel data={data} />
                </div>
            )}
        </main>
    );
}
