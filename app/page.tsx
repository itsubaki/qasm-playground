"use client"

import toast from 'react-hot-toast';
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { examples } from "./examples"
import type { States } from "@/lib/quantum"
import { throwError } from "@/lib/error"

export default function OpenQASMPlayground() {
  const [code, setCode] = useState("// Loading...")
  const [result, setResult] = useState<States | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const editCode = async () => {
      const path = window.location.pathname
      const match = path.match(/^\/p\/([a-zA-Z0-9_-]+)$/)

      if (!match) {
        setCode(examples[0].code)
        return
      }

      const id = match[1]

      try {
        const resp = await fetch("/api/edit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        })

        if (resp.ok) {
          const result = await resp.json()
          if (result.code) {
            setCode(result.code)
            return
          }

          console.error("Edit code:", result)
          return
        }

        await throwError(resp);
      } catch (err) {
        console.error("Edit code:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      }
    }

    editCode()
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    document.documentElement.classList.toggle("dark", newDarkMode)
  }

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const executeCode = async () => {
    if (!code.trim()) {
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const resp = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (resp.ok) {
        const data: States = await resp.json()
        setResult(data)
        return
      }

      await throwError(resp);
    } catch (err) {
      console.error("Execute code:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const shareCode = async () => {
    if (!code.trim()) {
      return
    }

    let url = "";
    try {
      const resp = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (!resp.ok) {
        await throwError(resp);
      }


      const result = await resp.json()
      if (!result.id) {
        console.error("Share code:", result)
        return
      }

      window.history.pushState(null, "", `/p/${result.id}`)
      url = `${window.location.origin}/p/${result.id}`
    } catch (err) {
      console.error("Share code:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied");
    } catch (err) {
      console.error("Copy to clipboard:", err);
      alert(err instanceof Error ? err.message : JSON.stringify(err));
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied")
    } catch (err) {
      console.error("Copy to clipboard:", err)
      alert(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode)
    setResult(null)
    setError(null)
  }

  const handleExampleSelect = (exampleName: string) => {
    const example = examples.find((ex) => ex.name === exampleName)
    if (example) {
      loadExample(example.code)
    }
  }

  const lineCount = code.split("\n").length
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)

  return (
    <div className={`min-h-screen p-4 ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <div className="flex justify-between items-center">
            <h1
              className={`font-bold text-2xl leading-7 mb-0 mt-0 text-left ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              OpenQASM 3.0 Playground
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <a
                href="https://github.com/itsubaki/qasm-playground"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors duration-200 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                aria-label="View source on GitHub"
              >
                <img
                  src="/github-mark.svg"
                  alt="GitHub"
                  className="w-6 h-6"
                  style={{ filter: isDarkMode ? "invert(1)" : "none" }}
                />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[800px]">
          {/* Code Editor */}
          <Card
            className={`lg:w-[70%] border flex flex-col h-full rounded-l-lg shadow-lg backdrop-blur-sm ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/90 border-gray-200"}`}
          >
            <CardContent className="flex-1 flex flex-col p-6 pt-2 h-full">
              <div className="flex justify-end items-center mt-0 mb-2 gap-3">
                <Button
                  onClick={executeCode}
                  disabled={isLoading}
                  className={`text-white ${isDarkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  Run
                </Button>
                <Button
                  onClick={shareCode}
                  variant="outline"
                  className={`${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"}`}
                >
                  Share
                </Button>
                <Select onValueChange={handleExampleSelect} defaultValue={examples[0]?.name}>
                  <SelectTrigger
                    className={`w-48 border ${isDarkMode ? "bg-gray-900 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className={`border ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
                  >
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
              </div>
              <div
                className={`relative flex-1 flex overflow-hidden min-h-0 border rounded-lg ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}
              >
                <div
                  ref={lineNumbersRef}
                  className={`flex-shrink-0 px-3 py-2 text-right select-none overflow-hidden scrollbar-hide rounded-tl-lg rounded-bl-lg leading-[1.4] ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
                  style={{
                    height: "100%",
                    paddingTop: "8px",
                  }}
                >
                  {lineNumbers.map((lineNum) => (
                    <div
                      key={lineNum}
                      className={`font-mono text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      style={{
                        lineHeight: "1.4",
                        fontSize: "14px",
                      }}
                    >
                      {lineNum}
                    </div>
                  ))}
                </div>
                <Textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onScroll={handleScroll}
                  placeholder="Enter your OpenQASM code here..."
                  className={`font-mono text-sm border-0 resize-none h-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 rounded-l-none rounded-r-lg overflow-y-auto py-2 leading-[1.4] ${isDarkMode ? "bg-gray-900 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}`}
                  style={{
                    fontFamily: 'Monaco, "Menlo", "Ubuntu Mono", "Consolas", "Courier New", monospace',
                    lineHeight: "1.4",
                    fontSize: "14px",
                    whiteSpace: "pre",
                    overflowX: "auto",
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card
            className={`lg:w-[30%] border flex flex-col h-full shadow-lg backdrop-blur-sm ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/90 border-gray-200"}`}
          >
            <CardContent className="flex-1 overflow-auto p-6">
              {error && (
                <div
                  className={`border rounded-lg p-4 mb-4 ${isDarkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${isDarkMode ? "text-red-300" : "text-red-800"}`}>Error Details</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(error)}
                      className={`${isDarkMode ? "text-red-300 border-red-700 hover:bg-red-900/30 bg-red-900/20" : "text-red-700 border-red-300 hover:bg-red-100 bg-red-50"}`}
                    >
                      Copy Error
                    </Button>
                  </div>
                  <pre
                    className={`text-sm whitespace-pre-wrap font-mono p-3 rounded border overflow-auto max-h-40 ${isDarkMode ? "text-red-300 bg-red-900/30 border-red-800" : "text-red-700 bg-red-100 border-red-200"}`}
                  >
                    {error}
                  </pre>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-0">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Quantum States
                  </h3>
                  {result && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                      className={`border h-6 text-xs ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"}`}
                    >
                      Copy JSON
                    </Button>
                  )}
                </div>

                {result ? (
                  <>
                    <div className="space-y-3">
                      {result.states.map((state, index) => {
                        const numQubits = Math.ceil(Math.log2(result.states.length)) || 1

                        return (
                          <div
                            key={index}
                            className={`rounded-lg p-4 border pb-4 pt-4 ${isDarkMode ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className={`font-mono ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {state.binaryString.map((str, i) => (
                                  <span key={i} className="font-mono">
                                    |{str}⟩
                                  </span>
                                ))}
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              {/* Probability Bar */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    Probability
                                  </span>
                                  <span className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                    {state.probability?.toFixed(6) || "0.000000"}
                                  </span>
                                </div>
                                <div
                                  className={`w-full rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                                >
                                  <div
                                    className={`min-w-[6px] h-2 rounded-full transition-all duration-300 ${isDarkMode ? "bg-blue-400" : "bg-blue-500"}`}
                                    style={{
                                      width: `${(state.probability || 0) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Amplitude */}
                              <div className="space-y-2">
                                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  Amplitude
                                </span>
                                <div className={`font-mono text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {state.amplitude?.real?.toFixed(6) || "0.000000"} +{" "}
                                  {state.amplitude?.imag?.toFixed(6) || "0.000000"}i
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Collapsible JSON view */}
                    <details className="mt-4">
                      <summary
                        className={`cursor-pointer transition-colors ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                      >
                        Show Raw JSON
                      </summary>
                      <div
                        className={`rounded-lg p-4 mt-2 overflow-auto ${isDarkMode ? "bg-gray-900/50" : "bg-gray-50"}`}
                      >
                        <pre
                          className={`text-sm font-mono whitespace-pre ${isDarkMode ? "text-green-400" : "text-green-700"}`}
                        >
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </>
                ) : isLoading ? (
                  <div
                    className={`text-center py-12 min-h-[100px] flex flex-col justify-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <p>Waiting for remote server...</p>
                  </div>
                ) : (
                  <div
                    className={`text-center py-12 min-h-[100px] flex flex-col justify-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <p>Run your OpenQASM code to see quantum states here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-left">
          <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            <li>Any unitary operation requires exponential resources with respect to the number of qubits.</li>
            <li>This playground supports up to 10 qubits. If you want to lift this limitation, please self-host.</li>
            <li>There are several other limitations. For more details, please refer to{" "}
              <a
                href="https://github.com/itsubaki/qasm/issues"
                target="_blank"
                rel="noopener noreferrer"
                className={isDarkMode ? "text-blue-400 underline" : "text-blue-600 underline"}
              >
                the issues
              </a>
              {" "}on GitHub.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
