import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { ExecutionPack } from "../types";
import { analyzeExecution } from "../api";
import { useScan } from "../context/ScanContext";
import Markdown from "react-markdown";
import PricingModal from "../components/PricingModal";

export default function IssueDetailPage() {
    const { owner, repo, number } = useParams();
    const navigate = useNavigate();
    const { data } = useScan();

    // Find issue in context if available
    const issueMatch = data?.issues.find(i => i.number === Number(number));

    const [analysis, setAnalysis] = useState<ExecutionPack | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!owner || !repo || !number) return;
        if (!issueMatch || !data) {
            setError("Issue details not found. Please go back and scan the repository again.");
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                const result = await analyzeExecution(
                    {
                        title: issueMatch!.title,
                        description: "(Description fetched earlier)",
                        labels: [], // In full implementation we would pass the actual labels here if data persisted them
                        difficulty: "Intermediate", // Derived placeholder
                        requiredSkills: [data!.repoHealth.openPRs > 10 ? "Git" : "Debugging"],
                    },
                    {
                        repoName: `${owner}/${repo}`,
                        primaryLanguage: "TypeScript",
                    },
                    {
                        maintainerScore: data!.maintainerMetrics.maintainerScore,
                        repoHealthScore: data!.repoHealth.healthScore,
                        competitionLevel: issueMatch!.competitionLevel,
                    }
                );
                if (!cancelled) setAnalysis(result);
            } catch (err) {
                if (!cancelled)
                    setError(err instanceof Error ? err.message : "Analysis failed");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [owner, repo, number, issueMatch]);

    if (!owner || !repo || !number) return null;

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-8">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-400 transition-all hover:text-white group"
            >
                <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to results
            </button>

            {issueMatch && (
                <div className="mb-8 card-enter">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-mono text-slate-400">#{number}</span>
                        <ClassBadge classification={issueMatch.classification} />
                    </div>
                    <h1 className="text-2xl font-bold text-white leading-tight sm:text-3xl">
                        {issueMatch.title}
                    </h1>
                </div>
            )}

            <div className="relative rounded-2xl border border-surface-600/30 bg-surface-800/50 backdrop-blur-sm p-6 sm:p-8">
                {isLoading && <LoadingState />}

                {error && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-6 py-5 text-sm text-rose-400">
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <p className="font-semibold text-base">Analysis failed</p>
                        </div>
                        <p className="opacity-80 leading-relaxed">{error}</p>
                        {!issueMatch && (
                            <Link to="/" className="mt-4 inline-block font-semibold text-accent-bright underline decoration-accent/30 underline-offset-4 hover:decoration-accent">
                                Return home to scan
                            </Link>
                        )}
                        {error.includes("limit reached") && (
                            <button onClick={() => window.dispatchEvent(new CustomEvent('open-pricing'))} className="mt-4 ml-4 inline-block font-bold text-white bg-accent px-4 py-1.5 rounded-lg hover:bg-accent-bright transition-colors">
                                View Plans
                            </button>
                        )}
                    </div>
                )}

                {analysis && <AnalysisContent analysis={analysis} repo={`${owner}/${repo}`} issueNumber={Number(number)} issueMatch={issueMatch} />}
            </div>

            <PricingModalWrapper />
        </div>
    );
}

function PricingModalWrapper() {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        const handler = () => setIsOpen(true);
        window.addEventListener('open-pricing', handler);
        return () => window.removeEventListener('open-pricing', handler);
    }, []);
    return <PricingModal isOpen={isOpen} onClose={() => setIsOpen(false)} defaultErrorMessage="You've reached your free daily limit for AI-powered issue analysis." />;
}

function LoadingState() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                <svg className="h-5 w-5 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>AI is scanning codebase for contribution signals…</span>
            </div>
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-4 rounded-lg" style={{ width: `${90 - i * 15}%` }} />
                ))}
            </div>
        </div>
    );
}

