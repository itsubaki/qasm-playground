import { type States } from "@/lib/http"
import { cn } from "@/lib/utils"
import { AmplitudeValue, formatBasis, ProbabilityBar } from "@/components/resultParts"

export function ResultTable({
    result,
    sortMode,
}: {
    result: States,
    sortMode: "index" | "prob_desc",
}) {
    const sorted = [...result.states].sort((a, b) => {
        if (sortMode === "prob_desc") return b.probability - a.probability
        return 0
    })

    return (
        <div className={cn(
            "overflow-x-auto rounded-lg border",
            "border-gray-200 bg-gray-50",
            "dark:border-gray-700 dark:bg-gray-900/50",
        )}>
            <table className="min-w-full text-sm">
                <thead>
                    <tr className={cn(
                        "border-b text-left",
                        "border-gray-200 text-gray-600",
                        "dark:border-gray-700 dark:text-gray-400",
                    )}>
                        <th className="px-4 py-3 font-medium">Basis</th>
                        <th className="px-4 py-3 font-medium">Amplitude</th>
                        <th className="px-4 py-3 font-medium">Probability</th>
                        <th className="px-4 py-3 font-medium" aria-label="Probability bar" />
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((state) => (
                        <tr
                            key={state.binaryString.join("")}
                            className={cn(
                                "border-b last:border-b-0",
                                "border-gray-200 text-gray-900",
                                "dark:border-gray-700 dark:text-white",
                            )}>
                            <td className="px-4 py-3 font-mono whitespace-nowrap">
                                {formatBasis(state.binaryString)}
                            </td>
                            <td className="px-4 py-3 font-mono whitespace-nowrap">
                                <AmplitudeValue
                                    real={state.amplitude.real}
                                    imag={state.amplitude.imag}
                                />
                            </td>
                            <td className="px-4 py-3 font-mono whitespace-nowrap">
                                {state.probability.toFixed(6)}
                            </td>
                            <td className="px-4 py-3 min-w-40">
                                <ProbabilityBar probability={state.probability} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
