import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { SonnerProvider } from "@/components/sonner-provider"
import AppSidebar from "@/components/layout/app-sidebar"
import TopNav from "@/components/layout/top-nav"
import { NotificationProvider } from "@/components/pages/notifications-page"
import { DeviceProvider } from "@/components/context/device-context"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IoT Command Center | Smart Device Management",
  description: "Monitor, manage, and optimize your IoT devices in real-time with advanced analytics and automation",
  generator: "v0.dev",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DeviceProvider>
            <NotificationProvider>
              <div className="flex min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/90">
                <AppSidebar />
                <div className="flex flex-1 flex-col w-full md:ml-64">
                  <TopNav />
                  <main className="flex-1 w-full overflow-auto p-4 md:p-6">
                    <div className="animate-fade-in">{children}</div>
                  </main>
                </div>
              </div>
              <SonnerProvider />
            </NotificationProvider>
          </DeviceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'