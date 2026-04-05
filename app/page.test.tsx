import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { States } from "@/lib/http"
import Playground from "./page"

const mockSimulate = vi.fn()
const mockShare = vi.fn()
const mockSort = vi.fn()
const mockCopyToClipboard = vi.fn()
const mockEdit = vi.fn()

let mountState = { isMounted: true }
let shareState: { sharedURL: string | null, share: typeof mockShare }
let sortState: { sortMode: "index" | "prob_desc", sort: typeof mockSort }
let simulateState: {
    isLoading: boolean
    result: States | null
    error: string | null
    simulate: typeof mockSimulate
}

vi.mock("@/components/header", () => ({
    Header: () => <div>Mock Header</div>,
}))

vi.mock("@/components/notes", () => ({
    Notes: () => <div>Mock Notes</div>,
}))

vi.mock("@/components/result", () => ({
    Result: ({ result, sortMode }: { result: { states: Array<unknown> }, sortMode: string }) => (
        <div data-testid="result-view">{sortMode}:{result.states.length}</div>
    ),
}))

vi.mock("@/components/resultTable", () => ({
    ResultTable: ({ result, sortMode }: { result: { states: Array<unknown> }, sortMode: string }) => (
        <div data-testid="result-table-view">{sortMode}:{result.states.length}</div>
    ),
}))

vi.mock("@/components/sharedURL", () => ({
    SharedURL: ({ sharedURL }: { sharedURL: string }) => <div data-testid="shared-url">{sharedURL}</div>,
}))

vi.mock("@/components/examples", () => ({
    Examples: ({ setCode }: { setCode: (code: string) => void }) => (
        <button onClick={() => setCode("example code")}>Load example</button>
    ),
}))

vi.mock("@/components/editor", () => ({
    Editor: ({ code, setCode }: { code: string, setCode: (code: string) => void }) => (
        <textarea
            aria-label="editor"
            value={code}
            onChange={(event) => setCode(event.target.value)}
        />
    ),
}))

vi.mock("@/hooks/useMount", () => ({
    useMount: () => mountState,
}))

vi.mock("@/hooks/useShareURL", () => ({
    useShareURL: () => shareState,
}))

vi.mock("@/hooks/useSort", () => ({
    useSort: () => sortState,
}))

vi.mock("@/hooks/useSimulate", () => ({
    useSimulate: () => simulateState,
}))

vi.mock("@/lib/clipboard", () => ({
    copyToClipboard: (value: string) => mockCopyToClipboard(value),
}))

vi.mock("@/lib/edit", () => ({
    edit: (...args: Parameters<typeof mockEdit>) => mockEdit(...args),
}))

