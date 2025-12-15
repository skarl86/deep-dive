import { searchMovies } from "@/actions/tmdb/search"
import { SearchEmpty } from "@/app/search/_components/search-empty"
import { SearchResultsSchema } from "@/app/search/_structured-data/search-results"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { SearchResultsList } from "./_components/search-results-list"

interface SearchPageProps {
  searchParams: Promise<{
    query?: string
  }>
}

/**
 * 검색 페이지 메타데이터 생성
 */
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { query } = await searchParams

  if (!query) {
    return {
      title: "검색 | Movie App",
      description: "영화를 검색해보세요",
    }
  }

  return {
    title: `"${query}" 검색 결과 | Movie App`,
    description: `"${query}"에 대한 영화 검색 결과를 확인하세요`,
    openGraph: {
      title: `"${query}" 검색 결과`,
      description: `"${query}"에 대한 영화 검색 결과`,
    },
  }
}

/**
 * 검색 결과 페이지
 *
 * URL 쿼리 파라미터에서 검색어를 받아 TMDB API로 검색합니다.
 * 검색어가 없으면 홈으로 리다이렉트합니다.
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query } = await searchParams

  // 쿼리 없으면 홈으로 리다이렉트
  if (!query || query.trim() === "") {
    redirect("/")
  }

  // 첫 페이지 검색
  const result = await searchMovies({ query, page: 1 })

  // 에러 처리
  if (!result.success) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div
          role="alert"
          className="flex min-h-[60vh] items-center justify-center"
        >
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-600 dark:text-red-400">
              검색 중 오류가 발생했습니다
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {result.error}
            </p>
          </div>
        </div>
      </main>
    )
  }

  // 결과가 없을 때
  if (result.data.results.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <SearchEmpty query={query} />
      </main>
    )
  }

  // 검색 결과 표시
  return (
    <main className="container mx-auto px-4 py-8">
      <SearchResultsSchema
        query={query}
        movies={result.data.results}
        totalResults={result.data.total_results}
      />
      <SearchResultsList
        initialMovies={result.data.results}
        query={query}
        nextPage={2}
        totalPages={result.data.total_pages}
      />
    </main>
  )
}

