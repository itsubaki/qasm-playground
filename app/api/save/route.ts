import { type NextRequest, NextResponse } from "next/server"

const SERVICE_URL = process.env.GOOGLE_CLOUD_SERVICE_URL

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "code is required" }, { status: 400 })
    }

    if (!SERVICE_URL) {
      return NextResponse.json(
        { error: "Configuration missing. Please set GOOGLE_CLOUD_SERVICE_URL environment variables." },
        { status: 500 },
      )
    }

    const response = await fetch(`${SERVICE_URL}/quasar.v1.QuasarService/Save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] External service error:", errorText)
      return NextResponse.json({ error: "Failed to save code" }, { status: response.status })
    }

    const result = await response.json()
    console.log("[v0] Save successful:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Save API error:", error)
    return NextResponse.json({ error: "Failed to save code" }, { status: 500 })
  }
}
