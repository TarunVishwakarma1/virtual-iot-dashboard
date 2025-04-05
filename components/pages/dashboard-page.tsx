"use client"

import { useState } from "react"
import {
  Activity,
  Award,
  Battery,
  BatteryCharging,
  Calendar,
  ChevronRight,
  Clock,
  Cloud,
  CpuIcon,
  ExternalLink,
  Eye,
  Home,
  Info,
  Lightbulb,
  Plus,
  RefreshCw,
  Smartphone,
  Thermometer,
  Wifi,
  Zap,
} from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { DeviceCard } from "@/components/ui/device-card"
import { ChartCard } from "@/components/ui/chart-card"
import { DeviceProvider, useDevices } from "@/components/context/device-context"
import { DeviceDetailDialog } from "@/components/devices/device-detail-dialog"
import { AddDeviceDialog } from "@/components/devices/add-device-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

function DashboardContent() {
  const { devices, selectedDevice, setSelectedDevice, removeDevice } = useDevices()
  const [isAddingDevice, setIsAddingDevice] = useState(false)
  const [timeRange, setTimeRange] = useState("24h")

  // Calculate total stats
  const totalOnline = devices.filter((d) => d.status === "online").length
  const totalOffline = devices.filter((d) => d.status === "offline").length
  const totalWarning = devices.filter((d) => d.status === "warning").length
  const totalRewards = devices.reduce((sum, device) => sum + device.rewardPoints, 0)

  // Get device icon based on type
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return <Thermometer className="h-5 w-5" />
      case "motion":
        return <Activity className="h-5 w-5" />
      case "connectivity":
        return <Wifi className="h-5 w-5" />
      case "humidity":
        return <Cloud className="h-5 w-5" />
      case "light":
        return <Lightbulb className="h-5 w-5" />
      default:
        return <Smartphone className="h-5 w-5" />
    }
  }

  // Format temperature data for charts
  const temperatureChartData = () => {
    const tempDevices = devices.filter((d) => d.type === "temperature")
    return tempDevices.map((device) => ({
      name: device.name,
      data: device.history.map((h) => ({
        time: new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        value: h.value,
      })),
    }))
  }

  // Latest activity data
  const latestActivities = [
    { id: 1, type: "device_online", device: "Temperature Sensor 3", time: "5 minutes ago" },
    { id: 2, type: "battery_low", device: "Motion Sensor 1", time: "1 hour ago" },
    { id: 3, type: "firmware_update", device: "System", time: "2 hours ago" },
    { id: 4, type: "new_device", device: "Humidity Sensor 2", time: "Yesterday" },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "device_online":
        return <Wifi className="h-4 w-4 text-success" />
      case "battery_low":
        return <Battery className="h-4 w-4 text-warning" />
      case "firmware_update":
        return <RefreshCw className="h-4 w-4 text-info" />
      case "new_device":
        return <Plus className="h-4 w-4 text-primary" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Energy consumption data
  const energyData = [
    { time: "00:00", value: 2.3 },
    { time: "04:00", value: 1.8 },
    { time: "08:00", value: 3.5 },
    { time: "12:00", value: 4.2 },
    { time: "16:00", value: 3.8 },
    { time: "20:00", value: 4.5 },
    { time: "23:59", value: 3.2 },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6 w-full animate-slide-in">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, John</h1>
          <p className="text-muted-foreground">Here's what's happening with your IoT network today</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setIsAddingDevice(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Device</span>
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Devices"
          value={devices.length}
          description={`${totalOnline} online, ${totalWarning} warning, ${totalOffline} offline`}
          icon={<Smartphone className="h-5 w-5 text-primary" />}
          className="card-hover"
        />

        <StatCard
          title="Network Status"
          value={`${devices.length > 0 ? Math.round((totalOnline / devices.length) * 100) : 0}%`}
          progress={devices.length > 0 ? (totalOnline / devices.length) * 100 : 0}
          trend={{ value: 2.5, label: "from last week" }}
          icon={<Wifi className="h-5 w-5 text-success" />}
          className="card-hover"
        />

        <StatCard
          title="Battery Health"
          value={`${
            devices.length > 0
              ? Math.round(devices.reduce((sum, device) => sum + device.batteryLevel, 0) / devices.length)
              : 0
          }%`}
          progress={
            devices.length > 0 ? devices.reduce((sum, device) => sum + device.batteryLevel, 0) / devices.length : 0
          }
          trend={{ value: -1.5, label: "from last week" }}
          icon={<BatteryCharging className="h-5 w-5 text-warning" />}
          className="card-hover"
        />

        <StatCard
          title="Reward Points"
          value={totalRewards}
          description="Earn points for keeping devices online"
          trend={{ value: 5, label: "from last week" }}
          icon={<Award className="h-5 w-5 text-primary" />}
          className="card-hover"
        />
      </div>

      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Temperature chart */}
        <div className="md:col-span-2">
          <ChartCard
            title="Temperature Trends"
            description="Temperature readings over the past 24 hours"
            toolbar={
              <Button variant="outline" size="sm" asChild>
                <Link href="/analytics">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Details</span>
                </Link>
              </Button>
            }
            chart={
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      type="category"
                      allowDuplicatedCategory={false}
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      width={30}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        fontSize: "12px",
                      }}
                    />
                    {temperatureChartData().map((s, index) => (
                      <Line
                        key={s.name}
                        data={s.data}
                        type="monotone"
                        dataKey="value"
                        name={s.name}
                        stroke={`hsl(var(--chart-${index + 1}))`}
                        strokeWidth={2}
                        dot={{ r: 3, fill: `hsl(var(--chart-${index + 1}))` }}
                        activeDot={{ r: 5, fill: `hsl(var(--chart-${index + 1}))` }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            }
            className="card-hover"
          />
        </div>

        {/* Activity feed */}
        <div>
          <Card className="h-full card-hover">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Activity</span>
                <Badge variant="outline">Live</Badge>
              </CardTitle>
              <CardDescription>Latest events from your network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="mt-0.5 bg-muted rounded-full p-1.5">{getActivityIcon(activity.type)}</div>
                    <div>
                      <p className="text-sm font-medium">{activity.device}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/notifications">
                  View All Activity
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Energy consumption */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-warning" />
                Energy Consumption
              </CardTitle>
              <CardDescription>Today's energy usage across all devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      unit="kWh"
                      tick={{ fontSize: 12 }}
                      width={45}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [`${value} kWh`, "Energy"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Energy"
                      stroke="hsl(var(--warning))"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "hsl(var(--warning))" }}
                      activeDot={{ r: 5, fill: "hsl(var(--warning))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="rounded-lg bg-muted p-2 sm:p-3">
                  <p className="text-xs text-muted-foreground">Today</p>
                  <p className="text-sm sm:text-lg font-bold">23.4 kWh</p>
                </div>
                <div className="rounded-lg bg-muted p-2 sm:p-3">
                  <p className="text-xs text-muted-foreground">This Week</p>
                  <p className="text-sm sm:text-lg font-bold">142.8 kWh</p>
                </div>
                <div className="rounded-lg bg-muted p-2 sm:p-3">
                  <p className="text-xs text-muted-foreground">This Month</p>
                  <p className="text-sm sm:text-lg font-bold">518.2 kWh</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="ml-auto">
                <Link href="/energy">
                  View Energy Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="h-full card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Upcoming Automations
              </CardTitle>
              <CardDescription>Scheduled tasks for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Evening Lights</p>
                      <p className="text-xs text-muted-foreground">Triggers at sunset</p>
                    </div>
                  </div>
                  <Badge variant="outline">7:42 PM</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Thermometer className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Adjust Temperature</p>
                      <p className="text-xs text-muted-foreground">Lower temperature at night</p>
                    </div>
                  </div>
                  <Badge variant="outline">10:00 PM</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Home className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Good Morning</p>
                      <p className="text-xs text-muted-foreground">Morning routine activation</p>
                    </div>
                  </div>
                  <Badge variant="outline">6:30 AM</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/automation">
                  Manage Automations
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Devices section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Devices</h2>
          <Button variant="outline" asChild>
            <Link href="/devices">
              View All Devices
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {devices.slice(0, 8).map((device) => (
            <DeviceCard
              key={device.id}
              id={device.id}
              name={device.name}
              type={device.type}
              status={device.status}
              location={device.location}
              batteryLevel={device.batteryLevel}
              lastReading={{ value: device.lastReading, unit: device.type === "temperature" ? "°C" : "%" }}
              icon={getDeviceIcon(device.type)}
              onView={() => setSelectedDevice(device)}
              onRemove={removeDevice}
              extraDetails={{
                "Reward Points": device.rewardPoints,
              }}
              className="card-hover"
            />
          ))}

          <Card
            className="flex flex-col items-center justify-center p-6 border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setIsAddingDevice(true)}
          >
            <div className="rounded-full bg-primary/10 p-3 mb-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">Add New Device</h3>
            <p className="text-sm text-muted-foreground text-center">Connect a new device to your network</p>
          </Card>
        </div>
      </div>

      {/* Tips and insights */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5 text-info" />
              Quick Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Optimize your device placement for better signal strength and battery life. Devices near windows tend to
              have better connectivity.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/help">
                Learn More
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5 text-info" />
              Did You Know?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              You can create automated scenes to control multiple devices at once. Try setting up a "Movie Night" scene
              to adjust lights and temperature.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/scenes">
                Create Scene
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CpuIcon className="mr-2 h-5 w-5 text-info" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">System</span>
                <Badge variant="outline" className="bg-success/10 text-success">
                  Healthy
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Last Backup</span>
                <span className="text-sm text-muted-foreground">2 days ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Updates</span>
                <Badge variant="outline">Available</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">
                System Settings
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Device details dialog */}
      <DeviceDetailDialog device={selectedDevice} onClose={() => setSelectedDevice(null)} />

      {/* Add device dialog */}
      <AddDeviceDialog open={isAddingDevice} onOpenChange={setIsAddingDevice} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DeviceProvider>
      <DashboardContent />
    </DeviceProvider>
  )
}

