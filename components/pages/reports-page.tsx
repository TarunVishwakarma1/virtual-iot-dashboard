"use client"

import { useState } from "react"
import { Calendar, FileDown, FileText, Filter, Plus, Search } from "lucide-react"
import { toast } from "sonner"
import { format, subDays } from "date-fns"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DeviceProvider } from "@/components/context/device-context"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ReportCard } from "@/components/ui/report-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Types for reports
interface Report {
  id: string
  title: string
  description: string
  date: Date
  type: "daily" | "weekly" | "monthly" | "custom"
  format: "pdf" | "csv" | "excel"
  size: string
  category: "energy" | "devices" | "security" | "analytics" | "system"
  status: "ready" | "generating" | "scheduled"
}

// Sample reports
const sampleReports: Report[] = [
  {
    id: "1",
    title: "Daily Energy Consumption",
    description: "Detailed breakdown of energy usage by device",
    date: new Date(),
    type: "daily",
    format: "pdf",
    size: "1.2 MB",
    category: "energy",
    status: "ready",
  },
  {
    id: "2",
    title: "Weekly Device Status",
    description: "Summary of device performance and uptime",
    date: subDays(new Date(), 2),
    type: "weekly",
    format: "pdf",
    size: "2.4 MB",
    category: "devices",
    status: "ready",
  },
  {
    id: "3",
    title: "Monthly Security Audit",
    description: "Security events and potential vulnerabilities",
    date: subDays(new Date(), 5),
    type: "monthly",
    format: "pdf",
    size: "3.1 MB",
    category: "security",
    status: "ready",
  },
  {
    id: "4",
    title: "Device Performance Analysis",
    description: "Detailed performance metrics for all devices",
    date: subDays(new Date(), 7),
    type: "custom",
    format: "excel",
    size: "4.5 MB",
    category: "analytics",
    status: "ready",
  },
  {
    id: "5",
    title: "System Health Check",
    description: "Overall system health and recommendations",
    date: subDays(new Date(), 10),
    type: "weekly",
    format: "pdf",
    size: "1.8 MB",
    category: "system",
    status: "ready",
  },
  {
    id: "6",
    title: "Energy Efficiency Trends",
    description: "Long-term energy usage patterns and optimization suggestions",
    date: subDays(new Date(), 14),
    type: "monthly",
    format: "pdf",
    size: "2.7 MB",
    category: "energy",
    status: "ready",
  },
  {
    id: "7",
    title: "Device Connectivity Report",
    description: "Analysis of device connectivity and signal strength",
    date: subDays(new Date(), 21),
    type: "weekly",
    format: "csv",
    size: "0.9 MB",
    category: "devices",
    status: "ready",
  },
  {
    id: "8",
    title: "Security Incident Summary",
    description: "Details of security events and resolution status",
    date: subDays(new Date(), 28),
    type: "monthly",
    format: "pdf",
    size: "2.2 MB",
    category: "security",
    status: "ready",
  },
  {
    id: "9",
    title: "Custom Analytics Export",
    description: "Custom data export based on selected parameters",
    date: subDays(new Date(), 1),
    type: "custom",
    format: "csv",
    size: "3.6 MB",
    category: "analytics",
    status: "generating",
  },
  {
    id: "10",
    title: "Scheduled Monthly Overview",
    description: "Comprehensive monthly system overview",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: "monthly",
    format: "pdf",
    size: "N/A",
    category: "system",
    status: "scheduled",
  },
]

// Sample chart data
const energyData = [
  { date: "Jan", value: 420 },
  { date: "Feb", value: 380 },
  { date: "Mar", value: 350 },
  { date: "Apr", value: 320 },
  { date: "May", value: 290 },
  { date: "Jun", value: 310 },
  { date: "Jul", value: 340 },
  { date: "Aug", value: 380 },
  { date: "Sep", value: 410 },
  { date: "Oct", value: 440 },
  { date: "Nov", value: 470 },
  { date: "Dec", value: 490 },
]

