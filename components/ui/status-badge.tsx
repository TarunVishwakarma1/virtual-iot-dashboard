import { Badge } from "@/components/ui/badge"

export type StatusType = "online" | "offline" | "warning" | "maintenance"

interface StatusBadgeProps {
  status: StatusType
  showDot?: boolean
  className?: string
}

export function StatusBadge({ status, showDot = true, className }: StatusBadgeProps) {
  const statusConfig = {
    online: {
      label: "Online",
      variant: "default",
      dotColor: "bg-green-500",
    },
    offline: {
      label: "Offline",
      variant: "outline" as const,
      dotColor: "bg-red-500",
    },
    warning: {
      label: "Warning",
      variant: "outline" as const,
      dotColor: "bg-yellow-500",
    },
    maintenance: {
      label: "Maintenance",
      variant: "outline" as const,
      dotColor: "bg-blue-500",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={className}>
      {showDot && <span className={`mr-1 h-2 w-2 rounded-full ${config.dotColor}`} />}
      {config.label}
    </Badge>
  )
}

