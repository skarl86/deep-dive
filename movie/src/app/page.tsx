import { getPopularMovies } from "@/actions/tmdb/movie"
import { InfiniteMovieList } from "@/components/infinite-movie-list"
import { ThemeToggle } from "@/components/theme-toggle"
import { uniqueMoviesById } from "@/utils/array"

/**
 * 홈 페이지
 * 
 * ISR 전략:
 * - 초기 2페이지(40개 영화)를 서버에서 미리 렌더링
 * - revalidate: 3600으로 1시간 캐시
 * - 추가 페이지는 클라이언트에서 무한 스크롤로 로드
 */
export default async function Home() {
  // 1. 초기 2페이지 데이터를 병렬로 fetch (빠른 로딩)
  const [page1Result, page2Result] = await Promise.all([
    getPopularMovies({ page: 1 }),
    getPopularMovies({ page: 2 }),
  ])

  // 2. 에러 처리 - 첫 페이지 로드 실패
  if (!page1Result.success) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Movie App
            </h1>
            <ThemeToggle />
          </header>

          <main>
            <div
              role="alert"
              className="flex min-h-[400px] items-center justify-center text-red-600"
            >
              <p>에러: {page1Result.error}</p>
            </div>
          </main>
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Movie App
          </h1>
          <ThemeToggle />
        </header>

        {/* Main Content - 무한 스크롤 영화 목록 */}
        <main>
          <InfiniteMovieList
            initialMovies={initialMovies}
            nextPage={nextPage}
            totalPages={totalPages}
          />
        </main>
      </div>
    </div>
  )
}
