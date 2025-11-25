import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useShareURL } from "./useShareURL"
import { httpPost } from "@/lib/http"
import { copyToClipboard } from "@/lib/clipboard"

vi.mock("@/lib/http", () => ({
    httpPost: vi.fn(),
}))

vi.mock("@/lib/clipboard", () => ({
    copyToClipboard: vi.fn(),
}))

describe("useShareURL", () => {
    const originalPushState = window.history.pushState

    beforeEach(() => {
        vi.clearAllMocks()
        // pushState をモック
        window.history.pushState = vi.fn()
    })

    afterEach(() => {
        window.history.pushState = originalPushState
    })

    it("should not call anything if code is empty", async () => {
        const { result } = renderHook(() => useShareURL())

        await act(async () => {
            await result.current.share("   ")
        })

        expect(httpPost).not.toHaveBeenCalled()
        expect(copyToClipboard).not.toHaveBeenCalled()
        expect(result.current.sharedURL).toBeNull()
    })
})
