"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * 페이지 전환 프로그레스 바
 *
 * Next.js App Router에서 페이지 전환을 감지하고
 * 상단에 프로그레스 바를 표시합니다.
 *
 * 주요 기능:
 * - pathname 변경 감지로 페이지 전환 시작 감지
 * - 애니메이션으로 진행 상황 표시
 * - 전환 완료 시 자동으로 숨김
 * - 접근성: role="progressbar" 및 aria-label 제공
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 페이지 전환 시작
    setIsLoading(true)

    // 페이지 전환 완료 시 프로그레스 바 숨김
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timeout)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div
      role="progressbar"
      aria-label="페이지 로딩 중"
      aria-valuenow={undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 animate-pulse"
      data-testid="navigation-progress"
    >
      {/* 스크린 리더를 위한 텍스트 */}
      <span className="sr-only">페이지를 불러오는 중입니다...</span>
    </div>
  )
}

