"use client"

import { useState } from "react"
import { Download, FileDown, Filter } from "lucide-react"
import { toast } from "sonner"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts"

import { DeviceProvider, useDevices } from "@/components/context/device-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChartCard } from "@/components/ui/chart-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { getDeviceTypeLabel } from "@/lib/device-service"

function AnalyticsContent() {
  const { devices } = useDevices()
  const [timeRange, setTimeRange] = useState("24h")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  // Get all unique locations from devices
  const locations = ["all", ...new Set(devices.map((device) => device.location))]

  // Get all unique types from devices
  const deviceTypes = [...new Set(devices.map((device) => device.type))]

  // Toggle device type selection
  const toggleDeviceType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  // Filtered devices based on location
  const filteredDevices = devices.filter((device) => locationFilter === "all" || device.location === locationFilter)

  // Filter by selected types if any are selected
  const typeFilteredDevices =
    selectedTypes.length > 0 ? filteredDevices.filter((device) => selectedTypes.includes(device.type)) : filteredDevices

  // Calculate device stats by type
  const devicesByType = deviceTypes.map((type) => ({
    name: getDeviceTypeLabel(type),
    value: devices.filter((d) => d.type === type).length,
  }))

  // Calculate device stats by status
  const devicesByStatus = [
    { name: "Online", value: devices.filter((d) => d.status === "online").length },
    { name: "Offline", value: devices.filter((d) => d.status === "offline").length },
    { name: "Warning", value: devices.filter((d) => d.status === "warning").length },
    { name: "Maintenance", value: devices.filter((d) => d.status === "maintenance").length },
  ]

  // Calculate device stats by location
  const devicesByLocation = [...new Set(devices.map((d) => d.location))].map((location) => ({
    name: location,
    value: devices.filter((d) => d.location === location).length,
  }))

  // Format data for line chart
  const formattedChartData = () => {
    const result: { time: string; [key: string]: any }[] = []

    // Use first device's history timestamps as base
    if (typeFilteredDevices.length > 0) {
      const baseDevice = typeFilteredDevices[0]

      baseDevice.history.forEach((h, i) => {
        const time = new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        const dataPoint: { time: string; [key: string]: any } = { time }

        typeFilteredDevices.forEach((device) => {
          if (i < device.history.length) {
            dataPoint[device.name] = device.history[i].value
          }
        })

        result.push(dataPoint)
      })
    }

    return result
  }

  const handleExportData = () => {
    toast.success("Data Exported", {
      description: "Your data has been exported successfully",
    })
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Analyze your IoT network data</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location === "all" ? "All locations" : location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px]">
              <div className="space-y-4">
                <h4 className="font-medium">Device Types</h4>
                <div className="space-y-2">
                  {deviceTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => toggleDeviceType(type)}
                      />
                      <Label htmlFor={`type-${type}`}>{getDeviceTypeLabel(type)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon" onClick={handleExportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ChartCard
          title="Devices by Type"
          chart={
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devicesByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {devicesByType.map((entry, index) => (
                      <Sector key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          }
        />

        <ChartCard
          title="Devices by Status"
          chart={
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devicesByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {devicesByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === "Online"
                            ? "#22c55e"
                            : entry.name === "Offline"
                              ? "#ef4444"
                              : entry.name === "Warning"
                                ? "#eab308"
                                : "#3b82f6"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          }
        />

        <ChartCard
          title="Devices by Location"
          chart={
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devicesByLocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {devicesByLocation.map((entry, index) => (
                      <Sector key={`cell-${index}`} fill={`hsl(${index * 30}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          }
        />
      </div>

      <ChartCard
        title="Sensor Readings"
        description="Detailed sensor data over time"
        toolbar={
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
        chart={
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                {typeFilteredDevices.map((device, index) => (
                  <Line
                    key={device.id}
                    type="monotone"
                    dataKey={device.name}
                    stroke={`hsl(${index * 20}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Battery Level</span>
                  <span className="text-sm font-medium">
                    {Math.round(devices.reduce((acc, device) => acc + device.batteryLevel, 0) / devices.length)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${Math.round(devices.reduce((acc, device) => acc + device.batteryLevel, 0) / devices.length)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network Uptime</span>
                  <span className="text-sm font-medium">98.7%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary" style={{ width: "98.7%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Transmission Rate</span>
                  <span className="text-sm font-medium">4.2 MB/hour</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary" style={{ width: "65%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Response Time</span>
                  <span className="text-sm font-medium">126ms</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary" style={{ width: "85%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rounded-lg border p-3">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Network Health</h3>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((devices.filter((d) => d.status === "online").length / devices.length) * 100)}% of
                    devices are online, which is above the target of 95%
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-lg border p-3">
                <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
                  <div className="h-4 w-4 rounded-full bg-yellow-500" />
                </div>
                <div>
                  <h3 className="font-medium">Battery Concerns</h3>
                  <p className="text-sm text-muted-foreground">
                    {devices.filter((d) => d.batteryLevel < 30).length} devices have low battery levels (below 30%)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-lg border p-3">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                  <div className="h-4 w-4 rounded-full bg-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Peak Usage</h3>
                  <p className="text-sm text-muted-foreground">Highest activity detected between 18:00 and 22:00</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-lg border p-3">
                <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                  <div className="h-4 w-4 rounded-full bg-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium">Optimization Opportunities</h3>
                  <p className="text-sm text-muted-foreground">3 devices could be relocated for better coverage</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <DeviceProvider>
      <AnalyticsContent />
    </DeviceProvider>
  )
}

