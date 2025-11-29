import { httpPost } from "@/lib/http"
import { examples } from "@/lib/examples"
import { type Snippet } from "@/lib/http"

export async function edit(
    snippetId: string | undefined,
    setCode: (code: string) => void
) {
    if (!snippetId) {
        setCode(examples[0].code)
        return
    }

    try {
        const snippet = await httpPost<Snippet>("/api/edit", { id: snippetId })
        if (!snippet.code) {
            console.error("Edit code:", snippet)
            return
        }

        setCode(snippet.code)
    } catch (err) {
        console.error("Edit code:", err)
    }
}
