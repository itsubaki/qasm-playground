import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Examples } from "./examples"
import { examples } from "@/lib/examples"

describe("Examples component", () => {
    it("renders the select dropdown with the default value", () => {
        const setCode = vi.fn()
        render(<Examples setCode={setCode} />)

        const selectTrigger = screen.getByRole("combobox")
        expect(selectTrigger).toBeInTheDocument()
        expect(selectTrigger).toHaveTextContent(examples[0].name)
    })

    it("reports menu state and loads the selected example", async () => {
        const setCode = vi.fn()
        const onContentMountChange = vi.fn()

        render(<Examples setCode={setCode} onContentMountChange={onContentMountChange} />)

        const selected = examples[1].name
        const selectTrigger = screen.getByRole("combobox")
        fireEvent.click(selectTrigger)
        expect(onContentMountChange).toHaveBeenLastCalledWith(true)

        const item = screen.getByText(selected)
        fireEvent.click(item)

        expect(setCode).toHaveBeenCalledWith(examples[1].code)
        await waitFor(() => expect(onContentMountChange).toHaveBeenLastCalledWith(false))
    })

    it("includes dark mode classes", () => {
        const setCode = vi.fn()
        render(<Examples setCode={setCode} />)

        const selectTrigger = screen.getByRole("combobox")
        expect(selectTrigger.classList.contains("dark:bg-gray-900")).toBe(true)
        expect(selectTrigger.classList.contains("dark:border-gray-600")).toBe(true)
        expect(selectTrigger.classList.contains("dark:text-white")).toBe(true)
    })
})
