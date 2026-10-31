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

    it("generates and copies a snapshot link without changing the editor URL", async () => {
        vi.mocked(httpPost).mockResolvedValue({ id: "test123" })
        vi.mocked(copyToClipboard).mockResolvedValue(undefined)
        Object.defineProperty(window, "location", {
            value: { origin: "https://test.origin" },
            configurable: true,
        })
        const { result } = renderHook(() => useShareURL())

        let url
        await act(async () => {
            url = await result.current.share("console.log('hello');")
        })

        expect(httpPost).toHaveBeenCalledWith("/api/share", { code: "console.log('hello');" })
        expect(window.history.pushState).not.toHaveBeenCalled()
        expect(result.current.sharedCode).toBe("console.log('hello');")
        expect(copyToClipboard).toHaveBeenCalledWith("https://test.origin/p/test123")
        expect(result.current.sharedURL).toBe("https://test.origin/p/test123")
        expect(url).toBe("https://test.origin/p/test123")
    })

    it("should handle invalid response (no id)", async () => {
        vi.mocked(httpPost).mockResolvedValue({ id: "" })
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { })
        const { result } = renderHook(() => useShareURL())

        await act(async () => {
            await result.current.share("code")
        })

        expect(httpPost).toHaveBeenCalled()
        expect(copyToClipboard).not.toHaveBeenCalled()
        expect(result.current.sharedURL).toBeNull()
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
    })

    it("exposes an error without an unhandled rejection when sharing fails", async () => {
        vi.mocked(httpPost).mockRejectedValue(new Error("network fail"))
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { })
        const { result } = renderHook(() => useShareURL())

        await act(async () => {
            await result.current.share("code")
        })

        expect(httpPost).toHaveBeenCalled()
        expect(copyToClipboard).not.toHaveBeenCalled()
        expect(result.current.sharedURL).toBeNull()
        expect(result.current.shareError).toBe("network fail")
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
    })
})
