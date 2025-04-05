"use client"

import { Award, Check, Download, Gift, History, Plus, Star, Unlock } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { DeviceProvider, useDevices } from "@/components/context/device-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Define rewards
const rewards = [
  {
    id: "1",
    title: "Premium Analytics",
    description: "Unlock advanced analytics tools and reports",
    points: 500,
    icon: <Star className="h-6 w-6" />,
    category: "digital",
  },
  {
    id: "2",
    title: "$10 Credit",
    description: "Get $10 credit towards your next IoT device purchase",
    points: 1000,
    icon: <Gift className="h-6 w-6" />,
    category: "credit",
  },
  {
    id: "3",
    title: "Priority Support",
    description: "Get priority customer support for 30 days",
    points: 750,
    icon: <Check className="h-6 w-6" />,
    category: "service",
  },
  {
    id: "4",
    title: "Data Export",
    description: "Unlock data export capabilities for all your devices",
    points: 300,
    icon: <Download className="h-6 w-6" />,
    category: "digital",
  },
  {
    id: "5",
    title: "Device Themes",
    description: "Unlock custom dashboard themes",
    points: 200,
    icon: <Unlock className="h-6 w-6" />,
    category: "digital",
  },
  {
    id: "6",
    title: "$25 Credit",
    description: "Get $25 credit towards your next IoT device purchase",
    points: 2500,
    icon: <Gift className="h-6 w-6" />,
    category: "credit",
  },
]

// Define reward history
const rewardHistory = [
  {
    id: "1",
    title: "Premium Analytics",
    pointsSpent: 500,
    date: "2023-12-01",
    status: "active",
    expiresAt: "2024-12-01",
  },
  {
    id: "2",
    title: "Device Themes",
    pointsSpent: 200,
    date: "2023-11-15",
    status: "active",
    expiresAt: null,
  },
  {
    id: "3",
    title: "$10 Credit",
    pointsSpent: 1000,
    date: "2023-10-22",
    status: "used",
    expiresAt: null,
  },
]

