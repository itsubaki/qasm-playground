import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ThemeProvider from "./theme";

vi.mock("next-themes", () => {
    return {
        ThemeProvider: ({ children, ...props }: any) => (
            <div data-testid="mock-theme-provider" data-props={JSON.stringify(props)}>
                {children}
            </div>
        ),
    };
});

describe("ThemeProvider", () => {
    it("renders children correctly", () => {
        render(
            <ThemeProvider attribute="class">
                <div>child content</div>
            </ThemeProvider>
        );

        expect(screen.getByText("child content")).toBeInTheDocument();
    });

    it("passes props to NextThemesProvider", () => {
        render(
            <ThemeProvider attribute="class" defaultTheme="dark">
                <div>child</div>
            </ThemeProvider>
        );

        const provider = screen.getByTestId("mock-theme-provider");
        const props = JSON.parse(provider.getAttribute("data-props")!);

        expect(props.attribute).toBe("class");
        expect(props.defaultTheme).toBe("dark");
    });
});
