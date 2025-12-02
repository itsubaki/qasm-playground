import { type States } from "@/lib/http"
import { cn } from "@/lib/utils"

export function Result({
    result,
    sort,
}: {
    result: States,
    sort: "index" | "prob_desc",
}) {
    const sorted = [...result.states].sort((a, b) => {
        if (sort === "prob_desc") return (b.probability || 0) - (a.probability || 0)
        return 0 // index order (default)
    })

    return (sorted.map((state, index) => {
        return (
            <div key={state.binaryString.join("")} className={cn(
                "p-4 border rounded-lg",
                "bg-gray-50 border-gray-200",
                "dark:bg-gray-900/50 dark:border-gray-700",
            )}>
                <div className="mb-3 flex items-center justify-between">
                    {/* Ket notation (quantum state) */}
                    <div className={`font-mono text-gray-900 dark:text-white`}>
                        {state.binaryString.map((str, i) => (
                            <span key={i}>
                                |{str}⟩
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {/* Probability Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className={`text-gray-600 dark:text-gray-400`}>
                                Probability
                            </span>
                            <span className={`text-gray-900 dark:text-white`}>
                                {state.probability?.toFixed(6) || "0.000000"}
                            </span>
                        </div>
                        <div className={`rounded-full h-2 w-full bg-gray-200 dark:bg-gray-700`}>
                            <div
                                className={`rounded-full h-2 min-w-[6px] bg-blue-500 dark:bg-blue-400`}
                                style={{
                                    width: `${(state.probability || 0) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Amplitude */}
                    <div className="space-y-2">
                        <span className={`text-sm text-gray-600 dark:text-gray-400`}>
                            Amplitude
                        </span>
                        <div className={`text-sm font-mono text-gray-900 dark:text-white`}>
                            {state.amplitude?.real?.toFixed(6) || "0.000000"} +{" "}
                            {state.amplitude?.imag?.toFixed(6) || "0.000000"}i
                        </div>
                    </div>
                </div>
            </div>
        )
    }))
}
