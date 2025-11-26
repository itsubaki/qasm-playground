import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { examples } from "@/lib/examples"
import * as http from "@/lib/http"
import { useEdit } from "./useEdit"

describe("useEdit", () => {
    let setCode: (code: string) => void
    beforeEach(() => {
        setCode = vi.fn()
        vi.clearAllMocks()
    })

    it("sets code from examples if path doesn't match", async () => {
        vi.spyOn(window, "location", "get").mockReturnValue({
            ...window.location,
            pathname: "/other-path",
        } as any)

        await act(async () => {
            renderHook(() => useEdit({ snippetId: undefined, setCode }))
        })

        expect(setCode).toHaveBeenCalledWith(examples[0].code)
    })

    it("fetches snippet and sets code if path matches", async () => {
        vi.spyOn(window, "location", "get").mockReturnValue({
            ...window.location,
            pathname: "/p/abc123",
        } as any)

        const snippet = { code: "console.log('snippet')" }
        vi.spyOn(http, "httpPost").mockResolvedValue(snippet)

        await act(async () => {
            renderHook(() => useEdit({ snippetId: "abc123", setCode }))
        })

        expect(http.httpPost).toHaveBeenCalledWith("/api/edit", { id: "abc123" })
        expect(setCode).toHaveBeenCalledWith(snippet.code)
    })

    it("does not set code if snippet.code is empty and logs error", async () => {
        vi.spyOn(window, "location", "get").mockReturnValue({
            ...window.location,
            pathname: "/p/abc123",
        } as any)

        const snippet = { code: "" }
        vi.spyOn(http, "httpPost").mockResolvedValue(snippet)
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { })

        await act(async () => {
            renderHook(() => useEdit({ snippetId: "abc123", setCode }))
        })

        expect(setCode).not.toHaveBeenCalled()
        expect(consoleSpy).toHaveBeenCalled()
    })

    it("logs error if httpPost throws", async () => {
        vi.spyOn(window, "location", "get").mockReturnValue({
            ...window.location,
            pathname: "/p/abc123",
        } as any)

        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { })
        vi.spyOn(http, "httpPost").mockRejectedValue(new Error("Network error"))

        await act(async () => {
            renderHook(() => useEdit({ snippetId: "abc123", setCode }))
        })

        expect(setCode).not.toHaveBeenCalled()
        expect(consoleSpy).toHaveBeenCalled()
    })
})
