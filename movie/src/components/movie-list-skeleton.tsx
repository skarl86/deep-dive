import { MovieSkeleton } from "@/components/movie-skeleton"

/**
 * 영화 목록 스켈레톤 로딩 UI
 *
 * Suspense fallback으로 사용되며,
 * 데이터 페칭 중 사용자에게 로딩 상태를 시각적으로 제공합니다.
 *
 * 실제 콘텐츠와 동일한 레이아웃 구조를 유지하여
 * 레이아웃 시프트(CLS)를 최소화합니다.
 */
export function MovieListSkeleton() {
  return (
    <section aria-label="영화 목록 로딩 중" aria-busy="true">
      {/* 제목 스켈레톤 */}
      <div className="mb-6">
        <div className="h-8 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* 영화 그리드 스켈레톤 - InfiniteMovieList와 동일한 레이아웃 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 lg:gap-6 xl:grid-cols-8">
        <MovieSkeleton count={40} />
      </div>

      {/* 스크린 리더를 위한 로딩 메시지 */}
      <div className="sr-only" role="status" aria-live="polite">
        영화 목록을 불러오는 중입니다...
      </div>
    </section>
  )
}
