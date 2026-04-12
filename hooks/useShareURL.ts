import { useState } from "react"
import { type Snippet, httpPost } from "@/lib/http"
import { copyToClipboard } from "@/lib/clipboard"

export const useShareURL = () => {
    const [sharedURL, setSharedURL] = useState<string | null>(null)
    const [isSharing, setIsSharing] = useState(false)

    const share = async (code: string) => {
        if (!code.trim()) return

        setIsSharing(true)

        try {
            const snippet = await httpPost<Snippet>("/api/share", { code })
            if (!snippet.id) {
                console.error("Share: ", snippet)
                return
            }

            const url = `${window.location.origin}/p/${snippet.id}`
            window.history.pushState(null, "", `/p/${snippet.id}`)
            setSharedURL(url)

            await copyToClipboard(url)
            return url
        } catch (err) {
            console.error("Share code:", err)
            throw err
        } finally {
            setIsSharing(false)
        }
    }

    return {
        share,
        sharedURL,
        isSharing,
    }
}
