import { NextResponse, type NextRequest } from "next/server"

export async function edit(request: NextRequest) {
    return apiCall(request, API.Edit);
}

export async function share(request: NextRequest) {
    return apiCall(request, API.Share);
}

export async function simulate(request: NextRequest) {
    return apiCall(request, API.Simulate);
}

const API = {
    Edit: { path: "Edit", key: "id" } as const,
    Share: { path: "Share", key: "code" } as const,
    Simulate: { path: "Simulate", key: "code" } as const,
};

async function apiCall(
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

        const resp = await fetch(`${SERVICE_URL}/quasar.v1.QuasarService/${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [key]: value }),
        })
        if (resp.ok) {
            return NextResponse.json(await resp.json())
        }

        const text = await resp.text()
        console.error(`${path} error:`, text)

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
        console.error(`${path}:`, err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Internal server error" },
            { status: 500 },
        )
    }
}
