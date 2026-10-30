import { act, fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { States } from "@/lib/http"
import { httpPost } from "@/lib/http"
import { copyToClipboard } from "@/lib/clipboard"
import Playground from "@/components/playground"

vi.mock("@/hooks/useMount", () => ({ useMount: () => ({ isMounted: true }) }))
vi.mock("@/components/header", () => ({ Header: () => <div>Header</div> }))
vi.mock("@/components/notes", () => ({ Notes: () => <div>Notes</div> }))
vi.mock("@/components/examples", () => ({
    Examples: ({ setCode }: { setCode: (code: string) => void }) => <button onClick={() => setCode("example code")}>Choose next example</button>,
}))
vi.mock("@/lib/http", () => ({ httpPost: vi.fn() }))
vi.mock("@/lib/clipboard", () => ({ copyToClipboard: vi.fn() }))
vi.mock("@/lib/edit", () => ({
    edit: (id: string | undefined, setCode: (code: string) => void) => setCode(id ? `snippet:${id}` : "default code"),
}))
const states: States = { states: [
    { binaryString: ["00"], probability: 0.25, amplitude: { real: 0.5 } },
    { binaryString: ["11"], probability: 0.75, amplitude: { real: Math.sqrt(0.75) } },
] }
const editor = () => screen.getByRole("textbox", { name: "OpenQASM code" })
const run = () => fireEvent.click(screen.getByRole("button", { name: "Run" }))

beforeEach(() => { vi.resetAllMocks(); vi.mocked(httpPost).mockResolvedValue(states) })

describe("Playground workflow", () => {
    it("loads shared code", () => {
        render(<Playground snippetId="123" />)
        expect(editor()).toHaveValue("snippet:123")
    })

    it("marks results stale after editing and clears the warning when the code is restored", async () => {
        render(<Playground />)
        run()
        await screen.findByText("Results match the current code")
        fireEvent.change(editor(), { target: { value: "changed" } })
        expect(screen.getByRole("button", { name: "Run" })).toHaveAttribute("title", "Unrun changes — run to update results")
        expect(screen.getByText("Unrun changes")).toBeVisible()
        expect(screen.getByText("|00⟩")).toBeInTheDocument()
        fireEvent.change(editor(), { target: { value: "default code" } })
        expect(screen.queryByText("Unrun changes")).not.toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Run" })).toHaveAttribute("title", "Run current code")
    })

    it("tracks the submitted code when editing during a run", async () => {
        let resolve!: (value: States) => void
        vi.mocked(httpPost).mockReturnValue(new Promise((done) => { resolve = done }))
        render(<Playground />)
        run()
        fireEvent.change(editor(), { target: { value: "new code" } })
        expect(screen.getByText(/Running an earlier version/)).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Run" })).toBeDisabled()
        await act(async () => resolve(states))
        expect(screen.getByText(/Previous run shown/)).toBeInTheDocument()
        expect(httpPost).toHaveBeenCalledWith("/api/simulate", { code: "default code" })
    })

    it("protects edits until replacement is confirmed and shows no undo banner", async () => {
        const user = userEvent.setup()
        render(<Playground />)
        fireEvent.change(editor(), { target: { value: "my work" } })
        await user.click(screen.getByRole("button", { name: "Choose next example" }))
        expect(screen.getByRole("alertdialog")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Keep editing" })).toHaveFocus()
        await user.click(screen.getByRole("button", { name: "Keep editing" }))
        expect(editor()).toHaveValue("my work")
        await user.click(screen.getByRole("button", { name: "Choose next example" }))
        await user.click(screen.getByRole("button", { name: "Load example" }))
        expect(editor()).toHaveValue("example code")
        expect(screen.queryByRole("button", { name: "Undo" })).not.toBeInTheDocument()
        expect(screen.queryByText("Example loaded")).not.toBeInTheDocument()
    })

    it("switches unedited examples directly without showing undo", () => {
        render(<Playground />)
        fireEvent.click(screen.getByRole("button", { name: "Choose next example" }))
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
        expect(editor()).toHaveValue("example code")
        expect(screen.queryByRole("button", { name: "Undo" })).not.toBeInTheDocument()
    })

    it("keeps examples after sharing and identifies changes outside the shared snapshot", async () => {
        vi.mocked(httpPost).mockResolvedValue({ id: "abc" })
        render(<Playground />)
        fireEvent.click(screen.getByRole("button", { name: "Share" }))
        await screen.findByLabelText("Shared URL")
        expect(screen.getByRole("button", { name: "Choose next example" })).toBeInTheDocument()
        expect(screen.getByText("Share link matches the current code.")).toBeInTheDocument()
        fireEvent.change(editor(), { target: { value: "changed" } })
        expect(screen.getByText(/This link contains an earlier version/)).toBeInTheDocument()
    })

    it("compares an in-flight share with its submitted code", async () => {
        let resolve!: (value: unknown) => void
        vi.mocked(httpPost).mockReturnValue(new Promise((done) => { resolve = done }))
        render(<Playground />)
        fireEvent.click(screen.getByRole("button", { name: "Share" }))
        fireEvent.change(editor(), { target: { value: "new code" } })
        await act(async () => resolve({ id: "abc" }))
        expect(screen.getByText(/This link contains an earlier version/)).toBeInTheDocument()
    })

    it("shows share failures and leaves the editor intact", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {})
        vi.mocked(httpPost).mockRejectedValue(new Error("offline"))
        render(<Playground />)
        fireEvent.click(screen.getByRole("button", { name: "Share" }))
        expect(await screen.findByRole("alert")).toHaveTextContent("Could not create a share link.")
        expect(editor()).toHaveValue("default code")
    })

    it("opens an explicit table dialog, traps focus, closes with Escape and restores focus", async () => {
        const user = userEvent.setup()
        render(<Playground />)
        run()
        const trigger = await screen.findByRole("button", { name: "View all states in a table" })
        fireEvent.click(screen.getByRole("button", { name: "Highest probability" }))
        expect(screen.getByRole("button", { name: "Highest probability" })).toHaveAttribute("aria-pressed", "true")
        await user.click(trigger)
        const dialog = screen.getByRole("dialog", { name: "Quantum States" })
        expect(dialog).toContainElement(document.activeElement as HTMLElement)
        expect(within(dialog).getAllByRole("row")[1]).toHaveTextContent("|11⟩")
        await user.click(within(dialog).getByRole("button", { name: "Basis order" }))
        expect(within(dialog).getAllByRole("row")[1]).toHaveTextContent("|00⟩")
        expect(within(dialog).getByRole("button", { name: "Basis order" })).toHaveAttribute("aria-pressed", "true")
        // Last control wraps to the first, in both directions.
        within(dialog).getByRole("button", { name: "Highest probability" }).focus()
        await user.tab()
        expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus()
        await user.tab({ shift: true })
        expect(dialog).toContainElement(document.activeElement as HTMLElement)
        await user.keyboard("{Escape}")
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
        expect(trigger).toHaveFocus()
    })

    it("disables empty input actions and explains what to do", () => {
        render(<Playground />)
        fireEvent.change(editor(), { target: { value: "  " } })
        expect(screen.getByRole("button", { name: "Run" })).toBeDisabled()
        expect(screen.getByRole("button", { name: "Share" })).toBeDisabled()
        expect(screen.getByText(/Enter code or choose an example/)).toBeInTheDocument()
    })

    it("places error details near the code and selects a reported line", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {})
        vi.mocked(httpPost).mockRejectedValue(new Error("HTTP 400: line 2: expected semicolon"))
        render(<Playground />)
        fireEvent.change(editor(), { target: { value: "OPENQASM 3.0;\ninvalid" } })
        run()
        await screen.findByText("Could not run this code")
        fireEvent.click(screen.getByRole("button", { name: "Go to line 2" }))
        expect(editor()).toHaveFocus()
        expect((editor() as HTMLTextAreaElement).selectionStart).toBe(14)
        fireEvent.change(editor(), { target: { value: "edited again" } })
        expect(screen.queryByRole("button", { name: "Go to line 2" })).not.toBeInTheDocument()
        expect(screen.getByText(/These details refer to the previous run/)).toBeInTheDocument()
    })

    it("copies the complete result", async () => {
        render(<Playground />)
        run()
        await screen.findByText("Results match the current code")
        fireEvent.click(screen.getByRole("button", { name: "Copy results" }))
        expect(copyToClipboard).toHaveBeenCalledWith(JSON.stringify(states, null, 2))
    })
})
