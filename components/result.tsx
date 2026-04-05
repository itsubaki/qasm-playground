import { type States } from "@/lib/http"
import { cn } from "@/lib/utils"

function getAmplitudeParts(real?: number, imag?: number) {
    const safeReal = real ?? 0
    const safeImag = imag ?? 0

    return {
        realSign: safeReal < 0 ? "-" : "",
        real: Math.abs(safeReal).toFixed(6),
        imagSign: safeImag < 0 ? "-" : "+",
        imag: `${Math.abs(safeImag).toFixed(6)}i`,
    }
}

function formatBasis(binaryString: string[]) {
    return binaryString.map((bits) => `|${bits}⟩`).join("")
}

function AmplitudeValue({
    real,
    imag,
}: {
    real?: number,
    imag?: number,
}) {
    const amplitude = getAmplitudeParts(real, imag)

    return (
        <span className="inline-flex items-baseline font-mono tabular-nums whitespace-nowrap">
            <span className="w-3 text-right">{amplitude.realSign}</span>
            <span>{amplitude.real}</span>
            <span className="w-6 text-center">{amplitude.imagSign}</span>
            <span>{amplitude.imag}</span>
        </span>
    )
}

export function Result({
    result,
    sortMode,
    viewMode = "cards",
}: {
    result: States,
    sortMode: "index" | "prob_desc",
    viewMode?: "cards" | "table",
}) {
    const sorted = [...result.states].sort((a, b) => {
        if (sortMode === "prob_desc") return b.probability - a.probability
        return 0 // index order (default)
    })

    if (viewMode === "table") {
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
                                    <div className={`rounded-full h-2 w-full bg-gray-200 dark:bg-gray-700`}>
                                        <div
                                            className={`rounded-full h-2 min-w-[6px] bg-blue-500 dark:bg-blue-400`}
                                            style={{
                                                width: `${state.probability * 100}%`,
                                            }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

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
                                {state.probability.toFixed(6)}
                            </span>
                        </div>
                        <div className={`rounded-full h-2 w-full bg-gray-200 dark:bg-gray-700`}>
                            <div
                                className={`rounded-full h-2 min-w-[6px] bg-blue-500 dark:bg-blue-400`}
                                style={{
                                    width: `${state.probability * 100}%`,
                                }}
                            />
                        </div>
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
