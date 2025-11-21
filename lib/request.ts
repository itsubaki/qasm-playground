import { NextResponse, type NextRequest } from "next/server"
import { throwError } from "@/lib/error"

const SERVICE_URL = process.env.GOOGLE_CLOUD_SERVICE_URL

export enum Path {
    Edit = "Edit",
    Share = "Share",
    Simulate = "Simulate",
}

export enum Key {
    Id = "id",
    Code = "code",
}

export async function request(
    request: NextRequest,
    path: Path,
    key: Key,
) {
    if (!SERVICE_URL) {
        return NextResponse.json(
            { error: "GOOGLE_CLOUD_SERVICE_URL is not set" },
            { status: 500 },
        )
    }

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

export async function post(url: string, body: object) {
    const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })

    if (!resp.ok) {
        await throwError(resp)
    }

    return resp
}
