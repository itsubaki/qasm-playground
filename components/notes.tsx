import { smooth } from "@/lib/utils"

export function Notes({
    isDarkMode,
}: {
    isDarkMode: boolean,
}) {
    return (
        <div className="text-left">
            <ul className={`text-sm space-y-1 ${smooth} ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                <li>Simulating arbitrary unitary operations requires resources that grow exponentially with the number of qubits.</li>
                <li>This playground supports up to 10 qubits. To remove this limit, please self-host the system.</li>
                <li>Additional limitations apply. For details, see
                    {" "}
                    <a
                        href="https://github.com/itsubaki/qasm/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${smooth} ${isDarkMode ? "text-blue-400 underline" : "text-blue-600 underline"}`}
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
