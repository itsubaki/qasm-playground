import { Textarea } from "@/components/ui/textarea"
import { useMemo, useRef } from "react"

export function Editor({
    code,
    isDarkMode,
    setCode,
}: {
    code: string,
    isDarkMode: boolean,
    setCode: (code: string) => void,
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const lineNumbersRef = useRef<HTMLDivElement>(null)
    const lineNumbers = useMemo(() => Array.from({ length: code.split("\n").length }, (_, i) => i + 1), [code])

    const scroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
        }
    }

    return (
        <div className={`relative flex-1 flex overflow-hidden min-h-0 border rounded-lg transition-colors duration-500 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
            <div
                ref={lineNumbersRef}
                className={`flex-shrink-0 px-3 py-2 text-right select-none overflow-hidden scrollbar-hide rounded-tl-lg rounded-bl-lg leading-[1.4] transition-colors duration-500 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
                style={{
                    height: "100%",
                    paddingTop: "8px",
                }}
            >
                {lineNumbers.map((lineNum) => (
                    <div
                        key={lineNum}
                        className={`font-mono text-sm transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        style={{
                            lineHeight: "1.4",
                            fontSize: "0.83rem",
                        }}
                    >
                        {lineNum}
                    </div>
                ))}
            </div>

            <Textarea
                id="code-editor"
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={scroll}
                placeholder="Enter your OpenQASM code here..."
                className={`font-mono text-sm border-0 resize-none h-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 rounded-l-none rounded-r-lg overflow-y-auto py-2 leading-[1.4] transition-colors duration-500 ${isDarkMode ? "bg-gray-900 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}`}
                style={{
                    fontFamily: 'Monaco, "Menlo", "Ubuntu Mono", "Consolas", "Courier New", monospace',
                    lineHeight: "1.4",
                    fontSize: "0.83rem",
                    whiteSpace: "pre",
                    overflowX: "auto",
                }}
            />
        </div>
    )
}
