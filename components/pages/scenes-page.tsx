"use client"

import { useState } from "react"
import {
  Copy,
  Edit,
  Home,
  Lightbulb,
  Moon,
  MoreHorizontal,
  Play,
  Plus,
  Settings,
  Sun,
  Trash,
  Tv,
  Utensils,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DeviceProvider } from "@/components/context/device-context"
import { Badge } from "@/components/ui/badge"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Types for scenes
interface SceneDevice {
  id: string
  name: string
  action: string
  value?: string
}

interface Scene {
  id: string
  name: string
  icon: string
  description: string
  devices: SceneDevice[]
  color: string
  createdAt: string
}

// Sample scenes
const sampleScenes: Scene[] = [
  {
    id: "1",
    name: "Good Morning",
    icon: "sun",
    description: "Start your day with the perfect lighting and temperature",
    devices: [
      { id: "1", name: "Bedroom Lights", action: "turn_on" },
      { id: "2", name: "Kitchen Lights", action: "turn_on" },
      { id: "3", name: "Living Room Thermostat", action: "set_temperature", value: "22" },
    ],
    color: "amber",
    createdAt: "2023-02-15T08:30:00",
  },
  {
    id: "2",
    name: "Movie Night",
    icon: "tv",
    description: "Dim the lights and set the perfect movie atmosphere",
    devices: [
      { id: "1", name: "Living Room Lights", action: "dim", value: "20" },
      { id: "4", name: "TV", action: "turn_on" },
      { id: "5", name: "Sound System", action: "turn_on" },
    ],
    color: "blue",
    createdAt: "2023-01-20T19:45:00",
  },
  {
    id: "3",
    name: "Good Night",
    icon: "moon",
    description: "Turn off all lights and set night mode",
    devices: [
      { id: "1", name: "All Lights", action: "turn_off" },
      { id: "3", name: "Living Room Thermostat", action: "set_temperature", value: "19" },
      { id: "6", name: "Front Door", action: "lock" },
    ],
    color: "indigo",
    createdAt: "2023-03-05T22:00:00",
  },
  {
    id: "4",
    name: "Dinner Time",
    icon: "utensils",
    description: "Set the perfect ambiance for dinner",
    devices: [
      { id: "7", name: "Dining Room Lights", action: "dim", value: "50" },
      { id: "8", name: "Kitchen Lights", action: "turn_on" },
      { id: "9", name: "Living Room Lights", action: "turn_off" },
    ],
    color: "rose",
    createdAt: "2023-02-28T18:30:00",
  },
  {
    id: "5",
    name: "Away Mode",
    icon: "home",
    description: "Secure your home when you're away",
    devices: [
      { id: "1", name: "All Lights", action: "turn_off" },
      { id: "6", name: "Front Door", action: "lock" },
      { id: "10", name: "Security System", action: "arm" },
    ],
    color: "emerald",
    createdAt: "2023-01-10T09:15:00",
  },
]

