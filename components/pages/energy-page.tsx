"use client"

import { useState } from "react"
import {
  Battery,
  Calendar,
  ChevronRight,
  Download,
  Info,
  Lightbulb,
  Plug,
  Settings,
  Smartphone,
  Thermometer,
  Zap,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DeviceProvider } from "@/components/context/device-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

// Sample energy data
const dailyEnergyData = [
  { time: "00:00", value: 2.3 },
  { time: "02:00", value: 1.8 },
  { time: "04:00", value: 1.5 },
  { time: "06:00", value: 2.0 },
  { time: "08:00", value: 3.5 },
  { time: "10:00", value: 4.0 },
  { time: "12:00", value: 4.2 },
  { time: "14:00", value: 3.9 },
  { time: "16:00", value: 3.8 },
  { time: "18:00", value: 4.5 },
  { time: "20:00", value: 4.2 },
  { time: "22:00", value: 3.2 },
]

const weeklyEnergyData = [
  { day: "Mon", value: 23.4 },
  { day: "Tue", value: 25.1 },
  { day: "Wed", value: 22.8 },
  { day: "Thu", value: 19.5 },
  { day: "Fri", value: 20.2 },
  { day: "Sat", value: 18.3 },
  { day: "Sun", value: 17.5 },
]

const monthlyEnergyData = [
  { month: "Jan", value: 520 },
  { month: "Feb", value: 480 },
  { month: "Mar", value: 450 },
  { month: "Apr", value: 420 },
  { month: "May", value: 380 },
  { month: "Jun", value: 350 },
  { month: "Jul", value: 370 },
  { month: "Aug", value: 390 },
  { month: "Sep", value: 410 },
  { month: "Oct", value: 440 },
  { month: "Nov", value: 490 },
  { month: "Dec", value: 530 },
]

const deviceEnergyData = [
  { name: "Thermostat", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Lights", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Kitchen Appliances", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Entertainment", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--chart-5))" },
]

const deviceList = [
  { id: "1", name: "Living Room Thermostat", type: "thermostat", consumption: 4.2, status: "active" },
  { id: "2", name: "Kitchen Lights", type: "light", consumption: 2.8, status: "active" },
  { id: "3", name: "Bedroom Lights", type: "light", consumption: 1.5, status: "inactive" },
  { id: "4", name: "TV", type: "entertainment", consumption: 3.5, status: "active" },
  { id: "5", name: "Refrigerator", type: "appliance", consumption: 5.2, status: "active" },
  { id: "6", name: "Washing Machine", type: "appliance", consumption: 0, status: "inactive" },
  { id: "7", name: "Office Computer", type: "entertainment", consumption: 2.1, status: "active" },
  { id: "8", name: "Bathroom Heater", type: "thermostat", consumption: 3.8, status: "active" },
]

