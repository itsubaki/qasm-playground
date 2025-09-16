import { cn } from "./utils"

describe("cn", () => {
  it("combines multiple class names", () => {
    expect(cn("a", "b")).toBe("a b")
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz")
    expect(cn("class1", "class2", "class3")).toBe("class1 class2 class3")
  })

  it("ignores falsy values", () => {
    expect(cn("a", false, undefined, null, "b", "", 0)).toBe("a b")
    expect(cn(false)).toBe("")
    expect(cn(undefined)).toBe("")
    expect(cn(null)).toBe("")
    expect(cn("")).toBe("")
    expect(cn(0)).toBe("")
    expect(cn("valid", false, "also-valid")).toBe("valid also-valid")
  })

  it("merges tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
    expect(cn("text-sm", "text-lg")).toBe("text-lg")
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
    expect(cn("m-2", "mx-4")).toBe("m-2 mx-4")
    expect(cn("hover:text-red-500", "hover:text-blue-500")).toBe("hover:text-blue-500")
  })

  it("handles object syntax", () => {
    expect(cn({ a: true, b: false }, "c")).toBe("a c")
    expect(cn({ foo: true, bar: true }, "baz")).toBe("foo bar baz")
    expect(cn({ "active": true, "disabled": false })).toBe("active")
    expect(cn({ "p-2": true }, { "p-4": true })).toBe("p-4")
    expect(cn({ "text-red-500": false, "text-blue-500": true })).toBe("text-blue-500")
  })

  it("returns an empty string for no args", () => {
    expect(cn()).toBe("")
  })

  it("handles mixed input types", () => {
    expect(cn("base", { active: true, disabled: false }, "extra")).toBe("base active extra")
    expect(cn(["array", "classes"], "string")).toBe("array classes string")
    expect(cn("a", ["b", "c"], { d: true, e: false }, "f")).toBe("a b c d f")
  })

  it("handles complex tailwind merge scenarios", () => {
    expect(cn("px-2 py-1 px-3")).toBe("py-1 px-3")
    expect(cn("text-center", "text-left")).toBe("text-left")
    expect(cn("bg-red-500 text-white", "bg-blue-500")).toBe("text-white bg-blue-500")
    expect(cn("rounded-md rounded-lg")).toBe("rounded-lg")
  })

  it("preserves non-conflicting classes", () => {
    expect(cn("text-white", "bg-red-500", "px-4", "py-2")).toBe("text-white bg-red-500 px-4 py-2")
    expect(cn("flex", "items-center", "justify-between")).toBe("flex items-center justify-between")
  })
})