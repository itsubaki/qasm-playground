import { useState } from "react"
import { type States, httpPost } from "@/lib/http"

export const useSimulator = (options: {
    setError: (msg: string | null) => void
    setResult: (states: States | null) => void
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const { setError, setResult } = options

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
        simulate,
        isLoading,
    }
}
