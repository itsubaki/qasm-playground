export async function throwError(resp: Response) {
    let message = `HTTP ${resp.status}: ${resp.statusText}`;

    try {
        const data = await resp.json();
        if (data.error) {
            message += `\n${data.error}`;
        }
        throw new Error(message);
    } catch {
        // JSONでパースできなければ無視
    }

    try {
        const text = await resp.text();
        if (text) {
            message += `\n${text}`;
        }
        throw new Error(message);
    } catch {
        // テキストで取得できなければ無視
    }

    throw new Error(message);
}
