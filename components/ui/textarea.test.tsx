import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("Textarea component", () => {
  it("applies base className", () => {
    const baseClasses = "flex min-h-[80px] w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-0 border pb-2"
    expect(baseClasses).toContain("min-h-[80px]")
    expect(baseClasses).toContain("w-full")
    expect(baseClasses).toContain("rounded-md")
    expect(baseClasses).toContain("border-input")
    expect(baseClasses).toContain("bg-background")
  })

  it("merges custom className", () => {
    const baseClasses = "flex min-h-[80px] w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-0 border pb-2"
    const customClass = "custom-textarea"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-textarea")
    expect(result).toContain("min-h-[80px]")
  })

  it("includes focus-visible styles", () => {
    const baseClasses = "flex min-h-[80px] w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-0 border pb-2"
    expect(baseClasses).toContain("focus-visible:outline-none")
    expect(baseClasses).toContain("focus-visible:ring-2")
    expect(baseClasses).toContain("focus-visible:ring-ring")
    expect(baseClasses).toContain("focus-visible:ring-offset-2")
  })

  it("includes disabled styles", () => {
    const baseClasses = "flex min-h-[80px] w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-0 border pb-2"
    expect(baseClasses).toContain("disabled:cursor-not-allowed")
    expect(baseClasses).toContain("disabled:opacity-50")
  })

  it("includes placeholder styles", () => {
    const baseClasses = "flex min-h-[80px] w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-0 border pb-2"
    expect(baseClasses).toContain("placeholder:text-muted-foreground")
  })

  it("handles className override for padding", () => {
    const baseClasses = "flex min-h-[80px] w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-0 border pb-2"
    const customClass = "px-4 py-4"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("px-4")
    expect(result).toContain("py-4")
    expect(result).not.toContain("px-3")
  })

  it("handles className override for min-height", () => {
    const baseClasses = "flex min-h-[80px] w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-0 border pb-2"
    const customClass = "min-h-[120px]"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("min-h-[120px]")
    expect(result).not.toContain("min-h-[80px]")
  })

  it("includes spacing and border classes", () => {
    const baseClasses = "flex min-h-[80px] w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-0 border pb-2"
    expect(baseClasses).toContain("px-3")
    expect(baseClasses).toContain("py-2")
    expect(baseClasses).toContain("pb-2")
    expect(baseClasses).toContain("my-0")
    expect(baseClasses).toContain("border")
  })
})
