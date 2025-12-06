import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { examples } from "@/lib/examples";
import { cn } from "@/lib/utils"

export function Examples({
    setCode,
}: {
    setCode: (code: string) => void,
}) {
    const select = (name: string) => {
        const example = examples.find((ex) => ex.name === name)! // always found
        setCode(example.code)
    }

    return (
        <Select onValueChange={select} defaultValue={examples[0]?.name} aria-label="Choose an example">
            <SelectTrigger className={cn(
                "w-48",
                "bg-white border-gray-300 text-gray-900",
                "dark:bg-gray-900 dark:border-gray-600 dark:text-white",
            )}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent className={cn(
                "bg-white border-gray-200",
                "dark:bg-gray-900 dark:border-gray-700",
            )}>
                {examples.map((example) => (
                    <SelectItem
                        key={example.name}
                        value={example.name}
                        className={cn(
                            "text-gray-900 focus:bg-gray-100 focus:text-gray-900",
                            "dark:text-white dark:focus:bg-gray-800 dark:focus:text-white",
                        )}>
                        {example.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