function ScenesContent() {
  const [scenes, setScenes] = useState<Scene[]>(sampleScenes)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)
  const [newScene, setNewScene] = useState<Partial<Scene>>({
    name: "",
    icon: "lightbulb",
    description: "",
    devices: [],
    color: "amber",
  })

  // Get scene icon
  const getSceneIcon = (icon: string) => {
    switch (icon) {
      case "sun":
        return <Sun className="h-6 w-6" />
      case "moon":
        return <Moon className="h-6 w-6" />
      case "tv":
        return <Tv className="h-6 w-6" />
      case "utensils":
        return <Utensils className="h-6 w-6" />
      case "home":
        return <Home className="h-6 w-6" />
      case "lightbulb":
      default:
        return <Lightbulb className="h-6 w-6" />
    }
  }

  // Get color class
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      amber: "bg-amber-500",
      blue: "bg-blue-500",
      indigo: "bg-indigo-500",
      rose: "bg-rose-500",
      emerald: "bg-emerald-500",
      violet: "bg-violet-500",
      cyan: "bg-cyan-500",
      orange: "bg-orange-500",
    }
    return colorMap[color] || "bg-primary"
  }

  // Run scene
  const runScene = (id: string) => {
    const scene = scenes.find((s) => s.id === id)
    if (scene) {
      toast.success(`Scene activated`, {
        description: `"${scene.name}" has been activated`,
      })
    }
  }

  // Delete scene
  const deleteScene = (id: string) => {
    const scene = scenes.find((s) => s.id === id)
    setScenes(scenes.filter((scene) => scene.id !== id))

    if (scene) {
      toast.success(`Scene deleted`, {
        description: `"${scene.name}" has been deleted`,
      })
    }
  }

  // Create new scene
  const createScene = () => {
    if (!newScene.name) {
      toast.error("Scene name required", {
        description: "Please provide a name for your scene",
      })
      return
    }

    const newId = (scenes.length + 1).toString()
    const createdScene: Scene = {
      id: newId,
      name: newScene.name || "New Scene",
      icon: newScene.icon || "lightbulb",
      description: newScene.description || "",
      devices: newScene.devices || [],
      color: newScene.color || "amber",
      createdAt: new Date().toISOString(),
    }

    setScenes([...scenes, createdScene])
    setIsCreating(false)
    setNewScene({
      name: "",
      icon: "lightbulb",
      description: "",
      devices: [],
      color: "amber",
    })

    toast.success("Scene created", {
      description: `"${createdScene.name}" has been created successfully`,
    })
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Scenes</h1>
          <p className="text-muted-foreground">Create and manage scenes to control multiple devices at once</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Scene
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scenes.map((scene) => (
          <Card key={scene.id} className="card-hover overflow-hidden">
            <div className={`h-2 w-full ${getColorClass(scene.color)}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${getColorClass(scene.color)} bg-opacity-20 dark:bg-opacity-30`}>
                    {getSceneIcon(scene.icon)}
                  </div>
                  <CardTitle className="text-lg">{scene.name}</CardTitle>
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
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteScene(scene.id)} className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{scene.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Devices in this scene:</p>
                <ul className="space-y-1">
                  {scene.devices.map((device, index) => (
                    <li key={index} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50">
                      <span>{device.name}</span>
                      <Badge variant="outline">
                        {device.action === "turn_on" && "On"}
                        {device.action === "turn_off" && "Off"}
                        {device.action === "dim" && `Dim ${device.value}%`}
                        {device.action === "set_temperature" && `${device.value}°C`}
                        {device.action === "lock" && "Lock"}
                        {device.action === "arm" && "Arm"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </span>
              </Button>
              <Button onClick={() => runScene(scene.id)}>
                <Play className="mr-2 h-4 w-4" />
                Run Scene
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
          <h3 className="text-lg font-medium mb-1">Create Scene</h3>
          <p className="text-sm text-muted-foreground text-center">Control multiple devices with a single tap</p>
        </Card>
      </div>

      {/* Create scene dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Scene</DialogTitle>
            <DialogDescription>Create a new scene to control multiple devices at once</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Scene Name</Label>
              <Input
                id="name"
                placeholder="Enter a name for this scene"
                value={newScene.name}
                onChange={(e) => setNewScene({ ...newScene, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this scene does"
                value={newScene.description}
                onChange={(e) => setNewScene({ ...newScene, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select value={newScene.icon} onValueChange={(value) => setNewScene({ ...newScene, icon: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lightbulb">Lightbulb</SelectItem>
                    <SelectItem value="sun">Sun</SelectItem>
                    <SelectItem value="moon">Moon</SelectItem>
                    <SelectItem value="tv">TV</SelectItem>
                    <SelectItem value="utensils">Utensils</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <Select value={newScene.color} onValueChange={(value) => setNewScene({ ...newScene, color: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amber">Amber</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="indigo">Indigo</SelectItem>
                    <SelectItem value="rose">Rose</SelectItem>
                    <SelectItem value="emerald">Emerald</SelectItem>
                    <SelectItem value="violet">Violet</SelectItem>
                    <SelectItem value="cyan">Cyan</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Devices</Label>
              <p className="text-sm text-muted-foreground">You can add devices to this scene after creation</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={createScene}>Create Scene</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ScenesPage() {
  return (
    <DeviceProvider>
      <ScenesContent />
    </DeviceProvider>
  )
}

