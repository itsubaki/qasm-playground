import { type States } from "@/lib/http"
import { AmplitudeValue, formatBasis, ProbabilityBar } from "@/components/resultParts"

export function Result({ result, sortMode }: {
    result: States,
    sortMode: "index" | "prob_desc",
}) {
    const sorted = [...result.states].sort((a, b) =>
        sortMode === "prob_desc" ? b.probability - a.probability : 0)

    return sorted.map((state) => <div key={state.binaryString.join("")}
        className="space-y-2 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
        <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-mono text-gray-900 dark:text-white">{formatBasis(state.binaryString)}</span>
            <span className="flex gap-2 text-xs tabular-nums text-gray-600 dark:text-gray-400">
                <span>Probability</span><span className="font-mono text-gray-900 dark:text-white">{state.probability.toFixed(6)}</span>
            </span>
        </div>
        <ProbabilityBar probability={state.probability} />
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 text-xs">
            <span className="text-gray-600 dark:text-gray-400">Amplitude</span>
            <AmplitudeValue real={state.amplitude.real} imag={state.amplitude.imag} />
        </div>
    </div>)
}
