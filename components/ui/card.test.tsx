import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("Card components className handling", () => {
  it("Card merges custom className", () => {
    const baseClasses = "bg-card text-card-foreground flex flex-col rounded-xl shadow-sm border gap-2 py-3 pt-0 pb-0"
    const customClass = "custom-card-class"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-card-class")
    expect(result).toContain("bg-card")
    expect(result).toContain("rounded-xl")
  })

  it("CardHeader merges custom className", () => {
    const baseClasses = "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
    const customClass = "custom-header"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-header")
    expect(result).toContain("grid")
    expect(result).toContain("px-6")
  })

  it("CardTitle merges custom className", () => {
    const baseClasses = "leading-none font-semibold"
    const customClass = "custom-title"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-title")
    expect(result).toContain("leading-none")
    expect(result).toContain("font-semibold")
  })

  it("CardDescription merges custom className", () => {
    const baseClasses = "text-muted-foreground text-sm"
    const customClass = "custom-description"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-description")
    expect(result).toContain("text-muted-foreground")
    expect(result).toContain("text-sm")
  })

  it("CardAction merges custom className", () => {
    const baseClasses = "col-start-2 row-span-2 row-start-1 self-start justify-self-end"
    const customClass = "custom-action"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-action")
    expect(result).toContain("col-start-2")
    expect(result).toContain("justify-self-end")
  })

  it("CardContent merges custom className", () => {
    const baseClasses = "px- pl-3 pr-3 pb-0 pt-2"
    const customClass = "custom-content"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-content")
    expect(result).toContain("pl-3")
    expect(result).toContain("pt-2")
  })

  it("CardFooter merges custom className", () => {
    const baseClasses = "flex items-center px-6 [.border-t]:pt-6"
    const customClass = "justify-end"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("justify-end")
    expect(result).toContain("flex")
    expect(result).toContain("items-center")
    expect(result).toContain("px-6")
  })

  it("Card handles conflicting className", () => {
    const baseClasses = "bg-card text-card-foreground flex flex-col rounded-xl shadow-sm border gap-2 py-3 pt-0 pb-0"
    const customClass = "gap-4"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("gap-4")
    expect(result).not.toContain("gap-2")
  })

  it("CardTitle handles text size override", () => {
    const baseClasses = "leading-none font-semibold"
    const customClass = "text-2xl"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("text-2xl")
    expect(result).toContain("font-semibold")
  })
})
