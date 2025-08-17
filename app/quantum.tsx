export interface QuantumState {
  amplitude: {
    real: number
    imag: number
  }
  probability: number
  int: number[]
  binaryString: string[]
}

export interface SimulationResult {
  state: QuantumState[]
}
