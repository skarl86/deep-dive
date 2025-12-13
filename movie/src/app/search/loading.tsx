import { MovieListSkeleton } from "@/components/movie-list-skeleton"

/**
 * 검색 페이지 로딩 상태
 *
 * Suspense boundary에서 자동으로 표시됩니다.
 */
export default function SearchLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        {/* 제목 스켈레톤 */}
        <div className="h-8 w-64 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />

        {/* 설명 스켈레톤 */}
        <div className="mt-2 h-5 w-48 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* 영화 그리드 스켈레톤 */}
      <MovieListSkeleton />
    </main>
  )
}

