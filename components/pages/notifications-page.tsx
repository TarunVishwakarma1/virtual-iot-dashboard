"use client"

import { useState, useEffect, type ReactNode } from "react"
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowUp,
  Battery,
  Bell,
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  Filter,
  Info,
  Lightbulb,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Smartphone,
  Trash,
  Wifi,
  Search,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DeviceProvider } from "@/components/context/device-context"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

// Create a notification context
import { createContext, useContext } from "react"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  deleteSelectedNotifications: (ids: string[]) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)

  // Simulate new notifications coming in
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% chance to add a new notification
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: `new-${Date.now()}`,
          title: "New Activity Detected",
          message: `New activity detected at ${new Date().toLocaleTimeString()}`,
          timestamp: new Date(),
          type: Math.random() > 0.7 ? "warning" : "info",
          read: false,
          source: Math.random() > 0.5 ? "device" : "system",
          category: ["connectivity", "battery", "updates", "alerts", "security"][Math.floor(Math.random() * 5)],
        }

        setNotifications((prev) => [newNotification, ...prev])

        // Show toast for new notification
        toast.info(newNotification.title, {
          description: newNotification.message,
        })
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    toast.success("All notifications marked as read")
  }

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
    toast.success("Notification deleted")
  }

  // Delete selected notifications
  const deleteSelectedNotifications = (ids: string[]) => {
    setNotifications(notifications.filter((notification) => !ids.includes(notification.id)))
    toast.success(`${ids.length} notifications deleted`)
  }

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteSelectedNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// Types for notifications
type NotificationType = "info" | "warning" | "success" | "error"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  type: NotificationType
  read: boolean
  source: string
  category: string
}

// Sample notifications
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Device Offline",
    message: "Temperature Sensor in Kitchen has gone offline. Please check the device.",
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    type: "error",
    read: false,
    source: "device",
    category: "connectivity",
  },
  {
    id: "2",
    title: "Battery Low",
    message: "Motion Sensor in Garage has low battery (15%). Consider replacing the batteries soon.",
    timestamp: new Date(Date.now() - 60 * 60000), // 1 hour ago
    type: "warning",
    read: false,
    source: "device",
    category: "battery",
  },
  {
    id: "3",
    title: "System Update Available",
    message:
      "A new system update (v2.1.4) is available for your IoT network. This update includes security improvements and bug fixes.",
    timestamp: new Date(Date.now() - 3 * 60 * 60000), // 3 hours ago
    type: "info",
    read: true,
    source: "system",
    category: "updates",
  },
  {
    id: "4",
    title: "Temperature Alert",
    message: "Unusual temperature detected in Living Room (29°C). This is above your set threshold of 26°C.",
    timestamp: new Date(Date.now() - 12 * 60 * 60000), // 12 hours ago
    type: "warning",
    read: false,
    source: "device",
    category: "alerts",
  },
  {
    id: "5",
    title: "New Device Added",
    message: "Humidity Sensor has been successfully added to your network in Bedroom.",
    timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
    type: "success",
    read: true,
    source: "system",
    category: "devices",
  },
  {
    id: "6",
    title: "Motion Detected",
    message: "Motion detected in Garage while you were away. Check your security camera footage.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
    type: "warning",
    read: true,
    source: "device",
    category: "security",
  },
  {
    id: "7",
    title: "Weekly Report Ready",
    message:
      "Your weekly IoT network report is now available. View insights about your device performance and energy usage.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000), // 3 days ago
    type: "info",
    read: true,
    source: "system",
    category: "reports",
  },
  {
    id: "8",
    title: "Firmware Update Completed",
    message: "Firmware update for Living Room Thermostat has been successfully completed.",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60000), // 4 days ago
    type: "success",
    read: true,
    source: "device",
    category: "updates",
  },
  {
    id: "9",
    title: "Connection Restored",
    message: "Kitchen Lights are back online after 25 minutes of disconnection.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60000), // 5 days ago
    type: "success",
    read: true,
    source: "device",
    category: "connectivity",
  },
  {
    id: "10",
    title: "Energy Usage Alert",
    message: "Unusual energy consumption detected. Your daily usage is 30% higher than average.",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60000), // 6 days ago
    type: "warning",
    read: true,
    source: "system",
    category: "energy",
  },
]

