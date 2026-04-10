import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import RootLayout, { metadata } from "./layout"

vi.mock("next/font/google", () => ({
    Inter: () => ({ variable: "font-inter" }),
}))

vi.mock("../providers/theme", () => ({
    default: ({
        children,
        ...props
    }: {
        children: React.ReactNode
        [key: string]: unknown
    }) => (
        <div data-testid="theme-provider" data-props={JSON.stringify(props)}>
            {children}
        </div>
    ),
}))

vi.mock("react-hot-toast", () => ({
    Toaster: ({ position }: { position: string }) => <div data-testid="toaster">{position}</div>,
}))

vi.mock("@vercel/analytics/next", () => ({
    Analytics: () => <div data-testid="analytics" />,
}))

vi.mock("@vercel/speed-insights/next", () => ({
    SpeedInsights: () => <div data-testid="speed-insights" />,
}))

vi.mock("@next/third-parties/google", () => ({
    GoogleAnalytics: ({ gaId }: { gaId: string }) => <div data-testid="ga">{gaId}</div>,
}))

describe("RootLayout", () => {
    const originalGaId = process.env.NEXT_PUBLIC_GA_ID

    afterEach(() => {
        process.env.NEXT_PUBLIC_GA_ID = originalGaId
    })

    it("exports the expected metadata", () => {
        expect(metadata).toEqual({
            title: "OpenQASM Playground",
            description: "A playground for writing and running OpenQASM code in the browser",
        })
    })

    it("renders providers, children, and shared analytics widgets", () => {
        delete process.env.NEXT_PUBLIC_GA_ID

        const { container } = render(
            <RootLayout>
                <div>child content</div>
            </RootLayout>
        )

        expect(screen.getByText("child content")).toBeInTheDocument()
        expect(screen.getByTestId("toaster")).toHaveTextContent("top-center")
        expect(screen.getByTestId("analytics")).toBeInTheDocument()
        expect(screen.getByTestId("speed-insights")).toBeInTheDocument()
        expect(screen.queryByTestId("ga")).not.toBeInTheDocument()

        const provider = screen.getByTestId("theme-provider")
        expect(provider).toHaveAttribute("data-props", JSON.stringify({
            attribute: "class",
            defaultTheme: "system",
            enableSystem: true,
            disableTransitionOnChange: true,
        }))

        expect(container.querySelector("main")).toHaveTextContent("child content")
    })

    it("renders Google analytics tags when environment variables are set", () => {
        process.env.NEXT_PUBLIC_GA_ID = "GA-456"

        render(
            <RootLayout>
                <div>child content</div>
            </RootLayout>
        )

        expect(screen.getByTestId("ga")).toHaveTextContent("GA-456")
    })
})
