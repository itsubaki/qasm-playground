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
        render(<Result result={mock} sortMode="index" />)

        const blocks = screen.getAllByText(/Probability/i)
        expect(blocks.length).toBe(2)
    })

    it("renders ket notation correctly", () => {
        render(<Result result={mock} sortMode="index" />)

        expect(screen.getByText("|010⟩")).toBeInTheDocument()
        expect(screen.getByText("|111⟩")).toBeInTheDocument()
    })

    it("shows probability with 6 decimal places", () => {
        render(<Result result={mock} sortMode="index" />)

        expect(screen.getByText("0.250000")).toBeInTheDocument()
        expect(screen.getByText("0.750000")).toBeInTheDocument()
    })

    it("shows amplitude formatted correctly", () => {
        render(<Result result={mock} sortMode="index" />)

        expect(screen.getByText("0.500000 + -0.500000i")).toBeInTheDocument()
        expect(screen.getByText("0.866000 + 0.000000i")).toBeInTheDocument()
    })

    it("renders dark mode class strings", () => {
        const { container } = render(<Result result={mock} sortMode="index" />)

        const rootDivs = container.querySelectorAll("div")
        const hasDarkModeBackground = Array.from(rootDivs).some(div =>
            div.className.includes("dark:bg-gray-900/50")
        )
        expect(hasDarkModeBackground).toBe(true)
    })

    it("sorts states by probability in descending order when sort is 'prob_desc'", () => {
        render(<Result result={mock} sortMode="prob_desc" />)

        const ketNotations = screen.getAllByText(/\|\d{3}⟩/).map(el => el.textContent)
        expect(ketNotations).toEqual(["|111⟩", "|010⟩"])
    })

    it("renders amplitude with fallback '0.000000' for missing real/imag", () => {
        const fallbackMock: States = {
            states: [
                {
                    amplitude: { real: 1 },
                    probability: 1,
                    binaryString: ["000"],
                    int: [0],
                },
                {
                    amplitude: { imag: 1 },
                    probability: 1,
                    binaryString: ["001"],
                    int: [1],
                },
            ]
        }

        render(<Result result={fallbackMock} sortMode="index" />)
        expect(screen.getAllByText("1.000000 + 0.000000i").length).toBe(1)
        expect(screen.getAllByText("0.000000 + 1.000000i").length).toBe(1)
    })
})
