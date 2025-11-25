import { describe, it, expect } from "vitest"
import { cn, smooth } from "./utils"

describe("cn", () => {
  it("combines multiple class names", () => {
    expect(cn("a", "b")).toBe("a b")
  })

  it("ignores falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b")
  })

  it("merges tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
    expect(cn("text-sm", "text-lg")).toBe("text-lg")
  })

  it("handles object syntax", () => {
    expect(cn({ "a": true, "b": false }, "c")).toBe("a c")
  })

  it("returns an empty string for no args", () => {
    expect(cn()).toBe("")
  })

  it("handles array inputs", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c")
  })

  it("handles complex tailwind class merging", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
  })

  it("handles mixed input types", () => {
    expect(cn("base", { active: true, disabled: false }, ["extra", "classes"])).toBe("base active extra classes")
  })

  it("handles nested object conditions", () => {
    expect(cn({
      "text-red-500": true,
      "text-blue-500": false,
      "font-bold": true
    })).toBe("text-red-500 font-bold")
  })

  it("merges conflicting margin classes correctly", () => {
    expect(cn("m-2", "mx-4")).toBe("m-2 mx-4")
    expect(cn("mx-2", "m-4")).toBe("m-4")
  })
})

describe("transition constant", () => {
  it("should have the correct value", () => {
    expect(smooth).toBe("transition-colors duration-150 ease-in-out")
  })
})
