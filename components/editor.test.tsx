import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Editor } from "./editor"

describe("Editor", () => {
    it("renders correct line numbers", () => {
        render(
            <Editor
                code={"line1\nline2\nline3"}
                setCode={() => { }}
            />
        )

        expect(screen.getByText("1")).toBeInTheDocument()
        expect(screen.getByText("2")).toBeInTheDocument()
        expect(screen.getByText("3")).toBeInTheDocument()
    })

    it("calls setCode when text is entered", () => {
        const setCode = vi.fn()

        render(
            <Editor
                code=""
                setCode={setCode}
            />
        )

        const textarea = screen.getByPlaceholderText("Enter your OpenQASM code here...")
        fireEvent.change(textarea, { target: { value: "hello" } })
        expect(setCode).toHaveBeenCalledWith("hello")
    })

    it("syncs scroll position between textarea and line numbers", () => {
        render(
            <Editor
                code={"a\nb\nc\nd\ne\nf\ng"}
                setCode={() => { }}
            />
        )

        const textarea = screen.getByRole("textbox")
        const lineNumbers = textarea.parentElement!.querySelector("div")
        fireEvent.scroll(textarea, { target: { scrollTop: 120 } })
        expect(lineNumbers!.scrollTop).toBe(120)
    })

    it("includes dark mode styles", () => {
        render(
            <Editor
                code=""
                setCode={() => { }}
            />
        )

        const container = screen.getByRole("textbox").parentElement!
        expect(container.className).toContain("dark:border-gray-600")
    })
})
