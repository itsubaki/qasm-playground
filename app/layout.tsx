import "./globals.css"
import type React from "react"
import { Toaster } from 'react-hot-toast';
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import ThemeProvider from "../providers/theme"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "OpenQASM Playground",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning // To avoid hydration mismatch due to theme change
    >
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>
            {children}
          </main>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>

      <Analytics />
      <SpeedInsights />
      {process.env.NEXT_PUBLIC_GTM_ID && (<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />)}
      {process.env.NEXT_PUBLIC_GA_ID && (<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />)}
    </html>
  )
}
