import { smooth } from "@/lib/utils"

export function Notes() {
    return (
        <div className="text-left">
            <ul className={`text-sm space-y-1 ${smooth} dark:text-gray-400 text-gray-600`}>
                <li>Simulation of arbitrary unitary operations requires resources that grow exponentially with the number of qubits.</li>
                <li>This playground supports up to 10 qubits, and to remove this limit, please self-host the system.</li>
                <li>Additional limitations may apply. For details, please refer to the GitHub
                    {" "}
                    <a
                        href="https://github.com/itsubaki/qasm/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${smooth} dark:text-blue-400 text-blue-600`}
                    >
                        the issues
                    </a>
                    .
                </li>
            </ul>
        </div>
    )
}
