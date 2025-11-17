import { describe, it, expect } from "vitest"
import { throwError } from "./error"

describe("throwError", () => {
  it("throws error with basic HTTP status message", async () => {
    const resp = new Response(null, {
      status: 404,
      statusText: "Not Found",
    })

    await expect(throwError(resp)).rejects.toThrow("HTTP 404: Not Found")
  })

  it("throws error with JSON error message", async () => {
    const resp = new Response(JSON.stringify({ error: "Invalid input" }), {
      status: 400,
      statusText: "Bad Request",
      headers: { "content-type": "application/json" },
    })

    await expect(throwError(resp)).rejects.toThrow(
      "HTTP 400: Bad Request\nInvalid input"
    )
  })

  it("throws error with plain text message", async () => {
    const resp = new Response("Server error occurred", {
      status: 500,
      statusText: "Internal Server Error",
      headers: { "content-type": "text/plain" },
    })

    await expect(throwError(resp)).rejects.toThrow(
      "HTTP 500: Internal Server Error\nServer error occurred"
    )
  })

  it("handles JSON with no error field", async () => {
    const resp = new Response(JSON.stringify({ message: "Something happened" }), {
      status: 500,
      statusText: "Internal Server Error",
      headers: { "content-type": "application/json" },
    })

    await expect(throwError(resp)).rejects.toThrow("HTTP 500: Internal Server Error")
  })

  it("handles empty response body", async () => {
    const resp = new Response("", {
      status: 503,
      statusText: "Service Unavailable",
    })

    await expect(throwError(resp)).rejects.toThrow("HTTP 503: Service Unavailable")
  })

  it("handles malformed JSON gracefully", async () => {
    const resp = new Response("{ invalid json", {
      status: 500,
      statusText: "Internal Server Error",
      headers: { "content-type": "application/json" },
    })

    await expect(throwError(resp)).rejects.toThrow("HTTP 500: Internal Server Error")
  })

  it("handles JSON with charset in content-type", async () => {
    const resp = new Response(JSON.stringify({ error: "Charset test" }), {
      status: 400,
      statusText: "Bad Request",
      headers: { "content-type": "application/json; charset=utf-8" },
    })

    await expect(throwError(resp)).rejects.toThrow(
      "HTTP 400: Bad Request\nCharset test"
    )
  })
})
