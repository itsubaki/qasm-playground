import { type States } from "@/lib/http"

export function Result({
    result,
    isDarkMode,
}: {
    result: States,
    isDarkMode: boolean,
}) {
    return (result.states.map((state, index) => {
        const transition = "transition-colors duration-500"

        return (
            <div key={index} className={`p-4 border rounded-lg ${transition} ${isDarkMode ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex items-center justify-between mb-3">
                    {/* Ket */}
                    <div className={`font-mono ${transition} ${isDarkMode ? "text-white" : "text-gray-900"}`}>
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
                            <span className={`${transition} ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Probability
                            </span>
                            <span className={`${transition} ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {state.probability?.toFixed(6) || "0.000000"}
                            </span>
                        </div>
                        <div className={`rounded-full h-2 w-full ${transition} ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                            <div
                                className={`rounded-full h-2 min-w-[6px] ${transition} ${isDarkMode ? "bg-blue-400" : "bg-blue-500"}`}
                                style={{
                                    width: `${(state.probability || 0) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Amplitude */}
                    <div className="space-y-2">
                        <span className={`text-sm ${transition} ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Amplitude
                        </span>
                        <div className={`text-sm font-mono ${transition} ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {state.amplitude?.real?.toFixed(6) || "0.000000"} +{" "}
                            {state.amplitude?.imag?.toFixed(6) || "0.000000"}i
                        </div>
                    </div>
                </div>
            </div>
        )
    }))
}
