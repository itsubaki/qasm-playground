import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import EditPage from "./page"

const mockUseParams = vi.fn()
const mockPlayground = vi.fn(({ snippetId }: { snippetId?: string }) => (
    <div data-testid="playground">{snippetId}</div>
))

vi.mock("next/navigation", () => ({
    useParams: () => mockUseParams(),
}))

vi.mock("@/app/page", () => ({
    default: (props: { snippetId?: string }) => mockPlayground(props),
}))

describe("EditPage", () => {
    beforeEach(() => {
        mockUseParams.mockReset()
        mockPlayground.mockClear()
        mockUseParams.mockReturnValue({ id: "snippet-42" })
    })

    it("passes the route id to the playground", () => {
        render(<EditPage />)

        expect(mockPlayground).toHaveBeenCalledWith({ snippetId: "snippet-42" })
        expect(screen.getByTestId("playground")).toHaveTextContent("snippet-42")
    })
})
