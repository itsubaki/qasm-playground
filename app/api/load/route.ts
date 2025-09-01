import { type NextRequest, NextResponse } from "next/server"

const SERVICE_URL = process.env.GOOGLE_CLOUD_SERVICE_URL

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    if (!SERVICE_URL) {
      console.error("[v0] GOOGLE_CLOUD_SERVICE_URL not configured")
      return NextResponse.json({ error: "Service URL not configured" }, { status: 500 })
    }

    const response = await fetch(`${SERVICE_URL}/quasar.v1.QuasarService/Load`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })

    console.log("[v0] External service response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] External service error:", errorText)
      return NextResponse.json({ error: "Failed to load code" }, { status: response.status })
    }

    const result = await response.json()
    console.log("[v0] Load successful:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Load API error:", error)
    return NextResponse.json({ error: "Failed to load code" }, { status: 500 })
  }
}
