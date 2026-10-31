import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallback } from "react"
import { examples } from "@/lib/examples";
import { cn } from "@/lib/utils"

export function Examples({
    setCode,
    code,
    disabled,
    onContentMountChange,
}: {
    setCode: (code: string) => void,
    code?: string,
    disabled?: boolean,
    onContentMountChange?: (mounted: boolean) => void,
}) {
    // Track presence, including the closing animation, rather than only the open flag.
    const contentRef = useCallback((node: HTMLDivElement | null) => {
        // Radix also renders options into a detached fragment while the menu is closed.
        onContentMountChange?.(node?.isConnected ?? false)
        return () => onContentMountChange?.(false)
    }, [onContentMountChange])
    const select = (name: string) => {
        const example = examples.find((ex) => ex.name === name)! // always found
        setCode(example.code)
    }

    return (
        <Select onValueChange={select} disabled={disabled} {...(code === undefined
            ? { defaultValue: examples[0]?.name }
            : { value: examples.find((example) => example.code === code)?.name ?? "" })}>
            <SelectTrigger className={cn(
                "h-9 w-full sm:w-52 [&>span]:min-w-0 [&>span]:truncate [&>svg]:shrink-0",
                "bg-white border-gray-300 text-gray-900",
                "dark:bg-gray-900 dark:border-gray-600 dark:text-white",
            )} aria-label="Choose an example">
                <SelectValue placeholder="Custom code" />
            </SelectTrigger>
            <SelectContent ref={contentRef} className={cn(
                "max-h-[26rem]",
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
