import "./globals.css"
import type React from "react"
import { Toaster } from 'react-hot-toast';
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "OpenQASM 3.0 Playground",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="font-sans">
        {children}
        <Toaster position="top-center" />
      </body>

      <Analytics />
      <SpeedInsights />
      {process.env.NEXT_PUBLIC_GTM_ID && (<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />)}
      {process.env.NEXT_PUBLIC_GA_ID && (<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />)}
    </html>
  )
}
