"use client"

import { useState, useEffect, useRef } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { Copy, LoaderCircle, Play, Share2, Table2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Editor } from "@/components/editor"
import { Result } from "@/components/result"
import { Header } from "@/components/header"
import { Examples } from "@/components/examples"
import { Notes } from "@/components/notes"
import { SharedURL } from "@/components/sharedURL"
import { StateExplorer, StateSort, type SortMode } from "@/components/stateExplorer"
import { useSimulate } from "@/hooks/useSimulate"
import { useShareURL } from "@/hooks/useShareURL"
import { useMount } from "@/hooks/useMount"
import { copyToClipboard } from "@/lib/clipboard"
import { simulationError } from "@/lib/simulationError"
import { edit } from "@/lib/edit"

const panel = "flex min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50"
const muted = "text-sm text-gray-600 dark:text-gray-400"
const modal = "fixed left-1/2 top-1/2 z-50 flex w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-gray-900 dark:text-white"

export default function Playground({ snippetId }: { snippetId?: string }) {
    const [code, setCode] = useState("")
    const [baseline, setBaseline] = useState("")
    const [isCodeReady, setIsCodeReady] = useState(false)
    const [pendingCode, setPendingCode] = useState<string | null>(null)
    const [sortMode, setSortMode] = useState<SortMode>("index")
    const [isResultTableOpen, setIsResultTableOpen] = useState(false)
    const [isExampleOpen, setIsExampleOpen] = useState(false)
    const exampleTrigger = useRef<HTMLDivElement>(null)
    const { isMounted } = useMount()
    const { sharedURL, share, isSharing, sharedCode, shareError } = useShareURL()
    const { isLoading, result, error, simulate, submittedCode } = useSimulate()

    useEffect(() => {
        let active = true
        edit(snippetId, (loaded) => {
            if (!active) return
            setCode(loaded)
            setBaseline(loaded)
            setIsCodeReady(true)
        })
        return () => { active = false }
    }, [snippetId])

    const dirty = code !== baseline
    const stale = submittedCode != null && code !== submittedCode
    const staleShare = sharedCode != null && code !== sharedCode
    const errorInfo = error ? simulationError(error) : null
    const errorLine = !stale && errorInfo?.line && errorInfo.line <= code.split("\n").length ? errorInfo.line : undefined

    function loadExample(next: string) {
        if (next === code) return
        if (dirty) { setPendingCode(next); return }
        replaceCode(next)
    }

    function replaceCode(next: string) {
        setCode(next)
        setBaseline(next)
        setPendingCode(null)
    }

    function jumpToError() {
        const editor = document.getElementById("code-editor") as HTMLTextAreaElement | null
        if (!editor || !errorLine) return
        const start = code.split("\n").slice(0, errorLine - 1).reduce((offset, line) => offset + line.length + 1, 0)
        editor.focus()
        editor.setSelectionRange(start, start + (code.split("\n")[errorLine - 1]?.length ?? 0))
        editor.scrollTop = (errorLine - 1) * parseFloat(getComputedStyle(editor).lineHeight)
        editor.dispatchEvent(new Event("scroll"))
    }

    if (!isMounted) return null

    // Overlay contents are portalled outside this element, so they remain interactive.
    return <div inert={isResultTableOpen || pendingCode !== null || isExampleOpen}
        className="min-h-screen bg-blue-50 p-3 text-gray-900 sm:p-4 dark:bg-gray-900 dark:text-white">
        <div className="mx-auto max-w-7xl">
            <Header />

            <div className="mt-3 grid min-w-0 gap-3 md:h-[80vh] md:min-h-[28rem] md:grid-cols-[minmax(0,13fr)_minmax(0,7fr)]">
                <section className={panel} aria-labelledby="editor-title">
                    <h1 id="editor-title" className="sr-only">Circuit</h1>
                    <div className="flex items-center gap-2 p-2">
                        <div ref={exampleTrigger} className="min-w-0 flex-1">
                            <Examples code={code} setCode={loadExample} disabled={!isCodeReady} onContentMountChange={setIsExampleOpen} />
                        </div>
                        <span className="sr-only">{dirty ? "Edited code" : "Example circuit"}</span>
                        <Button onClick={() => simulate(code)} disabled={isLoading || !isCodeReady || !code.trim()} aria-busy={isLoading}
                            aria-describedby="simulation-status"
                            title={stale ? "Unrun changes — run to update results" : "Run current code"}
                            className="h-9 bg-blue-600 px-5 text-white hover:bg-blue-700">
                            {isLoading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Play aria-hidden="true" />}Run
                        </Button>
                        <Button onClick={() => share(code)} disabled={isSharing || !isCodeReady || !code.trim()} aria-busy={isSharing} variant="outline" className="h-9">
                            {isSharing ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Share2 aria-hidden="true" />}Share
                        </Button>
                    </div>

                    {sharedURL && <div className="mx-2 mb-2 space-y-1">
                        <p className={muted} role="status">{staleShare ? "This link contains an earlier version. Share again to include your changes." : "Share link matches the current code."}</p>
                        <div className="flex min-w-0 gap-2"><SharedURL sharedURL={sharedURL} /><Button variant="outline" className="h-9" aria-label="Copy share link" onClick={() => copyToClipboard(sharedURL)}><Copy aria-hidden="true" /></Button></div>
                    </div>}
                    {shareError && <p role="alert" className="mx-2 mb-2 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">Could not create a share link. {shareError}</p>}

                    {errorInfo && <div className="mx-2 mb-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200" role="alert">
                        <p className="font-semibold">{errorInfo.title}</p>
                        <p className="mt-1">{stale ? "These details refer to the previous run. Run your edited code to check it." : errorInfo.hint}</p>
                        {errorLine && <Button variant="outline" className="mt-2 h-9" onClick={jumpToError}>Go to line {errorLine}</Button>}
                        <details className="mt-2"><summary className="cursor-pointer py-2">Server details</summary><pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words py-2 font-mono">{error}</pre><Button variant="outline" className="h-9" onClick={() => copyToClipboard(error!)}>Copy error</Button></details>
                    </div>}
                    <div className="flex min-h-0 flex-1 flex-col px-2"><Editor code={code} setCode={setCode} errorLine={errorLine} /></div>
                    <div id="editor-help" className={muted + " flex flex-wrap justify-between gap-2 px-2 py-1.5 text-xs"}>
                        <span>Tab: indent · Esc: leave editor</span><span>{code.split("\n").length} lines · OpenQASM</span>
                        {isCodeReady && !code.trim() && <span className="w-full">Enter code or choose an example to run or share.</span>}
                    </div>
                </section>

                <Dialog.Root open={isResultTableOpen} onOpenChange={setIsResultTableOpen}>
                <section className={panel} aria-labelledby="results-title">
                    <div className="flex items-center justify-end gap-2 px-2 pt-2 pb-6 sm:pb-2 dark:border-gray-700">
                        <div className="mr-auto flex h-9 shrink-0 items-end">
                            <div className="relative flex items-baseline gap-2">
                            <h2 id="results-title" className="whitespace-nowrap text-lg font-semibold">Quantum States</h2>
                            <span aria-hidden="true" className="absolute top-full left-0 w-20 shrink-0 whitespace-nowrap text-[11px] font-medium text-amber-800 sm:static dark:text-amber-300">{stale ? "Unrun changes" : null}</span>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                            {result && <Dialog.Trigger asChild><Button variant="ghost" className="h-9 px-2 has-[>svg]:px-2" aria-label="View all states in a table"><Table2 aria-hidden="true" />Table</Button></Dialog.Trigger>}
                            <Button variant="ghost" className="h-9 w-9 px-0" title="Copy" disabled={!result && !error} aria-label={error ? "Copy error" : "Copy results"} onClick={() => copyToClipboard(error ?? JSON.stringify(result, null, 2))}><Copy aria-hidden="true" /></Button>
                        </div>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col gap-2 px-2 pb-2">
                        <div id="simulation-status" role="status" aria-live="polite" className={stale || (!isLoading && !error) ? "sr-only" : undefined}>
                            {stale ? <p>{isLoading ? "Running an earlier version. Run again when it finishes to include your changes." : "Previous run shown. Run again to update the results."}</p>
                                : isLoading ? <p className={muted + " flex items-center gap-2"}><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />Waiting for remote server...</p>
                                : result ? <p className="sr-only">Results match the current code</p>
                                : error ? <p className="text-sm text-red-700 dark:text-red-300">Run failed. Review the details beside the editor.</p> : null}
                        </div>
                        {result && <>
                            <div className="flex flex-wrap items-center justify-between gap-2"><p className={muted + " text-xs"}>{result.states.length} states</p><StateSort value={sortMode} onChange={setSortMode} /></div>
                                <Dialog.Portal>
                                    <Dialog.Overlay className="fixed inset-0 z-50 bg-gray-950/60 backdrop-blur-sm" />
                                    <Dialog.Content className={modal + " h-[90dvh] max-w-6xl"}>
                                        <div className="flex items-center justify-between gap-3"><Dialog.Title className="text-xl font-semibold">Quantum States</Dialog.Title><Dialog.Close asChild><Button variant="outline" className="h-9">Close</Button></Dialog.Close></div>
                                        <Dialog.Description className={muted}>Probabilities range from 0 to 1. {stale ? "Previous run: the code has unrun changes." : "Results for the current code."}</Dialog.Description>
                                        <StateExplorer result={result} sortMode={sortMode} setSortMode={setSortMode} />
                                    </Dialog.Content>
                                </Dialog.Portal>
                            <div className="min-h-0 space-y-2 overflow-y-auto"><Result result={result} sortMode={sortMode} /></div>
                            {result.states.length === 0 && <p className={muted}>The simulator returned no states. Review your circuit and run again.</p>}
                        </>}
                        {!result && !error && !isLoading && <p className={muted + " py-8 text-center text-xs"}>Run your OpenQASM code to see quantum states here</p>}
                    </div>
                </section>
                </Dialog.Root>
            </div>
            <div className="mt-2 py-2"><Notes /></div>

            <AlertDialog.Root open={pendingCode !== null} onOpenChange={(open) => { if (!open) setPendingCode(null) }}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 z-50 bg-gray-950/60" />
                    <AlertDialog.Content className={modal + " max-w-md"} onCloseAutoFocus={(event) => { event.preventDefault(); exampleTrigger.current?.querySelector<HTMLButtonElement>("button")?.focus() }}>
                        <AlertDialog.Title className="text-lg font-semibold">Replace your edited code?</AlertDialog.Title>
                        <AlertDialog.Description className={muted}>Loading this example will replace your changes. Keep editing to preserve your current code.</AlertDialog.Description>
                        <div className="flex flex-wrap justify-end gap-2"><AlertDialog.Cancel asChild><Button variant="outline" className="h-9">Keep editing</Button></AlertDialog.Cancel><AlertDialog.Action asChild><Button className="h-9 bg-blue-600 text-white hover:bg-blue-700" onClick={() => { if (pendingCode !== null) replaceCode(pendingCode) }}>Load example</Button></AlertDialog.Action></div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </div>
    </div>
}
