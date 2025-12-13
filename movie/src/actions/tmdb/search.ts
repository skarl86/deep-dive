"use server"

import {
  safeParseMoviePopularResponse,
  type MoviePopularResponse,
} from "@/schemas"
import {
  SearchMoviesParamsSchema,
  type ActionResult,
  type SearchMoviesParams,
} from "./types"
import { TMDB_API_BASE_URL, createAuthHeaders, handleTMDBError } from "./utils"

/**
 * 영화 검색
 *
 * @param params - 검색 쿼리와 페이지 번호
 * @returns 검색 결과 또는 에러
 *
 * @example
 * ```typescript
 * const result = await searchMovies({ query: "avengers", page: 1 })
 * if (result.success) {
 *   console.log(result.data.results)
 * }
 * ```
 */
export async function searchMovies(
  params: SearchMoviesParams
): Promise<ActionResult<MoviePopularResponse>> {
  try {
    // 1. 파라미터 검증
    const { query, page } = SearchMoviesParamsSchema.parse(params)

    // 2. 환경 변수 검증
    const headers = createAuthHeaders()
    if (!headers) {
      return {
        success: false,
        error: "TMDB API 토큰이 설정되지 않았습니다",
      }
    }

    // 3. API 요청
    const url = `${TMDB_API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=ko-KR&page=${page}`
    const response = await fetch(url, {
      headers,
      next: {
        revalidate: 3600, // 1시간 캐시
        tags: ["movies", "search", query],
      },
    })

    // 4. HTTP 상태 확인 + TMDB 에러 처리
    if (!response.ok) {
      const errorMessage = await handleTMDBError(response)
      return { success: false, error: errorMessage }
    }

    // 5. 성공 응답 검증
    const json = await response.json()
    const result = safeParseMoviePopularResponse(json)

    if (!result.success) {
      return {
        success: false,
        error: `응답 데이터 검증 실패: ${result.error.message}`,
      }
    }

    return { success: true, data: result.data }
  } catch (error: unknown) {
    // Zod 검증 에러 또는 기타 에러 처리
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "알 수 없는 오류가 발생했습니다" }
  }
}