function EnergyContent() {
  const [timeRange, setTimeRange] = useState("day")
  const [activeTab, setActiveTab] = useState("overview")

  // Get device icon
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "thermostat":
        return <Thermometer className="h-5 w-5 text-rose-500" />
      case "light":
        return <Lightbulb className="h-5 w-5 text-amber-500" />
      case "entertainment":
        return <Smartphone className="h-5 w-5 text-indigo-500" />
      case "appliance":
        return <Plug className="h-5 w-5 text-emerald-500" />
      default:
        return <Zap className="h-5 w-5 text-primary" />
    }
  }

  // Get current energy data based on time range
  const getCurrentEnergyData = () => {
    switch (timeRange) {
      case "day":
        return dailyEnergyData
      case "week":
        return weeklyEnergyData
      case "month":
        return monthlyEnergyData
      case "year":
        return monthlyEnergyData
      default:
        return dailyEnergyData
    }
  }

  // Get x-axis key based on time range
  const getXAxisKey = () => {
    switch (timeRange) {
      case "day":
        return "time"
      case "week":
        return "day"
      case "month":
      case "year":
        return "month"
      default:
        return "time"
    }
  }

  // Calculate total energy consumption
  const calculateTotalEnergy = () => {
    const data = getCurrentEnergyData()
    return data.reduce((sum, item) => sum + item.value, 0).toFixed(1)
  }

  // Calculate average energy consumption
  const calculateAverageEnergy = () => {
    const data = getCurrentEnergyData()
    return (data.reduce((sum, item) => sum + item.value, 0) / data.length).toFixed(1)
  }

  // Handle download report
  const handleDownloadReport = () => {
    toast.success("Report downloaded", {
      description: `Energy report for ${timeRange} has been downloaded`,
    })
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Energy Monitoring</h1>
          <p className="text-muted-foreground">Track and optimize your energy consumption</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-primary" />
              Total Consumption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{calculateTotalEnergy()} kWh</div>
            <p className="text-sm text-muted-foreground">
              {timeRange === "day" && "Today's total energy usage"}
              {timeRange === "week" && "This week's total energy usage"}
              {timeRange === "month" && "This month's total energy usage"}
              {timeRange === "year" && "This year's total energy usage"}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Battery className="mr-2 h-5 w-5 text-success" />
              Average Consumption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{calculateAverageEnergy()} kWh</div>
            <p className="text-sm text-muted-foreground">
              {timeRange === "day" && "Average hourly consumption"}
              {timeRange === "week" && "Average daily consumption"}
              {timeRange === "month" && "Average daily consumption"}
              {timeRange === "year" && "Average monthly consumption"}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Plug className="mr-2 h-5 w-5 text-warning" />
              Active Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deviceList.filter((d) => d.status === "active").length}</div>
            <p className="text-sm text-muted-foreground">Out of {deviceList.length} total devices</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Energy Consumption</CardTitle>
              <CardDescription>
                {timeRange === "day" && "Hourly energy consumption for today"}
                {timeRange === "week" && "Daily energy consumption for this week"}
                {timeRange === "month" && "Daily energy consumption for this month"}
                {timeRange === "year" && "Monthly energy consumption for this year"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getCurrentEnergyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey={getXAxisKey()} stroke="hsl(var(--muted-foreground))" tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} unit=" kWh" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                      formatter={(value) => [`${value} kWh`, "Energy"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      name="Energy"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Energy Distribution</CardTitle>
                <CardDescription>Energy usage by device category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceEnergyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {deviceEnergyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                        formatter={(value) => [`${value}%`, "Energy Usage"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Energy Trends</CardTitle>
                <CardDescription>Compare with previous periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Previous", current: 0, previous: 120 },
                        { name: "Current", current: 100, previous: 0 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tickLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} unit=" kWh" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Bar dataKey="previous" name="Previous Period" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="current" name="Current Period" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <Badge variant="outline" className="bg-success/10 text-success">
                    16.7% less than previous period
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Energy Usage</CardTitle>
              <CardDescription>Monitor energy consumption by device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search devices..." className="w-[250px]" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="thermostat">Thermostats</SelectItem>
                      <SelectItem value="light">Lights</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="appliance">Appliances</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {deviceList.map((device) => (
                    <AccordionItem key={device.id} value={device.id}>
                      <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            {getDeviceIcon(device.type)}
                            <div>
                              <p className="font-medium text-left">{device.name}</p>
                              <p className="text-xs text-muted-foreground text-left">
                                {device.status === "active" ? "Currently active" : "Inactive"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={device.status === "active" ? "default" : "outline"}>
                              {device.consumption} kWh
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Today's Usage</p>
                              <p className="font-medium">{device.consumption * 24} kWh</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Monthly Estimate</p>
                              <p className="font-medium">{(device.consumption * 24 * 30).toFixed(1)} kWh</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Efficiency Rating</span>
                              <span className="font-medium">
                                {device.consumption < 2 ? "Excellent" : device.consumption < 4 ? "Good" : "Average"}
                              </span>
                            </div>
                            <Progress
                              value={device.consumption < 2 ? 90 : device.consumption < 4 ? 70 : 50}
                              className={
                                device.consumption < 2
                                  ? "text-success"
                                  : device.consumption < 4
                                    ? "text-warning"
                                    : "text-destructive"
                              }
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Settings className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5 text-primary" />
                  Energy Insights
                </CardTitle>
                <CardDescription>Smart recommendations to save energy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                    <div className="mt-0.5 bg-primary/10 rounded-full p-1.5">
                      <Thermometer className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Optimize Thermostat Settings</p>
                      <p className="text-sm text-muted-foreground">
                        Lowering your thermostat by 1°C could save up to 10% on heating costs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                    <div className="mt-0.5 bg-primary/10 rounded-full p-1.5">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Lighting Efficiency</p>
                      <p className="text-sm text-muted-foreground">
                        Your kitchen lights are on for an average of 8 hours per day. Consider motion sensors to reduce
                        usage.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                    <div className="mt-0.5 bg-primary/10 rounded-full p-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Schedule Optimization</p>
                      <p className="text-sm text-muted-foreground">
                        Creating a schedule for your appliances could reduce your energy consumption by up to 15%.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Recommendations
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Energy Forecast</CardTitle>
                <CardDescription>Predicted energy usage for next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { day: "Mon", predicted: 24.5, actual: 23.4 },
                        { day: "Tue", predicted: 25.2, actual: 25.1 },
                        { day: "Wed", predicted: 23.1, actual: 22.8 },
                        { day: "Thu", predicted: 20.8, actual: 19.5 },
                        { day: "Fri", predicted: 21.5, actual: null },
                        { day: "Sat", predicted: 19.2, actual: null },
                        { day: "Sun", predicted: 18.7, actual: null },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tickLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} unit=" kWh" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        name="Actual"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        name="Predicted"
                        stroke="hsl(var(--muted-foreground))"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Based on your historical usage patterns</div>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function EnergyPage() {
  return (
    <DeviceProvider>
      <EnergyContent />
    </DeviceProvider>
  )
}

