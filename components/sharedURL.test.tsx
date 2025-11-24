import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SharedURL } from "./sharedURL"

describe("SharedURL", () => {
    it("renders the input with correct value", () => {
        render(<SharedURL isDarkMode={false} sharedURL="https://example.com" />)
        const input = screen.getByLabelText("Shared URL") as HTMLInputElement
        expect(input.value).toBe("https://example.com")
        expect(input).toHaveAttribute("readonly")
    })

    it("focuses and selects input when sharedURL changes", async () => {
        const { rerender } = render(<SharedURL isDarkMode={false} sharedURL="" />)
        const input = screen.getByLabelText("Shared URL") as HTMLInputElement
        expect(document.activeElement).not.toBe(input)

        rerender(<SharedURL isDarkMode={false} sharedURL="https://example.com" />)
        expect(document.activeElement).toBe(input)
        expect(input.selectionStart).toBe(0)
        expect(input.selectionEnd).toBe("https://example.com".length)
    })

    it("selects input text when clicked", async () => {
        render(<SharedURL isDarkMode={false} sharedURL="https://example.com" />)
        const input = screen.getByLabelText("Shared URL") as HTMLInputElement

        await userEvent.click(input)
        expect(input.selectionStart).toBe(0)
        expect(input.selectionEnd).toBe("https://example.com".length)
    })

    it("applies correct class for dark mode", () => {
        render(<SharedURL isDarkMode={true} sharedURL="https://example.com" />)
        const input = screen.getByLabelText("Shared URL") as HTMLInputElement
        expect(input.className).toContain("bg-gray-900")
        expect(input.className).toContain("text-gray-300")
    })
})
