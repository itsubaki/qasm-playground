import { type States } from "@/lib/http"
import { smooth } from "@/lib/utils"

export function Result({
    result,
}: {
    result: States,
}) {
    return (result.states.map((state, index) => {
        return (
            <div key={index} className={`p-4 border rounded-lg ${smooth} dark:bg-gray-900/50 dark:border-gray-700 bg-gray-50 border-gray-200`}>
                <div className="flex items-center justify-between mb-3">
                    {/* Ket */}
                    <div className={`font-mono ${smooth} dark:text-white text-gray-900`}>
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
                            <span className={`${smooth} dark:text-gray-400 text-gray-600`}>
                                Probability
                            </span>
                            <span className={`${smooth} dark:text-white text-gray-900`}>
                                {state.probability?.toFixed(6) || "0.000000"}
                            </span>
                        </div>
                        <div className={`rounded-full h-2 w-full ${smooth} dark:bg-gray-700 bg-gray-200`}>
                            <div
                                className={`rounded-full h-2 min-w-[6px] ${smooth} dark:bg-blue-400 bg-blue-500`}
                                style={{
                                    width: `${(state.probability || 0) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Amplitude */}
                    <div className="space-y-2">
                        <span className={`text-sm ${smooth} dark:text-gray-400 text-gray-600`}>
                            Amplitude
                        </span>
                        <div className={`text-sm font-mono ${smooth} dark:text-white text-gray-900`}>
                            {state.amplitude?.real?.toFixed(6) || "0.000000"} +{" "}
                            {state.amplitude?.imag?.toFixed(6) || "0.000000"}i
                        </div>
                    </div>
                </div>
            </div>
        )
    }))
}
