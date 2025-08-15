import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    if (!code) {
      return NextResponse.json({ error: "code is required" }, { status: 400 })
    }

    const SERVICE_URL = process.env.GOOGLE_CLOUD_SERVICE_URL
    if (!SERVICE_URL) {
      return NextResponse.json(
        { error: "Configuration missing. Please set GOOGLE_CLOUD_SERVICE_URL environment variables." },
        { status: 500 },
      )
    }

    const endpoint = `${SERVICE_URL}/quasar.v1.QuasarService/Simulate`

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(errorText)
      throw new Error(errorText)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Simulation error:", error)

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { error: "Failed to connect to remote server. Please check your service URL and network connectivity." },
        { status: 503 },
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
