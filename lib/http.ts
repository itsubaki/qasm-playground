export interface State {
    amplitude: {
        real: number
        imag: number
    }
    probability: number
    int: number[]
    binaryString: string[]
}

export interface States {
    states: State[]
}

export interface Snippet {
    id: string
    code: string
    createdAt: string
}

export async function post<T>(url: string, body: object) {
    const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })

    if (!resp.ok) {
        await throwError(resp)
    }

    return resp.json() as Promise<T>
}

export async function throwError(resp: Response) {
    let message = `HTTP ${resp.status}: ${resp.statusText}`;
    const contentType = resp.headers.get("content-type");

    try {
        if (contentType?.includes("application/json")) {
            const data = await resp.json();
            if (data.error) {
                message += `\n${data.error}`;
            }
        } else {
            const text = await resp.text();
            if (text) {
                message += `\n${text}`;
            }
        }
    } catch (err) {
        // Silently ignore parsing errors and fall back to basic HTTP error message
    }

    throw new Error(message);
}
