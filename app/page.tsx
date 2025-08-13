"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Play, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuantumState {
  amplitude: {
    real: number
    imag: number
  }
  probability: number
  int: number[]
  binaryString: string[]
}

interface SimulationResult {
  state: QuantumState[]
}

const defaultCode = `OPENQASM 3.0;

gate h q { U(pi/2.0, 0, pi) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }

qubit[2] q;
reset q;

h q[0];
cx q[0], q[1];`

export default function OpenQASMPlayground() {
  const [code, setCode] = useState(defaultCode)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Calculate editor height based on number of lines
  const calculateEditorHeight = (codeText: string) => {
    const lines = codeText.split("\n").length
    const minHeight = 400
    const lineHeight = 20 // approximate line height in pixels
    const padding = 16 // top and bottom padding
    const calculatedHeight = Math.max(minHeight, lines * lineHeight + padding)
    return calculatedHeight
  }

  const [editorHeight, setEditorHeight] = useState(calculateEditorHeight(defaultCode))

  useEffect(() => {
    setEditorHeight(calculateEditorHeight(code))
  }, [code])

  const executeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some OpenQASM code to run",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage = `${errorMessage}\n\nDetails: ${errorData.error}`
          }
        } catch {
          // If response is not JSON, try to get text
          try {
            const errorText = await response.text()
            if (errorText) {
              errorMessage = `${errorMessage}\n\nResponse: ${errorText}`
            }
          } catch {
            // Ignore if we can't read the response
          }
        }

        throw new Error(errorMessage)
      }

      const data: SimulationResult = await response.json()
      setResult(data)

      toast({
        title: "Success",
        description: "OpenQASM code executed successfully!",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      console.error("Detailed error:", err) // Added console logging for debugging
      toast({
        title: "Execution Error",
        description: errorMessage.split("\n")[0], // Show only first line in toast
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "Code copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const resetCode = () => {
    setCode(defaultCode)
    setResult(null)
    setError(null)
  }

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="font-bold text-white text-left text-2xl leading-7 mb-0 mt-0">OpenQASM 3.0 Playground</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Code Editor and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Code Editor */}
            <Card className="h-fit bg-gray-800 border-gray-700">
              <CardContent>
                <div className="relative">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900 border-r border-gray-600 flex flex-col text-xs text-gray-400 font-mono pt-2 pb-2 rounded-l-md"
                    style={{ height: `${editorHeight}px` }}
                  >
                    {code.split("\n").map((_, index) => (
                      <div key={index} className="h-5 flex items-center justify-end pr-2 leading-5">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter your OpenQASM code here..."
                    className="font-mono text-sm bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-400 pl-14 resize-none"
                    style={{
                      height: `${editorHeight}px`,
                      fontFamily: 'Monaco, "Menlo", "Ubuntu Mono", "Consolas", "Courier New", monospace',
                      lineHeight: "1.4",
                    }}
                  />
                </div>
                <div className="flex justify-end items-center mt-4">
                  <Button
                    onClick={executeCode}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <>
                      <Play className="h-4 w-4" />
                      Run
                    </>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="h-fit min-h-[300px] bg-gray-800 border-gray-700">
              <CardContent>
                {error && (
                  <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-red-300 font-semibold">Error Details</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(error)}
                        className="text-red-300 border-red-600 hover:bg-red-800/50 bg-red-900/30"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Error
                      </Button>
                    </div>
                    <pre className="text-red-200 text-sm whitespace-pre-wrap font-mono bg-red-950/50 p-3 rounded border border-red-800 overflow-auto max-h-40">
                      {error}
                    </pre>
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Quantum States</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-gray-800"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy JSON
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {result.state.map((state, index) => {
                        const numQubits = Math.ceil(Math.log2(result.state.length)) || 1
                        
                        return (
                          <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-medium">|{state.binaryString}⟩</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Probability Bar */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Probability</span>
                                  <span className="text-white">{state.probability?.toFixed(6) || "0.000000"}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(state.probability || 0) * 100}%` }}
                                  />
                                </div>
                              </div>

                              {/* Amplitude */}
                              <div className="space-y-2">
                                <span className="text-gray-400 text-sm">Amplitude</span>
                                <div className="text-white font-mono text-sm">
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
                      <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors">
                        Show Raw JSON
                      </summary>
                      <div className="bg-gray-900 rounded-lg p-4 mt-2 overflow-auto max-h-60">
                        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </div>
                )}

                {!result && !error && !isLoading && (
                  <div className="text-center py-12 text-gray-400 min-h-[100px] flex flex-col justify-center"></div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-fit bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Bell State",
                      description: "Creates an entangled Bell state.",
                      code: `OPENQASM 3.0;

gate h q { U(pi/2.0, 0, pi) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }

qubit[2] q;
reset q;

h q[0];
cx q[0], q[1];`,
                    },
                    {
                      name: "Standard Gates",
                      description: "Defines standard quantum gates using unitary operations.",
                      code: `OPENQASM 3.0;

gate i q { U(0, 0, 0) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate x q { U(pi, 0, pi) q; }
gate y q { U(pi, pi/2.0, pi/2.0) q; }
gate z q { U(0, pi, 0) q; }
gate cx q0, q1 { ctrl @ U(pi, 0, pi) q0, q1;}

qubit[2] q;
reset q;

h q[0];
cx q[0], q[1];
`,
                    },
                    {
                      name: "Quantum Fourier Transform",
                      description:
                        "Implements the Quantum Fourier Transform on a 3-qubit register, including controlled phase rotations and qubit swaps to reverse order.",
                      code: `OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }
gate crz(theta) c, t { ctrl @ U(0, 0, theta) c, t; }

def qft(qubit[3] q) {
    h q[0];
    crz(pi/2) q[0], q[1];
    crz(pi/4) q[0], q[2];

    h q[1];
    crz(pi/2) q[1], q[2];

    h q[2];

    cx q[0], q[2];
    cx q[2], q[0];
    cx q[0], q[2];
}

qubit[3] q;
reset q;

x q[2];
qft(q);
`,
                    },
                  ].map((example, index) => (
                    <div
                      key={index}
                      className="border border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors bg-gray-750"
                      onClick={() => loadExample(example.code)}
                    >
                      <h4 className="font-semibold mb-2 text-white">{example.name}</h4>
                      <p className="text-sm text-gray-300 mb-3">{example.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
