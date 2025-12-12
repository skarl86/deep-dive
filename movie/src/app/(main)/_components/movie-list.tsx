import { getPopularMovies } from "@/actions/tmdb/movie"
import { MovieCard } from "@/components/movie-card"

/**
 * 인기 영화 목록을 표시하는 Server Component
 * getPopularMovies() Server Action을 호출하여 데이터를 가져옵니다.
 */
export async function MovieList() {
  // 1. 데이터 페칭
  const result = await getPopularMovies({ page: 1 })

  // 2. 에러 처리
  if (!result.success) {
    return (
      <div
        role="alert"
        className="flex min-h-[400px] items-center justify-center text-red-600"
      >
        <p>에러: {result.error}</p>
      </div>
    )
  }

  const { results } = result.data

  // 3. 빈 결과 처리
  if (results.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-gray-600">
        <p>영화를 찾을 수 없습니다.</p>
      </div>
    )
  }

  // 4. 그리드 레이아웃 (PC 중심 반응형)
  return (
    <section aria-label="인기 영화 목록">
      <h2 className="mb-6 text-2xl font-bold">인기 영화</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 lg:gap-6 xl:grid-cols-8">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
