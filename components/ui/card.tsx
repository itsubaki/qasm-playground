import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground",
        "flex flex-col gap-2",
        "rounded-xl shadow-sm border",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("pl-3 pr-3 pb-0 pt-2", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardContent,
}