function AnalysisContent({
    analysis,
    repo,
    issueNumber,
    issueMatch,
}: {
    analysis: ExecutionPack;
    repo: string;
    issueNumber: number;
    issueMatch: any; // Using any here temporarily or we can import ScoredIssue
}) {
    const [activeTab, setActiveTab] = useState<keyof ExecutionPack["idePrompts"]>("analysis");

    return (
        <div className="space-y-8 card-enter">

            {/* Legacy Meta Widgets */}
            <Section title="Analysis Summary" icon="📋">
                <div className="prose-modal text-[15px] leading-relaxed text-slate-300">
                    <Markdown>{analysis.summary}</Markdown>
                </div>
            </Section>

            <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard label="Difficulty" value={issueMatch?.difficulty || "Intermediate"} icon="🎯" />
                <InfoCard label="Time Estimate" value={analysis.timeEstimate} icon="⏱️" />
            </div>

            {issueMatch?.requiredSkills && issueMatch.requiredSkills.length > 0 && (
                <Section title="Required Technical Skills" icon="🛠️">
                    <div className="flex flex-wrap gap-2">
                        {issueMatch.requiredSkills.map((skill: string) => (
                            <span
                                key={skill}
                                className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent-bright ring-1 ring-accent/20"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </Section>
            )}

            <Section title="Proposed Approach" icon="💡">
                <div className="prose-modal text-[15px] leading-relaxed text-slate-300">
                    <Markdown>{analysis.approachSuggestion}</Markdown>
                </div>
            </Section>

            <Section title="Potential Roadblocks" icon="⚠️">
                <ul className="space-y-3 text-[15px] text-slate-300">
                    {(analysis.potentialChallenges || []).map((challenge, i) => (
                        <li key={i} className="flex gap-3">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500/50" />
                            <div className="prose-modal leading-relaxed"><Markdown>{challenge}</Markdown></div>
                        </li>
                    ))}
                </ul>
            </Section>

            <hr className="border-t border-surface-600/30 my-8 w-full" />

            {/* 30 Minute Plan */}
            <Section title="First 30-Minute Execution Plan" icon="⏱️">
                <ol className="space-y-4 text-[15px] text-slate-300">
                    {(analysis.first30MinutePlan || []).map((step, i) => (
                        <li key={i} className="flex gap-4">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent">
                                {i + 1}
                            </span>
                            <div className="prose-modal pt-0.5 leading-relaxed"><Markdown>{step}</Markdown></div>
                        </li>
                    ))}
                </ol>
            </Section>

            {/* IDE Prompts */}
            <Section title="IDE Copilot Prompts" icon="🤖">
                <div className="rounded-xl border border-surface-600/30 bg-surface-800 overflow-hidden">
                    <div className="flex border-b border-surface-600/30 bg-surface-900/50">
                        {(Object.keys(analysis.idePrompts || {}) as Array<keyof ExecutionPack["idePrompts"]>).map((t) => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === t
                                    ? "bg-surface-700/50 text-accent border-b-2 border-accent"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-surface-700/20"
                                    }`}
                            >
                                {t.replace(/([A-Z])/g, " $1")}
                            </button>
                        ))}
                    </div>
                    <div className="p-4 bg-surface-900/30">
                        <code className="text-sm font-mono text-emerald-400/90 whitespace-pre-wrap block">
                            {analysis.idePrompts?.[activeTab] || "Prompt generation failed."}
                        </code>
                    </div>
                </div>
            </Section>

            {/* PR Description Draft */}
            <Section title="PR Description Draft" icon="📝">
                <div className="rounded-xl border border-surface-600/30 bg-surface-800/50 p-5 prose-modal text-[15px] text-slate-300 leading-relaxed overflow-x-auto">
                    <Markdown>{analysis.prDescriptionDraft}</Markdown>
                </div>
            </Section>

            {/* Maintainer Comment Draft */}
            <Section title="Maintainer Clarification Draft" icon="💬">
                <div className="rounded-xl border border-surface-600/30 bg-surface-800/50 p-5 prose-modal text-[15px] text-slate-300 leading-relaxed overflow-x-auto">
                    <Markdown>{analysis.maintainerCommentDraft}</Markdown>
                </div>
            </Section>

            {/* Failing Test Template */}
            <Section title="Failing Test Template" icon="🧪">
                <div className="rounded-xl border border-surface-600/30 bg-surface-800 overflow-hidden">
                    <div className="w-full bg-surface-900/50 px-4 py-2 border-b border-surface-600/30 text-xs font-mono text-slate-500 flex gap-2 items-center">
                        <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></span>
                        </div>
                        <span className="ml-2">test_template</span>
                    </div>
                    <pre className="p-4 text-[13px] font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
                        {analysis.failingTestTemplate}
                    </pre>
                </div>
            </Section>

            {/* GitHub Button */}
            <div className="pt-4">
                <a
                    href={`https://github.com/${repo}/issues/${issueNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-purple-600
                       px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-accent/20 active:scale-[0.98]"
                >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    Continue on GitHub
                </a>
            </div>
        </div>
    );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                <span className="text-lg">{icon}</span> {title}
            </h3>
            {children}
        </div>
    );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="rounded-xl border border-surface-600/30 bg-surface-700/20 px-5 py-4">
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-slate-500">{icon} {label}</p>
            <p className="text-lg font-bold text-white">{value}</p>
        </div>
    );
}

function ClassBadge({ classification }: { classification: string }) {
    const map: Record<string, string> = {
        HIGH_MERGE_PROBABILITY: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
        COMPETITIVE: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
        HIGH_RISK: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
    };
    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-tight ring-1 ${map[classification] ?? ""}`}>
            {classification.replace(/_/g, " ")}
        </span>
    );
}
