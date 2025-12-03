import { describe, it, expect, vi, beforeEach } from "vitest"
import { httpPost } from "./http"

describe('httpPost', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return JSON when response is ok', async () => {
    const mockData = { success: true }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    } as any)

    const result = await httpPost('/test', { foo: 'bar' })
    expect(result).toEqual(mockData)
    expect(global.fetch).toHaveBeenCalledWith('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foo: 'bar' }),
    })
  })

  it('should include JSON error message when response has application/json error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      headers: {
        get: (name: string) => (name === "content-type" ? "application/json" : null),
      },
      json: vi.fn().mockResolvedValue({ error: "Invalid data" }),
    } as any)

    await expect(httpPost("/test", { foo: "bar" })).rejects.toThrow(
      "HTTP 400: Bad Request\nInvalid data"
    )
  })

  it("should call throwError and not include error if not present in JSON", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: {
        get: (name: string) => (name === "content-type" ? "application/json" : null)
      },
      json: vi.fn().mockResolvedValue({ message: "No error property" }),
    } as any);

    await expect(httpPost("/test", { foo: "bar" })).rejects.toThrow(
      "HTTP 401: Unauthorized"
    );
  });

  it('should fall back to HTTP error message when parsing error occurs', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      headers: {
        get: (name: string) => (name === "content-type" ? "application/json" : null),
      },
      json: vi.fn().mockRejectedValue(new Error("Parse error")),
    } as any)

    await expect(httpPost("/test", { foo: "bar" })).rejects.toThrow(
      "HTTP 403: Forbidden"
    )
  })

  it('should include plain text error when content-type is not application/json', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      headers: {
        get: (name: string) => (name === "content-type" ? "text/plain" : null),
      },
      text: vi.fn().mockResolvedValue("Resource not found"),
    } as any)

    await expect(httpPost("/test", { foo: "bar" })).rejects.toThrow(
      "HTTP 404: Not Found\nResource not found"
    )
  })

  it('should handle no content-type and no body gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 405,
      statusText: "Method Not Allowed",
      headers: {
        get: () => null,
      },
      text: vi.fn().mockResolvedValue(""),
    } as any)

    await expect(httpPost("/test", { foo: "bar" })).rejects.toThrow(
      "HTTP 405: Method Not Allowed"
    )
  })

  it("should call throwError and include plain text response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      headers: {
        get: (name: string) => (name === "content-type" ? "text/plain" : null),
      },
      text: vi.fn().mockResolvedValue("Server crashed"),
    } as any)

    await expect(httpPost("/test", { foo: "bar" })).rejects.toThrow(
      "HTTP 500: Internal Server Error\nServer crashed"
    )
  })
})
