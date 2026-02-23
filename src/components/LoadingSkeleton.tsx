export default function LoadingSkeleton() {
    return (
        <div className="mx-auto w-full max-w-5xl space-y-4">
            {/* Header skeleton */}
            <div className="space-y-2">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-6 w-48 rounded" />
            </div>

            {/* Cards skeleton */}
            <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-surface-600/30 bg-surface-800/40 p-5 space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="skeleton h-4 w-12 rounded" />
                            <div className="skeleton h-5 w-28 rounded-full" />
                        </div>
                        <div className="skeleton h-4 w-full rounded" />
                        <div className="skeleton h-4 w-3/4 rounded" />
                        <div className="skeleton h-1.5 w-full rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
