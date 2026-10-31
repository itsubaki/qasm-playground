import { describe, expect, it } from "vitest"
import { simulationError } from "./simulationError"

describe("simulationError", () => {
    it("uses only explicit source positions", () => {
        expect(simulationError("line 8: expected ';'").line).toBe(8)
        expect(simulationError("parse error at 4:12: invalid token").line).toBe(4)
        expect(simulationError("HTTP 400: invalid syntax").line).toBeUndefined()
    })
    it("distinguishes connection errors and qubit limits", () => {
        expect(simulationError("HTTP 503: Service Unavailable").title).toBe("Could not reach the simulator")
        expect(simulationError("maximum number of qubits exceeded").title).toBe("Simulation limit reached")
    })
})
