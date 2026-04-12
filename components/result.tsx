import { type States } from "@/lib/http"
import { cn } from "@/lib/utils"
import { AmplitudeValue, formatBasis, ProbabilityBar } from "@/components/resultParts"

export function Result({
    result,
    sortMode,
}: {
    result: States,
    sortMode: "index" | "prob_desc",
}) {
    const sorted = [...result.states].sort((a, b) => {
        if (sortMode === "prob_desc") return b.probability - a.probability
        return 0 // index order (default)
    })

    return (sorted.map((state) => {
        return (
            <div key={state.binaryString.join("")} className={cn(
                "p-4 border rounded-lg",
                "bg-gray-50 border-gray-200",
                "dark:bg-gray-900/50 dark:border-gray-700",
            )}>
                <div className="mb-3 flex items-center justify-between">
                    {/* Ket notation (quantum state) */}
                    <div className={`font-mono text-gray-900 dark:text-white`}>
                        {formatBasis(state.binaryString)}
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
                                {(state.probability ?? 0).toFixed(6)}
                            </span>
                        </div>
                        <ProbabilityBar probability={state.probability} />
                    </div>

                    {/* Amplitude */}
                    <div className="space-y-2">
                        <span className={`text-sm text-gray-600 dark:text-gray-400`}>
                            Amplitude
                        </span>
                        <div className={`text-sm text-gray-900 dark:text-white`}>
                            <AmplitudeValue
                                real={state.amplitude.real}
                                imag={state.amplitude.imag}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }))
}
