"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuantumState {
  amplitude: {
    real: number
    imag: number
  }
  probability: number
  int: number[]
  binary_string: string[]
}

interface SimulationResult {
  state: QuantumState[]
}

const defaultCode = `OPENQASM 3.0;

gate h q { U(pi/2.0, 0, pi) q; }
gate x q { U(pi, 0, pi) q; }
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

  const executeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some OpenQASM code to execute",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Note: In a real implementation, you would replace this with your actual Google Cloud Run endpoint
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
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
      toast({
        title: "Execution Error",
        description: errorMessage,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-left">OpenQASM 3.0 Playground</h1>
          <p className="text-lg text-gray-600 text-left">Write and execute OpenQASM 3.0 quantum circuits</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Code Editor</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(code)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetCode}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your OpenQASM code here..."
                className="min-h-[300px] font-mono text-sm"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">Lines: {code.split("\n").length}</div>
                <Button onClick={executeCode} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Execute
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="h-fit min-h-[300px]">
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
              <CardDescription>Raw JSON response from the quantum simulator</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h3 className="text-red-800 font-semibold mb-2">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">JSON Response</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy JSON
                    </Button>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4 overflow-auto min-h-[200px]">
                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {!result && !error && !isLoading && (
                <div className="text-center py-12 text-gray-500 min-h-[200px] flex flex-col justify-center">
                  <Play className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Execute your OpenQASM code to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Examples */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Example Circuits</CardTitle>
            <CardDescription>Click on any example to load it into the editor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  name: "Quantum Foruier Transform",
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
              ].map((example, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setCode(example.code)}
                >
                  <h4 className="font-semibold mb-2">{example.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                  <Badge variant="outline">Click to load</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
