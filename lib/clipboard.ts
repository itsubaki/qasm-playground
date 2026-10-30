import { toast } from "react-hot-toast"

export const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
        toast.success("Copied")
    } catch (err) {
        console.error("Copy to clipboard:", err)
        toast.error("Could not copy. Select the text and copy it manually.")
    }
}
