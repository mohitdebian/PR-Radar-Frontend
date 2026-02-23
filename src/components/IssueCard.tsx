import { Link } from "react-router-dom";
import type { ScoredIssue } from "../types";

interface Props {
    issue: ScoredIssue;
    repo: string;
    index: number;
}

const classificationConfig: Record<
    string,
    { label: string; color: string; bg: string; border: string; glow: string }
> = {
    HIGH_MERGE_PROBABILITY: {
        label: "High merge",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        glow: "shadow-emerald-500/5",
    },
    COMPETITIVE: {
        label: "Competitive",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        glow: "shadow-amber-500/5",
    },
    HIGH_RISK: {
        label: "High risk",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        glow: "shadow-rose-500/5",
    },
};

export default function IssueCard({ issue, repo, index }: Props) {
    const config = classificationConfig[issue.classification] || {
        label: issue.classification.replace(/_/g, " "),
        color: "text-slate-400",
        bg: "bg-surface-700/50",
        border: "border-surface-600/30",
        glow: "shadow-none",
    };
    const topReasons = issue.reasons.slice(0, 3);
    const [owner, name] = repo.split("/");

    return (
        <Link
            to={`/repo/${owner}/${name}/issue/${issue.number}`}
            className={`card-enter group relative block overflow-hidden rounded-2xl border
                 bg-surface-800/80 p-5 transition-[box-shadow,border-color] duration-200
                 will-change-transform hover:shadow-lg
                 ${config.border}`}
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Subtle glow on hover */}
            <div className={`absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${config.bg}`} />

            <div className="relative">
                {/* Top row */}
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {/* Score circle */}
                        <div className="relative h-10 w-10 shrink-0">
                            <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5"
                                    className="text-surface-600/40" />
                                <circle cx="18" cy="18" r="15" fill="none" strokeWidth="2.5"
                                    strokeDasharray={`${issue.score * 0.94} 100`}
                                    strokeLinecap="round"
                                    className={`${scoreCircleColor(issue.score)} transition-all duration-1000 ease-out`} />
                            </svg>
                            <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums ${config.color}`}>
                                {issue.score}
                            </span>
                        </div>

                        <span className="font-mono text-xs text-slate-500 transition-colors group-hover:text-slate-300">
                            #{issue.number}
                        </span>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${config.bg} ${config.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${scoreCircleFill(issue.score)}`} />
                        {config.label}
                    </span>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-[13px] font-semibold leading-snug text-slate-100 line-clamp-2 group-hover:text-white transition-colors">
                    {issue.title}
                </h3>

                {/* Reason chips */}
                {topReasons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {topReasons.map((reason, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center rounded-md bg-surface-700/60 px-2 py-0.5
                                           text-[10px] text-slate-400 ring-1 ring-surface-600/30"
                            >
                                {reason}
                            </span>
                        ))}
                        {issue.reasons.length > 3 && (
                            <span className="inline-flex items-center rounded-md bg-surface-700/40 px-2 py-0.5
                                             text-[10px] text-slate-500">
                                +{issue.reasons.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}

function scoreCircleColor(score: number): string {
    if (score >= 75) return "stroke-emerald-400";
    if (score >= 50) return "stroke-amber-400";
    return "stroke-rose-400";
}

function scoreCircleFill(score: number): string {
    if (score >= 75) return "bg-emerald-400";
    if (score >= 50) return "bg-amber-400";
    return "bg-rose-400";
}
