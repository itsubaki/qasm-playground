import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useSort } from "./useSort"

describe("useSort", () => {
    it("should have initial state of 'index'", () => {
        const { result } = renderHook(() => useSort())

        expect(result.current.sortMode).toBe("index")
    })

    it("should cycle to 'prob_desc' when sort() is called", () => {
        const { result } = renderHook(() => useSort())

        act(() => {
            result.current.sort()
        })

        expect(result.current.sortMode).toBe("prob_desc")
    })

    it("should wrap around from 'prob_desc' to 'index'", () => {
        const { result } = renderHook(() => useSort())

        // First call: index -> prob_desc
        act(() => {
            result.current.sort()
        })
        expect(result.current.sortMode).toBe("prob_desc")

        // Second call: prob_desc -> index (wrap around)
        act(() => {
            result.current.sort()
        })
        expect(result.current.sortMode).toBe("index")
    })

    it("should cycle through all modes correctly with multiple calls", () => {
        const { result } = renderHook(() => useSort())

        // Initial state
        expect(result.current.sortMode).toBe("index")

        // Cycle through all modes twice to verify wrapping
        const expectedModes = ["prob_desc", "index", "prob_desc", "index"]
        for (const expectedMode of expectedModes) {
            act(() => {
                result.current.sort()
            })
            expect(result.current.sortMode).toBe(expectedMode)
        }
    })
})
