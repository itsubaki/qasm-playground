import { type States } from "@/lib/http"

export function Result({
    result,
    isDarkMode,
}: {
    result: States,
    isDarkMode: boolean,
}) {
    return (result.states.map((state, index) => {
        return (
            <div key={index} className={`p-4 pb-4 pt-4 border rounded-lg transition-colors duration-500 ${isDarkMode ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex items-center justify-between mb-3">
                    {/* Ket */}
                    <div className={`font-mono transition-colors duration-500 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {state.binaryString.map((str, i) => (
                            <span key={i} className="font-mono">
                                |{str}⟩
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {/* Probability Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className={`transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Probability
                            </span>
                            <span className={`transition-colors duration-500 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {state.probability?.toFixed(6) || "0.000000"}
                            </span>
                        </div>
                        <div className={`w-full rounded-full h-2 transition-colors duration-500 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                            <div
                                className={`min-w-[6px] h-2 rounded-full transition-all duration-300 transition-colors duration-500 ${isDarkMode ? "bg-blue-400" : "bg-blue-500"}`}
                                style={{
                                    width: `${(state.probability || 0) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Amplitude */}
                    <div className="space-y-2">
                        <span className={`text-sm transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Amplitude
                        </span>
                        <div className={`font-mono text-sm transition-colors duration-500 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {state.amplitude?.real?.toFixed(6) || "0.000000"} +{" "}
                            {state.amplitude?.imag?.toFixed(6) || "0.000000"}i
                        </div>
                    </div>
                </div>
            </div>
        )
    }))
}
