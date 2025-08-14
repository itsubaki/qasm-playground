import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const SERVICE_URL = process.env.GOOGLE_CLOUD_SERVICE_URL

    if (!SERVICE_URL) {
      return NextResponse.json(
        {
          error:
            "Google Cloud configuration missing. Please set GOOGLE_CLOUD_SERVICE_URL environment variables.",
        },
        { status: 500 },
      )
    }

    const endpoint = SERVICE_URL.endsWith("/")
      ? `${SERVICE_URL}quasar.v1.QuasarService/Simulate`
      : `${SERVICE_URL}/quasar.v1.QuasarService/Simulate`

    console.log("Calling endpoint:", endpoint)
    console.log("Request payload:", { code })

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Google Cloud Run error:", errorText)
      throw new Error(`Google Cloud Run service error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("Success result:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Simulation error:", error)

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          error:
            "Failed to connect to Google Cloud Run service. Please check your service URL and network connectivity.",
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
