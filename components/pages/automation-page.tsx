"use client"

import { useState } from "react"
import {
  Clock,
  Cloud,
  Copy,
  Edit,
  Home,
  Lightbulb,
  MoreHorizontal,
  Plus,
  Power,
  Trash,
  Wifi,
  Zap,
  Bell,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DeviceProvider } from "@/components/context/device-context"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Types for automations
type TriggerType = "time" | "device" | "location" | "weather"
type ActionType = "device" | "scene" | "notification"

interface Automation {
  id: string
  name: string
  enabled: boolean
  trigger: {
    type: TriggerType
    condition: string
    value: string
  }
  actions: {
    type: ActionType
    target: string
    action: string
  }[]
  lastRun?: string
  nextRun?: string
  createdAt: string
}

// Sample automations
const sampleAutomations: Automation[] = [
  {
    id: "1",
    name: "Evening Lights",
    enabled: true,
    trigger: {
      type: "time",
      condition: "at",
      value: "19:30",
    },
    actions: [
      {
        type: "device",
        target: "Living Room Lights",
        action: "turn_on",
      },
      {
        type: "device",
        target: "Kitchen Lights",
        action: "turn_on",
      },
    ],
    lastRun: "2023-04-04T19:30:00",
    nextRun: "2023-04-05T19:30:00",
    createdAt: "2023-03-15T10:23:45",
  },
  {
    id: "2",
    name: "Morning Routine",
    enabled: true,
    trigger: {
      type: "time",
      condition: "at",
      value: "06:30",
    },
    actions: [
      {
        type: "device",
        target: "Bedroom Lights",
        action: "turn_on",
      },
      {
        type: "device",
        target: "Living Room Thermostat",
        action: "set_temperature",
      },
    ],
    lastRun: "2023-04-05T06:30:00",
    nextRun: "2023-04-06T06:30:00",
    createdAt: "2023-02-20T15:45:12",
  },
  {
    id: "3",
    name: "Low Battery Alert",
    enabled: true,
    trigger: {
      type: "device",
      condition: "battery_below",
      value: "20",
    },
    actions: [
      {
        type: "notification",
        target: "user",
        action: "send_notification",
      },
    ],
    createdAt: "2023-03-28T09:12:33",
  },
  {
    id: "4",
    name: "Away Mode",
    enabled: false,
    trigger: {
      type: "location",
      condition: "exit",
      value: "home",
    },
    actions: [
      {
        type: "scene",
        target: "Away Mode",
        action: "activate",
      },
    ],
    createdAt: "2023-01-10T11:30:22",
  },
  {
    id: "5",
    name: "Rainy Day Lights",
    enabled: true,
    trigger: {
      type: "weather",
      condition: "is",
      value: "rainy",
    },
    actions: [
      {
        type: "device",
        target: "Living Room Lights",
        action: "turn_on",
      },
    ],
    createdAt: "2023-03-05T16:20:10",
  },
]

