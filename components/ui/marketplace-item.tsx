"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface MarketplaceItemProps {
  title: string
  description: string
  image: string
  rating: number
  price?: string
  category: string
  onInstall: () => void
  className?: string
}

export function MarketplaceItem({
  title,
  description,
  image,
  rating,
  price,
  category,
  onInstall,
  className,
}: MarketplaceItemProps) {
  return (
    <Card className={cn("border shadow-sm overflow-hidden", className)}>
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="px-2 py-0 text-xs">
            {category}
          </Badge>
          <div className="flex items-center text-amber-500">
            <Star className="mr-1 h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        <CardTitle className="text-lg font-medium mt-2">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="font-medium">{price ? price : "Free"}</div>
        <Button variant="default" size="sm" onClick={onInstall}>
          <Download className="mr-2 h-4 w-4" />
          Install
        </Button>
      </CardFooter>
    </Card>
  )
}

