"use client"

import type React from "react"

import { useState } from "react"
import { type DeviceType, getDeviceTypeLabel } from "@/lib/device-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDevices } from "@/components/context/device-context"

interface AddDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
}

export function AddDeviceDialog({ open, onOpenChange, trigger }: AddDeviceDialogProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<DeviceType>("temperature")
  const [location, setLocation] = useState("Living Room")
  const { addDevice } = useDevices()

  const handleSubmit = () => {
    if (!name) return

    addDevice(name, type, location)
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setType("temperature")
    setLocation("Living Room")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) resetForm()
      }}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>Add a new IoT device to your network.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Device Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter device name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Device Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as DeviceType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temperature">{getDeviceTypeLabel("temperature")}</SelectItem>
                <SelectItem value="motion">{getDeviceTypeLabel("motion")}</SelectItem>
                <SelectItem value="connectivity">{getDeviceTypeLabel("connectivity")}</SelectItem>
                <SelectItem value="humidity">{getDeviceTypeLabel("humidity")}</SelectItem>
                <SelectItem value="light">{getDeviceTypeLabel("light")}</SelectItem>
                <SelectItem value="security">{getDeviceTypeLabel("security")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
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
                <SelectItem value="Hallway">Hallway</SelectItem>
                <SelectItem value="Bathroom">Bathroom</SelectItem>
                <SelectItem value="Patio">Patio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Device</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

