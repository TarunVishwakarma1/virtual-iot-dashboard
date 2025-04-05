"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Award,
  Bell,
  CircuitBoard,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  Lightbulb,
  Menu,
  Plug,
  Settings,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDevices } from "@/components/context/device-context"
import { useNotifications } from "@/components/pages/notifications-page"

export default function AppSidebar() {
  const pathname = usePathname()
  const { devices } = useDevices()
  const { unreadCount } = useNotifications()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Get the count of devices with issues (offline or warning)
  const devicesWithIssues = devices.filter(
    (device) => device.status === "offline" || device.status === "warning",
  ).length

  const isActive = (path: string) => {
    return pathname === path
  }

  // Close mobile sidebar when navigating or clicking outside
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        isMobileMenuOpen &&
        !target.closest('[data-sidebar="true"]') &&
        !target.closest('[data-sidebar-toggle="true"]')
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex h-16 items-center border-b px-6">
        <CircuitBoard className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">IoT Command</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {/* Overview Section */}
          <div className="px-3 py-2">
            <h3 className="mb-2 text-xs font-medium uppercase text-muted-foreground">Overview</h3>
            <div className="space-y-1">
              <NavItem
                href="/dashboard"
                icon={<LayoutDashboard className="h-4 w-4" />}
                label="Dashboard"
                isActive={isActive("/dashboard")}
              />
              <NavItem
                href="/devices"
                icon={<Smartphone className="h-4 w-4" />}
                label="Devices"
                isActive={isActive("/devices")}
                badges={[
                  devicesWithIssues > 0 && {
                    content: devicesWithIssues,
                    variant: "destructive",
                  },
                  {
                    content: devices.length,
                    variant: "outline",
                  },
                ]}
              />
              <NavItem
                href="/analytics"
                icon={<LineChart className="h-4 w-4" />}
                label="Analytics"
                isActive={isActive("/analytics")}
              />
              <NavItem
                href="/reports"
                icon={<FileText className="h-4 w-4" />}
                label="Reports"
                isActive={isActive("/reports")}
              />
              <NavItem
                href="/notifications"
                icon={<Bell className="h-4 w-4" />}
                label="Notifications"
                isActive={isActive("/notifications")}
                badges={[
                  unreadCount > 0 && {
                    content: unreadCount,
                    variant: "default",
                  },
                ]}
              />
            </div>
          </div>

          <div className="mx-3 my-2 h-px bg-border" />

          {/* Management Section */}
          <div className="px-3 py-2">
            <h3 className="mb-2 text-xs font-medium uppercase text-muted-foreground">Management</h3>
            <div className="space-y-1">
              <NavItem
                href="/automation"
                icon={<Zap className="h-4 w-4" />}
                label="Automation"
                isActive={isActive("/automation")}
              />
              <NavItem
                href="/scene"
                icon={<Lightbulb className="h-4 w-4" />}
                label="Scenes"
                isActive={isActive("/scene")}
              />
              <NavItem
                href="/energy"
                icon={<Plug className="h-4 w-4" />}
                label="Energy"
                isActive={isActive("/energy")}
              />
              <NavItem
                href="/rewards"
                icon={<Award className="h-4 w-4" />}
                label="Rewards"
                isActive={isActive("/rewards")}
              />
            </div>
          </div>

          <div className="mx-3 my-2 h-px bg-border" />

          {/* System Section */}
          <div className="px-3 py-2">
            <h3 className="mb-2 text-xs font-medium uppercase text-muted-foreground">System</h3>
            <div className="space-y-1">
              <NavItem
                href="/marketplace"
                icon={<Sparkles className="h-4 w-4" />}
                label="Marketplace"
                isActive={isActive("/marketplace")}
              />
              <NavItem
                href="/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
                isActive={isActive("/settings")}
              />
              <NavItem
                href="/help"
                icon={<HelpCircle className="h-4 w-4" />}
                label="Help & Support"
                isActive={isActive("/help")}
              />
            </div>
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted",
            isActive("/profile") && "bg-primary/10 text-primary",
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="fixed left-4 top-3 z-40 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-sidebar-toggle="true"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-card md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex-col border-r bg-card transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        data-sidebar="true"
      >
        <div className="absolute right-4 top-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close Menu</span>
          </Button>
        </div>
        <SidebarContent />
      </aside>
    </>
  )
}

// Navigation Item Component
function NavItem({
  href,
  icon,
  label,
  isActive,
  badges = [],
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  badges?: Array<{ content: number | string; variant: string } | false>
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {icon}
      <span className="flex-1">{label}</span>

      {badges.filter(Boolean).map((badge, index) => (
        <Badge key={index} variant={badge.variant as any} className={cn("ml-auto text-xs", index > 0 && "ml-1")}>
          {badge.content}
        </Badge>
      ))}
    </Link>
  )
}

