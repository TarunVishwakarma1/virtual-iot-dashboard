"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import { type Device, type DeviceType, generateInitialDevices, generateRandomData } from "@/lib/device-service"

interface DeviceContextType {
  devices: Device[]
  selectedDevice: Device | null
  setSelectedDevice: (device: Device | null) => void
  addDevice: (name: string, type: DeviceType, location: string) => void
  updateDevice: (id: string, updates: Partial<Device>) => void
  removeDevice: (id: string) => void
  isLoading: boolean
  error: string | null
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize devices
  useEffect(() => {
    try {
      const initialDevices = generateInitialDevices(12)
      setDevices(initialDevices)
      setIsLoading(false)
    } catch (err) {
      setError("Failed to initialize devices")
      setIsLoading(false)
    }
  }, [])

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
            device.type === "temperature" ? 18 : device.type === "humidity" ? 30 : device.type === "light" ? 0 : 0,
            device.type === "temperature" ? 30 : device.type === "humidity" ? 90 : device.type === "light" ? 1000 : 100,
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

          // Update selected device if it's the current one
          if (selectedDevice && selectedDevice.id === device.id) {
            setSelectedDevice({
              ...device,
              status: newStatus,
              lastReading: newReading,
              batteryLevel: newBatteryLevel,
              history: newHistory,
              rewardPoints: newRewardPoints,
            })
          }

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
  }, [selectedDevice])

  // Add a new device
  const addDevice = (name: string, type: DeviceType, location: string) => {
    const newDevice: Device = {
      id: `${devices.length + 1}`,
      name,
      type,
      status: "online",
      lastReading: generateRandomData(
        type === "temperature" ? 18 : type === "humidity" ? 30 : type === "light" ? 0 : 0,
        type === "temperature" ? 30 : type === "humidity" ? 90 : type === "light" ? 1000 : 100,
      ),
      batteryLevel: 100,
      location,
      ipAddress: `192.168.1.${generateRandomData(2, 254)}`,
      macAddress: Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0"),
      )
        .join(":")
        .toUpperCase(),
      firmwareVersion: `v1.0.0`,
      lastUpdated: new Date().toISOString(),
      history: Array.from({ length: 24 }, (_, i) => ({
        timestamp: Date.now() - (23 - i) * 3600000,
        value: generateRandomData(
          type === "temperature" ? 18 : type === "humidity" ? 30 : type === "light" ? 0 : 0,
          type === "temperature" ? 30 : type === "humidity" ? 90 : type === "light" ? 1000 : 100,
        ),
      })),
      rewardPoints: 0,
    }

    setDevices([...devices, newDevice])
    toast.success("Device Added", {
      description: `${name} has been added to your network`,
    })
  }

  // Update device
  const updateDevice = (id: string, updates: Partial<Device>) => {
    setDevices((prevDevices) => prevDevices.map((device) => (device.id === id ? { ...device, ...updates } : device)))

    // Update selectedDevice if it's the one being updated
    if (selectedDevice?.id === id) {
      setSelectedDevice((prev) => (prev ? { ...prev, ...updates } : null))
    }

    toast.success("Device Updated", {
      description: `Device settings have been updated`,
    })
  }

  // Remove device
  const removeDevice = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id))

    if (selectedDevice?.id === id) {
      setSelectedDevice(null)
    }

    toast.success("Device Removed", {
      description: "Device has been removed from your network",
    })
  }

  return (
    <DeviceContext.Provider
      value={{
        devices,
        selectedDevice,
        setSelectedDevice,
        addDevice,
        updateDevice,
        removeDevice,
        isLoading,
        error,
      }}
    >
      {children}
    </DeviceContext.Provider>
  )
}

export function useDevices() {
  const context = useContext(DeviceContext)
  if (context === undefined) {
    throw new Error("useDevices must be used within a DeviceProvider")
  }
  return context
}

