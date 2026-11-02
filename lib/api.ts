import { NextResponse, type NextRequest } from "next/server"
import { ipAddress } from "@vercel/functions"

export async function edit(request: NextRequest) {
    return call(request, API.Edit);
}

export async function share(request: NextRequest) {
    return call(request, API.Share);
}

export async function simulate(request: NextRequest) {
    return call(request, API.Simulate);
}

export async function validate(request: NextRequest) {
    return call(request, API.Validate);
}

const API = {
    Edit: { path: "Edit", key: "id" } as const,
    Share: { path: "Share", key: "code" } as const,
    Simulate: { path: "Simulate", key: "code" } as const,
    Validate: { path: "Validate", key: "code" } as const,
};

async function call(
    request: NextRequest,
    options: typeof API[keyof typeof API],
) {
    const SERVICE_URL = process.env.GOOGLE_CLOUD_SERVICE_URL
    if (!SERVICE_URL) {
        return NextResponse.json(
            { error: "GOOGLE_CLOUD_SERVICE_URL is not set" },
            { status: 500 },
        )
    }

    const { path, key } = options;
    try {
        const body = await request.json()
        const value = body?.[key]
        if (!value) {
            return NextResponse.json(
                { error: `${key} is required` },
                { status: 400 },
            )
        }

        // headers
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        }

        const ip = ipAddress(request)
        const userAgent = request.headers.get("user-agent")
        if (ip) headers["X-Quasar-Client-IP"] = ip
        if (userAgent) headers["User-Agent"] = userAgent

        // request
        const resp = await fetch(`${SERVICE_URL}/quasar.v1.QuasarService/${path}`, {
            method: "POST",
            headers,
            body: JSON.stringify({ [key]: value }),
        })

        if (resp.ok) {
            return NextResponse.json(await resp.json())
        }

        switch (resp.status) {
            case 503:
                return NextResponse.json(
                    { error: "Service Unavailable" },
                    { status: 503 },
                )
            case 400:
                return NextResponse.json(
                    { error: await resp.text() },
                    { status: 400 },
                )
            default:
                return NextResponse.json(
                    { error: await resp.text() },
                    { status: 500 },
                )
        }
    } catch (err) {
        console.error(`${path}:`, err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Internal server error" },
            { status: 500 },
        )
    }
}
