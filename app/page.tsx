"use client"

import toast from 'react-hot-toast';
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Editor } from "@/components/editor"
import { Result } from "@/components/result"
import { Header } from '@/components/header';
import { Notes } from "@/components/notes"
import { examples } from "@/lib/examples"
import { type States, type Snippet, httpPost } from "@/lib/http"

export default function Playground() {
  const [code, setCode] = useState("// Loading...")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<States | null>(null)
  const [sharedURL, setSharedURL] = useState<string | null>(null)

  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const sharedURLRef = useRef<HTMLInputElement>(null)
  const transition = "transition-colors duration-500"

  const run = async () => {
    if (!code.trim()) {
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const states = await httpPost<States>("/api/simulate", { code })
      setResult(states)
    } catch (err) {
      console.error("Run code:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const share = async () => {
    if (!code.trim()) {
      return
    }

    try {
      const snippet = await httpPost<Snippet>("/api/share", { code })
      if (!snippet.id) {
        console.error("Share code:", result)
        return
      }

      window.history.pushState(null, "", `/p/${snippet.id}`)
      const url = `${window.location.origin}/p/${snippet.id}`
      setSharedURL(url)
      await copyToClipboard(url)
    } catch (err) {
      console.error("Share code:", err)
    }
  }

  const edit = async () => {
    const path = window.location.pathname
    const match = path.match(/^\/p\/([a-zA-Z0-9_-]+)$/)

    if (!match) {
      setCode(examples[0].code)
      return
    }

    try {
      const id = match[1]
      const snippet = await httpPost<Snippet>("/api/edit", { id })
      if (!snippet.code) {
        console.error("Edit code:", snippet)
        return
      }

      setCode(snippet.code)
    } catch (err) {
      console.error("Edit code:", err)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied")
    } catch (err) {
      console.error("Copy to clipboard:", err)
    }
  }

  const selectExample = (name: string) => {
    const example = examples.find((ex) => ex.name === name)
    if (example) {
      setCode(example.code)
      setResult(null)
      setError(null)
    }
  }

  useEffect(() => { edit() }, [examples])

  useEffect(() => {
    if (sharedURL && sharedURLRef.current) {
      sharedURLRef.current.focus()
      sharedURLRef.current.select()
    }
  }, [sharedURL]);

  useEffect(() => {
    setIsMounted(true);

    // Detect system dark mode preference
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(media.matches);

    // Listen for changes in system dark mode preference
    const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    media.addEventListener("change", listener);

    // Cleanup listener on unmount
    return () => media.removeEventListener("change", listener);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`min-h-screen p-4 ${transition} ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </div>

        {/* Main */}
        <div className="flex flex-col lg:flex-row gap-3 h-[800px]">
          {/* Code Editor */}
          <Card className={`lg:w-[70%] border flex flex-col h-full rounded-l-lg shadow-lg backdrop-blur-sm ${transition} ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/90 border-gray-200"}`}>
            <CardContent className="flex flex-col h-full p-6 pt-2">
              <div className="flex justify-end items-center mb-2 gap-3">
                <Button
                  onClick={run}
                  disabled={isLoading}
                  className={`text-white ${transition} ${isDarkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  Run
                </Button>

                <Button
                  onClick={share}
                  variant="outline"
                  className={`${transition} ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-white-50 bg-white"}`}
                >
                  Share
                </Button>

                {sharedURL && (
                  <input
                    name="sharedURL"
                    aria-label="Shared URL"
                    type="text"
                    ref={sharedURLRef}
                    value={sharedURL}
                    readOnly
                    className={`h-9 px-4 py-2 w-48 text-sm rounded-md border outline-none pointer-events-auto focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/50 ${transition} ${isDarkMode ? "bg-gray-900 border-gray-600 text-gray-300 hover:bg-gray-800" : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"}`}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    tabIndex={0}
                  />
                )}

                {!sharedURL && (
                  <Select onValueChange={selectExample} defaultValue={examples[0]?.name} aria-label="Choose an example">
                    <SelectTrigger className={`w-48 border ${transition} ${isDarkMode ? "bg-gray-900 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`border ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                      {examples.map((example) => (
                        <SelectItem
                          key={example.name}
                          value={example.name}
                          className={`${isDarkMode ? "text-white focus:bg-gray-800 focus:text-white" : "text-gray-900 focus:bg-gray-100 focus:text-gray-900"}`}
                        >
                          {example.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Editor code={code} isDarkMode={isDarkMode} setCode={setCode} />
            </CardContent>
          </Card>

          {/* Results */}
          <Card className={`lg:w-[30%] border flex flex-col h-full rounded-l-lg shadow-lg backdrop-blur-sm ${transition} ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/90 border-gray-200"}`}>
            <CardContent className="p-6 pt-2 flex flex-col h-full">
              <div className="flex justify-between items-center mt-0 mb-2 gap-3">
                <div className={`py-1 text-lg font-semibold ${transition} ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Quantum States
                </div>

                {result && (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    className={`text-white ${transition} ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"}`}
                  >
                    Copy JSON
                  </Button>
                )}

                {error && (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(error)}
                    className={`text-white ${transition} ${isDarkMode ? "text-red-300 border-red-700 hover:bg-red-900/30 bg-red-900/20" : "text-red-700 border-red-300 hover:bg-red-100 bg-red-50"}`}
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
                <div className={`p-4 border rounded-lg ${transition} ${isDarkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`}>
                  <div className={`mb-2 font-semibold ${transition} ${isDarkMode ? "text-red-300" : "text-red-800"}`}>
                    Error Details
                  </div>

                  <pre className={`text-sm whitespace-pre-wrap font-mono p-3 rounded border overflow-auto w-full break-all ${transition} ${isDarkMode ? "text-red-300 bg-red-900/30 border-red-800" : "text-red-700 bg-red-100 border-red-200"}`}>
                    {error}
                  </pre>
                </div>
              )}

              {isLoading && (
                <div className={`text-center py-12 flex flex-col justify-center ${transition} ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <p>Waiting for remote server...</p>
                </div>
              )}

              {!result && !error && !isLoading && (
                <div className={`text-center py-12 flex flex-col justify-center ${transition} ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <p>Run your OpenQASM code to see quantum states here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Notes isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  )
}
