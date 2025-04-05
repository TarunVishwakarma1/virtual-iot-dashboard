"use client"

import { useState, useEffect } from "react"
import {
  Activity,
  Award,
  Bell,
  Home,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Smartphone,
  Thermometer,
  Wifi,
} from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types for our IoT devices
type DeviceType = "temperature" | "motion" | "connectivity"
type DeviceStatus = "online" | "offline" | "warning"

interface Device {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  lastReading: number
  batteryLevel: number
  location: string
  history: { timestamp: number; value: number }[]
  rewardPoints: number
}

// Generate random data for our devices
const generateRandomData = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Generate a random device
const generateRandomDevice = (id: string): Device => {
  const types: DeviceType[] = ["temperature", "motion", "connectivity"]
  const locations = ["Living Room", "Kitchen", "Bedroom", "Office", "Garage", "Basement"]
  const type = types[Math.floor(Math.random() * types.length)]

  // Generate 24 hours of random data
  const history = Array.from({ length: 24 }, (_, i) => ({
    timestamp: Date.now() - (23 - i) * 3600000,
    value: generateRandomData(type === "temperature" ? 18 : 0, type === "temperature" ? 30 : 100),
  }))

  return {
    id,
    name: `Device ${id}`,
    type,
    status: Math.random() > 0.8 ? (Math.random() > 0.5 ? "offline" : "warning") : "online",
    lastReading: history[history.length - 1].value,
    batteryLevel: generateRandomData(30, 100),
    location: locations[Math.floor(Math.random() * locations.length)],
    history,
    rewardPoints: generateRandomData(0, 1000),
  }
}

