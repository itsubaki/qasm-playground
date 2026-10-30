// Only use a location explicitly reported by the server; never guess a source line.
export function simulationError(message: string) {
    const lineMatch = message.match(/\bline\s*[:=]?\s*(\d+)\b/i)
        ?? message.match(/(?:^|\s|["(])(?:\w+\.qasm:)?(\d+):\d+\b/)
    const line = lineMatch ? Number(lineMatch[1]) : undefined
    if (/HTTP 5\d\d|fetch|network|service unavailable/i.test(message)) {
        return { title: "Could not reach the simulator", hint: "Your code is still here. Please try running it again.", line: undefined }
    }
    if (/qubits?.*(?:limit|maximum|exceed)|(?:limit|maximum|exceed).*qubits?/i.test(message)) {
        return { title: "Simulation limit reached", hint: "Use at most 12 qubits, then run again.", line }
    }
    return { title: "Could not run this code", hint: line
        ? `Check line ${line} using the server details below, then run again.`
        : "Check the server details below and review your code, then run again.", line }
}
