"use client"

import type React from "react"

import { Book, HelpCircle, Mail, MessageSquare, Search, Wrench } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmitContactForm = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Message Sent", {
      description: "Your message has been sent to our support team.",
    })
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">Get help with your IoT Network</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg opacity-20 blur-lg"></div>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
          <CardContent className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold tracking-tight mb-3">How can we help you today?</h2>
                <p className="text-muted-foreground mb-6">
                  Search our knowledge base or browse frequently asked questions
                </p>

                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:w-1/2 grid gap-4 grid-cols-2">
                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Book className="h-10 w-10 text-blue-500 mb-2" />
                    <h3 className="font-medium">Documentation</h3>
                    <p className="text-sm text-muted-foreground">Browse detailed guides</p>
                  </CardContent>
                </Card>

                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <MessageSquare className="h-10 w-10 text-green-500 mb-2" />
                    <h3 className="font-medium">Live Chat</h3>
                    <p className="text-sm text-muted-foreground">Chat with support</p>
                  </CardContent>
                </Card>

                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Wrench className="h-10 w-10 text-orange-500 mb-2" />
                    <h3 className="font-medium">Troubleshooting</h3>
                    <p className="text-sm text-muted-foreground">Fix common issues</p>
                  </CardContent>
                </Card>

                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Mail className="h-10 w-10 text-purple-500 mb-2" />
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-sm text-muted-foreground">Get help via email</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq">
        <TabsList>
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            Contact Us
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-1">
            <Book className="h-4 w-4" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about the IoT Network</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I add a new device to my network?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Adding a new device to your IoT Network is easy:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Click on the "Devices" tab in the sidebar</li>
                      <li>Click the "Add Device" button in the top right</li>
                      <li>Fill in the device details including name, type, and location</li>
                      <li>Click "Add Device" to complete the process</li>
                    </ol>
                    <p className="mt-2">
                      Your new device will be added to your network and will start reporting data automatically.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>What should I do if a device goes offline?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">If a device shows as offline, try these troubleshooting steps:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Check the device's power supply and ensure it's properly connected</li>
                      <li>Verify that the device is within range of your network</li>
                      <li>Try restarting the device by clicking the "Restart Device" option in the device details</li>
                      <li>Check your network connectivity and ensure your router is functioning properly</li>
                      <li>If problems persist, you may need to reset the device to factory settings</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How does the rewards program work?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      The IoT Network rewards program allows you to earn points based on your device usage and
                      maintenance:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Devices earn points automatically when they're online and functioning properly</li>
                      <li>You earn bonus points for maintaining good battery levels and signal strength</li>
                      <li>Adding new devices to your network earns additional points</li>
                      <li>Points can be redeemed for benefits like premium features, credits, and priority support</li>
                    </ul>
                    <p className="mt-2">
                      Visit the Rewards page to see your current point balance and available redemption options.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I export my device data and analytics?</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Yes, you can export your device data and analytics. In the Analytics page, look for the Export
                      button in the top right corner of any chart or data display. You can export data in CSV, JSON, or
                      PDF formats. For more comprehensive exports, you can redeem reward points for enhanced data export
                      capabilities, which allow for scheduled exports, more export formats, and longer historical data
                      periods.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I set up notifications for my devices?</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">To set up notifications for your devices:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Go to the Settings page</li>
                      <li>Click on the "Notifications" tab</li>
                      <li>Toggle on the types of notifications you want to receive</li>
                      <li>Choose whether you want email notifications, push notifications, or both</li>
                      <li>Save your changes</li>
                    </ol>
                    <p className="mt-2">
                      You can set up notifications for events like devices going offline, low battery alerts, abnormal
                      readings, and system updates.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our support team for personalized assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitContactForm} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="What is your inquiry about?" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Please describe your issue or question in detail" rows={5} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="low">Low - General Question</option>
                      <option value="medium">Medium - Minor Issue</option>
                      <option value="high">High - Significant Problem</option>
                      <option value="urgent">Urgent - Critical Issue</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="device" className="text-sm font-medium">
                      Related Device (Optional)
                    </label>
                    <select
                      id="device"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a device</option>
                      <option value="1">Temperature Sensor 1</option>
                      <option value="2">Motion Sensor 2</option>
                      <option value="3">Connectivity Device 3</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Send Message</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Browse our comprehensive documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Getting Started</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Introduction to IoT Network
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Setting Up Your First Device
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Dashboard Overview
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Understanding Device Types
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Advanced Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Data Analytics & Reporting
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Automations & Triggers
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          API Documentation
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Custom Integrations
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Troubleshooting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Common Connection Issues
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Battery Optimization
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Signal Strength Improvement
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Error Code Reference
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Security & Privacy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Security Best Practices
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Data Privacy Policy
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Two-Factor Authentication
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-blue-500" />
                        <a href="#" className="text-blue-500 hover:underline">
                          Firmware Security Updates
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

