import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Prompt Engineer",
  description: "Interactive prompt editor for OpenAI models",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <main className="min-h-screen bg-background">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'