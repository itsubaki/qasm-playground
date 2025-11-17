import { describe, it, expect } from "vitest"
import { buttonVariants } from "./button"

describe("buttonVariants", () => {
  it("returns default variant classes", () => {
    const result = buttonVariants()
    expect(result).toContain("bg-primary")
    expect(result).toContain("text-primary-foreground")
    expect(result).toContain("h-9")
  })

  it("applies destructive variant", () => {
    const result = buttonVariants({ variant: "destructive" })
    expect(result).toContain("bg-destructive")
    expect(result).toContain("text-white")
  })

  it("applies outline variant", () => {
    const result = buttonVariants({ variant: "outline" })
    expect(result).toContain("border")
    expect(result).toContain("bg-background")
  })

  it("applies secondary variant", () => {
    const result = buttonVariants({ variant: "secondary" })
    expect(result).toContain("bg-secondary")
    expect(result).toContain("text-secondary-foreground")
  })

  it("applies ghost variant", () => {
    const result = buttonVariants({ variant: "ghost" })
    expect(result).toContain("hover:bg-accent")
    expect(result).toContain("hover:text-accent-foreground")
  })

  it("applies link variant", () => {
    const result = buttonVariants({ variant: "link" })
    expect(result).toContain("text-primary")
    expect(result).toContain("underline-offset-4")
  })

  it("applies sm size", () => {
    const result = buttonVariants({ size: "sm" })
    expect(result).toContain("h-8")
    expect(result).toContain("px-3")
  })

  it("applies lg size", () => {
    const result = buttonVariants({ size: "lg" })
    expect(result).toContain("h-10")
    expect(result).toContain("px-6")
  })

  it("applies icon size", () => {
    const result = buttonVariants({ size: "icon" })
    expect(result).toContain("size-9")
  })

  it("combines variant and size", () => {
    const result = buttonVariants({ variant: "outline", size: "sm" })
    expect(result).toContain("border")
    expect(result).toContain("h-8")
  })

  it("merges custom className", () => {
    const result = buttonVariants({ className: "custom-class" })
    expect(result).toContain("custom-class")
  })

  it("includes base classes", () => {
    const result = buttonVariants()
    expect(result).toContain("inline-flex")
    expect(result).toContain("items-center")
    expect(result).toContain("justify-center")
    expect(result).toContain("rounded-md")
    expect(result).toContain("disabled:pointer-events-none")
    expect(result).toContain("disabled:opacity-50")
  })
})
