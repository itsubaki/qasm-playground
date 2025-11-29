import { useEffect, useRef } from "react"
import { smooth, cn } from "@/lib/utils"

export function SharedURL({
    sharedURL,
}: {
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
                smooth,
                "dark:bg-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
                "bg-white border-gray-300 text-gray-900 hover:bg-gray-50",
            )}
        />
    )
}
