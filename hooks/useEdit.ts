import { useEffect } from "react"
import { type Snippet, httpPost } from "@/lib/http"
import { examples } from "@/lib/examples"

export function useEdit(
    snippetId: string | undefined,
    setCode: (code: string) => void,
) {
    useEffect(() => {
        const edit = async () => {
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

        edit()
    }, [setCode])
}
