"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Notes } from "@/components/notes"
import { Header } from '@/components/header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type States, examples } from "@/lib/quantum"
import { post } from "@/lib/request"

export default function Playground() {
  const [code, setCode] = useState("// Loading...")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<States | null>(null)
  const [sharedURL, setSharedURL] = useState<string | null>(null)

  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sharedURLRef = useRef<HTMLInputElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const lineNumbers = useMemo(() => Array.from({ length: code.split("\n").length }, (_, i) => i + 1), [code])

  const run = async () => {
    if (!code.trim()) {
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const resp = await post("/api/simulate", { code })
      const data: States = await resp.json()
      setResult(data)
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
      const resp = await post("/api/share", { code })
      const result = await resp.json()
      if (!result.id) {
        console.error("Share code:", result)
        return
      }

      window.history.pushState(null, "", `/p/${result.id}`)
      const url = `${window.location.origin}/p/${result.id}`
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
      const resp = await post("/api/edit", { id })
      const result = await resp.json()
      if (!result.code) {
        console.error("Edit code:", result)
        return
      }

      setCode(result.code)
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

  const scroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
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
    <div className={`min-h-screen p-4 transition-colors duration-500 ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}>
      <div className="max-w-7xl mx-auto">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        {/* Main */}
        <div className="flex flex-col lg:flex-row gap-6 h-[800px]">
          {/* Code Editor */}
          <Card className={`lg:w-[70%] border flex flex-col h-full rounded-l-lg shadow-lg backdrop-blur-sm transition-colors duration-500 ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/90 border-gray-200"}`}>
            <CardContent className="flex-1 flex flex-col p-6 pt-2 h-full">
              <div className="flex justify-end items-center mt-0 mb-2 gap-3">
                <Button
                  onClick={run}
                  disabled={isLoading}
                  className={`text-white transition-colors duration-500 ${isDarkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  Run
                </Button>

                <Button
                  onClick={share}
                  variant="outline"
                  className={`transition-colors duration-500 ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"}`}
                >
                  Share
                </Button>

                {sharedURL && (
                  <input
                    name="sharedURL"
                    type="text"
                    ref={sharedURLRef}
                    value={sharedURL}
                    readOnly
                    className={`h-9 px-4 py-2 rounded-md border w-48 text-sm transition-all outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/50 transition-colors duration-500 ${isDarkMode ? "bg-gray-900 border-gray-600 text-gray-300 hover:bg-gray-800" : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"}`}
                    style={{ pointerEvents: "auto" }}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    tabIndex={0}
                  />
                )}

                {!sharedURL && (
                  <Select onValueChange={selectExample} defaultValue={examples[0]?.name}>
                    <SelectTrigger className={`w-48 border transition-colors duration-500 ${isDarkMode ? "bg-gray-900 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`border transition-colors duration-500 ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
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

              <div className={`relative flex-1 flex overflow-hidden min-h-0 border rounded-lg transition-colors duration-500 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                <div
                  ref={lineNumbersRef}
                  className={`flex-shrink-0 px-3 py-2 text-right select-none overflow-hidden scrollbar-hide rounded-tl-lg rounded-bl-lg leading-[1.4] transition-colors duration-500 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
                  style={{
                    height: "100%",
                    paddingTop: "8px",
                  }}
                >
                  {lineNumbers.map((lineNum) => (
                    <div
                      key={lineNum}
                      className={`font-mono text-sm transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      style={{
                        lineHeight: "1.4",
                        fontSize: "0.83rem",
                      }}
                    >
                      {lineNum}
                    </div>
                  ))}
                </div>
                <Textarea
                  id="code-editor"
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onScroll={scroll}
                  placeholder="Enter your OpenQASM code here..."
                  className={`font-mono text-sm border-0 resize-none h-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 rounded-l-none rounded-r-lg overflow-y-auto py-2 leading-[1.4] transition-colors duration-500 ${isDarkMode ? "bg-gray-900 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}`}
                  style={{
                    fontFamily: 'Monaco, "Menlo", "Ubuntu Mono", "Consolas", "Courier New", monospace',
                    lineHeight: "1.4",
                    fontSize: "0.83rem",
                    whiteSpace: "pre",
                    overflowX: "auto",
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className={`lg:w-[30%] border flex flex-col h-full rounded-l-lg shadow-lg backdrop-blur-sm transition-colors duration-500 ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/90 border-gray-200"}`}>
            <CardContent className="flex-1 flex flex-col p-6 pt-2 h-full">
              <div className="flex justify-between items-center mt-0 mb-2 gap-3">
                <div className={`py-1 text-lg font-semibold transition-colors duration-500 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Quantum States
                </div>

                {result && (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    className={`text-white transition-colors duration-500 ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"}`}
                  >
                    Copy JSON
                  </Button>
                )}

                {error && (
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(error)}
                    className={`text-white transition-colors duration-500 ${isDarkMode ? "text-red-300 border-red-700 hover:bg-red-900/30 bg-red-900/20" : "text-red-700 border-red-300 hover:bg-red-100 bg-red-50"}`}
                  >
                    Copy Error
                  </Button>
                )}
              </div>

              {error && (
                <div className={`border rounded-lg p-4 mb-4 transition-colors duration-500 ${isDarkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`font-semibold transition-colors duration-500 ${isDarkMode ? "text-red-300" : "text-red-800"}`}>
                      Error Details
                    </div>
                  </div>

                  <pre className={`text-sm whitespace-pre-wrap font-mono p-3 rounded border overflow-auto max-h-40 w-full break-all transition-colors duration-500 ${isDarkMode ? "text-red-300 bg-red-900/30 border-red-800" : "text-red-700 bg-red-100 border-red-200"}`}>
                    {error}
                  </pre>
                </div>
              )}

              {result && (
                <>
                  <div className={`space-y-3 max-h-[800px] overflow-y-auto rounded-lg transition-colors duration-500 ${isDarkMode ? "bg-gray-900/30" : "bg-gray-50"}`}>
                    {result.states.map((state, index) => {
                      return (
                        <div
                          key={index}
                          className={`rounded-lg p-4 border pb-4 pt-4 transition-colors duration-500 ${isDarkMode ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className={`font-mono transition-colors duration-500 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                              {state.binaryString.map((str, i) => (
                                <span key={i} className="font-mono">
                                  |{str}⟩
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            {/* Probability Bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className={`transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  Probability
                                </span>
                                <span className={`transition-colors duration-500 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {state.probability?.toFixed(6) || "0.000000"}
                                </span>
                              </div>
                              <div className={`w-full rounded-full h-2 transition-colors duration-500 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                                <div
                                  className={`min-w-[6px] h-2 rounded-full transition-all duration-300 transition-colors duration-500 ${isDarkMode ? "bg-blue-400" : "bg-blue-500"}`}
                                  style={{
                                    width: `${(state.probability || 0) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Amplitude */}
                            <div className="space-y-2">
                              <span className={`text-sm transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Amplitude
                              </span>
                              <div className={`font-mono text-sm transition-colors duration-500 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {state.amplitude?.real?.toFixed(6) || "0.000000"} +{" "}
                                {state.amplitude?.imag?.toFixed(6) || "0.000000"}i
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* JSON view */}
                  <details className="mt-4">
                    <summary className={`cursor-pointer transition-colors transition-colors duration-500 ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                      Show Raw JSON
                    </summary>
                    <div className={`rounded-lg p-4 mt-2 overflow-auto transition-colors duration-500 ${isDarkMode ? "bg-gray-900/50" : "bg-gray-50"}`}>
                      <pre className={`text-sm font-mono whitespace-pre transition-colors duration-500 ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </details>
                </>
              )}

              {isLoading && (
                <div className={`text-center py-12 min-h-[100px] flex flex-col justify-center transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <p>Waiting for remote server...</p>
                </div>
              )}

              {!result && !isLoading && !error && (
                <div className={`text-center py-12 min-h-[100px] flex flex-col justify-center transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <p>Run your OpenQASM code to see quantum states here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Notes isDarkMode={isDarkMode} />
      </div>
    </div >
  )
}
