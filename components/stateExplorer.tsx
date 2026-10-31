import { ResultTable } from "@/components/resultTable"
import { Button } from "@/components/ui/button"
import type { States } from "@/lib/http"

export type SortMode = "index" | "prob_desc"

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
    return <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-end gap-3">
            <StateSort id="dialog-state-sort" value={sortMode} onChange={setSortMode} />
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
            {result.states.length > 0 ? <ResultTable result={result} sortMode={sortMode} />
                : <p className="py-12 text-center text-gray-500 dark:text-gray-400">The simulator returned no states.</p>}
        </div>
    </div>
}
