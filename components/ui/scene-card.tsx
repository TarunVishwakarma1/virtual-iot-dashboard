"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface SceneCardProps {
  title: string
  description: string
  onActivate: () => void
  onEdit: () => void
  icon?: React.ReactNode
  className?: string
}

export function SceneCard({ title, description, onActivate, onEdit, icon, className }: SceneCardProps) {
  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          {icon && <div className="mr-2">{icon}</div>}
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="default" size="sm" onClick={onActivate}>
          <Play className="mr-2 h-4 w-4" />
          Activate
        </Button>
      </CardFooter>
    </Card>
  )
}

