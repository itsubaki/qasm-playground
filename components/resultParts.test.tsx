import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { AmplitudeValue, formatBasis, ProbabilityBar } from "./resultParts"

describe("resultParts", () => {
    it("formats basis labels with register boundaries", () => {
        expect(formatBasis(["000", "0100", "0000", "1"]))
            .toBe("|000⟩|0100⟩|0000⟩|1⟩")
    })

    it("renders aligned amplitude values", () => {
        const { container } = render(<AmplitudeValue real={-0.5} imag={0.25} />)

        expect(container).toHaveTextContent("-0.500000+0.250000i")
    })

    it("falls back missing amplitude parts to zero", () => {
        const { container } = render(<AmplitudeValue imag={1} />)

        expect(container).toHaveTextContent("0.000000+1.000000i")
    })

    it("renders a probability bar with the expected width", () => {
        const { container } = render(<ProbabilityBar probability={0.25} />)

        expect(container.querySelector("div[style='width: 25%;']")).not.toBeNull()
    })

    it("keeps the minimum visible bar width for zero probability", () => {
        const { container } = render(<ProbabilityBar probability={0} />)

        const bar = container.querySelector("div[style='width: 0%;']")
        expect(bar).not.toBeNull()
        expect(bar).toHaveClass("min-w-[6px]")
    })
})