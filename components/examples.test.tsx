import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Examples } from "./examples"
import { examples } from "@/lib/examples"

describe("Examples component", () => {
    it("renders the select dropdown with the default value", () => {
        const setCode = vi.fn()
        const setResult = vi.fn()
        const setError = vi.fn()

        render(
            <Examples
                setCode={setCode}
                setResult={setResult}
                setError={setError}
            />
        )

        const selectTrigger = screen.getByRole("combobox")
        expect(selectTrigger).toBeInTheDocument()
        expect(selectTrigger).toHaveTextContent(examples[0].name)
    })

    it("calls setCode, setResult, setError when a new example is selected", async () => {
        const setCode = vi.fn()
        const setResult = vi.fn()
        const setError = vi.fn()

        render(
            <Examples
                setCode={setCode}
                setResult={setResult}
                setError={setError}
            />
        )

        const selected = examples[1].name
        const selectTrigger = screen.getByRole("combobox")
        fireEvent.click(selectTrigger)

        const item = screen.getByText(selected)
        fireEvent.click(item)

        expect(setCode).toHaveBeenCalledWith(examples[1].code)
        expect(setResult).toHaveBeenCalledWith(null)
        expect(setError).toHaveBeenCalledWith(null)
    })

    it("includes dark mode classes", () => {
        const setCode = vi.fn()
        const setResult = vi.fn()
        const setError = vi.fn()

        render(
            <Examples
                setCode={setCode}
                setResult={setResult}
                setError={setError}
            />
        )

        const selectTrigger = screen.getByRole("combobox")
        expect(selectTrigger.classList.contains("dark:bg-gray-900")).toBe(true)
        expect(selectTrigger.classList.contains("dark:border-gray-600")).toBe(true)
        expect(selectTrigger.classList.contains("dark:text-white")).toBe(true)
    })
})
