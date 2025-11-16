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
