import { useState } from "react"
import { type States, httpPost } from "@/lib/http"

export const useSimulate = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<States | null>(null)

    const simulate = async (code: string) => {
        if (!code.trim()) return

        setIsLoading(true)
        setError(null)
        setResult(null)

        try {
            const states = await httpPost<States>("/api/simulate", { code })
            setResult(states)
        } catch (err) {
            console.error("Run code:", err)
            setError(err instanceof Error ? err.message : "An unknown error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        result,
        error,
        simulate,
    }
}
