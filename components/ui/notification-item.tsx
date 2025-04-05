"use client"

import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Info, AlertTriangle, CheckCircle } from "lucide-react"

type NotificationType = "info" | "warning" | "success" | "error"

interface NotificationItemProps {
  title: string
  message: string
  timestamp: Date
  type?: NotificationType
  read?: boolean
  onMarkAsRead?: () => void
  className?: string
}

export function NotificationItem({
  title,
  message,
  timestamp,
  type = "info",
  read = false,
  onMarkAsRead,
  className,
}: NotificationItemProps) {
  const typeIcons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertTriangle className="h-5 w-5 text-red-500" />,
  }

  return (
    <div
      className={cn(
        "flex items-start p-4 border-b last:border-b-0 transition-colors",
        !read && "bg-muted/40",
        className,
      )}
      onClick={onMarkAsRead}
    >
      <div className="mr-3 mt-0.5">{typeIcons[type]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <span className="text-xs text-muted-foreground">{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{message}</p>
      </div>
      {!read && <div className="ml-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
    </div>
  )
}

