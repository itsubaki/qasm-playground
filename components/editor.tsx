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
    const transition = "transition-colors duration-500"

    const scroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
        }
    }

    return (
        <div className={`relative flex-1 flex overflow-hidden min-h-0 border rounded-lg ${transition} ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
            <div ref={lineNumbersRef} className={`flex-shrink-0 px-3 py-2 text-right select-none overflow-hidden scrollbar-hide ${transition} ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                {lineNumbers.map((num) => (
                    <div key={num} className={`font-mono text-[0.83rem] leading-[1.4] ${transition} ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {num}
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
                className={`font-mono text-[0.83rem] leading-[1.4] py-2 border-0 whitespace-pre overflow-x-auto resize-none h-full flex-1 overflow-y-auto focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${transition} ${isDarkMode ? "bg-gray-900 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}`}
                style={{ fontFamily: 'Monaco, "Menlo", "Ubuntu Mono", "Consolas", "Courier New", monospace' }}
            />
        </div>
    )
}