describe("Playground", () => {
    beforeEach(() => {
        mountState = { isMounted: true }
        shareState = { sharedURL: null, share: mockShare }
        sortState = { sortMode: "index", sort: mockSort }
        simulateState = {
            isLoading: false,
            result: null,
            error: null,
            simulate: mockSimulate,
        }

        mockSimulate.mockReset()
        mockShare.mockReset()
        mockSort.mockReset()
        mockCopyToClipboard.mockReset()
        mockEdit.mockReset()
        mockEdit.mockImplementation((snippetId: string | undefined, setCode: (code: string) => void) => {
            setCode(snippetId ? `snippet:${snippetId}` : "default code")
        })
    })

    it("renders nothing until mounted", () => {
        mountState = { isMounted: false }

        const { container } = render(<Playground />)

        expect(container).toBeEmptyDOMElement()
    })

    it("loads initial code through edit and forwards snippet ids", async () => {
        render(<Playground snippetId="snippet-123" />)

        await waitFor(() => {
            expect(mockEdit).toHaveBeenCalledWith("snippet-123", expect.any(Function))
        })

        expect(screen.getByLabelText("editor")).toHaveValue("snippet:snippet-123")
    })

    it("uses the latest editor value for run and share actions", async () => {
        render(<Playground />)

        const editor = await screen.findByLabelText("editor")
        fireEvent.change(editor, { target: { value: "OPENQASM 3;" } })

        fireEvent.click(screen.getByRole("button", { name: "Run" }))
        fireEvent.click(screen.getByRole("button", { name: "Share" }))

        expect(mockSimulate).toHaveBeenCalledWith("OPENQASM 3;")
        expect(mockShare).toHaveBeenCalledWith("OPENQASM 3;")
    })

    it("shows examples when there is no shared URL and updates the editor from them", async () => {
        render(<Playground />)

        fireEvent.click(screen.getByRole("button", { name: "Load example" }))

        expect(screen.queryByTestId("shared-url")).not.toBeInTheDocument()
        expect(screen.getByLabelText("editor")).toHaveValue("example code")
    })

    it("shows the shared URL instead of examples when a share link exists", () => {
        shareState = { sharedURL: "https://example.com/p/abc", share: mockShare }

        render(<Playground />)

        expect(screen.getByTestId("shared-url")).toHaveTextContent("https://example.com/p/abc")
        expect(screen.queryByRole("button", { name: "Load example" })).not.toBeInTheDocument()
    })

    it("renders loading, empty, result, and error states with the right copy actions", () => {
        const { rerender } = render(<Playground />)
        expect(screen.getByText("Run your OpenQASM code to see quantum states here")).toBeInTheDocument()

        simulateState = {
            ...simulateState,
            isLoading: true,
        }
        rerender(<Playground />)
        expect(screen.getByText("Waiting for remote server...")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Run" })).toBeDisabled()
        expect(screen.queryByText("Running...")).not.toBeInTheDocument()

        const result = {
            states: [{
                binaryString: ["0"],
                probability: 1,
                amplitude: { real: 1, imag: 0 },
                int: [0],
            }],
        }

        simulateState = {
            ...simulateState,
            isLoading: false,
            result,
            error: null,
        }
        sortState = { sortMode: "prob_desc", sort: mockSort }
        rerender(<Playground />)

        expect(screen.getByTestId("result-view")).toHaveTextContent("prob_desc:1")
        fireEvent.click(screen.getByRole("button", { name: "Quantum States" }))
        expect(screen.getByTestId("result-table-view")).toHaveTextContent("prob_desc:1")
        fireEvent.click(screen.getByRole("button", { name: "Sort" }))
        fireEvent.click(screen.getByRole("button", { name: "Copy" }))
        expect(mockSort).toHaveBeenCalled()
        expect(mockCopyToClipboard).toHaveBeenCalledWith(JSON.stringify(result, null, 2))

        simulateState = {
            ...simulateState,
            result: null,
            error: "broken circuit",
        }
        rerender(<Playground />)

        expect(screen.getByText("Error Details")).toBeInTheDocument()
        fireEvent.click(screen.getByRole("button", { name: "Copy" }))
        expect(mockCopyToClipboard).toHaveBeenCalledWith("broken circuit")
    })

    it("opens and closes the result table modal from the Quantum States header", () => {
        const { rerender } = render(<Playground />)

        const titleButton = screen.getByRole("button", { name: "Quantum States" })
        expect(titleButton).toBeDisabled()

        simulateState = {
            ...simulateState,
            result: {
                states: [{
                    binaryString: ["0"],
                    probability: 1,
                    amplitude: { real: 1, imag: 0 },
                    int: [0],
                }],
            },
        }
        rerender(<Playground />)

        const enabledTitleButton = screen.getByRole("button", { name: "Quantum States" })
        expect(enabledTitleButton).toBeEnabled()

        fireEvent.click(enabledTitleButton)
        expect(screen.getByRole("dialog")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", { name: "Close" }))
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })

    it("closes the result table modal when the overlay is clicked", () => {
        const { rerender } = render(<Playground />)

        simulateState = {
            ...simulateState,
            result: {
                states: [{
                    binaryString: ["0"],
                    probability: 1,
                    amplitude: { real: 1, imag: 0 },
                    int: [0],
                }],
            },
        }
        rerender(<Playground />)

        fireEvent.click(screen.getByRole("button", { name: "Quantum States" }))
        const dialog = screen.getByRole("dialog")
        expect(dialog).toBeInTheDocument()

        fireEvent.click(dialog)
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
})
