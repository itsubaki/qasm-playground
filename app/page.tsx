"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Editor } from "@/components/editor"
import { Result } from "@/components/result"
import { Header } from '@/components/header';
import { Examples } from "@/components/examples"
import { Notes } from "@/components/notes"
import { SharedURL } from '@/components/sharedURL';
import { useSimulator } from "@/hooks/useSimulator"
import { useShareURL } from "@/hooks/useShareURL"
import { type States } from "@/lib/http"
import { cn } from "@/lib/utils"
import { copyToClipboard } from "@/lib/clipboard"
import { edit } from "@/lib/edit"

export default function Playground({
  snippetId,
}: {
  snippetId?: string,
}) {
  const [code, setCode] = useState("// Loading...")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<States | null>(null)
  const [isMounted, setMounted] = useState(false);

  // custom hooks
  const { sharedURL, share } = useShareURL()
  const { isLoading, simulate } = useSimulator({ setError, setResult })

  // set shared code or example code
  useEffect(() => {
    edit(snippetId, setCode)
  }, [snippetId])

  // wait until mounted to avoid hydration mismatch
  useEffect(() => {
    // avoid calling setState synchronously within an effect, as it can trigger cascading renders
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, [])

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
                  className={cn(
                    "text-white",
                    "bg-blue-600 hover:bg-blue-700",
                    "dark:bg-blue-500 dark:hover:bg-blue-600",
                  )}>
                  Run
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
                  <Examples setCode={setCode} setResult={setResult} setError={setError} />
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
                <div className={`py-1 text-lg font-semibold text-gray-900 dark:text-white`}>
                  Quantum States
                </div>

                {result && (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    className={cn(
                      "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white",
                      "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:bg-gray-900",
                    )}>
                    Copy JSON
                  </Button>
                )}

                {error && (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(error)}
                    className={cn(
                      "text-red-700 border-red-300 hover:bg-red-100 bg-red-50",
                      "dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/30 dark:bg-red-900/20",
                    )}>
                    Copy Error
                  </Button>
                )}
              </div>

              {result && (
                <div className={`space-y-3 rounded-lg overflow-y-auto`}>
                  <Result result={result} />
                </div>
              )}

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

              {isLoading && (
                <div className={`py-12 text-center dark:text-gray-400 text-gray-500`}>
                  <p>Waiting for remote server...</p>
                </div>
              )}

              {!result && !error && !isLoading && (
                <div className={`py-12 text-center dark:text-gray-400 text-gray-500`}>
                  <p>Run your OpenQASM code to see quantum states here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="m-3">
          <Notes />
        </div>
      </div>
    </div>
  )
}
