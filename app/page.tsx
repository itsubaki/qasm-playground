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
import { useEdit } from "@/hooks/useEdit"
import { type States } from "@/lib/http"
import { smooth } from "@/lib/utils"
import { copyToClipboard } from "@/lib/clipboard"

export default function Playground({
  snippetId,
}: {
  snippetId?: string,
}) {
  const [code, setCode] = useState("// Loading...")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<States | null>(null)
  const [mounted, setMounted] = useState(false);

  // custom hooks
  const { sharedURL, share } = useShareURL()
  const { isLoading, simulate } = useSimulator({ setError, setResult })

  // set shared code or example code
  useEdit({ snippetId, setCode });

  // wait for mounted to avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return null;
  }

  return (
    <div className={`p-4 min-h-screen ${smooth} dark:bg-gray-900 bg-blue-50`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Header />
        </div>

        {/* Main */}
        <div className="flex flex-col lg:flex-row gap-3 lg:h-[80vh]">
          {/* Code Editor */}
          <Card className={`lg:w-[70%] flex flex-col backdrop-blur-sm ${smooth} dark:bg-gray-800/50 dark:border-gray-700 bg-white/90 border-gray-200`}>
            <CardContent className="p-3 flex flex-col h-full">
              {/* Toolbar */}
              <div className="mb-3 flex justify-end items-center gap-3">
                <Button
                  onClick={() => simulate(code)}
                  disabled={isLoading}
                  className={`text-white ${smooth} dark:bg-blue-500 dark:hover:bg-blue-600 bg-blue-600 hover:bg-blue-700`}
                >
                  Run
                </Button>

                <Button
                  onClick={() => share(code)}
                  variant="outline"
                  className={`${smooth} dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:bg-gray-900 order-gray-300 text-gray-700 hover:bg-white-50 bg-white`}
                >
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
          <Card className={`lg:w-[30%] flex flex-col backdrop-blur-sm ${smooth} dark:bg-gray-800/50 dark:border-gray-700 bg-white/90 border-gray-200`}>
            <CardContent className="p-3 flex flex-col h-full">
              <div className="mb-3 flex justify-between items-center gap-3">
                <div className={`py-1 text-lg font-semibold ${smooth} dark:text-white ext-gray-900`}>
                  Quantum States
                </div>

                {result && (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    className={`text-white ${smooth} dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:bg-gray-900 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"}`}
                  >
                    Copy JSON
                  </Button>
                )}

                {error && (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(error)}
                    className={`text-white ${smooth} dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/30 dark:bg-red-900/20 text-red-700 border-red-300 hover:bg-red-100 bg-red-50`}
                  >
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
                <div className={`p-3 border rounded-lg ${smooth} dark:bg-red-900/20 dark:border-red-800 bg-red-50 border-red-200`}>
                  <div className={`pb-3 font-semibold ${smooth} dark:text-red-300 text-red-800`}>
                    Error Details
                  </div>

                  <pre className={`p-3 text-sm whitespace-pre-wrap font-mono rounded border overflow-auto w-full break-all ${smooth} dark:text-red-300 dark:bg-red-900/30 dark:border-red-800 text-red-700 bg-red-100 border-red-200`}>
                    {error}
                  </pre>
                </div>
              )}

              {isLoading && (
                <div className={`py-12 text-center ${smooth} dark:text-gray-400 text-gray-500`}>
                  <p>Waiting for remote server...</p>
                </div>
              )}

              {!result && !error && !isLoading && (
                <div className={`py-12 text-center ${smooth} dark:text-gray-400 text-gray-500`}>
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
