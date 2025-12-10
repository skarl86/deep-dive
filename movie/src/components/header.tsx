"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Menu, Search, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * GNB (Global Navigation Bar)
 * 넷플릭스 스타일의 상단 네비게이션
 * 
 * 주요 기능:
 * - Sticky 포지셔닝으로 상단 고정
 * - 스크롤 시 배경색 변경 (투명 → 불투명)
 * - 반응형 모바일 햄버거 메뉴
 * - 검색 기능
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  // 스크롤 감지 → 배경색 변경
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    // 초기 스크롤 위치 체크 (페이지 로드 시 이미 스크롤된 상태 처리)
    handleScroll()
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // viewport 크기 변경 감지 → 데스크톱 크기가 되면 모바일 메뉴 자동 닫기
  useEffect(() => {
    const handleResize = () => {
      // md breakpoint (768px) 이상이면 모바일 메뉴 닫기
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mobileMenuOpen])

  // 모바일 메뉴 열림 시 body 스크롤 방지
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  const navItems = [
    { label: "홈", href: "/" },
    { label: "인기", href: "/popular" },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-zinc-50/70 dark:bg-zinc-950/70 backdrop-blur-md shadow-md"
            : "bg-gradient-to-b from-zinc-900/80 to-transparent"
        )}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <Link
              href="/"
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-lg">
                M
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 hidden sm:block">
                Movie App
              </span>
            </Link>

            {/* 데스크톱 메뉴 */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50",
                    pathname === item.href
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* 우측 액션 버튼들 */}
            <div className="flex items-center space-x-2">
              {/* 검색 버튼 */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
                )}
                aria-label="검색"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* 테마 토글 */}
              <ThemeToggle />

              {/* 모바일 햄버거 메뉴 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors md:hidden",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
                )}
                aria-label="메뉴"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* 검색창 (열렸을 때) */}
          {searchOpen && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
              <input
                type="search"
                placeholder="영화 제목을 입력하세요..."
                className={cn(
                  "w-full rounded-md border border-zinc-300 dark:border-zinc-700",
                  "bg-white dark:bg-zinc-900",
                  "px-4 py-2 text-sm",
                  "placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
                  "focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300"
                )}
                autoFocus
              />
            </div>
          )}
        </nav>
      </header>

      {/* 모바일 메뉴 오버레이 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* 메뉴 패널 */}
          <div className="absolute right-0 top-0 h-full w-64 bg-zinc-50 dark:bg-zinc-950 shadow-xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col p-6 pt-20">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "py-3 text-lg font-medium transition-colors border-b border-zinc-200 dark:border-zinc-800",
                    pathname === item.href
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header 높이만큼 padding (sticky로 인한 컨텐츠 가림 방지) */}
      <div className="h-16" aria-hidden="true" />
    </>
  )
}

