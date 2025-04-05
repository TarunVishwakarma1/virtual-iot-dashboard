"use client"

import { useState } from "react"
import {
  Activity,
  Check,
  Clock,
  Cloud,
  Filter,
  Lightbulb,
  Lock,
  Plus,
  Search,
  Settings,
  Smartphone,
  Sparkles,
  Star,
  Thermometer,
  Wifi,
  Zap,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DeviceProvider } from "@/components/context/device-context"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types for marketplace items
interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: string
  price: number
  rating: number
  image: string
  featured?: boolean
  new?: boolean
  compatible?: boolean
  category: string
}

// Sample marketplace items
const marketplaceItems: MarketplaceItem[] = [
  {
    id: "1",
    name: "Smart Thermostat Pro",
    description: "Energy-efficient thermostat with AI temperature optimization",
    type: "thermostat",
    price: 129.99,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
    featured: true,
    compatible: true,
    category: "climate",
  },
  {
    id: "2",
    name: "Motion Sensor Plus",
    description: "High-sensitivity motion detection for enhanced security",
    type: "sensor",
    price: 49.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
    new: true,
    compatible: true,
    category: "security",
  },
  {
    id: "3",
    name: "Smart Light Bulb",
    description: "Color-changing smart bulb with voice control",
    type: "light",
    price: 29.99,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    compatible: true,
    category: "lighting",
  },
  {
    id: "4",
    name: "Door/Window Sensor",
    description: "Compact sensor for monitoring entry points",
    type: "sensor",
    price: 24.99,
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=200",
    compatible: true,
    category: "security",
  },
  {
    id: "5",
    name: "Smart Plug",
    description: "Wi-Fi enabled plug to control any device",
    type: "plug",
    price: 19.99,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200",
    compatible: true,
    category: "power",
  },
  {
    id: "6",
    name: "Indoor Camera",
    description: "HD security camera with night vision",
    type: "camera",
    price: 79.99,
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=200",
    compatible: true,
    category: "security",
  },
  {
    id: "7",
    name: "Water Leak Detector",
    description: "Early warning system for water leaks",
    type: "sensor",
    price: 39.99,
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=200",
    new: true,
    category: "safety",
  },
  {
    id: "8",
    name: "Smart Lock",
    description: "Keyless entry with smartphone control",
    type: "lock",
    price: 149.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
    featured: true,
    category: "security",
  },
  {
    id: "9",
    name: "Air Quality Monitor",
    description: "Track indoor air quality and pollution levels",
    type: "sensor",
    price: 89.99,
    rating: 4.1,
    image: "/placeholder.svg?height=200&width=200",
    category: "health",
  },
  {
    id: "10",
    name: "Smart Doorbell",
    description: "Video doorbell with two-way audio",
    type: "camera",
    price: 129.99,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    category: "security",
  },
  {
    id: "11",
    name: "Temperature Sensor",
    description: "Precise temperature monitoring for any room",
    type: "sensor",
    price: 34.99,
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=200",
    compatible: true,
    category: "climate",
  },
  {
    id: "12",
    name: "Smart Ceiling Fan",
    description: "Wi-Fi enabled ceiling fan with climate sensing",
    type: "fan",
    price: 199.99,
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=200",
    category: "climate",
  },
]

// Integration packages
const integrationPackages = [
  {
    id: "1",
    name: "Security Bundle",
    description: "Complete home security package with cameras, sensors, and smart lock",
    price: 299.99,
    items: ["Door/Window Sensor", "Indoor Camera", "Smart Lock", "Motion Sensor Plus"],
    savings: "Save $50",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Climate Control Pack",
    description: "Optimize your home temperature with smart thermostat and sensors",
    price: 179.99,
    items: ["Smart Thermostat Pro", "Temperature Sensor", "Smart Ceiling Fan"],
    savings: "Save $35",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Lighting Essentials",
    description: "Transform your home lighting with smart bulbs and controls",
    price: 99.99,
    items: ["Smart Light Bulb", "Smart Plug", "Motion Sensor Plus"],
    savings: "Save $20",
    image: "/placeholder.svg?height=200&width=200",
  },
]

function MarketplaceContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [compatibleOnly, setCompatibleOnly] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [activeTab, setActiveTab] = useState("devices")

  // Get device icon
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "thermostat":
        return <Thermometer className="h-5 w-5" />
      case "sensor":
        return <Activity className="h-5 w-5" />
      case "light":
        return <Lightbulb className="h-5 w-5" />
      case "camera":
        return <Smartphone className="h-5 w-5" />
      case "plug":
        return <Zap className="h-5 w-5" />
      case "lock":
        return <Lock className="h-5 w-5" />
      case "fan":
        return <Cloud className="h-5 w-5" />
      default:
        return <Wifi className="h-5 w-5" />
    }
  }

  // Filter items based on search, category, and price
  const filteredItems = marketplaceItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1]
    const matchesCompatibility = compatibleOnly ? item.compatible : true

    return matchesSearch && matchesCategory && matchesPrice && matchesCompatibility
  })

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.new ? 1 : -1
      case "featured":
      default:
        return b.featured ? 1 : -1
    }
  })

  // Handle add to cart
  const handleAddToCart = (item: MarketplaceItem) => {
    toast.success("Added to cart", {
      description: `${item.name} has been added to your cart`,
    })
    setSelectedItem(null)
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Discover new devices and integrations for your smart home</p>
        </div>
      </div>

      <Tabs defaultValue="devices" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search marketplace..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filters</h4>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="climate">Climate Control</SelectItem>
                        <SelectItem value="lighting">Lighting</SelectItem>
                        <SelectItem value="power">Power Management</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Price Range</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      />
                      <span>to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="compatible"
                      checked={compatibleOnly}
                      onCheckedChange={(checked) => setCompatibleOnly(checked as boolean)}
                    />
                    <Label htmlFor="compatible">Compatible devices only</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory("all")
                        setPriceRange([0, 200])
                        setCompatibleOnly(false)
                        setSortBy("featured")
                      }}
                    >
                      Reset
                    </Button>
                    <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <TabsContent value="devices" className="mt-0">
          {sortedItems.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedItems.map((item) => (
                <Card key={item.id} className="card-hover overflow-hidden">
                  <div className="relative h-48 bg-muted">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                    {item.featured && (
                      <Badge className="absolute top-2 left-2 bg-primary">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                    {item.new && <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>}
                    {item.compatible && (
                      <Badge variant="outline" className="absolute top-2 right-2 bg-background/80">
                        <Check className="mr-1 h-3 w-3 text-green-500" />
                        Compatible
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-1.5">{getDeviceIcon(item.type)}</div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                      <div className="text-lg font-bold">${item.price.toFixed(2)}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" onClick={() => setSelectedItem(item)}>
                      Details
                    </Button>
                    <Button onClick={() => handleAddToCart(item)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No devices found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setPriceRange([0, 200])
                  setCompatibleOnly(false)
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="integrations" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {integrationPackages.map((pack) => (
              <Card key={pack.id} className="card-hover overflow-hidden">
                <div className="relative h-48 bg-muted">
                  <img src={pack.image || "/placeholder.svg"} alt={pack.name} className="h-full w-full object-cover" />
                  <Badge className="absolute top-2 right-2 bg-green-500">{pack.savings}</Badge>
                </div>
                <CardHeader>
                  <CardTitle>{pack.name}</CardTitle>
                  <CardDescription>{pack.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Includes:</p>
                    <ul className="space-y-1">
                      {pack.items.map((item, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 text-xl font-bold">${pack.price.toFixed(2)}</div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline">View Details</Button>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="flex flex-col items-center justify-center p-6 border-dashed h-full">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">Custom Integration</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Need a custom solution for your smart home?
              </p>
              <Button>Contact Sales</Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Professional Installation</CardTitle>
                </div>
                <CardDescription>Expert installation of your smart home devices</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Professional setup and configuration
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Optimal placement for best performance
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Integration with existing systems
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Basic training on device usage
                  </li>
                </ul>
                <div className="mt-4 text-xl font-bold">$149.99</div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Schedule Installation</Button>
              </CardFooter>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Premium Support</CardTitle>
                </div>
                <CardDescription>24/7 priority support for your smart home</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    24/7 priority technical support
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Remote troubleshooting assistance
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Quarterly system health checks
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Extended warranty on devices
                  </li>
                </ul>
                <div className="mt-4">
                  <div className="text-xl font-bold">$9.99/month</div>
                  <div className="text-sm text-muted-foreground">or $99.99/year</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Subscribe Now</Button>
              </CardFooter>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Smart Home Consultation</CardTitle>
                </div>
                <CardDescription>Personalized smart home planning and advice</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Personalized smart home assessment
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Custom device recommendations
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Budget planning and optimization
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Future-proofing advice
                  </li>
                </ul>
                <div className="mt-4 text-xl font-bold">$79.99</div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Book Consultation</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Item detail dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">{getDeviceIcon(selectedItem.type)}</div>
                {selectedItem.name}
              </DialogTitle>
              <DialogDescription>{selectedItem.description}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="relative h-64 bg-muted rounded-md overflow-hidden">
                <img
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-bold">${selectedItem.price.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{selectedItem.rating}</span>
                    <span className="text-sm text-muted-foreground">(128 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Features</p>
                <ul className="space-y-1">
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Wi-Fi and Bluetooth connectivity
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Voice assistant compatible
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Energy usage monitoring
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Mobile app control
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Compatibility</p>
                <div className="flex gap-2">
                  <Badge variant="outline">Amazon Alexa</Badge>
                  <Badge variant="outline">Google Home</Badge>
                  <Badge variant="outline">Apple HomeKit</Badge>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleAddToCart(selectedItem)}>
                <Plus className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <DeviceProvider>
      <MarketplaceContent />
    </DeviceProvider>
  )
}

