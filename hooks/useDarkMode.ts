import { useEffect, useState } from "react"

export function useDarkMode() {
    const [isMounted, setIsMounted] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const mountedId = setTimeout(() => setIsMounted(true), 0);

        // Detect system dark mode preference
        const media = window.matchMedia("(prefers-color-scheme: dark)")
        const darkModeId = setTimeout(() => setIsDarkMode(media.matches), 0);

        // Listen for changes in system dark mode preference
        const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
        media.addEventListener("change", listener)

        // Cleanup listener on unmount
        return () => {
            media.removeEventListener("change", listener);
            clearTimeout(mountedId);
            clearTimeout(darkModeId);
        }
    }, [])

    return { isMounted, isDarkMode, setIsDarkMode }
}
