import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AnalyzeResponse } from "../types";

interface ScanContextType {
    data: AnalyzeResponse | null;
    setData: (data: AnalyzeResponse | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AnalyzeResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <ScanContext.Provider value={{ data, setData, isLoading, setIsLoading, error, setError }}>
            {children}
        </ScanContext.Provider>
    );
}

export function useScan() {
    const context = useContext(ScanContext);
    if (context === undefined) {
        throw new Error("useScan must be used within a ScanProvider");
    }
    return context;
}