function ReportsContent() {
  const [reports, setReports] = useState<Report[]>(sampleReports)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [formatFilter, setFormatFilter] = useState<string>("all")
  const [isCreatingReport, setIsCreatingReport] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [selectedReportType, setSelectedReportType] = useState<string>("daily")
  const [selectedReportFormat, setSelectedReportFormat] = useState<string>("pdf")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["energy"])

  // Filter reports based on active tab  setSelectedCategories] = useState<string[]>(["energy"]);

  // Filter reports based on active tab
  const filteredReports = reports.filter((report) => {
    // Filter by tab
    if (activeTab === "ready" && report.status !== "ready") return false
    if (activeTab === "generating" && report.status !== "generating") return false
    if (activeTab === "scheduled" && report.status !== "scheduled") return false

    // Filter by search query
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by type
    const matchesType = typeFilter === "all" || report.type === typeFilter

    // Filter by category
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter

    // Filter by format
    const matchesFormat = formatFilter === "all" || report.format === formatFilter

    return matchesSearch && matchesType && matchesCategory && matchesFormat
  })

  // Sort reports by date (newest first)
  const sortedReports = [...filteredReports].sort((a, b) => b.date.getTime() - a.date.getTime())

  // Handle download report
  const handleDownloadReport = (report: Report) => {
    toast.success("Report Downloaded", {
      description: `${report.title} has been downloaded successfully.`,
    })
  }

  // Handle view report
  const handleViewReport = (report: Report) => {
    toast.info("Opening Report", {
      description: `Opening ${report.title} for viewing.`,
    })
  }

  // Handle create report
  const handleCreateReport = () => {
    const newReport: Report = {
      id: `${reports.length + 1}`,
      title: `${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} Report - ${format(selectedDate || new Date(), "MMM d, yyyy")}`,
      description: `Generated ${selectedReportType} report for selected categories and devices`,
      date: new Date(),
      type: selectedReportType as "daily" | "weekly" | "monthly" | "custom",
      format: selectedReportFormat as "pdf" | "csv" | "excel",
      size: "Pending",
      category: selectedCategories[0] as "energy" | "devices" | "security" | "analytics" | "system",
      status: "generating",
    }

    setReports([newReport, ...reports])
    setIsCreatingReport(false)

    toast.success("Report Generation Started", {
      description: "Your report is being generated and will be ready shortly.",
    })

    // Simulate report generation completion
    setTimeout(() => {
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === newReport.id ? { ...report, status: "ready", size: "1.8 MB" } : report,
        ),
      )

      toast.success("Report Ready", {
        description: `${newReport.title} is now ready to download.`,
      })
    }, 5000)
  }

  // Get unique categories, types, and formats
  const categories = ["all", ...new Set(reports.map((report) => report.category))]
  const types = ["all", ...new Set(reports.map((report) => report.type))]
  const formats = ["all", ...new Set(reports.map((report) => report.format))]

  // Count reports by status
  const readyCount = reports.filter((report) => report.status === "ready").length
  const generatingCount = reports.filter((report) => report.status === "generating").length
  const scheduledCount = reports.filter((report) => report.status === "scheduled").length

  return (
    <div className="p-4 md:p-6 space-y-6 w-full animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and manage reports for your IoT network</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreatingReport(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              {readyCount} ready, {generatingCount} generating, {scheduledCount} scheduled
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Energy Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((report) => report.category === "energy").length}</div>
            <p className="text-xs text-muted-foreground">
              Last generated:{" "}
              {format(
                Math.max(
                  ...reports
                    .filter((report) => report.category === "energy" && report.status === "ready")
                    .map((report) => report.date.getTime()),
                ),
                "MMM d, yyyy",
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Device Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((report) => report.category === "devices").length}</div>
            <p className="text-xs text-muted-foreground">
              Last generated:{" "}
              {format(
                Math.max(
                  ...reports
                    .filter((report) => report.category === "devices" && report.status === "ready")
                    .map((report) => report.date.getTime()),
                ),
                "MMM d, yyyy",
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Security Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter((report) => report.category === "security").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Last generated:{" "}
              {format(
                Math.max(
                  ...reports
                    .filter((report) => report.category === "security" && report.status === "ready")
                    .map((report) => report.date.getTime()),
                ),
                "MMM d, yyyy",
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ready">
                Ready
                {readyCount > 0 && <Badge className="ml-1 bg-primary">{readyCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="generating">
                Generating
                {generatingCount > 0 && <Badge className="ml-1 bg-primary">{generatingCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="scheduled">
                Scheduled
                {scheduledCount > 0 && <Badge className="ml-1 bg-primary">{scheduledCount}</Badge>}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px]">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter Reports</h4>

                    <div className="space-y-2">
                      <Label className="text-xs">Report Type</Label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Category</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category === "all"
                                ? "All Categories"
                                : category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Format</Label>
                      <Select value={formatFilter} onValueChange={setFormatFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by format" />
                        </SelectTrigger>
                        <SelectContent>
                          {formats.map((format) => (
                            <SelectItem key={format} value={format}>
                              {format === "all" ? "All Formats" : format.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setTypeFilter("all")
                        setCategoryFilter("all")
                        setFormatFilter("all")
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Tabs>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedReports.length > 0 ? (
          sortedReports.map((report) => (
            <ReportCard
              key={report.id}
              title={report.title}
              description={report.description}
              date={report.date}
              type={`${report.type.charAt(0).toUpperCase() + report.type.slice(1)} • ${report.format.toUpperCase()} • ${report.size}`}
              onView={() => handleViewReport(report)}
              onDownload={() => handleDownloadReport(report)}
              className={`card-hover ${
                report.status === "generating"
                  ? "border-amber-500 border-2"
                  : report.status === "scheduled"
                    ? "border-blue-500 border-2"
                    : ""
              }`}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No reports found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search or filters" : "Create your first report to get started"}
            </p>
            <Button className="mt-4" onClick={() => setIsCreatingReport(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Report
            </Button>
          </div>
        )}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Energy Consumption Trends</CardTitle>
          <CardDescription>Monthly energy usage over the past year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} unit=" kWh" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value) => [`${value} kWh`, "Energy"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Energy"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              toast.success("Report Generated", {
                description: "Energy Consumption Trends report has been generated.",
              })
            }}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardFooter>
      </Card>

      {/* Create Report Dialog */}
      <Dialog open={isCreatingReport} onOpenChange={setIsCreatingReport}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>Configure and generate a new report for your IoT network</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Report Type</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Report</SelectItem>
                  <SelectItem value="weekly">Weekly Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="custom">Custom Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {["energy", "devices", "security", "analytics", "system"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category])
                        } else {
                          setSelectedCategories(selectedCategories.filter((c) => c !== category))
                        }
                      }}
                    />
                    <Label htmlFor={`category-${category}`} className="capitalize">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Format</Label>
              <Select value={selectedReportFormat} onValueChange={setSelectedReportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Additional Options</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-charts" defaultChecked />
                  <Label htmlFor="include-charts">Include charts and visualizations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-recommendations" defaultChecked />
                  <Label htmlFor="include-recommendations">Include recommendations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="schedule-recurring" />
                  <Label htmlFor="schedule-recurring">Schedule as recurring report</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingReport(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReport}>Generate Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <DeviceProvider>
      <ReportsContent />
    </DeviceProvider>
  )
}

