import { useEffect, useRef } from "react"
import { transition, cn } from "@/lib/utils"

export function SharedURL({
    isDarkMode,
    sharedURL,
}: {
    isDarkMode: boolean,
    sharedURL: string,
}) {
    const sharedURLRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (sharedURL && sharedURLRef.current) {
            sharedURLRef.current.focus()
            sharedURLRef.current.select()
        }
    }, [sharedURL]);

    return (
        <input
            name="sharedURL"
            aria-label="Shared URL"
            type="text"
            ref={sharedURLRef}
            value={sharedURL}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            readOnly
            className={cn(
                "h-9 w-48 px-4 py-2",
                "text-sm",
                "rounded-md border outline-none",
                "focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/50",
                transition,
                isDarkMode
                    ? "bg-gray-900 border-gray-600 text-gray-300 hover:bg-gray-800"
                    : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
            )}
        />
    )
}
