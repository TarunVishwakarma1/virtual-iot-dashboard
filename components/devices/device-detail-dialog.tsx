"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Power, RefreshCw, Trash, Wifi } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { toast } from "sonner"

import { type Device, type DeviceType, formatChartData, getDeviceReadingUnit } from "@/lib/device-service"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/ui/status-badge"
import { useDevices } from "@/components/context/device-context"

interface DeviceDetailDialogProps {
  device: Device | null
  onClose: () => void
}

export function DeviceDetailDialog({ device, onClose }: DeviceDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { updateDevice, removeDevice } = useDevices()

  if (!device) return null

  const handleRestartDevice = () => {
    toast.info("Restarting Device", {
      description: `${device.name} is restarting. This may take a moment.`,
    })

    // Simulate restart
    updateDevice(device.id, { status: "maintenance" })

    setTimeout(() => {
      updateDevice(device.id, { status: "online" })
      toast.success("Device Restarted", {
        description: `${device.name} has been successfully restarted.`,
      })
    }, 5000)
  }

  const handleRemoveDevice = () => {
    removeDevice(device.id)
    onClose()
  }

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      default:
        return <Wifi className="h-5 w-5" />
    }
  }

  const readingUnit = getDeviceReadingUnit(device.type)

  return (
    <Dialog open={!!device} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DialogTitle className="flex items-center gap-2">
                {getDeviceIcon(device.type)}
                <span>{device.name}</span>
                <StatusBadge status={device.status} className="ml-2" />
              </DialogTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Device
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRestartDevice}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restart Device
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Power className="mr-2 h-4 w-4" />
                  Toggle Power
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleRemoveDevice} className="text-red-500">
                  <Trash className="mr-2 h-4 w-4" />
                  Remove Device
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DialogDescription>
            {device.type.charAt(0).toUpperCase() + device.type.slice(1)} sensor in {device.location}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Location</h4>
                <p>{device.location}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Status</h4>
                <StatusBadge status={device.status} />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Battery Level</h4>
                <div className="flex items-center">
                  <Progress value={device.batteryLevel} className="mr-2" />
                  <span>{device.batteryLevel}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Last Reading</h4>
                <p>
                  {device.lastReading}
                  {readingUnit}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">IP Address</h4>
                <p>{device.ipAddress || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">MAC Address</h4>
                <p>{device.macAddress || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Firmware</h4>
                <p>{device.firmwareVersion || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Last Updated</h4>
                <p>{device.lastUpdated ? new Date(device.lastUpdated).toLocaleString() : "N/A"}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recent Readings</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData(device)}>
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

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
                  <div className="text-sm font-medium">Min</div>
                  <div className="text-2xl font-bold">
                    {Math.min(...device.history.map((h) => h.value))}
                    {readingUnit}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
                  <div className="text-sm font-medium">Max</div>
                  <div className="text-2xl font-bold">
                    {Math.max(...device.history.map((h) => h.value))}
                    {readingUnit}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
                  <div className="text-sm font-medium">Average</div>
                  <div className="text-2xl font-bold">
                    {Math.round(device.history.reduce((acc, h) => acc + h.value, 0) / device.history.length)}
                    {readingUnit}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Device Details
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleRestartDevice}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restart Device
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Power className="mr-2 h-4 w-4" />
                  Toggle Power
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Wifi className="mr-2 h-4 w-4" />
                  Test Connectivity
                </Button>
              </div>

              <div className="pt-4">
                <h3 className="mb-4 text-lg font-medium">Danger Zone</h3>
                <Button variant="destructive" onClick={handleRemoveDevice} className="w-full sm:w-auto">
                  <Trash className="mr-2 h-4 w-4" />
                  Remove Device
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

