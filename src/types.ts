export type Classification = "HIGH_MERGE_PROBABILITY" | "COMPETITIVE" | "HIGH_RISK";

export interface MaintainerMetrics {
    avgMergeTimeDays: number;
    avgIssueResponseTimeDays: number;
    prAcceptanceRate: number;
    maintainerScore: number;
}

export interface RepoHealth {
    lastCommitDaysAgo: number;
    issueClosureRate: number;
    openIssues: number;
    openPRs: number;
    healthScore: number;
}

export interface ScoredIssue {
    number: number;
    title: string;
    competitionLevel: string;
    competitionScore: number;
    score: number;
    mergeProbability: number;
    classification: string;
    reasons: string[];
}

export interface AnalyzeResponse {
    repo: string;
    repoHealth: RepoHealth;
    maintainerMetrics: MaintainerMetrics;
    issues: ScoredIssue[];
}

export interface ExecutionPack {
    summary: string;
    approachSuggestion: string;
    timeEstimate: string;
    potentialChallenges: string[];
    idePrompts: {
        analysis: string;
        fix: string;
        test: string;
        codeSearch: string;
    };
    first30MinutePlan: string[];
    prDescriptionDraft: string;
    maintainerCommentDraft: string;
    failingTestTemplate: string;
}

export interface IssueData {
    title: string;
    description: string;
    labels: string[];
    difficulty: string;
    requiredSkills: string[];
}

export interface RepoData {
    repoName: string;
    primaryLanguage: string;
    defaultBranch?: string;
}

export interface MetricsData {
    maintainerScore: number;
    repoHealthScore: number;
    competitionLevel: string;
}

export interface User {
    authenticated: boolean;
    plan?: "free" | "pro";
    aiUsageToday?: number;
}
