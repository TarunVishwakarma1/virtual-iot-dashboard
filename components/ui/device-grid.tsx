"use client"

import type React from "react"

import { useState } from "react"
import { Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DeviceGridProps {
  children: React.ReactNode
  listView?: React.ReactNode
  className?: string
}

export function DeviceGrid({ children, listView, className }: DeviceGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-end">
        <div className="inline-flex items-center rounded-md border border-input bg-background p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0", viewMode === "grid" && "bg-muted text-muted-foreground")}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0", viewMode === "list" && "bg-muted text-muted-foreground")}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? children : listView || children}
    </div>
  )
}

