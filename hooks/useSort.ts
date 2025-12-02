import { useState } from "react"

const modes = ["index", "prob_desc"] as const

export const useSort = () => {
    const [sortMode, setMode] = useState<typeof modes[number]>("index")

    const sort = () => {
        const currentIndex = modes.indexOf(sortMode)
        const next = modes[(currentIndex + 1) % modes.length]
        setMode(next)
    }

    return {
        sortMode,
        sort,
    }
}
