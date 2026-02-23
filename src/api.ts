import type { AnalyzeResponse, ExecutionPack, IssueData, RepoData, MetricsData } from "./types";

export async function analyzeRepo(repoUrl: string): Promise<AnalyzeResponse> {
    const res = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
    }

    return res.json();
}

export async function analyzeExecution(
    issueData: IssueData,
    repoData: RepoData,
    metrics: MetricsData
): Promise<ExecutionPack> {
    const res = await fetch("/analyze-execution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueData, repoData, metrics }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
    }

    return res.json();
}
