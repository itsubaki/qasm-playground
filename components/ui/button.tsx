import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none",
        "h-9 px-4 py-2 has-[>svg]:px-3",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
    ],
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
                outline:
                    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Button({
    className,
    variant,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants>) {
    return (
        <button
            data-slot="button"
            className={cn(buttonVariants({ variant, className }))}
            {...props}
        />
    )
}

export { Button }
