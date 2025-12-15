import { MovieListSkeleton } from "@/components/movie-list-skeleton"
import { Loader2 } from "lucide-react"

/**
 * 검색 페이지 로딩 상태
 *
 * Suspense boundary에서 자동으로 표시됩니다.
 * 검색 중임을 명확히 알리고 스켈레톤 UI를 제공합니다.
 */
export default function SearchLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* 검색 중 상태 표시 */}
      <div
        className="mb-8 flex justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="inline-flex items-center gap-3 rounded-lg bg-blue-50 px-6 py-3 dark:bg-blue-950">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            검색 중입니다...
          </span>
        </div>
      </div>

      {/* 제목 및 설명 스켈레톤 */}
      <div className="mb-6">
        {/* 제목 스켈레톤 */}
        <div className="h-8 w-64 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />

        {/* 설명 스켈레톤 */}
        <div className="mt-2 h-5 w-48 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* 영화 그리드 스켈레톤 */}
      <MovieListSkeleton />

      {/* 스크린 리더를 위한 추가 정보 */}
      <div className="sr-only">
        영화 검색 결과를 불러오는 중입니다. 잠시만 기다려주세요.
      </div>
    </main>
  )
}

