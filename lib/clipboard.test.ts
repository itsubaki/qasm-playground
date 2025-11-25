import { describe, it, expect, vi, beforeEach } from "vitest"
import { copyToClipboard } from "./clipboard"
import { toast } from "react-hot-toast"

vi.mock("react-hot-toast", () => ({
    toast: {
        success: vi.fn()
    }
}))

describe("copyToClipboard", () => {
    beforeEach(() => {
        vi.clearAllMocks()

        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(undefined)
            }
        })
    })

    it("should copy text to clipboard and show success toast", async () => {
        const text = "hello"

        await copyToClipboard(text)
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text)
        expect(toast.success).toHaveBeenCalledWith("Copied")
    })

    it("should handle errors gracefully", async () => {
        const error = new Error("fail")
        navigator.clipboard.writeText = vi.fn().mockRejectedValue(error)
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { })

        await copyToClipboard("text")
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
    })
})
