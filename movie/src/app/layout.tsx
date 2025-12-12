import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import "./globals.css"

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="container mx-auto px-4 pb-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