function AutomationContent() {
  const [automations, setAutomations] = useState<Automation[]>(sampleAutomations)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [newAutomation, setNewAutomation] = useState<Partial<Automation>>({
    name: "",
    enabled: true,
    trigger: {
      type: "time",
      condition: "at",
      value: "",
    },
    actions: [
      {
        type: "device",
        target: "",
        action: "",
      },
    ],
  })

  // Get trigger icon
  const getTriggerIcon = (type: TriggerType) => {
    switch (type) {
      case "time":
        return <Clock className="h-5 w-5 text-primary" />
      case "device":
        return <Wifi className="h-5 w-5 text-info" />
      case "location":
        return <Home className="h-5 w-5 text-success" />
      case "weather":
        return <Cloud className="h-5 w-5 text-warning" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  // Get action icon
  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case "device":
        return <Power className="h-5 w-5 text-primary" />
      case "scene":
        return <Lightbulb className="h-5 w-5 text-warning" />
      case "notification":
        return <Bell className="h-5 w-5 text-info" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  // Toggle automation
  const toggleAutomation = (id: string) => {
    setAutomations(
      automations.map((automation) =>
        automation.id === id ? { ...automation, enabled: !automation.enabled } : automation,
      ),
    )

    const automation = automations.find((a) => a.id === id)
    if (automation) {
      toast.success(`Automation ${automation.enabled ? "disabled" : "enabled"}`, {
        description: `"${automation.name}" has been ${automation.enabled ? "disabled" : "enabled"}`,
      })
    }
  }

  // Delete automation
  const deleteAutomation = (id: string) => {
    const automation = automations.find((a) => a.id === id)
    setAutomations(automations.filter((automation) => automation.id !== id))

    if (automation) {
      toast.success(`Automation deleted`, {
        description: `"${automation.name}" has been deleted`,
      })
    }
  }

  // Create new automation
  const createAutomation = () => {
    if (!newAutomation.name) {
      toast.error("Automation name required", {
        description: "Please provide a name for your automation",
      })
      return
    }

    const newId = (automations.length + 1).toString()
    const createdAutomation: Automation = {
      id: newId,
      name: newAutomation.name || "New Automation",
      enabled: newAutomation.enabled || true,
      trigger: newAutomation.trigger || {
        type: "time",
        condition: "at",
        value: "12:00",
      },
      actions: newAutomation.actions || [
        {
          type: "device",
          target: "Device",
          action: "turn_on",
        },
      ],
      createdAt: new Date().toISOString(),
    }

    setAutomations([...automations, createdAutomation])
    setIsCreating(false)
    setNewAutomation({
      name: "",
      enabled: true,
      trigger: {
        type: "time",
        condition: "at",
        value: "",
      },
      actions: [
        {
          type: "device",
          target: "",
          action: "",
        },
      ],
    })

    toast.success("Automation created", {
      description: `"${createdAutomation.name}" has been created successfully`,
    })
  }

  // Filter automations based on active tab
  const filteredAutomations = automations.filter((automation) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return automation.enabled
    if (activeTab === "inactive") return !automation.enabled
    return true
  })

  return (
    <div className="p-4 md:p-6 space-y-6 w-full animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Automations</h1>
          <p className="text-muted-foreground">Create rules to automate your smart home</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Automation
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAutomations.map((automation) => (
              <Card key={automation.id} className="card-hover">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Zap className={`h-5 w-5 ${automation.enabled ? "text-primary" : "text-muted-foreground"}`} />
                      <CardTitle className="text-lg">{automation.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={automation.enabled} onCheckedChange={() => toggleAutomation(automation.id)} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteAutomation(automation.id)}
                            className="text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardDescription>
                    {automation.lastRun ? `Last run: ${new Date(automation.lastRun).toLocaleString()}` : "Never run"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                      <div className="mt-0.5">{getTriggerIcon(automation.trigger.type)}</div>
                      <div>
                        <p className="text-sm font-medium">When</p>
                        <p className="text-sm">
                          {automation.trigger.type === "time" && `At ${automation.trigger.value}`}
                          {automation.trigger.type === "device" &&
                            `Device ${automation.trigger.condition} ${automation.trigger.value}`}
                          {automation.trigger.type === "location" &&
                            `Location ${automation.trigger.condition} ${automation.trigger.value}`}
                          {automation.trigger.type === "weather" &&
                            `Weather ${automation.trigger.condition} ${automation.trigger.value}`}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Then</p>
                      <div className="space-y-2">
                        {automation.actions.map((action, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                            <div className="mt-0.5">{getActionIcon(action.type)}</div>
                            <div>
                              <p className="text-sm font-medium">{action.target}</p>
                              <p className="text-sm text-muted-foreground">
                                {action.action === "turn_on" && "Turn on"}
                                {action.action === "turn_off" && "Turn off"}
                                {action.action === "set_temperature" && "Set temperature"}
                                {action.action === "activate" && "Activate"}
                                {action.action === "send_notification" && "Send notification"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Badge variant="outline">
                    {automation.nextRun
                      ? `Next: ${new Date(automation.nextRun).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : "On trigger"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Run Now
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Card
              className="flex flex-col items-center justify-center p-6 border-dashed cursor-pointer hover:bg-muted/50 transition-colors h-full"
              onClick={() => setIsCreating(true)}
            >
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">Create Automation</h3>
              <p className="text-sm text-muted-foreground text-center">Set up automated rules for your devices</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create automation dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Automation</DialogTitle>
            <DialogDescription>Set up a new automation rule for your devices</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Automation Name</Label>
              <Input
                id="name"
                placeholder="Enter a name for this automation"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Trigger</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={newAutomation.trigger?.type}
                  onValueChange={(value) =>
                    setNewAutomation({
                      ...newAutomation,
                      trigger: { ...newAutomation.trigger!, type: value as TriggerType },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="device">Device</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="weather">Weather</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={newAutomation.trigger?.condition}
                  onValueChange={(value) =>
                    setNewAutomation({
                      ...newAutomation,
                      trigger: { ...newAutomation.trigger!, condition: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {newAutomation.trigger?.type === "time" && (
                      <>
                        <SelectItem value="at">At</SelectItem>
                        <SelectItem value="after">After</SelectItem>
                        <SelectItem value="before">Before</SelectItem>
                      </>
                    )}
                    {newAutomation.trigger?.type === "device" && (
                      <>
                        <SelectItem value="turns_on">Turns On</SelectItem>
                        <SelectItem value="turns_off">Turns Off</SelectItem>
                        <SelectItem value="battery_below">Battery Below</SelectItem>
                      </>
                    )}
                    {newAutomation.trigger?.type === "location" && (
                      <>
                        <SelectItem value="enter">Enter</SelectItem>
                        <SelectItem value="exit">Exit</SelectItem>
                      </>
                    )}
                    {newAutomation.trigger?.type === "weather" && (
                      <>
                        <SelectItem value="is">Is</SelectItem>
                        <SelectItem value="changes_to">Changes To</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>

                <Input
                  placeholder={newAutomation.trigger?.type === "time" ? "HH:MM" : "Value"}
                  value={newAutomation.trigger?.value}
                  onChange={(e) =>
                    setNewAutomation({
                      ...newAutomation,
                      trigger: { ...newAutomation.trigger!, value: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Action</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={newAutomation.actions?.[0]?.type}
                  onValueChange={(value) =>
                    setNewAutomation({
                      ...newAutomation,
                      actions: [{ ...newAutomation.actions![0], type: value as ActionType }],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="device">Device</SelectItem>
                    <SelectItem value="scene">Scene</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Target"
                  value={newAutomation.actions?.[0]?.target}
                  onChange={(e) =>
                    setNewAutomation({
                      ...newAutomation,
                      actions: [{ ...newAutomation.actions![0], target: e.target.value }],
                    })
                  }
                />

                <Select
                  value={newAutomation.actions?.[0]?.action}
                  onValueChange={(value) =>
                    setNewAutomation({
                      ...newAutomation,
                      actions: [{ ...newAutomation.actions![0], action: value }],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    {newAutomation.actions?.[0]?.type === "device" && (
                      <>
                        <SelectItem value="turn_on">Turn On</SelectItem>
                        <SelectItem value="turn_off">Turn Off</SelectItem>
                        <SelectItem value="set_temperature">Set Temperature</SelectItem>
                      </>
                    )}
                    {newAutomation.actions?.[0]?.type === "scene" && <SelectItem value="activate">Activate</SelectItem>}
                    {newAutomation.actions?.[0]?.type === "notification" && (
                      <SelectItem value="send_notification">Send Notification</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={newAutomation.enabled}
                onCheckedChange={(checked) => setNewAutomation({ ...newAutomation, enabled: checked })}
              />
              <Label htmlFor="enabled">Enable automation</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={createAutomation}>Create Automation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AutomationPage() {
  return (
    <DeviceProvider>
      <AutomationContent />
    </DeviceProvider>
  )
}