function RewardsContent() {
  const { devices } = useDevices()
  const [activeTab, setActiveTab] = useState<string>("available")
  const [selectedReward, setSelectedReward] = useState<(typeof rewards)[0] | null>(null)
  const [isRedeeming, setIsRedeeming] = useState(false)

  // Calculate total rewards
  const totalRewards = devices.reduce((sum, device) => sum + device.rewardPoints, 0)

  // Filter rewards by category
  const filterRewardsByCategory = (category: string) => {
    return rewards.filter((reward) => reward.category === category)
  }

  // Handle redeem button click
  const handleRedeemClick = (reward: (typeof rewards)[0]) => {
    setSelectedReward(reward)
    setIsRedeeming(true)
  }

  // Handle confirm redemption
  const handleConfirmRedemption = () => {
    if (!selectedReward) return

    toast.success("Reward Redeemed!", {
      description: `You have successfully redeemed ${selectedReward.title} for ${selectedReward.points} points.`,
    })

    setIsRedeeming(false)
    setSelectedReward(null)
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Rewards Program</h1>
          <p className="text-muted-foreground">Earn and redeem points with your IoT devices</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Your Reward Balance</CardTitle>
            <CardDescription className="text-blue-100">Earn points by keeping your devices online</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-4xl font-bold">{totalRewards}</div>
                <div className="text-blue-100">Available Points</div>
              </div>
              <Button variant="secondary" className="group hover:bg-white">
                <Award className="mr-2 h-4 w-4 text-blue-600 group-hover:text-blue-600" />
                <span className="text-blue-600 group-hover:text-blue-600">Redeem Points</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievement Progress</CardTitle>
            <CardDescription>Complete tasks to earn more points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Connect 10 Devices</span>
                <span className="font-medium">{Math.min(devices.length, 10)}/10</span>
              </div>
              <Progress value={Math.min(devices.length / 10, 1) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Maintain 95% Uptime</span>
                <span className="font-medium">87%</span>
              </div>
              <Progress value={87} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Use 5 Device Types</span>
                <span className="font-medium">{Math.min(new Set(devices.map((d) => d.type)).size, 5)}/5</span>
              </div>
              <Progress value={Math.min(new Set(devices.map((d) => d.type)).size / 5, 1) * 100} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="available">Available Rewards</TabsTrigger>
          <TabsTrigger value="my-rewards">My Rewards</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Digital Rewards</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filterRewardsByCategory("digital").map((reward) => (
                <Card key={reward.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">{reward.icon}</div>
                      <div>
                        <CardTitle>{reward.title}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className="mr-2 h-5 w-5 text-yellow-500" />
                        <span className="text-lg font-bold">{reward.points} points</span>
                      </div>
                      <Badge variant={totalRewards >= reward.points ? "default" : "secondary"}>
                        {totalRewards >= reward.points ? "Available" : "Locked"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 border-t">
                    <Button
                      className="w-full"
                      disabled={totalRewards < reward.points}
                      onClick={() => handleRedeemClick(reward)}
                    >
                      Redeem Reward
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Credit Rewards</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filterRewardsByCategory("credit").map((reward) => (
                <Card key={reward.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 text-green-500">
                        {reward.icon}
                      </div>
                      <div>
                        <CardTitle>{reward.title}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className="mr-2 h-5 w-5 text-yellow-500" />
                        <span className="text-lg font-bold">{reward.points} points</span>
                      </div>
                      <Badge variant={totalRewards >= reward.points ? "default" : "secondary"}>
                        {totalRewards >= reward.points ? "Available" : "Locked"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 border-t">
                    <Button
                      className="w-full"
                      disabled={totalRewards < reward.points}
                      onClick={() => handleRedeemClick(reward)}
                    >
                      Redeem Reward
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Service Rewards</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filterRewardsByCategory("service").map((reward) => (
                <Card key={reward.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2 text-purple-500">
                        {reward.icon}
                      </div>
                      <div>
                        <CardTitle>{reward.title}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className="mr-2 h-5 w-5 text-yellow-500" />
                        <span className="text-lg font-bold">{reward.points} points</span>
                      </div>
                      <Badge variant={totalRewards >= reward.points ? "default" : "secondary"}>
                        {totalRewards >= reward.points ? "Available" : "Locked"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 border-t">
                    <Button
                      className="w-full"
                      disabled={totalRewards < reward.points}
                      onClick={() => handleRedeemClick(reward)}
                    >
                      Redeem Reward
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-rewards" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rewardHistory
              .filter((r) => r.status === "active")
              .map((reward) => (
                <Card key={reward.id} className="overflow-hidden">
                  <CardHeader className="pb-3 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <CardTitle>{reward.title}</CardTitle>
                      <Badge>Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Redeemed on</span>
                        <span className="text-sm font-medium">{new Date(reward.date).toLocaleDateString()}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Points spent</span>
                        <span className="text-sm font-medium">{reward.pointsSpent}</span>
                      </div>

                      {reward.expiresAt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Expires on</span>
                          <span className="text-sm font-medium">{new Date(reward.expiresAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 border-t">
                    <Button variant="outline" className="w-full">
                      Manage Reward
                    </Button>
                  </CardFooter>
                </Card>
              ))}

            {rewardHistory.filter((r) => r.status === "active").length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Active Rewards</h3>
                <p className="text-muted-foreground">You don't have any active rewards yet</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab("available")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Browse Rewards
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reward History</CardTitle>
              <CardDescription>A record of all your redeemed rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewardHistory.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-full p-2 
                        ${
                          reward.status === "active"
                            ? "bg-green-100 dark:bg-green-900 text-green-500"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }
                      `}
                      >
                        {reward.status === "active" ? <Check className="h-4 w-4" /> : <History className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{reward.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(reward.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">{reward.pointsSpent} points</div>
                        <div className="text-xs text-muted-foreground capitalize">{reward.status}</div>
                      </div>
                      <Badge variant={reward.status === "active" ? "default" : "secondary"}>{reward.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Redemption confirmation dialog */}
      {selectedReward && (
        <Dialog open={isRedeeming} onOpenChange={setIsRedeeming}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Redemption</DialogTitle>
              <DialogDescription>You are about to redeem the following reward:</DialogDescription>
            </DialogHeader>
            <div className="p-4 border rounded-md mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">{selectedReward.icon}</div>
                <div>
                  <h3 className="font-medium">{selectedReward.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{selectedReward.points} points</span>
              </div>
            </div>
            <div className="flex justify-between px-1">
              <div className="text-sm">Your current balance:</div>
              <div className="font-medium">{totalRewards} points</div>
            </div>
            <div className="flex justify-between px-1">
              <div className="text-sm">After redemption:</div>
              <div className="font-medium">{totalRewards - selectedReward.points} points</div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRedeeming(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmRedemption}>Confirm Redemption</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function RewardsPage() {
  return (
    <DeviceProvider>
      <RewardsContent />
    </DeviceProvider>
  )
}

