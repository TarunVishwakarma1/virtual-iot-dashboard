"use client"

import type { ReactNode } from "react"
import { MoreHorizontal } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StatusBadge, type StatusType } from "@/components/ui/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DeviceCardProps {
  id: string
  name: string
  type: string
  status: StatusType
  location: string
  batteryLevel?: number
  lastReading?: {
    value: number
    unit: string
  }
  icon: ReactNode
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onRemove?: (id: string) => void
  extraDetails?: Record<string, string | number>
  className?: string
}

export function DeviceCard({
  id,
  name,
  type,
  status,
  location,
  batteryLevel,
  lastReading,
  icon,
  onView,
  onEdit,
  onRemove,
  extraDetails,
  className,
}: DeviceCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Device Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onView && <DropdownMenuItem onClick={() => onView(id)}>View Details</DropdownMenuItem>}
                {onEdit && <DropdownMenuItem onClick={() => onEdit(id)}>Edit Device</DropdownMenuItem>}
                <DropdownMenuItem>Restart Device</DropdownMenuItem>
                <DropdownMenuItem>Calibrate</DropdownMenuItem>
                <DropdownMenuSeparator />
                {onRemove && (
                  <DropdownMenuItem onClick={() => onRemove(id)} className="text-red-500 focus:text-red-500">
                    Remove Device
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>
          {type} in {location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {lastReading && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Reading:</span>
              <span className="font-medium">
                {lastReading.value}
                {lastReading.unit}
              </span>
            </div>
          )}

          {batteryLevel !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Battery:</span>
                <span className="font-medium">{batteryLevel}%</span>
              </div>
              <Progress
                value={batteryLevel}
                className={batteryLevel < 20 ? "text-red-500" : batteryLevel < 50 ? "text-yellow-500" : ""}
              />
            </div>
          )}

          {extraDetails &&
            Object.entries(extraDetails).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
        </div>
      </CardContent>
      {(onView || onEdit) && (
        <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(id)}>
              View Details
            </Button>
          )}
          {onEdit && (
            <Button variant="default" size="sm" onClick={() => onEdit(id)}>
              Configure
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

