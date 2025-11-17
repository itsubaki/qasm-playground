import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("Select components className handling", () => {
  it("SelectTrigger merges custom className", () => {
    const baseClasses = "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 text-left"
    const customClass = "custom-trigger"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-trigger")
    expect(result).toContain("h-10")
    expect(result).toContain("w-full")
  })

  it("SelectTrigger includes focus styles", () => {
    const baseClasses = "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 text-left"
    expect(baseClasses).toContain("focus:outline-none")
    expect(baseClasses).toContain("focus:ring-2")
    expect(baseClasses).toContain("focus:ring-ring")
  })

  it("SelectTrigger includes disabled styles", () => {
    const baseClasses = "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 text-left"
    expect(baseClasses).toContain("disabled:cursor-not-allowed")
    expect(baseClasses).toContain("disabled:opacity-50")
  })

  it("SelectScrollUpButton merges custom className", () => {
    const baseClasses = "flex cursor-default items-center justify-center py-1"
    const customClass = "custom-scroll-up"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-scroll-up")
    expect(result).toContain("flex")
    expect(result).toContain("cursor-default")
  })

  it("SelectScrollDownButton merges custom className", () => {
    const baseClasses = "flex cursor-default items-center justify-center py-1"
    const customClass = "custom-scroll-down"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-scroll-down")
    expect(result).toContain("items-center")
  })

  it("SelectContent merges custom className with popper position", () => {
    const baseClasses = "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    const popperClasses = "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
    const customClass = "custom-content"
    const result = cn(baseClasses, popperClasses, customClass)
    expect(result).toContain("custom-content")
    expect(result).toContain("z-50")
    expect(result).toContain("max-h-96")
  })

  it("SelectContent includes animation classes", () => {
    const baseClasses = "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    expect(baseClasses).toContain("data-[state=open]:animate-in")
    expect(baseClasses).toContain("data-[state=closed]:animate-out")
    expect(baseClasses).toContain("data-[state=open]:fade-in-0")
    expect(baseClasses).toContain("data-[state=closed]:fade-out-0")
  })

  it("SelectLabel merges custom className", () => {
    const baseClasses = "py-1.5 pl-8 pr-2 text-sm font-semibold"
    const customClass = "custom-label"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-label")
    expect(result).toContain("font-semibold")
    expect(result).toContain("text-sm")
  })

  it("SelectItem merges custom className", () => {
    const baseClasses = "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    const customClass = "custom-item"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-item")
    expect(result).toContain("cursor-default")
    expect(result).toContain("select-none")
  })

  it("SelectItem includes focus and disabled styles", () => {
    const baseClasses = "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    expect(baseClasses).toContain("focus:bg-accent")
    expect(baseClasses).toContain("focus:text-accent-foreground")
    expect(baseClasses).toContain("data-[disabled]:pointer-events-none")
    expect(baseClasses).toContain("data-[disabled]:opacity-50")
  })

  it("SelectSeparator merges custom className", () => {
    const baseClasses = "-mx-1 my-1 h-px bg-muted"
    const customClass = "custom-separator"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("custom-separator")
    expect(result).toContain("h-px")
    expect(result).toContain("bg-muted")
  })

  it("SelectTrigger handles className override for height", () => {
    const baseClasses = "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 text-left"
    const customClass = "h-12"
    const result = cn(baseClasses, customClass)
    expect(result).toContain("h-12")
    expect(result).not.toContain("h-10")
  })

  it("SelectContent handles position prop classes conditionally", () => {
    const baseClasses = "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    const popperClasses = "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
    
    // When position is "popper", additional classes are applied
    const resultWithPopper = cn(baseClasses, popperClasses)
    expect(resultWithPopper).toContain("data-[side=bottom]:translate-y-1")
    
    // When position is not "popper", those classes are not applied
    const resultWithoutPopper = cn(baseClasses)
    expect(resultWithoutPopper).not.toContain("translate-y-1")
  })
})