function NotificationsContent() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, deleteSelectedNotifications } =
    useNotifications()

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "connectivity":
        return <Wifi className="h-5 w-5 text-blue-500" />
      case "battery":
        return <Battery className="h-5 w-5 text-amber-500" />
      case "updates":
        return <RefreshCw className="h-5 w-5 text-green-500" />
      case "alerts":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "devices":
        return <Smartphone className="h-5 w-5 text-purple-500" />
      case "security":
        return <Activity className="h-5 w-5 text-red-500" />
      case "reports":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "energy":
        return <Lightbulb className="h-5 w-5 text-amber-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  // Filter notifications based on active tab, search query, and filters
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by tab
    if (activeTab === "unread" && notification.read) return false
    if (activeTab === "read" && !notification.read) return false

    // Filter by search query
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by type
    const matchesType = typeFilter === "all" || notification.type === typeFilter

    // Filter by category
    const matchesCategory = categoryFilter === "all" || notification.category === categoryFilter

    return matchesSearch && matchesType && matchesCategory
  })

  // Sort notifications
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.timestamp.getTime() - a.timestamp.getTime()
    } else {
      return a.timestamp.getTime() - b.timestamp.getTime()
    }
  })

  // Toggle notification selection
  const toggleNotificationSelection = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter((notificationId) => notificationId !== id))
    } else {
      setSelectedNotifications([...selectedNotifications, id])
    }
  }

  // Select all visible notifications
  const selectAllVisible = () => {
    if (selectedNotifications.length === sortedNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(sortedNotifications.map((notification) => notification.id))
    }
  }

  // Get unique categories
  const categories = ["all", ...new Set(notifications.map((notification) => notification.category))]

  // Delete selected notifications
  const handleDeleteSelected = () => {
    deleteSelectedNotifications(selectedNotifications)
    setSelectedNotifications([])
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with alerts and information about your IoT network
            {unreadCount > 0 && ` • ${unreadCount} unread`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              <div className="p-2">
                <div className="mb-4">
                  <Label className="text-xs">Notification Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="warning">Warnings</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Errors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4">
                  <Label className="text-xs">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4">
                  <Label className="text-xs">Sort Order</Label>
                  <div className="flex items-center justify-between mt-1">
                    <Button
                      variant={sortOrder === "newest" ? "default" : "outline"}
                      size="sm"
                      className="w-[48%]"
                      onClick={() => setSortOrder("newest")}
                    >
                      <ArrowDown className="mr-1 h-3 w-3" />
                      Newest
                    </Button>
                    <Button
                      variant={sortOrder === "oldest" ? "default" : "outline"}
                      size="sm"
                      className="w-[48%]"
                      onClick={() => setSortOrder("oldest")}
                    >
                      <ArrowUp className="mr-1 h-3 w-3" />
                      Oldest
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setTypeFilter("all")
                    setCategoryFilter("all")
                    setSortOrder("newest")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && <Badge className="ml-1 bg-primary">{unreadCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>

            <div className="relative w-full max-w-sm ml-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notifications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </Tabs>
      </div>

      <Card>
        <CardHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={
                  selectedNotifications.length > 0 &&
                  selectedNotifications.length === notifications.length &&
                  selectedNotifications.length === sortedNotifications.length
                }
                onCheckedChange={selectAllVisible}
              />
              <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                Select All
              </Label>
            </div>

            {selectedNotifications.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{selectedNotifications.length} selected</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={handleDeleteSelected}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {sortedNotifications.length > 0 ? (
            <div className="divide-y">
              {sortedNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 mr-3">
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onCheckedChange={() => toggleNotificationSelection(notification.id)}
                    />
                    <div
                      className={`rounded-full p-2 ${
                        notification.type === "info"
                          ? "bg-blue-100 dark:bg-blue-900"
                          : notification.type === "warning"
                            ? "bg-amber-100 dark:bg-amber-900"
                            : notification.type === "success"
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-red-100 dark:bg-red-900"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0" onClick={() => markAsRead(notification.id)}>
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline" className="whitespace-nowrap">
                          {getCategoryIcon(notification.category)}
                          <span className="ml-1 text-xs capitalize">{notification.category}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.timestamp.toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {notification.message}
                    </p>
                  </div>

                  {!notification.read && <div className="ml-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Read
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteNotification(notification.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notifications found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : activeTab === "unread"
                    ? "You're all caught up!"
                    : "No notifications to display"}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {sortedNotifications.length} of {notifications.length} notifications
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch id="auto-archive" />
                <Label htmlFor="auto-archive" className="text-sm">
                  Auto-archive read notifications
                </Label>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Notification Settings
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <DeviceProvider>
      <NotificationProvider>
        <NotificationsContent />
      </NotificationProvider>
    </DeviceProvider>
  )
}

