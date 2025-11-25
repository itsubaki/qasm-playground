"use client"

import { useState } from "react"
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
import { useDarkMode } from "@/hooks/useDarkMode"
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

  // custom hooks
  const { sharedURL, share } = useShareURL()
  const { isLoading, simulate } = useSimulator({ setError, setResult })
  const { isMounted, isDarkMode, setIsDarkMode } = useDarkMode()

  // load shared code or example code
  useEdit(snippetId, setCode);

  if (!isMounted) return null;

  return (
    <div className={`p-4 min-h-screen ${smooth} ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </div>

        {/* Main */}
        <div className="flex flex-col lg:flex-row gap-3 h-screen lg:h-[80vh]">
          {/* Code Editor */}
          <Card className={`lg:w-[70%] border flex flex-col rounded-l-lg shadow-lg backdrop-blur-sm ${smooth} ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/90 border-gray-200"}`}>
            <CardContent className="p-3 flex flex-col h-full">
              {/* Toolbar */}
              <div className="mb-3 flex justify-end items-center gap-3">
                <Button
                  onClick={() => simulate(code)}
                  disabled={isLoading}
                  className={`text-white ${smooth} ${isDarkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  Run
                </Button>

                <Button
                  onClick={() => share(code)}
                  variant="outline"
                  className={`${smooth} ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-white-50 bg-white"}`}
                >
                  Share
                </Button>

                {sharedURL && (
                  <SharedURL isDarkMode={isDarkMode} sharedURL={sharedURL} />
                )}

                {!sharedURL && (
                  <Examples isDarkMode={isDarkMode} setCode={setCode} setResult={setResult} setError={setError} />
                )}
              </div>

              {/* Editor */}
              <Editor isDarkMode={isDarkMode} code={code} setCode={setCode} />
            </CardContent>
          </Card>

          {/* Results */}
          <Card className={`lg:w-[30%] border flex flex-col rounded-l-lg shadow-lg backdrop-blur-sm ${smooth} ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/90 border-gray-200"}`}>
            <CardContent className="p-3 flex flex-col h-full">
              <div className="mb-3 flex justify-between items-center gap-3">
                <div className={`py-1 text-lg font-semibold ${smooth} ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Quantum States
                </div>

                {result && (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    className={`text-white ${smooth} ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"}`}
                  >
                    Copy JSON
                  </Button>
                )}

                {error && (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(error)}
                    className={`text-white ${smooth} ${isDarkMode ? "text-red-300 border-red-700 hover:bg-red-900/30 bg-red-900/20" : "text-red-700 border-red-300 hover:bg-red-100 bg-red-50"}`}
                  >
                    Copy Error
                  </Button>
                )}
              </div>

              {result && (
                <div className={`space-y-3 overflow-y-auto rounded-lg`}>
                  <Result result={result} isDarkMode={isDarkMode} />
                </div>
              )}

              {error && (
                <div className={`p-3 border rounded-lg ${smooth} ${isDarkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`}>
                  <div className={`pb-3 font-semibold ${smooth} ${isDarkMode ? "text-red-300" : "text-red-800"}`}>
                    Error Details
                  </div>

                  <pre className={`text-sm whitespace-pre-wrap font-mono p-3 rounded border overflow-auto w-full break-all ${smooth} ${isDarkMode ? "text-red-300 bg-red-900/30 border-red-800" : "text-red-700 bg-red-100 border-red-200"}`}>
                    {error}
                  </pre>
                </div>
              )}

              {isLoading && (
                <div className={`py-12 text-center flex flex-col justify-center ${smooth} ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <p>Waiting for remote server...</p>
                </div>
              )}

              {!result && !error && !isLoading && (
                <div className={`py-12 text-center flex flex-col justify-center ${smooth} ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <p>Run your OpenQASM code to see quantum states here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="m-3">
          <Notes isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  )
}
