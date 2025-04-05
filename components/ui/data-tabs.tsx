"use client"

import type { ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export interface DataTab {
  id: string
  label: string
  icon?: ReactNode
  content: ReactNode
}

interface DataTabsProps {
  tabs: DataTab[]
  defaultValue?: string
  className?: string
}

export function DataTabs({ tabs, defaultValue, className }: DataTabsProps) {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.id} className={className}>
      <div className="flex items-center">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1">
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

