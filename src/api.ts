import type { AnalyzeResponse, ExecutionPack, IssueData, RepoData, MetricsData } from "./types";

export async function analyzeRepo(repoUrl: string): Promise<AnalyzeResponse> {
    const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const token = localStorage.getItem("github_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/analyze`, {
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
    const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const token = localStorage.getItem("github_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/analyze-execution`, {
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

export async function createBillingSession(plan: "monthly" | "yearly"): Promise<{ url: string }> {
    const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const token = localStorage.getItem("github_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/billing/create-session`, {
        method: "POST",
        headers,
        body: JSON.stringify({ plan }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
    }

    return res.json();
}
