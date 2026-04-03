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
    GoogleTagManager: ({ gtmId }: { gtmId: string }) => <div data-testid="gtm">{gtmId}</div>,
    GoogleAnalytics: ({ gaId }: { gaId: string }) => <div data-testid="ga">{gaId}</div>,
}))

describe("RootLayout", () => {
    const originalGtmId = process.env.NEXT_PUBLIC_GTM_ID
    const originalGaId = process.env.NEXT_PUBLIC_GA_ID

    afterEach(() => {
        process.env.NEXT_PUBLIC_GTM_ID = originalGtmId
        process.env.NEXT_PUBLIC_GA_ID = originalGaId
    })

    it("exports the expected metadata", () => {
        expect(metadata).toEqual({
            title: "OpenQASM 3.x Playground",
            description: "A playground that lets you write and run OpenQASM 3.x code in your browser",
        })
    })

    it("renders providers, children, and shared analytics widgets", () => {
        delete process.env.NEXT_PUBLIC_GTM_ID
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
        expect(screen.queryByTestId("gtm")).not.toBeInTheDocument()
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
        process.env.NEXT_PUBLIC_GTM_ID = "GTM-123"
        process.env.NEXT_PUBLIC_GA_ID = "GA-456"

        render(
            <RootLayout>
                <div>child content</div>
            </RootLayout>
        )

        expect(screen.getByTestId("gtm")).toHaveTextContent("GTM-123")
        expect(screen.getByTestId("ga")).toHaveTextContent("GA-456")
    })
})