// Initial devices
const initialDevices: Device[] = Array.from({ length: 6 }, (_, i) => generateRandomDevice(`${i + 1}`))

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceType, setNewDeviceType] = useState<DeviceType>("temperature")
  const [newDeviceLocation, setNewDeviceLocation] = useState("Living Room")
  const [isAddingDevice, setIsAddingDevice] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prevDevices) =>
        prevDevices.map((device) => {
          // 10% chance to change status
          const newStatus =
            Math.random() > 0.9
              ? Math.random() > 0.5
                ? "offline"
                : "warning"
              : device.status === "offline" && Math.random() > 0.7
                ? "online"
                : device.status

          // Add new reading to history
          const newReading = generateRandomData(
            device.type === "temperature" ? 18 : 0,
            device.type === "temperature" ? 30 : 100,
          )

          const newHistory = [
            ...device.history.slice(1),
            {
              timestamp: Date.now(),
              value: newReading,
            },
          ]

          // Adjust battery level
          const newBatteryLevel = Math.max(1, device.batteryLevel - (Math.random() > 0.8 ? 1 : 0))

          // Add reward points for online devices
          const newRewardPoints =
            device.status === "online" ? device.rewardPoints + (Math.random() > 0.7 ? 5 : 0) : device.rewardPoints

          return {
            ...device,
            status: newStatus,
            lastReading: newReading,
            batteryLevel: newBatteryLevel,
            history: newHistory,
            rewardPoints: newRewardPoints,
          }
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Add a new device
  const handleAddDevice = () => {
    if (!newDeviceName) return

    const newDevice: Device = {
      id: `${devices.length + 1}`,
      name: newDeviceName,
      type: newDeviceType,
      status: "online",
      lastReading: generateRandomData(
        newDeviceType === "temperature" ? 18 : 0,
        newDeviceType === "temperature" ? 30 : 100,
      ),
      batteryLevel: 100,
      location: newDeviceLocation,
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: Date.now() - (23 - i) * 3600000,
        value: generateRandomData(newDeviceType === "temperature" ? 18 : 0, newDeviceType === "temperature" ? 30 : 100),
      })),
      rewardPoints: 0,
    }

    setDevices([...devices, newDevice])
    setNewDeviceName("")
    setIsAddingDevice(false)
  }

  // Remove a device
  const handleRemoveDevice = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id))
    if (selectedDevice?.id === id) {
      setSelectedDevice(null)
    }
  }

  // Get device icon based on type
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case "temperature":
        return <Thermometer className="h-5 w-5" />
      case "motion":
        return <Activity className="h-5 w-5" />
      case "connectivity":
        return <Wifi className="h-5 w-5" />
    }
  }

  // Get status color
  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
    }
  }

  // Format data for charts
  const formatChartData = (device: Device) => {
    return device.history.map((point) => ({
      time: new Date(point.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      value: point.value,
    }))
  }

  // Calculate total stats
  const totalOnline = devices.filter((d) => d.status === "online").length
  const totalOffline = devices.filter((d) => d.status === "offline").length
  const totalWarning = devices.filter((d) => d.status === "warning").length
  const totalRewards = devices.reduce((sum, device) => sum + device.rewardPoints, 0)

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 md:flex">
        <div className="flex h-14 items-center border-b border-gray-200 dark:border-gray-700 px-4">
          <Smartphone className="h-6 w-6 text-blue-500" />
          <span className="ml-2 text-lg font-semibold">IoT Dashboard</span>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <Button variant="ghost" className="justify-start" asChild>
              <a href="#">
                <Home className="mr-2 h-4 w-4" />
                Home
              </a>
            </Button>
            <Button variant="secondary" className="justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <a href="#">
                <Smartphone className="mr-2 h-4 w-4" />
                Devices
              </a>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <a href="#">
                <Award className="mr-2 h-4 w-4" />
                Rewards
              </a>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <a href="#">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </a>
            </Button>
          </nav>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-800 px-4 sm:px-6">
          <Button variant="outline" size="icon" className="md:hidden">
            <Smartphone className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">IoT Network Dashboard</h1>
          </div>
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="Avatar"
                  className="rounded-full"
                  height={32}
                  width={32}
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Dashboard content */}
        <main className="grid gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{devices.length}</div>
                <p className="text-xs text-muted-foreground">
                  {totalOnline} online, {totalWarning} warning, {totalOffline} offline
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Online Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {devices.length > 0 ? Math.round((totalOnline / devices.length) * 100) : 0}%
                </div>
                <Progress value={devices.length > 0 ? (totalOnline / devices.length) * 100 : 0} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Battery Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {devices.length > 0
                    ? Math.round(devices.reduce((sum, device) => sum + device.batteryLevel, 0) / devices.length)
                    : 0}
                  %
                </div>
                <Progress
                  value={
                    devices.length > 0
                      ? devices.reduce((sum, device) => sum + device.batteryLevel, 0) / devices.length
                      : 0
                  }
                  className="mt-2"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Reward Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRewards}</div>
                <p className="text-xs text-muted-foreground">Earn points for keeping devices online</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="devices">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="devices">Devices</TabsTrigger>
                <TabsTrigger value="trends">Data Trends</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>
              <div className="ml-auto">
                <Dialog open={isAddingDevice} onOpenChange={setIsAddingDevice}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Device
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Device</DialogTitle>
                      <DialogDescription>Add a new IoT device to your network.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Device Name</Label>
                        <Input
                          id="name"
                          value={newDeviceName}
                          onChange={(e) => setNewDeviceName(e.target.value)}
                          placeholder="Enter device name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Device Type</Label>
                        <Select value={newDeviceType} onValueChange={(value) => setNewDeviceType(value as DeviceType)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select device type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="temperature">Temperature Sensor</SelectItem>
                            <SelectItem value="motion">Motion Sensor</SelectItem>
                            <SelectItem value="connectivity">Connectivity Device</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Select value={newDeviceLocation} onValueChange={setNewDeviceLocation}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Living Room">Living Room</SelectItem>
                            <SelectItem value="Kitchen">Kitchen</SelectItem>
                            <SelectItem value="Bedroom">Bedroom</SelectItem>
                            <SelectItem value="Office">Office</SelectItem>
                            <SelectItem value="Garage">Garage</SelectItem>
                            <SelectItem value="Basement">Basement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingDevice(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddDevice}>Add Device</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="devices" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {devices.map((device) => (
                  <Card key={device.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getDeviceIcon(device.type)}
                          <CardTitle className="ml-2 text-lg">{device.name}</CardTitle>
                        </div>
                        <Badge
                          variant={device.status === "online" ? "default" : "outline"}
                          className={device.status === "online" ? "" : "text-foreground"}
                        >
                          <span className={`mr-1 h-2 w-2 rounded-full ${getStatusColor(device.status)}`} />
                          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>{device.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Reading:</span>
                          <span className="font-medium">
                            {device.lastReading}
                            {device.type === "temperature" ? "°C" : "%"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Battery:</span>
                          <span className="font-medium">{device.batteryLevel}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Reward Points:</span>
                          <span className="font-medium">{device.rewardPoints}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                      <Button variant="outline" size="sm" onClick={() => setSelectedDevice(device)}>
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => handleRemoveDevice(device.id)}
                      >
                        Remove
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Device details dialog */}
              {selectedDevice && (
                <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        {getDeviceIcon(selectedDevice.type)}
                        <span className="ml-2">{selectedDevice.name}</span>
                        <Badge
                          variant={selectedDevice.status === "online" ? "default" : "outline"}
                          className={`ml-2 ${selectedDevice.status === "online" ? "" : "text-foreground"}`}
                        >
                          <span className={`mr-1 h-2 w-2 rounded-full ${getStatusColor(selectedDevice.status)}`} />
                          {selectedDevice.status.charAt(0).toUpperCase() + selectedDevice.status.slice(1)}
                        </Badge>
                      </DialogTitle>
                      <DialogDescription>
                        {selectedDevice.type.charAt(0).toUpperCase() + selectedDevice.type.slice(1)} sensor in{" "}
                        {selectedDevice.location}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-medium">Recent Readings</h4>
                        <div className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formatChartData(selectedDevice)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="mb-1 text-sm font-medium">Battery Level</h4>
                          <div className="flex items-center">
                            <Progress value={selectedDevice.batteryLevel} className="mr-2" />
                            <span>{selectedDevice.batteryLevel}%</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-medium">Reward Points</h4>
                          <div className="flex items-center">
                            <Award className="mr-2 h-4 w-4 text-yellow-500" />
                            <span>{selectedDevice.rewardPoints} points</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            <TabsContent value="trends" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Trends</CardTitle>
                  <CardDescription>View historical data from all your devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="time"
                          type="category"
                          allowDuplicatedCategory={false}
                          domain={["dataMin", "dataMax"]}
                          tickFormatter={(time) =>
                            new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          }
                        />
                        <YAxis />
                        <Tooltip />
                        {devices.map((device, index) => (
                          <Line
                            key={device.id}
                            data={device.history.map((h) => ({
                              time: h.timestamp,
                              value: h.value,
                            }))}
                            type="monotone"
                            dataKey="value"
                            name={device.name}
                            stroke={`hsl(${index * 40}, 70%, 50%)`}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Rewards Program</CardTitle>
                  <CardDescription>Earn points by keeping your devices online and optimized</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{totalRewards}</h3>
                      <p className="text-sm text-muted-foreground">Total reward points</p>
                    </div>
                    <Button>Redeem Points</Button>
                  </div>

                  <h3 className="mb-4 text-lg font-medium">Top Performing Devices</h3>
                  <div className="space-y-4">
                    {[...devices]
                      .sort((a, b) => b.rewardPoints - a.rewardPoints)
                      .slice(0, 5)
                      .map((device) => (
                        <div key={device.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getDeviceIcon(device.type)}
                            <div className="ml-3">
                              <p className="font-medium">{device.name}</p>
                              <p className="text-sm text-muted-foreground">{device.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Award className="mr-2 h-4 w-4 text-yellow-500" />
                            <span>{device.rewardPoints} points</span>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-medium">How to Earn More Points</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          1
                        </div>
                        <p>Keep devices online and maintain good connectivity</p>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          2
                        </div>
                        <p>Optimize device placement for better signal strength</p>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          3
                        </div>
                        <p>Maintain battery levels above 50% for all devices</p>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          4
                        </div>
                        <p>Add new devices to your network to expand coverage</p>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

