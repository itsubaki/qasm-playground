import { type NextRequest, NextResponse } from "next/server"
const SERVICE_URL = process.env.GOOGLE_CLOUD_SERVICE_URL

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    if (!code) {
      return NextResponse.json(
        { error: "code is required" },
        { status: 400 },
      )
    }

    // endpoint
    if (!SERVICE_URL) {
      return NextResponse.json(
        { error: "Configuration missing. Please set GOOGLE_CLOUD_SERVICE_URL environment variables." },
        { status: 500 },
      )
    }

    // simulate
    const resp = await fetch(`${SERVICE_URL}/quasar.v1.QuasarService/Simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })

    if (resp.ok) {
      const result = await resp.json()
      return NextResponse.json(result)
    }

    const text = await resp.text()
    console.error(text)

    if (resp.status === 400) {
      return NextResponse.json(
        { error: text },
        { status: 400 },
      )
    }

    if (resp.status === 503) {
      return NextResponse.json(
        { error: "Service Unavailable" },
        { status: 503 },
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  } catch (err) {
    console.error("Simulate:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    )
  }
}
