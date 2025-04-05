"use client"

import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Edit } from "lucide-react"
import { cn } from "@/lib/utils"

interface AutomationCardProps {
  title: string
  description: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  onEdit: () => void
  schedule?: string
  className?: string
}

export function AutomationCard({
  title,
  description,
  enabled,
  onToggle,
  onEdit,
  schedule,
  className,
}: AutomationCardProps) {
  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {schedule && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{schedule}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  )
}

