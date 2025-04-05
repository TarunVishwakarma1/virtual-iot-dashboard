"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface ReportCardProps {
  title: string
  description: string
  date: Date
  type: string
  onView: () => void
  onDownload: () => void
  className?: string
}

export function ReportCard({ title, description, date, type, onView, onDownload, className }: ReportCardProps) {
  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Date:</div>
          <div>{format(date, "MMM d, yyyy")}</div>
          <div className="text-muted-foreground">Type:</div>
          <div>{type}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        <Button variant="default" size="sm" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}

