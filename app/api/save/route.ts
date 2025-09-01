import { type NextRequest, NextResponse } from "next/server"

const SERVICE_URL = process.env.GOOGLE_CLOUD_SERVICE_URL

const inMemoryStorage = new Map<string, string>()

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    console.log("[v0] Save request received with code length:", code?.length || 0)

    if (!code) {
      console.log("[v0] No code provided in request")
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    if (!SERVICE_URL) {
      console.log("[v0] Using fallback in-memory storage")
      const id = generateId()
      inMemoryStorage.set(id, code)
      console.log("[v0] Code saved with ID:", id)
      return NextResponse.json({ id })
    }

    console.log("[v0] Making request to external service:", `${SERVICE_URL}/quasar.v1.QuasarService/Save`)

    const response = await fetch(`${SERVICE_URL}/quasar.v1.QuasarService/Save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })

    console.log("[v0] External service response status:", response.status)
    console.log("[v0] External service response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] External service error response:", errorText)
      return NextResponse.json({ error: `External service error: ${response.status} - ${errorText}` }, { status: 500 })
    }

    const result = await response.json()
    console.log("[v0] Save successful, result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Save API error details:", error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
