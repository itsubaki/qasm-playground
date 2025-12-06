import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import { useSimulate } from "./useSimulate"
import { type States, httpPost } from "@/lib/http"

vi.mock("@/lib/http", () => ({
    httpPost: vi.fn(),
}))

describe("useSimulate", () => {
    let originalConsoleError: typeof console.error;

    beforeEach(() => {
        vi.clearAllMocks()
        originalConsoleError = console.error;
    })

    afterEach(() => {
        console.error = originalConsoleError;
    });

    it("should not call anything if code is empty", async () => {
        const { result } = renderHook(() =>
            useSimulate()
        )

        await act(async () => {
            await result.current.simulate("")
        })

        expect(result.current.result).toBeNull()
        expect(result.current.error).toBeNull()
        expect(result.current.isLoading).toBe(false)
    })

    it("should call setResult when simulation succeeds", async () => {
        const states: States = {
            states: [
                {
                    amplitude: { real: 1, imag: 0 },
                    probability: 1,
                    int: [0],
                    binaryString: ["0"],
                },
            ],
        }
        vi.mocked(httpPost).mockResolvedValue(states)

        const { result } = renderHook(() =>
            useSimulate()
        )

        await act(async () => {
            await result.current.simulate("OPENQASM 3.0;")
        })

        expect(result.current.result).toEqual(states)
        expect(result.current.error).toBeNull()
        expect(result.current.isLoading).toBe(false)
    })

    it("should set and reset loading status", async () => {
        const states: States = {
            states: [
                {
                    amplitude: { real: 1, imag: 0 },
                    probability: 1,
                    int: [0],
                    binaryString: ["0"],
                },
            ],
        }
        vi.mocked(httpPost).mockImplementation(
            () => new Promise((res) => setTimeout(() => res(states), 10))
        )

        const { result } = renderHook(() =>
            useSimulate()
        )

        expect(result.current.isLoading).toBe(false)

        act(() => {
            result.current.simulate("print('hello')")
        })

        await waitFor(() => {
            expect(result.current.isLoading).toBe(true)
        })

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })
    })

    it("should call setError when simulation fails", async () => {
        console.error = vi.fn();
        vi.mocked(httpPost).mockRejectedValue(new Error("fail!"))

        const { result } = renderHook(() =>
            useSimulate()
        )

        await act(async () => {
            await result.current.simulate("print('error')")
        })

        expect(result.current.result).toBeNull()
        expect(result.current.error).toBe("fail!")
        expect(result.current.isLoading).toBe(false)
    })

    it("should call setError with 'An unknown error occurred' when thrown value is not an Error", async () => {
        console.error = vi.fn();
        vi.mocked(httpPost).mockRejectedValue("unexpected error string")

        const { result } = renderHook(() =>
            useSimulate()
        )

        await act(async () => {
            await result.current.simulate("some code")
        })

        expect(result.current.result).toBeNull()
        expect(result.current.error).toBe("An unknown error occurred")
        expect(result.current.isLoading).toBe(false)
    })
})
