// Types for our IoT devices
export type DeviceType = "temperature" | "motion" | "connectivity" | "humidity" | "light" | "security"
export type DeviceStatus = "online" | "offline" | "warning" | "maintenance"

export interface Device {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  lastReading: number
  batteryLevel: number
  location: string
  ipAddress?: string
  macAddress?: string
  firmwareVersion?: string
  lastUpdated?: string
  history: { timestamp: number; value: number }[]
  rewardPoints: number
}

// Generate random data for our devices
export const generateRandomData = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Generate a random device
export const generateRandomDevice = (id: string): Device => {
  const types: DeviceType[] = ["temperature", "motion", "connectivity", "humidity", "light", "security"]
  const locations = [
    "Living Room",
    "Kitchen",
    "Bedroom",
    "Office",
    "Garage",
    "Basement",
    "Hallway",
    "Bathroom",
    "Patio",
  ]
  const type = types[Math.floor(Math.random() * types.length)]
  const macBytes = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0"),
  )
  const macAddress = macBytes.join(":").toUpperCase()

  const ipOctets = Array.from({ length: 4 }, (_, i) =>
    i === 0 ? 192 : i === 1 ? 168 : Math.floor(Math.random() * 256),
  )
  const ipAddress = ipOctets.join(".")

  // Generate 24 hours of random data
  const history = Array.from({ length: 24 }, (_, i) => ({
    timestamp: Date.now() - (23 - i) * 3600000,
    value: generateRandomData(
      type === "temperature" ? 18 : type === "humidity" ? 30 : type === "light" ? 0 : 0,
      type === "temperature" ? 30 : type === "humidity" ? 90 : type === "light" ? 1000 : 100,
    ),
  }))

  return {
    id,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Sensor ${id}`,
    type,
    status: Math.random() > 0.8 ? (Math.random() > 0.5 ? "offline" : "warning") : "online",
    lastReading: history[history.length - 1].value,
    batteryLevel: generateRandomData(30, 100),
    location: locations[Math.floor(Math.random() * locations.length)],
    ipAddress,
    macAddress,
    firmwareVersion: `v${generateRandomData(1, 3)}.${generateRandomData(0, 9)}.${generateRandomData(0, 9)}`,
    lastUpdated: new Date(Date.now() - generateRandomData(1, 30) * 86400000).toISOString(),
    history,
    rewardPoints: generateRandomData(0, 1000),
  }
}

// Initial devices - more of them
export const generateInitialDevices = (count = 12): Device[] =>
  Array.from({ length: count }, (_, i) => generateRandomDevice(`${i + 1}`))

// Device data transformation helpers
export const formatChartData = (device: Device) => {
  return device.history.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    value: point.value,
  }))
}

// Get device type label
export const getDeviceTypeLabel = (type: DeviceType): string => {
  const labels: Record<DeviceType, string> = {
    temperature: "Temperature Sensor",
    motion: "Motion Sensor",
    connectivity: "Connectivity Device",
    humidity: "Humidity Sensor",
    light: "Light Sensor",
    security: "Security Device",
  }
  return labels[type] || type
}

// Get device reading unit
export const getDeviceReadingUnit = (type: DeviceType): string => {
  const units: Record<DeviceType, string> = {
    temperature: "°C",
    humidity: "%",
    motion: "%",
    connectivity: "Mbps",
    light: "lux",
    security: "",
  }
  return units[type]
}

