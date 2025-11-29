import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { type States } from "@/lib/http"
import { Result } from "./result"

describe("Result", () => {
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
            }
        ]
    }

    it("renders the correct number of state blocks", () => {
        render(<Result result={mock} />)

        const blocks = screen.getAllByText(/Probability/i)
        expect(blocks.length).toBe(2)
    })

    it("renders ket notation correctly", () => {
        render(<Result result={mock} />)

        expect(screen.getByText("|010⟩")).toBeInTheDocument()
        expect(screen.getByText("|111⟩")).toBeInTheDocument()
    })

    it("shows probability with 6 decimal places", () => {
        render(<Result result={mock} />)

        expect(screen.getByText("0.250000")).toBeInTheDocument()
        expect(screen.getByText("0.750000")).toBeInTheDocument()
    })

    it("shows amplitude formatted correctly", () => {
        render(<Result result={mock} />)

        expect(screen.getByText("0.500000 + -0.500000i")).toBeInTheDocument()
        expect(screen.getByText("0.866000 + 0.000000i")).toBeInTheDocument()
    })

    it("applies dark mode classes", () => {
        const { container } = render(<Result result={mock} />)

        const rootDivs = container.querySelectorAll("div")
        const hasDarkModeBackground = Array.from(rootDivs).some(div =>
            div.className.includes("bg-gray-900/50")
        )
        expect(hasDarkModeBackground).toBe(true)
    })
})
