"use client"

import { getPopularMovies } from "@/actions/tmdb/movie"
import { MovieCard } from "@/components/movie-card"
import { MovieSkeleton } from "@/components/movie-skeleton"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import type { MovieListItem } from "@/schemas"
import { uniqueMoviesById } from "@/utils/array"
import { useCallback, useState } from "react"

interface InfiniteMovieListProps {
  /**
   * 초기 영화 목록 (서버에서 렌더링된 데이터)
   */
  initialMovies: MovieListItem[]

  /**
   * 다음에 로드할 페이지 번호
   * @example 초기 2페이지를 로드했다면 3
   */
  nextPage: number

  /**
   * 전체 페이지 수
   */
  totalPages: number
}

/**
 * 무한 스크롤 영화 목록 컴포넌트
 *
 * ISR로 미리 렌더링된 초기 데이터를 받아서 표시하고,
 * 스크롤 시 추가 페이지를 동적으로 로드합니다.
 *
 * Prefetching 전략:
 * - 스크롤 80% 지점에서 다음 페이지를 미리 로드
 * - 사용자가 끝에 도달하기 전에 데이터 준비
 */
export function InfiniteMovieList({
  initialMovies,
  nextPage,
  totalPages,
}: InfiniteMovieListProps) {
  // 영화 목록 상태
  const [movies, setMovies] = useState<MovieListItem[]>(initialMovies)

  // 현재 페이지 (다음 로드할 페이지)
  const [currentPage, setCurrentPage] = useState(nextPage)

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false)

  // 에러 상태
  const [error, setError] = useState<string | undefined>(undefined)

  // 더 로드할 페이지가 있는지
  const hasNextPage = currentPage <= totalPages

  /**
   * 다음 페이지 로드
   */
  const loadNextPage = useCallback(async () => {
    // 이미 로딩 중이거나 더 이상 페이지가 없으면 중단
    if (isLoading || !hasNextPage) {
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      const result = await getPopularMovies({ page: currentPage })

      if (!result.success) {
        setError(result.error)
        return
      }

      // 새로운 영화 추가 (중복 제거)
      setMovies((prev) => uniqueMoviesById([...prev, ...result.data.results]))

      // 다음 페이지로 이동
      setCurrentPage((prev) => prev + 1)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다"
      )
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, hasNextPage, isLoading])

  // IntersectionObserver로 스크롤 감지
  const loadMoreRef = useInfiniteScroll({
    onIntersect: loadNextPage,
    enabled: hasNextPage && !isLoading,
    threshold: 0.8, // 80% 보이면 트리거 (prefetching 효과)
  })

  return (
    <section aria-label="인기 영화 목록">
      <h2 className="mb-6 text-2xl font-bold">인기 영화</h2>

      {/* 영화 그리드 - MovieList와 동일한 레이아웃 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 lg:gap-6 xl:grid-cols-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}

        {/* 로딩 중일 때 스켈레톤 표시 */}
        {isLoading && <MovieSkeleton count={20} />}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div
          role="alert"
          className="mt-8 flex items-center justify-center text-red-600 dark:text-red-400"
        >
          <p>에러: {error}</p>
        </div>
      )}

      {/* Sentinel 요소 - IntersectionObserver가 감지할 요소 */}
      {hasNextPage && !error && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-8"
          aria-label="더 많은 영화 로딩 중"
        >
          {/* 스크롤 감지용 빈 요소 */}
        </div>
      )}

      {/* 마지막 페이지 도달 메시지 */}
      {!hasNextPage && !error && (
        <div
          className="mt-8 flex items-center justify-center text-gray-600 dark:text-gray-400"
          role="status"
          aria-live="polite"
        >
          <p>모든 영화를 확인했습니다 🎬</p>
        </div>
      )}
    </section>
  )
}
