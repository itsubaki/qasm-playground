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
