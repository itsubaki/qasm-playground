"use client"

import { useState, useEffect } from "react"
import { LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Editor } from "@/components/editor"
import { Result } from "@/components/result"
import { ResultTable } from "@/components/resultTable"
import { Header } from '@/components/header';
import { Examples } from "@/components/examples"
import { Notes } from "@/components/notes"
import { SharedURL } from '@/components/sharedURL';
import { useSimulate } from "@/hooks/useSimulate"
import { useShareURL } from "@/hooks/useShareURL"
import { useMount } from "@/hooks/useMount"
import { useSort } from "@/hooks/useSort"
import { cn } from "@/lib/utils"
import { copyToClipboard } from "@/lib/clipboard"
import { edit } from "@/lib/edit"

export default function Playground({
  snippetId,
}: {
  snippetId?: string,
}) {
  const [code, setCode] = useState("// Loading...")
  const [isResultTableOpen, setIsResultTableOpen] = useState(false)
  const { isMounted } = useMount()
  const { sharedURL, share } = useShareURL()
  const { sortMode, sort } = useSort()
  const {
    isLoading,
    result,
    error,
    simulate,
  } = useSimulate()

  // set shared code or example code
  useEffect(() => {
    edit(snippetId, setCode)
  }, [snippetId, setCode])

  if (!isMounted) {
    return null
  }

  return (
    <div className={cn(
      "p-4 min-h-screen",
      "bg-blue-50",
      "dark:bg-gray-900",
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Header />
        </div>

        {/* Main */}
        <div className={cn(
          "lg:flex-row lg:h-[80vh]",
          "flex flex-col gap-3",
        )}>
          {/* Code Editor */}
          <Card className={cn(
            "lg:w-[70%]",
            "flex flex-col backdrop-blur-sm",
            "dark:bg-gray-800/50 dark:border-gray-700",
            "bg-white/90 border-gray-200",
          )}>
            <CardContent className="p-3 flex flex-col h-full">
              {/* Toolbar */}
              <div className="mb-3 flex justify-end items-center gap-3">
                <Button
                  onClick={() => simulate(code)}
                  disabled={isLoading}
                  aria-busy={isLoading}
                  className={cn(
                    "relative",
                    "text-white",
                    "bg-blue-600 hover:bg-blue-700",
                    "dark:bg-blue-500 dark:hover:bg-blue-600",
                  )}>
                  {isLoading && (
                    <span
                      className="absolute inset-0 flex items-center justify-center"
                      aria-hidden="true">
                      <LoaderCircle className="animate-spin" />
                    </span>
                  )}
                  <span className={cn(isLoading && "opacity-0")}>Run</span>
                </Button>

                <Button
                  onClick={() => share(code)}
                  variant="outline"
                  className={cn(
                    "border-gray-300 text-gray-700 hover:bg-white-50 bg-white",
                    "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:bg-gray-900",
                  )}>
                  Share
                </Button>

                {sharedURL && (
                  <SharedURL sharedURL={sharedURL} />
                )}

                {!sharedURL && (
                  <Examples setCode={setCode} />
                )}
              </div>

              {/* Editor */}
              <Editor code={code} setCode={setCode} />
            </CardContent>
          </Card>

          {/* Results */}
          <Card className={cn(
            "lg:w-[30%]",
            "flex flex-col backdrop-blur-sm",
            "bg-white/90 border-gray-200",
            "dark:bg-gray-800/50 dark:border-gray-700",
          )}>
            <CardContent className="p-3 flex flex-col h-full">
              <div className="mb-3 flex justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => result && !error && setIsResultTableOpen(true)}
                  disabled={!result || !!error}
                  className={cn(
                    "py-1 text-left text-lg font-semibold transition-colors",
                    "text-gray-900 dark:text-white",
                    result && !error && "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400",
                    (!result || error) && "cursor-default",
                  )}>
                  Quantum States
                </button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => sort()}
                    className={cn(
                      "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white",
                      "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:bg-gray-900",
                    )}>
                    Sort
                  </Button>

                  {error && (
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(error)}
                      className={cn(
                        "text-red-700 border-red-300 hover:bg-red-100 bg-red-50",
                        "dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/30 dark:bg-red-900/20",
                      )}>
                      Copy
                    </Button>
                  )}

                  {!error && (
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                      className={cn(
                        "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white",
                        "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:bg-gray-900",
                      )}>
                      Copy
                    </Button>
                  )}
                </div>
              </div>

              {error && (
                <div className={`p-3 border rounded-lg bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800`}>
                  <div className={`pb-3 font-semibold text-red-800 dark:text-red-300`}>
                    Error Details
                  </div>

                  <pre className={cn(
                    "p-3 text-sm whitespace-pre-wrap font-mono rounded border overflow-auto w-full break-all",
                    "text-red-700 bg-red-100 border-red-200",
                    "dark:text-red-300 dark:bg-red-900/30 dark:border-red-800",
                  )}>
                    {error}
                  </pre>
                </div>
              )}

              {result && (
                <div className={`space-y-3 rounded-lg overflow-y-auto`}>
                  <Result result={result} sortMode={sortMode} />
                </div>
              )}

              {isLoading && (
                <div className={`py-12 text-center text-gray-500 dark:text-gray-400`}>
                  <p>Waiting for remote server...</p>
                </div>
              )}

              {!result && !error && !isLoading && (
                <div className={`py-12 text-center text-gray-500 dark:text-gray-400`}>
                  <p>Run your OpenQASM code to see quantum states here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="m-3">
          <Notes />
        </div>

        {isResultTableOpen && result && !error && (
          <div
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center",
              "bg-gray-950/60 p-4 backdrop-blur-sm",
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quantum-states-dialog-title"
            onClick={() => setIsResultTableOpen(false)}>
            <div
              className={cn(
                "flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border shadow-2xl",
                "border-gray-200 bg-white",
                "dark:border-gray-700 dark:bg-gray-900",
              )}
              onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <div>
                  <div id="quantum-states-dialog-title" className="text-xl font-semibold text-gray-900 dark:text-white">
                    Quantum States
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setIsResultTableOpen(false)}
                  className={cn(
                    "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white",
                    "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:bg-gray-900",
                  )}>
                  Close
                </Button>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <ResultTable result={result} sortMode={sortMode} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
