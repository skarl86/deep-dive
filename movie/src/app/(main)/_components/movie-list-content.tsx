import { getPopularMovies } from "@/actions/tmdb/movie"
import { InfiniteMovieList } from "@/app/(main)/_components/infinite-movie-list"
import { uniqueMoviesById } from "@/utils/array"

/**
 * 영화 목록 콘텐츠 (Server Component)
 *
 * 데이터 페칭 및 초기 렌더링을 담당합니다.
 * Suspense boundary 내부에서 실행되어 스트리밍 렌더링을 지원합니다.
 *
 * ISR 전략:
 * - 초기 2페이지(40개 영화)를 서버에서 미리 렌더링
 * - 추가 페이지는 클라이언트에서 무한 스크롤로 로드
 */
export async function MovieListContent() {
  // 1. 초기 2페이지 데이터를 병렬로 fetch (빠른 로딩)
  const [page1Result, page2Result] = await Promise.all([
    getPopularMovies({ page: 1 }),
    getPopularMovies({ page: 2 }),
  ])

  // 2. 에러 처리 - 첫 페이지 로드 실패
  if (!page1Result.success) {
    return (
      <div
        role="alert"
        className="flex min-h-[400px] items-center justify-center text-red-600 dark:text-red-400"
      >
        <div className="text-center">
          <p className="mb-2 text-lg font-semibold">
            영화를 불러올 수 없습니다
          </p>
          <p className="text-sm">{page1Result.error}</p>
        </div>
      </div>
    )
  }

  // 3. 초기 영화 목록 구성
  // 첫 페이지는 필수, 두 번째 페이지는 실패해도 진행
  const allMovies = [
    ...page1Result.data.results,
    ...(page2Result.success ? page2Result.data.results : []),
  ]

  // 4. 중복 제거 (TMDB API는 페이지 간 데이터가 겹칠 수 있음)
  const initialMovies = uniqueMoviesById(allMovies)

  // 5. 다음 로드할 페이지 번호
  const nextPage = page2Result.success ? 3 : 2

  // 6. 전체 페이지 수
  const totalPages = page1Result.data.total_pages

  return (
    <InfiniteMovieList
      initialMovies={initialMovies}
      nextPage={nextPage}
      totalPages={totalPages}
    />
  )
}
