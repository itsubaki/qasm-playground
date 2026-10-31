import { render, screen } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StateExplorer } from "./stateExplorer"

function makeResult(count: number) {
    return { states: Array.from({ length: count }, (_, i) => {
        const probability = i === count - 1 ? 0.5 : 0.5 / (count - 1)
        return {
            binaryString: [i.toString(2).padStart(12, "0")],
            probability,
            amplitude: { real: Math.sqrt(probability) },
        }
    }) }
}

// Still exceeds the former 50-row page size without repeating a full 12-qubit DOM.
const result = makeResult(64)

describe("StateExplorer", () => {
    it("shows all 4096 states without pagination", () => {
        // Verify the full real table output without constructing/scanning a large jsdom tree.
        const html = renderToStaticMarkup(<StateExplorer result={makeResult(4096)} sortMode="index" setSortMode={() => {}} />)
        expect(html.match(/<tr\b/g)).toHaveLength(4097)
        expect(html).toContain("|111111111111⟩")
    })
    it("handles an empty simulation result", () => {
        render(<StateExplorer result={makeResult(0)} sortMode="index" setSortMode={() => {}} />)
        expect(screen.getByText("The simulator returned no states.")).toBeInTheDocument()
    })
    it("sorts the complete table", () => {
        render(<StateExplorer result={result} sortMode="prob_desc" setSortMode={() => {}} />)
        const rows = (screen.getByRole("table") as HTMLTableElement).rows
        expect(rows[1]).toHaveTextContent("|000000111111⟩")
        expect(rows).toHaveLength(65)
        expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument()
    })
})
