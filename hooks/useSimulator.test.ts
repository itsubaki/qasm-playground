import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useSimulator } from "./useSimulator"
import type { States } from "@/lib/http"

vi.mock("@/lib/http", () => ({
    httpPost: vi.fn(),
}))

describe("useSimulator", () => {
    let setError: (msg: string | null) => void
    let setResult: (states: States | null) => void

    beforeEach(() => {
        setError = vi.fn()
        setResult = vi.fn()
        vi.clearAllMocks()
    })

    it("should not call anything if code is empty", async () => {
        const { result } = renderHook(() =>
            useSimulator({ setError, setResult })
        )

        await act(async () => {
            await result.current.simulate("   ")
        })

        expect(setError).not.toHaveBeenCalled()
        expect(setResult).not.toHaveBeenCalled()
    })
})
