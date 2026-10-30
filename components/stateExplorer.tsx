import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { ResultTable } from "@/components/resultTable"
import { Button } from "@/components/ui/button"
import type { States } from "@/lib/http"

export type SortMode = "index" | "prob_desc"
export const fieldClass = "h-9 min-w-0 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"

export function StateSort({ value, onChange, id = "state-sort" }: {
    value: SortMode, onChange: (mode: SortMode) => void, id?: string,
}) {
    return <div id={id} role="group" aria-label="State order"
        className="inline-flex max-w-full gap-0.5 rounded-md border border-gray-300 p-0.5 dark:border-gray-600">
        {([
            ["index", "Basis order"],
            ["prob_desc", "Highest probability"],
        ] as const).map(([mode, label]) => <Button key={mode} type="button" variant="ghost"
            aria-pressed={value === mode} onClick={() => onChange(mode)}
            className={"h-7 rounded-sm px-2 text-xs " + (value === mode
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/60 dark:text-blue-200 dark:hover:bg-blue-900/60"
                : "text-gray-600 dark:text-gray-400")}>
            {label}
        </Button>)}
    </div>
}

export function StateExplorer({ result, sortMode, setSortMode }: {
    result: States, sortMode: SortMode, setSortMode: (mode: SortMode) => void,
}) {
    const [query, setQuery] = useState("")
    const states = useMemo(() => {
        const matches = result.states.filter((state) =>
            state.binaryString.join("").includes(query.trim()))
        if (sortMode === "prob_desc") matches.sort((a, b) => b.probability - a.probability)
        return matches
    }, [result, query, sortMode])

    return <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
            <label className="relative min-w-0 flex-1 basis-48">
                <Search className="absolute left-3 top-2.5 size-4 text-gray-500" aria-hidden="true" />
                <span className="sr-only">Search basis states</span>
                <input className={fieldClass + " w-full pl-9"} placeholder="Search bits, e.g. 001" value={query}
                    onChange={(event) => setQuery(event.target.value)} />
            </label>
            <StateSort id="dialog-state-sort" value={sortMode} onChange={setSortMode} />
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
            {states.length > 0 ? <ResultTable result={{ states }} sortMode={sortMode} />
                : <p className="py-12 text-center text-gray-500 dark:text-gray-400">No matching states. Change your search.</p>}
        </div>
        <p role="status" className="text-sm">{states.length} of {result.states.length} states</p>
    </div>
}
