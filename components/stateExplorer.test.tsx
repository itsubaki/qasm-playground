import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StateExplorer } from "./stateExplorer"

const result = { states: Array.from({ length: 4096 }, (_, i) => ({
    binaryString: [i.toString(2).padStart(12, "0")], probability: i === 4095 ? 0.5 : 0.5 / 4095, amplitude: { real: Math.sqrt(i === 4095 ? 0.5 : 0.5 / 4095) },
})) }

describe("StateExplorer", () => {
    it("shows all 4096 states without pagination", () => {
        render(<StateExplorer result={result} sortMode="index" setSortMode={() => {}} />)
        const rows = (screen.getByRole("table") as HTMLTableElement).rows
        expect(rows).toHaveLength(4097)
        expect(rows[4096]).toHaveTextContent("|111111111111⟩")
        expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument()
    })
    it("searches all states and handles empty matches", () => {
        render(<StateExplorer result={result} sortMode="index" setSortMode={() => {}} />)
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "111111111111" } })
        expect(screen.getByRole("status")).toHaveTextContent("1 of 4096 states")
        expect(screen.getByText("|111111111111⟩")).toBeInTheDocument()
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "222" } })
        expect(screen.getByText(/No matching states/)).toBeInTheDocument()
    })
    it("sorts the complete table", () => {
        render(<StateExplorer result={result} sortMode="prob_desc" setSortMode={() => {}} />)
        const rows = (screen.getByRole("table") as HTMLTableElement).rows
        expect(rows[1]).toHaveTextContent("|111111111111⟩")
        expect(rows).toHaveLength(4097)
        expect(screen.getByRole("status")).toHaveTextContent("4096 of 4096 states")
    })
})
