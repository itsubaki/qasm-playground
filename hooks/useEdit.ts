import { useEffect } from "react"
import { type Snippet, httpPost } from "@/lib/http"
import { examples } from "@/lib/examples"

export function useEdit(
    setCode: (code: string) => void,
) {
    useEffect(() => {
        const edit = async () => {
            const path = window.location.pathname
            const match = path.match(/^\/p\/([a-zA-Z0-9_-]+)$/)

            if (!match) {
                setCode(examples[0].code)
                return
            }

            try {
                const id = match[1]
                const snippet = await httpPost<Snippet>("/api/edit", { id })
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
