"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const defaultCode = `// Bell State

OPENQASM 3.0;

gate h q { U(pi/2.0, 0, pi) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }

qubit[2] q;
reset q;

h q[0];
cx q[0], q[1];

measure q;
`

const examples = [
  {
    name: "Bell State",
    code: defaultCode,
  },
  {
    name: "Quantum Fourier Transform",
    code: `// Quantum Fourier Transform

OPENQASM 3.0;

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
}

def swap(qubit[3] q) {
    cx q[0], q[2];
    cx q[2], q[0];
    cx q[0], q[2];
}

qubit[3] q;
reset q;

x q[2];
qft(q);
swap(q);
`,
  },
  {
    name: "Grover's algorithm",
    code: `// Grover's algorithm

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cccx c0, c1, c2, t { ctrl @ ctrl @ ctrl @ U(pi, 0, pi) c0, c1, c2, t; }

// oracle for |110>|x>
def oracle(qubit[4] q) {
    x q[2], q[3];
    h q[3];
    cccx q[0], q[1], q[2], q[3];
    h q[3];
    x q[2], q[3];
}

def diffuser(qubit[4] q) {
    h q;
    x q;
    h q[3];
    cccx q[0], q[1], q[2], q[3];
    h q[3];
    x q;
    h q;
}

const int n = 4;
qubit[n] q;
reset q;
h q;

int N = 2**n;
int r = int(pi/4 * sqrt(float(N)));
for int i in [0:r] {
    oracle(q);
    diffuser(q);
}

measure q[3];
`,
  },
  {
    name: "Sudoku 2x2",
    code: `// Sudoku 2x2

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }

gate cx q0, q1 { ctrl @ U(pi, 0, pi) q0, q1; }
gate cccz c0, c1, c2, t { ctrl @ ctrl @ ctrl @ U(0, pi, 0) c0, c1, c2, t; }
gate ccccz c0, c1, c2, c3, t { ctrl @ ctrl @ ctrl @ ctrl @ U(0, pi, 0) c0, c1, c2, c3, t; }
gate xor q0, q1, q2 { cx q0, q2; cx q1, q2; }

// The oracle constructs a Grover oracle that validates solutions to a 2x2 sudoku puzzle.
// It enforces the following uniqueness constraints: a != b, c != d, a != c, b != d.
// Valid solutions are [1,0,0,1] and [0,1,1,0].
def oracle(qubit[4] r, qubit[4] s, qubit a) {
    xor r[0], r[1], s[0];
    xor r[2], r[3], s[1];
    xor r[0], r[2], s[2];
    xor r[1], r[3], s[3];

    ccccz s[0], s[1], s[2], s[3], a;

    xor r[3], r[1], s[3];
    xor r[2], r[0], s[2];
    xor r[3], r[2], s[1];
    xor r[1], r[0], s[0];
}

def diffuser(qubit[4] r) {
    h r;
    x r;
    cccz r[0], r[1], r[2], r[3];
    x r;
    h r;
}

const int n = 4;
qubit[n] r;
qubit[4] s;
qubit a;

reset r;
reset s;
reset a;

h r;
h a;

int N = 2**n;
int M = 2;
int R = int(pi/4 * sqrt(float(N)/float(M)));

for int i in [0:R] {
    oracle(r, s, a);
    diffuser(r);
}

measure s;
measure a;
`,
  },
]

export default function OpenQASMPlayground() {
  const [code, setCode] = useState(defaultCode)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { toast } = useToast()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

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
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
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
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
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
                <Select onValueChange={handleExampleSelect}>
                  <SelectTrigger
                    className={`w-48 border ${isDarkMode ? "bg-gray-900 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  >
                    <SelectValue placeholder="Examples" />
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
                  className={`flex-shrink-0 px-3 py-2 text-right select-none overflow-y-auto scrollbar-hide rounded-tl-lg rounded-bl-lg leading-[1.4] ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
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

              {result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-0">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Quantum States
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                      className={`border ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"}`}
                    >
                      Copy JSON
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {result.state.map((state, index) => {
                      const numQubits = Math.ceil(Math.log2(result.state.length)) || 1

                      return (
                        <div
                          key={index}
                          className={`rounded-lg p-4 border pb-4 pt-4 ${isDarkMode ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                              {Array.isArray(state.binaryString) ? (
                                state.binaryString.map((str, i) => (
                                  <span key={i}>
                                    |<span className="font-mono">{str}</span>⟩
                                  </span>
                                ))
                              ) : (
                                <span>
                                  |<span className="font-mono">{state.binaryString}</span>⟩
                                </span>
                              )}
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            {/* Probability Bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Probability</span>
                                <span className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {state.probability?.toFixed(6) || "0.000000"}
                                </span>
                              </div>
                              <div className={`w-full rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${isDarkMode ? "bg-blue-400" : "bg-blue-500"}`}
                                  style={{ width: `${(state.probability || 0) * 100}%` }}
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
                      className={`rounded-lg p-4 mt-2 overflow-auto max-h-60 ${isDarkMode ? "bg-gray-900/50" : "bg-gray-50"}`}
                    >
                      <pre
                        className={`text-sm font-mono whitespace-pre-wrap ${isDarkMode ? "text-green-400" : "text-green-700"}`}
                      >
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              )}

              {!result && !error && !isLoading && (
                <div
                  className={`text-center py-12 min-h-[100px] flex flex-col justify-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                ></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
