import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useDarkMode } from "./useDarkMode"

function mockMatchMedia(matches: boolean) {
    return vi.fn().mockImplementation((query) => ({
        matches,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }))
}

describe("useDarkMode", () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    it("should initialize with system dark mode preference", () => {
        window.matchMedia = mockMatchMedia(true)

        const { result } = renderHook(() => useDarkMode())
        expect(result.current.isMounted).toBe(false)
        expect(result.current.isDarkMode).toBe(false)

        act(() => {
            vi.runAllTimers()
        })

        expect(result.current.isMounted).toBe(true)
        expect(result.current.isDarkMode).toBe(true)
    })

    it("should allow toggling dark mode manually", () => {
        window.matchMedia = mockMatchMedia(false)

        const { result } = renderHook(() => useDarkMode())
        act(() => {
            vi.runAllTimers()
        })

        expect(result.current.isDarkMode).toBe(false)
        act(() => {
            result.current.setIsDarkMode(true)
        })

        expect(result.current.isDarkMode).toBe(true)
    })
})
