import type { AnalyzeResponse, ExecutionPack, IssueData, RepoData, MetricsData } from "./types";

export async function analyzeRepo(repoUrl: string): Promise<AnalyzeResponse> {
    const token = localStorage.getItem("github_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch("/analyze", {
        method: "POST",
        headers,
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
    const token = localStorage.getItem("github_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch("/analyze-execution", {
        method: "POST",
        headers,
        body: JSON.stringify({ issueData, repoData, metrics }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
    }

    return res.json();
}
