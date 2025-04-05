import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartCardProps {
  title: string
  description?: string
  chart: ReactNode
  toolbar?: ReactNode
  className?: string
}

export function ChartCard({ title, description, chart, toolbar, className }: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {toolbar && <div>{toolbar}</div>}
        </div>
      </CardHeader>
      <CardContent>{chart}</CardContent>
    </Card>
  )
}

