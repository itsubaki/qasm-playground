import { type NextRequest, NextResponse } from "next/server"

const SERVICE_URL = process.env.GOOGLE_CLOUD_SERVICE_URL

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    if (!SERVICE_URL) {
      return NextResponse.json({ error: "Service URL not configured" }, { status: 500 })
    }

    // Call the external quasar service
    const response = await fetch(`${SERVICE_URL}/quasar.v1.QuasarService/Save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("External service error:", errorText)
      return NextResponse.json({ error: "Failed to save code to external service" }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Save API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
