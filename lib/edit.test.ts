import { describe, it, expect, vi, beforeEach } from "vitest"
import { edit } from "@/lib/edit"
import { httpPost } from "@/lib/http"
import { examples } from "@/lib/examples"
import type { Snippet } from "@/lib/http"

vi.mock("@/lib/http", () => ({
    httpPost: vi.fn(),
}))

describe("edit function", () => {
    const setCode = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("sets code to the first example if snippetId is undefined", async () => {
        await edit(undefined, setCode)
        expect(setCode).toHaveBeenCalledWith(examples[0].code)
    })

    it("sets code to the snippet code when httpPost succeeds", async () => {
        const mock = {
            id: "123",
            code: "console.log('hello')",
            createdAt: "",
        }

        vi.mocked(httpPost).mockResolvedValue(mock)
        await edit("123", setCode)

        expect(httpPost).toHaveBeenCalledWith("/api/edit", { id: "123" })
        expect(setCode).toHaveBeenCalledWith(mock.code)
    })

    it("logs error if snippet.code is empty", async () => {
        const mock = {
            id: "123",
            code: "",
            createdAt: "",
        }

        vi.mocked(httpPost).mockResolvedValue(mock)
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { })
        await edit("123", setCode)

        expect(consoleSpy).toHaveBeenCalledWith("Edit code:", mock)
        expect(setCode).not.toHaveBeenCalled()
        consoleSpy.mockRestore()
    })

    it("logs error if httpPost throws", async () => {
        const error = new Error("fail")
        vi.mocked(httpPost).mockRejectedValue(error)

        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { })
        await edit("123", setCode)

        expect(consoleSpy).toHaveBeenCalledWith("Edit code:", error)
        expect(setCode).not.toHaveBeenCalled()
        consoleSpy.mockRestore()
    })
})
