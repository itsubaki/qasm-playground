export function Notes() {
    return (
        <div className="text-left">
            <ul className={`text-sm space-y-1 text-gray-600 dark:text-gray-400`}>
                <li>A playground that lets you write and run OpenQASM code in a web browser.</li>
                <li>It supports up to 12 qubits, with additional limitations. For more details, see the GitHub
                    {" "}
                    <a
                        href="https://github.com/itsubaki/qasm/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline text-blue-600 dark:text-blue-400`}
                    >
                        issues
                    </a>
                    .
                </li>
            </ul>
        </div>
    )
}
