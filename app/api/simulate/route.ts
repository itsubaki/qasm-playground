import { type NextRequest, NextResponse } from "next/server"
import { GoogleAuth } from "google-auth-library"

const SERVICE_URL = process.env.GOOGLE_CLOUD_SERVICE_URL
if (!SERVICE_URL) {
  throw new Error("Missing GOOGLE_CLOUD_SERVICE_URL environment variable.")
}

const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON
if (!credentialsJson) {
  throw new Error("Missing GOOGLE_CREDENTIALS_JSON environment variable.")
}

const credentials = JSON.parse(
  Buffer.from(credentialsJson, "base64").toString("utf-8")
)

const auth = new GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
})

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    if (!code) {
      return NextResponse.json({ error: "code is required" }, { status: 400 })
    }

    const endpoint = `${SERVICE_URL}/quasar.v1.QuasarService/Simulate`
    const client = await auth.getClient()
    const token = await client.getAccessToken()

    console.log("Calling endpoint:", endpoint)
    console.log("Request payload:", { code })

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.token}`,
      },
      body: JSON.stringify({ code }),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(errorText)
      throw new Error(errorText)
    }

    const result = await response.json()
    console.log("Success result:", result)
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
