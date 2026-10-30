import { useState } from "react"
import { type Snippet, httpPost } from "@/lib/http"
import { copyToClipboard } from "@/lib/clipboard"

export const useShareURL = () => {
    const [sharedURL, setSharedURL] = useState<string | null>(null)
    const [isSharing, setIsSharing] = useState(false)
    const [sharedCode, setSharedCode] = useState<string | null>(null)
    const [shareError, setShareError] = useState<string | null>(null)

    const share = async (code: string) => {
        if (!code.trim()) return

        setIsSharing(true)
        setShareError(null)

        try {
            const snippet = await httpPost<Snippet>("/api/share", { code })
            if (!snippet.id) {
                throw new Error("The server did not return a share link. Please try again.")
            }

            const url = `${window.location.origin}/p/${snippet.id}`
            setSharedURL(url)
            setSharedCode(code)

            await copyToClipboard(url)
            return url
        } catch (err) {
            console.error("Share code:", err)
            setShareError(err instanceof Error ? err.message : "Could not create a share link. Please try again.")
        } finally {
            setIsSharing(false)
        }
    }

    return {
        share,
        sharedURL,
        isSharing,
        sharedCode,
        shareError,
    }
}
