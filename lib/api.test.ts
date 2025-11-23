import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { request, Path, Key } from "./api"

describe("request", () => {
    beforeEach(() => {
        // Mock fetch
        global.fetch = vi.fn()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        // Mock console.error to suppress stack traces
        vi.spyOn(console, "error").mockImplementation(() => { })
    })

    it("returns error when required key is missing", async () => {
        const req = new NextRequest("http://localhost:3000/api/simulate", {
            method: "POST",
            body: JSON.stringify({}),
        })

        const response = await request(req, Path.Simulate, Key.Code)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data).toEqual({ error: "code is required" })
    })

    it("successfully forwards request and returns response", async () => {
        const mockResult = { states: [] }
        vi.mocked(global.fetch).mockResolvedValueOnce(
            new Response(JSON.stringify(mockResult), {
                status: 200,
                headers: { "content-type": "application/json" },
            })
        )

        const req = new NextRequest("http://localhost:3000/api/simulate", {
            method: "POST",
            body: JSON.stringify({ code: "test code" }),
        })

        const response = await request(req, Path.Simulate, Key.Code)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockResult)
        expect(global.fetch).toHaveBeenCalledWith(
            "https://example.com/quasar.v1.QuasarService/Simulate",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: "test code" }),
            }
        )
    })

    it("handles 400 error from service", async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce(
            new Response("Invalid request", {
                status: 400,
            })
        )

        const req = new NextRequest("http://localhost:3000/api/edit", {
            method: "POST",
            body: JSON.stringify({ id: "test-id" }),
        })

        const response = await request(req, Path.Edit, Key.Id)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data).toEqual({ error: "Invalid request" })
    })

    it("handles 503 error from service", async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce(
            new Response("", {
                status: 503,
            })
        )

        const req = new NextRequest("http://localhost:3000/api/share", {
            method: "POST",
            body: JSON.stringify({ code: "test code" }),
        })

        const response = await request(req, Path.Share, Key.Code)
        const data = await response.json()

        expect(response.status).toBe(503)
        expect(data).toEqual({ error: "Service Unavailable" })
    })

    it("handles other HTTP errors as internal server error", async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce(
            new Response("", {
                status: 404,
            })
        )

        const req = new NextRequest("http://localhost:3000/api/simulate", {
            method: "POST",
            body: JSON.stringify({ code: "test code" }),
        })

        const response = await request(req, Path.Simulate, Key.Code)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data).toEqual({ error: "Internal server error" })
    })

    it("handles network errors", async () => {
        vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network failure"))

        const req = new NextRequest("http://localhost:3000/api/simulate", {
            method: "POST",
            body: JSON.stringify({ code: "test code" }),
        })

        const response = await request(req, Path.Simulate, Key.Code)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data).toEqual({ error: "Network failure" })
    })

    it("handles non-Error exceptions", async () => {
        vi.mocked(global.fetch).mockRejectedValueOnce("String error")

        const req = new NextRequest("http://localhost:3000/api/simulate", {
            method: "POST",
            body: JSON.stringify({ code: "test code" }),
        })

        const response = await request(req, Path.Simulate, Key.Code)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data).toEqual({ error: "Internal server error" })
    })

    it("handles Edit path with Id key", async () => {
        const mockResult = { code: "result code" }
        vi.mocked(global.fetch).mockResolvedValueOnce(
            new Response(JSON.stringify(mockResult), {
                status: 200,
                headers: { "content-type": "application/json" },
            })
        )

        const req = new NextRequest("http://localhost:3000/api/edit", {
            method: "POST",
            body: JSON.stringify({ id: "abc123" }),
        })

        const response = await request(req, Path.Edit, Key.Id)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockResult)
        expect(global.fetch).toHaveBeenCalledWith(
            "https://example.com/quasar.v1.QuasarService/Edit",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: "abc123" }),
            }
        )
    })

    it("handles Share path with Code key", async () => {
        const mockResult = { id: "xyz789" }
        vi.mocked(global.fetch).mockResolvedValueOnce(
            new Response(JSON.stringify(mockResult), {
                status: 200,
                headers: { "content-type": "application/json" },
            })
        )

        const req = new NextRequest("http://localhost:3000/api/share", {
            method: "POST",
            body: JSON.stringify({ code: "shared code" }),
        })

        const response = await request(req, Path.Share, Key.Code)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockResult)
        expect(global.fetch).toHaveBeenCalledWith(
            "https://example.com/quasar.v1.QuasarService/Share",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: "shared code" }),
            }
        )
    })

    it('should return 500 if SERVICE_URL is not set', async () => {
        delete process.env.GOOGLE_CLOUD_SERVICE_URL

        const req = {
            json: async () => ({ id: '123' }),
        } as unknown as NextRequest

        const res = await request(req, Path.Edit, Key.Id)
        const data = await res.json()

        expect(res.status).toBe(500)
        expect(data).toEqual({ error: 'GOOGLE_CLOUD_SERVICE_URL is not set' })
    })
})
