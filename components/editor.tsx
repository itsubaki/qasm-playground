import { Textarea } from "@/components/ui/textarea"
import { useMemo, useRef } from "react"
import { transition } from "@/lib/utils"

export function Editor({
    isDarkMode,
    code,
    setCode,
}: {
    isDarkMode: boolean,
    code: string,
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
        <div className={`relative flex-1 flex overflow-hidden min-h-0 border rounded-lg ${transition} ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
            <div ref={lineNumbersRef} className={`px-3 py-2 flex-shrink-0 text-right select-none overflow-hidden scrollbar-hide ${transition} ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                {lineNumbers.map((num) => (
                    <div key={num} className={`font-mono min-w-[3ch] text-[0.83rem] leading-[1.4] ${transition} ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
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
                className={`font-mono text-[0.83rem] leading-[1.4] py-2 flex-1 border-0 h-full whitespace-pre overflow-x-auto overflow-y-auto resize-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${transition} ${isDarkMode ? "bg-gray-900 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}`}
                style={{ fontFamily: 'Monaco, "Menlo", "Ubuntu Mono", "Consolas", "Courier New", monospace' }}
            />
        </div>
    )
}
