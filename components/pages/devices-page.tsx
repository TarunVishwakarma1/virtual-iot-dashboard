"use client"

import { useState } from "react"
import { Database, Grid, List, Plus, Settings, Smartphone } from "lucide-react"
import { toast } from "sonner"

import { DeviceProvider, useDevices } from "@/components/context/device-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeviceCard } from "@/components/ui/device-card"
import { DeviceDetailDialog } from "@/components/devices/device-detail-dialog"
import { AddDeviceDialog } from "@/components/devices/add-device-dialog"
import { getDeviceTypeLabel } from "@/lib/device-service"

function DevicesContent() {
  const { devices, selectedDevice, setSelectedDevice, removeDevice } = useDevices()
  const [isAddingDevice, setIsAddingDevice] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Get device icon based on type
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return <Smartphone className="h-5 w-5" />
      case "motion":
        return <Smartphone className="h-5 w-5" />
      case "connectivity":
        return <Smartphone className="h-5 w-5" />
      case "humidity":
        return <Smartphone className="h-5 w-5" />
      default:
        return <Smartphone className="h-5 w-5" />
    }
  }

  // Get all unique locations from devices
  const locations = [...new Set(devices.map((device) => device.location))]

  // Get all unique types from devices
  const types = [...new Set(devices.map((device) => device.type))]

  // Filter devices based on search query and filters
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLocation = locationFilter === "all" || device.location === locationFilter
    const matchesType = typeFilter === "all" || device.type === typeFilter
    const matchesStatus = statusFilter === "all" || device.status === statusFilter

    return matchesSearch && matchesLocation && matchesType && matchesStatus
  })

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Devices</h1>
          <p className="text-muted-foreground">Manage and monitor your IoT devices</p>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-1">
                <Grid className="h-4 w-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button onClick={() => setIsAddingDevice(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-72 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {getDeviceTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery("")
                  setLocationFilter("all")
                  setTypeFilter("all")
                  setStatusFilter("all")
                  toast.success("Filters reset", {
                    description: "All filters have been reset to default values",
                  })
                }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Devices:</span>
                <span className="font-medium">{devices.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Online:</span>
                <span className="font-medium">{devices.filter((d) => d.status === "online").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Offline:</span>
                <span className="font-medium">{devices.filter((d) => d.status === "offline").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Warning:</span>
                <span className="font-medium">{devices.filter((d) => d.status === "warning").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Maintenance:</span>
                <span className="font-medium">{devices.filter((d) => d.status === "maintenance").length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          {viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  id={device.id}
                  name={device.name}
                  type={device.type}
                  status={device.status}
                  location={device.location}
                  batteryLevel={device.batteryLevel}
                  lastReading={{
                    value: device.lastReading,
                    unit:
                      device.type === "temperature"
                        ? "°C"
                        : device.type === "humidity"
                          ? "%"
                          : device.type === "connectivity"
                            ? "Mbps"
                            : "%",
                  }}
                  icon={getDeviceIcon(device.type)}
                  onView={() => setSelectedDevice(device)}
                  onEdit={() => setSelectedDevice(device)}
                  onRemove={removeDevice}
                  extraDetails={{
                    "Reward Points": device.rewardPoints,
                  }}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-full 
                          ${
                            device.status === "online"
                              ? "bg-green-100 dark:bg-green-900"
                              : device.status === "offline"
                                ? "bg-red-100 dark:bg-red-900"
                                : device.status === "warning"
                                  ? "bg-yellow-100 dark:bg-yellow-900"
                                  : "bg-blue-100 dark:bg-blue-900"
                          }`}
                        >
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{device.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {device.location} • {getDeviceTypeLabel(device.type)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-right hidden md:block">
                          <div>
                            {device.lastReading}
                            {device.type === "temperature" ? "°C" : "%"}
                          </div>
                          <div className="text-muted-foreground">Battery: {device.batteryLevel}%</div>
                        </div>
                        <div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs
                            ${
                              device.status === "online"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                                : device.status === "offline"
                                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                                  : device.status === "warning"
                                    ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                                    : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                            }`}
                          >
                            {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedDevice(device)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredDevices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No devices found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsAddingDevice(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Device
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Device details dialog */}
      <DeviceDetailDialog device={selectedDevice} onClose={() => setSelectedDevice(null)} />

      {/* Add device dialog */}
      <AddDeviceDialog open={isAddingDevice} onOpenChange={setIsAddingDevice} />
    </div>
  )
}

export default function DevicesPage() {
  return (
    <DeviceProvider>
      <DevicesContent />
    </DeviceProvider>
  )
}

