import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { type States } from "@/lib/http"
import { ResultTable } from "./resultTable"

describe("ResultTable", () => {
    const mock: States = {
        states: [
            {
                amplitude: { real: 0.5, imag: -0.5 },
                probability: 0.25,
                binaryString: ["010"],
                int: [2],
            },
            {
                amplitude: { real: 0.866, imag: 0 },
                probability: 0.75,
                binaryString: ["111"],
                int: [7],
            },
        ],
    }

    it("renders the table headers and probability bars", () => {
        const { container } = render(<ResultTable result={mock} sortMode="index" />)

        expect(screen.getByRole("table")).toBeInTheDocument()
        expect(screen.getByText("Basis")).toBeInTheDocument()
        expect(screen.getByText("Amplitude")).toBeInTheDocument()
        expect(screen.getByText("Probability")).toBeInTheDocument()
        expect(screen.getByLabelText("Probability bar")).toBeInTheDocument()

        const probabilityBars = container.querySelectorAll("div[style*='width: 25%'], div[style*='width: 75%']")
        expect(probabilityBars).toHaveLength(2)
    })

    it("keeps the basis column sticky during horizontal scroll", () => {
        const { container } = render(<ResultTable result={mock} sortMode="index" />)

        const basisHeader = screen.getByText("Basis")
        const basisCell = screen.getByText("|010⟩")

        expect(basisHeader).toHaveClass("sticky", "left-0")
        expect(basisCell).toHaveClass("sticky", "left-0")
        expect(container.firstChild).toHaveClass("overflow-x-auto")
    })

    it("sorts states by probability in descending order when requested", () => {
        render(<ResultTable result={mock} sortMode="prob_desc" />)

        const rows = screen.getAllByRole("row")
        expect(rows[1]).toHaveTextContent("|111⟩")
        expect(rows[2]).toHaveTextContent("|010⟩")
    })

    it("preserves register boundaries in basis labels", () => {
        const registerMock: States = {
            states: [
                {
                    amplitude: { real: 1, imag: 0 },
                    probability: 1,
                    binaryString: ["000", "0100", "0000", "1"],
                    int: [0, 4, 0, 1],
                },
            ],
        }

        render(<ResultTable result={registerMock} sortMode="index" />)
        expect(screen.getByText("|000⟩|0100⟩|0000⟩|1⟩")).toBeInTheDocument()
    })

    it("renders aligned amplitude values for negative real parts", () => {
        const negativeRealMock: States = {
            states: [
                {
                    amplitude: { real: -0.5, imag: 0.25 },
                    probability: 1,
                    binaryString: ["101"],
                    int: [5],
                },
            ],
        }

        const { container } = render(<ResultTable result={negativeRealMock} sortMode="index" />)
        expect(container).toHaveTextContent("-0.500000+0.250000i")
    })
})
