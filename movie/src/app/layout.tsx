import { OrganizationSchema } from "@/app/_structured-data/organization"
import { SkipToContent } from "@/app/_structured-data/skip-to-content"
import { Header } from "@/components/header"
import { NavigationProgress } from "@/components/navigation-progress"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: "Movie App - 인기 영화 둘러보기",
  description: "최신 인기 영화를 확인하고 검색해보세요",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${openSans.variable} min-h-screen bg-zinc-50 font-sans antialiased dark:bg-zinc-950`}
      >
        <SkipToContent />
        <OrganizationSchema />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavigationProgress />
          <Suspense fallback={<div className="h-[72px]" />}>
            <Header />
          </Suspense>
          <main id="main-content" className="container mx-auto px-4 pb-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
