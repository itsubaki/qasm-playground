import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type States } from "@/lib/http"
import { smooth } from "@/lib/utils"
import { examples } from "@/lib/examples";

export function Examples({
    setCode,
    setResult,
    setError,
}: {
    setCode: (code: string) => void,
    setResult: (result: States | null) => void,
    setError: (error: string | null) => void,
}) {
    const select = (name: string) => {
        const example = examples.find((ex) => ex.name === name)! // always found
        setCode(example.code)
        setResult(null)
        setError(null)
    }

    return (
        <Select onValueChange={select} defaultValue={examples[0]?.name} aria-label="Choose an example">
            <SelectTrigger className={`w-48 ${smooth} dark:bg-gray-900 dark:border-gray-600 dark:text-white bg-white border-gray-300 text-gray-900`}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent className={`dark:bg-gray-900 dark:border-gray-700 bg-white border-gray-200`}>
                {examples.map((example) => (
                    <SelectItem
                        key={example.name}
                        value={example.name}
                        className={`dark:text-white dark:focus:bg-gray-800 dark:focus:text-white text-gray-900 focus:bg-gray-100 focus:text-gray-900`}
                    >
                        {example.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
