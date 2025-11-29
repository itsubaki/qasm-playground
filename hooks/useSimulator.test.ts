import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import { useSimulator } from "./useSimulator"
import { type States, httpPost } from "@/lib/http"

vi.mock("@/lib/http", () => ({
    httpPost: vi.fn(),
}))

describe("useSimulator", () => {
    let setError: (msg: string | null) => void
    let setResult: (states: States | null) => void
    let original: typeof console.error;


    beforeEach(() => {
        setError = vi.fn()
        setResult = vi.fn()
        vi.clearAllMocks()
        original = console.error;
    })

    afterEach(() => {
        console.error = original;
    });

    it("should not call anything if code is empty", async () => {
        const { result } = renderHook(() =>
            useSimulator({ setError, setResult })
        )

        await act(async () => {
            await result.current.simulate("   ")
        })

        expect(setError).not.toHaveBeenCalled()
        expect(setResult).not.toHaveBeenCalled()
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
            useSimulator({ setError, setResult })
        )

        await act(async () => {
            await result.current.simulate("print('hello')")
        })

        expect(setError).toHaveBeenCalledWith(null)
        expect(setResult).toHaveBeenCalledWith(null)
        expect(setResult).toHaveBeenCalledWith(states)
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
            useSimulator({ setError, setResult })
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
            useSimulator({ setError, setResult })
        )

        await act(async () => {
            await result.current.simulate("print('error')")
        })

        expect(setResult).toHaveBeenCalledWith(null)
        expect(setError).toHaveBeenCalledWith(null)
        expect(setError).toHaveBeenCalledWith("fail!")
        expect(result.current.isLoading).toBe(false)
    })

    it("should call setError with 'An unknown error occurred' when thrown value is not an Error", async () => {
        console.error = vi.fn();
        vi.mocked(httpPost).mockRejectedValue("unexpected error string")

        const { result } = renderHook(() =>
            useSimulator({ setError, setResult })
        )

        await act(async () => {
            await result.current.simulate("some code")
        })

        expect(setResult).toHaveBeenCalledWith(null)
        expect(setError).toHaveBeenCalledWith(null)
        expect(setError).toHaveBeenCalledWith("An unknown error occurred")
    })
})
