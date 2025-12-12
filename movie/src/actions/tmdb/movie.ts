"use server"

import {
  safeParseMovieDetail,
  safeParseMoviePopularResponse,
  type MovieDetail,
  type MoviePopularResponse,
} from "@/schemas"
import {
  type ActionResult,
  type GetMovieDetailParams,
  type GetPopularMoviesParams,
  GetMovieDetailParamsSchema,
  GetPopularMoviesParamsSchema,
} from "./types"
import { TMDB_API_BASE_URL, createAuthHeaders, handleTMDBError } from "./utils"

/**
 * 인기 영화 목록 조회
 *
 * @param params - 페이지 번호 (선택, 기본값: 1)
 * @returns 인기 영화 목록 또는 에러
 *
 * @example
 * ```typescript
 * const result = await getPopularMovies({ page: 2 })
 * if (result.success) {
 *   console.log(result.data.results)
 * }
 * ```
 */
export async function getPopularMovies(
  params?: GetPopularMoviesParams
): Promise<ActionResult<MoviePopularResponse>> {
  try {
    // 1. 파라미터 검증
    const { page } = GetPopularMoviesParamsSchema.parse(params ?? {})

    // 2. 환경 변수 검증
    const headers = createAuthHeaders()
    if (!headers) {
      return {
        success: false,
        error: "TMDB API 토큰이 설정되지 않았습니다",
      }
    }

    // 3. API 요청
    const url = `${TMDB_API_BASE_URL}/movie/popular?language=ko-KR&page=${page}`
    const response = await fetch(url, {
      headers,
      next: {
        revalidate: 3600, // 1시간 캐시
        tags: ["movies", "popular"],
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

/**
 * 영화 상세 정보 조회
 *
 * @param params - 영화 ID (필수)
 * @returns 영화 상세 정보 또는 에러
 *
 * @example
 * ```typescript
 * const result = await getMovieDetail({ movieId: 1084242 })
 * if (result.success) {
 *   console.log(result.data.title) // "웡카"
 * }
 * ```
 */
export async function getMovieDetail({
  movieId,
}: GetMovieDetailParams): Promise<ActionResult<MovieDetail>> {
  try {
    // 1. 파라미터 검증
    const { movieId: validatedMovieId } = GetMovieDetailParamsSchema.parse({
      movieId,
    })

    // 2. 환경 변수 검증
    const headers = createAuthHeaders()
    if (!headers) {
      return {
        success: false,
        error: "TMDB API 토큰이 설정되지 않았습니다",
      }
    }

    // 3. API 요청
    const url = `${TMDB_API_BASE_URL}/movie/${validatedMovieId}?language=ko-KR`
    const response = await fetch(url, {
      headers,
      next: {
        revalidate: 86400, // 24시간 캐시
        tags: ["movies", `movie-${validatedMovieId}`],
      },
    })

    // 4. HTTP 상태 확인 + TMDB 에러 처리
    if (!response.ok) {
      const errorMessage = await handleTMDBError(response)
      return { success: false, error: errorMessage }
    }

    // 5. 성공 응답 검증
    const json = await response.json()
    const result = safeParseMovieDetail(json)

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
