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
    afterEach(() => {
        vi.unstubAllEnvs()
    })

    it("exports the expected metadata", () => {
        expect(metadata).toEqual({
            title: "OpenQASM Playground",
            description: "A playground for OpenQASM in the browser",
            icons: {
                icon: [
                    {
                        url: '/icon-light-32x32.png',
                        media: '(prefers-color-scheme: light)',
                    },
                    {
                        url: '/icon-dark-32x32.png',
                        media: '(prefers-color-scheme: dark)',
                    },
                    {
                        url: '/icon.svg',
                        type: 'image/svg+xml',
                    },
                ],
                apple: '/apple-icon.png',
            },
        })
    })

    it("renders providers and children outside production", () => {
        vi.stubEnv("NODE_ENV", "test")
        vi.stubEnv("NEXT_PUBLIC_GA_ID", "")

        const { container } = render(
            <RootLayout>
                <div>child content</div>
            </RootLayout>
        )

        expect(screen.getByText("child content")).toBeInTheDocument()
        expect(screen.getByTestId("toaster")).toHaveTextContent("top-center")

        const provider = screen.getByTestId("theme-provider")
        expect(provider).toHaveAttribute("data-props", JSON.stringify({
            attribute: "class",
            defaultTheme: "system",
            enableSystem: true,
            disableTransitionOnChange: true,
        }))

        expect(container.querySelector("main")).toHaveTextContent("child content")
        expect(screen.queryByTestId("analytics")).not.toBeInTheDocument()
        expect(screen.queryByTestId("speed-insights")).not.toBeInTheDocument()
        expect(screen.queryByTestId("ga")).not.toBeInTheDocument()
    })

    it("renders production analytics widgets without Google Analytics when no GA ID is configured", () => {
        vi.stubEnv("NODE_ENV", "production")
        vi.stubEnv("NEXT_PUBLIC_GA_ID", "")

        render(
            <RootLayout>
                <div>child content</div>
            </RootLayout>
        )

        expect(screen.getByTestId("analytics")).toBeInTheDocument()
        expect(screen.getByTestId("speed-insights")).toBeInTheDocument()
        expect(screen.queryByTestId("ga")).not.toBeInTheDocument()
    })

    it("renders Google Analytics in production when a GA ID is configured", () => {
        vi.stubEnv("NODE_ENV", "production")
        vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST123")

        render(
            <RootLayout>
                <div>child content</div>
            </RootLayout>
        )

        expect(screen.getByTestId("analytics")).toBeInTheDocument()
        expect(screen.getByTestId("speed-insights")).toBeInTheDocument()
        expect(screen.getByTestId("ga")).toHaveTextContent("G-TEST123")
    })
})
