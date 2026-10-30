import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StateExplorer } from "./stateExplorer"

const result = { states: Array.from({ length: 4096 }, (_, i) => ({
    binaryString: [i.toString(2).padStart(12, "0")], probability: i === 4095 ? 0.5 : 0.5 / 4095, amplitude: { real: Math.sqrt(i === 4095 ? 0.5 : 0.5 / 4095) },
})) }

describe("StateExplorer", () => {
    it("limits the rendered rows and supports paging through 4096 states", () => {
        render(<StateExplorer result={result} sortMode="index" setSortMode={() => {}} />)
        expect(screen.getAllByRole("row")).toHaveLength(51)
        expect(screen.getByRole("status")).toHaveTextContent("Page 1 of 82")
        fireEvent.click(screen.getByRole("button", { name: "Next" }))
        expect(screen.getByRole("status")).toHaveTextContent("Page 2 of 82")
        expect(screen.getAllByRole("row")[1]).toHaveTextContent("|000000110010⟩")
    })
    it("searches all states, resets pagination, and handles empty matches", () => {
        render(<StateExplorer result={result} sortMode="index" setSortMode={() => {}} />)
        fireEvent.click(screen.getByRole("button", { name: "Next" }))
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "111111111111" } })
        expect(screen.getByRole("status")).toHaveTextContent("1 of 4096 states · Page 1 of 1")
        expect(screen.getByText("|111111111111⟩")).toBeInTheDocument()
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "222" } })
        expect(screen.getByText(/No matching states/)).toBeInTheDocument()
    })
    it("sorts all states before paging", () => {
        render(<StateExplorer result={result} sortMode="prob_desc" setSortMode={() => {}} />)
        expect(screen.getAllByRole("row")[1]).toHaveTextContent("|111111111111⟩")
        expect(screen.getAllByRole("row")).toHaveLength(51)
        expect(screen.getByRole("status")).toHaveTextContent("4096 of 4096 states")
    })
})
