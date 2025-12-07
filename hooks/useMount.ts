import { useState, useEffect } from "react"

export const useMount = () => {
    const [isMounted, setMounted] = useState(false);

    // wait until mounted to avoid hydration mismatch
    useEffect(() => {
        // avoid calling setState synchronously within an effect, as it can trigger cascading renders
        const timeout = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timeout);
    }, [])

    return {
        isMounted,
    }
}
