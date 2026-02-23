import type { AnalyzeResponse, Classification } from "../types";
import IssueCard from "./IssueCard";
import { useState } from "react";

interface Props {
    data: AnalyzeResponse;
}

type FilterValue = Classification | "ALL";

const filters: { label: string; value: FilterValue; emoji: string }[] = [
    { label: "All", value: "ALL", emoji: "📊" },
    { label: "High Merge", value: "HIGH_MERGE_PROBABILITY", emoji: "🟢" },
    { label: "Competitive", value: "COMPETITIVE", emoji: "🟡" },
    { label: "High Risk", value: "HIGH_RISK", emoji: "🔴" },
];

export default function ResultsPanel({ data }: Props) {
    const [activeFilter, setActiveFilter] = useState<FilterValue>("ALL");

    const filtered =
        activeFilter === "ALL"
            ? data.issues
            : data.issues.filter((i) => i.classification === activeFilter);

    const counts: Record<FilterValue, number> = {
        ALL: data.issues.length,
        HIGH_MERGE_PROBABILITY: data.issues.filter((i) => i.classification === "HIGH_MERGE_PROBABILITY").length,
        COMPETITIVE: data.issues.filter((i) => i.classification === "COMPETITIVE").length,
        HIGH_RISK: data.issues.filter((i) => i.classification === "HIGH_RISK").length,
    };

    const avgScore = data.issues.length
        ? Math.round(data.issues.reduce((s, i) => s + i.score, 0) / data.issues.length)
        : 0;

    return (
        <div className="mx-auto w-full max-w-5xl card-enter">
            {/* Stats dashboard */}
            <div className="mb-8 rounded-2xl border border-surface-600/30 bg-surface-800/70 p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                            </svg>
                            <h2 className="text-lg font-bold text-white">{data.repo}</h2>
                        </div>
                        <p className="text-xs text-slate-500">
                            {data.issues.length} open issue{data.issues.length !== 1 && "s"} analyzed · avg score {avgScore}
                        </p>
                    </div>

                    {/* Distribution mini-bars */}
                    <div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:gap-4">
                        <StatBlock
                            count={counts.HIGH_MERGE_PROBABILITY}
                            label="High Merge"
                            color="bg-emerald-400"
                            textColor="text-emerald-400"
                            total={data.issues.length}
                        />
                        <div className="hidden sm:block h-8 w-px bg-surface-600/40" />
                        <StatBlock
                            count={counts.COMPETITIVE}
                            label="Competitive"
                            color="bg-amber-400"
                            textColor="text-amber-400"
                            total={data.issues.length}
                        />
                        <div className="hidden sm:block h-8 w-px bg-surface-600/40" />
                        <StatBlock
                            count={counts.HIGH_RISK}
                            label="High Risk"
                            color="bg-rose-400"
                            textColor="text-rose-400"
                            total={data.issues.length}
                        />
                    </div>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-surface-800/40 border border-surface-600/20 p-1 w-full sm:w-fit scrollbar-hide">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(f.value)}
                        className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200
              ${activeFilter === f.value
                                ? "bg-surface-600/80 text-white shadow-md"
                                : "text-slate-400 hover:text-slate-200 hover:bg-surface-700/30"
                            }`}
                    >
                        <span className="text-[11px]">{f.emoji}</span>
                        {f.label}
                        <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold
                            ${activeFilter === f.value
                                ? "bg-surface-700 text-slate-300"
                                : "text-slate-500"
                            }`}
                        >
                            {counts[f.value]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Issue grid */}
            {filtered.length === 0 ? (
                <div className="rounded-2xl border border-surface-600/20 bg-surface-800/30 p-12 text-center">
                    <p className="text-sm text-slate-500">No issues match this filter.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {filtered.map((issue, i) => (
                        <IssueCard
                            key={issue.number}
                            issue={issue}
                            repo={data.repo}
                            index={i}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function StatBlock({
    count,
    label,
    color,
    textColor,
    total,
}: {
    count: number;
    label: string;
    color: string;
    textColor: string;
    total: number;
}) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex flex-col items-center gap-1">
            <span className={`text-lg font-bold tabular-nums ${textColor}`}>{count}</span>
            <span className="text-[10px] text-slate-500 whitespace-nowrap">{label}</span>
            <div className="h-1 w-12 overflow-hidden rounded-full bg-surface-600/30">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
