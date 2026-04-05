function getAmplitudeParts(real?: number, imag?: number) {
    const safeReal = real ?? 0
    const safeImag = imag ?? 0

    return {
        realSign: safeReal < 0 ? "-" : "",
        real: Math.abs(safeReal).toFixed(6),
        imagSign: safeImag < 0 ? "-" : "+",
        imag: `${Math.abs(safeImag).toFixed(6)}i`,
    }
}

export function formatBasis(binaryString: string[]) {
    return binaryString.map((bits) => `|${bits}⟩`).join("")
}

export function AmplitudeValue({
    real,
    imag,
}: {
    real?: number,
    imag?: number,
}) {
    const amplitude = getAmplitudeParts(real, imag)

    return (
        <span className="inline-flex items-baseline font-mono tabular-nums whitespace-nowrap">
            <span className="w-3 text-right">{amplitude.realSign}</span>
            <span>{amplitude.real}</span>
            <span className="w-6 text-center">{amplitude.imagSign}</span>
            <span>{amplitude.imag}</span>
        </span>
    )
}

export function ProbabilityBar({
    probability,
}: {
    probability: number,
}) {
    return (
        <div className="rounded-full h-2 w-full bg-gray-200 dark:bg-gray-700">
            <div
                className="rounded-full h-2 min-w-[6px] bg-blue-500 dark:bg-blue-400"
                style={{ width: `${probability * 100}%` }}
            />
        </div>
    )
}