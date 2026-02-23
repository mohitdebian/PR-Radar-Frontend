import { useState } from "react";
import { createBillingSession } from "../api";
import { useAuth } from "../context/AuthContext";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultErrorMessage?: string;
}

export default function PricingModal({ isOpen, onClose, defaultErrorMessage }: PricingModalProps) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<"monthly" | "yearly" | null>(null);

    if (!isOpen) return null;

    const handleSubscribe = async (plan: "monthly" | "yearly") => {
        if (!user) return;
        setIsLoading(plan);
        try {
            const { url } = await createBillingSession(plan);
            window.location.href = url; // Redirect to Dodo checkout
        } catch (error) {
            console.error("Failed to create billing session:", error);
            setIsLoading(null);
            alert("Failed to initiate checkout. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 pt-10 backdrop-blur-sm sm:p-6" onClick={onClose}>
            <div
                className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-surface-600/30 bg-surface-900 shadow-2xl card-enter"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface-800 text-slate-400 transition-colors hover:bg-surface-700 hover:text-white"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid lg:grid-cols-5">
                    {/* Left Side: Copy */}
                    <div className="flex flex-col justify-center bg-surface-800/50 p-8 lg:col-span-2 lg:p-12">
                        {defaultErrorMessage ? (
                            <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
                                <p className="text-sm font-semibold text-rose-400">{defaultErrorMessage}</p>
                            </div>
                        ) : null}

                        <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
                            Unlock your open-source potential
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            Stop wasting hours reading through issues. Get the exact blueprint, code, and confidence to make your next PR.
                        </p>

                        <div className="space-y-4">
                            <FeatureItem text="Unlimited AI issue execution plans" />
                            <FeatureItem text="Unlimited GitHub repo scans" />
                            <FeatureItem text="Advanced maintainer insights" />
                            <FeatureItem text="Copy-paste IDE Prompts" />
                        </div>
                    </div>

                    {/* Right Side: Plans */}
                    <div className="grid gap-6 p-8 lg:col-span-3 lg:grid-cols-2 lg:p-12">

                        {/* Free Plan */}
                        <div className="flex flex-col rounded-3xl border border-surface-600/30 bg-surface-800/30 p-8 pt-10 opacity-75 grayscale transition-all hover:grayscale-0">
                            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                            <div className="mb-6 flex items-baseline text-4xl font-extrabold text-white">
                                ₹0
                                <span className="ml-1 text-sm font-medium text-slate-500">/forever</span>
                            </div>
                            <ul className="mb-8 flex-1 space-y-4 text-sm text-slate-300">
                                <li className="flex items-start gap-3">
                                    <CheckIcon />
                                    Unlimited public repo scans
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckIcon />
                                    Base issue scoring & health
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckIcon />
                                    3 AI Execution Packs per day
                                </li>
                            </ul>
                            <button
                                disabled
                                className="w-full rounded-xl bg-surface-700 py-3.5 text-sm font-bold text-slate-400"
                            >
                                Current Plan
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="relative flex flex-col rounded-3xl border-2 border-accent bg-surface-800 p-8 pt-10 shadow-2xl shadow-accent/10">
                            <div className="absolute -top-4 inset-x-0 mx-auto w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                                Recommended
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                            <div className="mb-6 flex items-baseline text-4xl font-extrabold text-white">
                                ₹999
                                <span className="ml-1 text-sm font-medium text-slate-400">/mo</span>
                            </div>
                            <ul className="mb-8 flex-1 space-y-4 text-sm text-slate-300">
                                <li className="flex items-start gap-3 text-white font-medium">
                                    <CheckIcon color="mt-1 h-5 w-5 shrink-0 text-accent-bright" />
                                    Unlimited AI Execution Packs
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckIcon />
                                    Deep repository health scoring
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckIcon />
                                    Detailed failing test templates
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckIcon />
                                    Custom IDE code search prompts
                                </li>
                            </ul>

                            {/* Monthly checkout */}
                            <button
                                onClick={() => handleSubscribe("monthly")}
                                disabled={!!isLoading}
                                className="w-full mb-3 rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-accent-bright hover:shadow-accent/25 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading === "monthly" ? "Redirecting to checkout..." : "Upgrade to Pro"}
                            </button>

                            {/* Yearly checkout (Discounted) */}
                            <button
                                onClick={() => handleSubscribe("yearly")}
                                disabled={!!isLoading}
                                className="w-full rounded-xl bg-surface-700 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-surface-600 disabled:opacity-50"
                            >
                                {isLoading === "yearly" ? "Loading..." : "Or pay ₹9,999/yr (Save 15%)"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 text-sm font-medium text-slate-300 py-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent-bright">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </span>
            {text}
        </div>
    )
}

function CheckIcon({ color = "mt-0.5 h-4 w-4 shrink-0 text-slate-400" }: { color?: string }) {
    return (
        <svg className={color} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}
