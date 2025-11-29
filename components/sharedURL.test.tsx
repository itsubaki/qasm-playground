import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SharedURL } from "./sharedURL"

describe("SharedURL", () => {
    it("renders the input with correct value", () => {
        render(<SharedURL sharedURL="https://example.com" />)
        const input = screen.getByLabelText("Shared URL") as HTMLInputElement
        expect(input.value).toBe("https://example.com")
        expect(input).toHaveAttribute("readonly")
    })

    it("focuses and selects input when sharedURL changes", async () => {
        const { rerender } = render(<SharedURL sharedURL="" />)
        const input = screen.getByLabelText("Shared URL") as HTMLInputElement
        expect(document.activeElement).not.toBe(input)

        rerender(<SharedURL sharedURL="https://example.com" />)
        expect(document.activeElement).toBe(input)
        expect(input.selectionStart).toBe(0)
        expect(input.selectionEnd).toBe("https://example.com".length)
    })

    it("selects input text when clicked", async () => {
        render(<SharedURL sharedURL="https://example.com" />)
        const input = screen.getByLabelText("Shared URL") as HTMLInputElement

        await userEvent.click(input)
        expect(input.selectionStart).toBe(0)
        expect(input.selectionEnd).toBe("https://example.com".length)
    })

    it("applies correct class for dark mode", () => {
        render(<SharedURL sharedURL="https://example.com" />)
        const input = screen.getByLabelText("Shared URL") as HTMLInputElement
        expect(input.className).toContain("dark:bg-gray-900")
        expect(input.className).toContain("dark:text-gray-300")
    })
})
