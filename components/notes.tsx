export function Notes() {
    return (
        <div className="text-left">
            <ul className={`text-sm space-y-1 text-gray-600 dark:text-gray-400`}>
                <li>Simulation of arbitrary unitary operations requires resources that grow exponentially with the number of qubits.</li>
                <li>This playground supports up to 10 qubits, and to remove this limit, please self-host the system.</li>
                <li>Additional limitations apply. For details, see
                    {" "}
                    <a
                        href="https://github.com/itsubaki/qasm/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline text-blue-600 dark:text-blue-400`}
                    >
                        the issues
                    </a>
                    {" "}
                    on GitHub.
                </li>
            </ul>
        </div>
    )
}
