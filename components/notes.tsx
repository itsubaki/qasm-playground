export function Notes({
    isDarkMode,
}: {
    isDarkMode: boolean,
}) {
    const transition = "transition-colors duration-500"

    return (
        <div className="text-left">
            <ul className={`text-sm space-y-1 ${transition} ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                <li>Any unitary operation requires exponential resources with respect to the number of qubits.</li>
                <li>This playground supports up to 10 qubits. If you want to lift this limitation, please self-host it.</li>
                <li>There are several other limitations. For more details, please refer to{" "}
                    <a
                        href="https://github.com/itsubaki/qasm/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${transition} ${isDarkMode ? "text-blue-400 underline" : "text-blue-600 underline"}`}
                    >
                        the issues
                    </a>
                    {" "}on GitHub.
                </li>
            </ul>
        </div>
    )
}
