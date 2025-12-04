"use server"

import { z } from "zod"
import {
  parseMoviePopularResponse,
  parseMovieDetail,
  safeParseTMDBError,
  isAuthenticationError,
  isNotFoundError,
  isRateLimitError,
  type MoviePopularResponse,
  type MovieDetail,
} from "@/schemas"

/**
 * TMDB API Base URL
 */
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3"

/**
 * Server Action 결과 타입
 */
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * 인기 영화 목록 조회 파라미터 스키마
 */
const GetPopularMoviesParamsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
})

type GetPopularMoviesParams = z.infer<typeof GetPopularMoviesParamsSchema>

/**
 * 영화 상세 정보 조회 파라미터 스키마
 */
const GetMovieDetailParamsSchema = z.object({
  movieId: z.number().int().positive(),
})

type GetMovieDetailParams = z.infer<typeof GetMovieDetailParamsSchema>

/**
 * Bearer Token 헤더 생성
 */
function createAuthHeaders(): Record<string, string> | undefined {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN

  if (!token) {
    return undefined
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

/**
 * TMDB API 에러 처리
 */
async function handleTMDBError(response: Response): Promise<string> {
  try {
    const json = await response.json()
    const errorResult = safeParseTMDBError(json)

    if (errorResult.success) {
      const tmdbError = errorResult.data

      if (isAuthenticationError(tmdbError)) {
        return "인증 실패: API 키를 확인해주세요"
      }

      if (isNotFoundError(tmdbError)) {
        return "요청한 리소스를 찾을 수 없습니다"
      }

      if (isRateLimitError(tmdbError)) {
        return "API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요"
      }

      return `TMDB API 에러: ${tmdbError.status_message}`
    }
  } catch {
    // JSON 파싱 실패 또는 TMDB 에러 형식이 아닌 경우
  }

  return `HTTP ${response.status}: ${response.statusText}`
}

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
    const data = parseMoviePopularResponse(json)

    return { success: true, data }
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
    const { movieId: validatedMovieId } =
      GetMovieDetailParamsSchema.parse({ movieId })

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
    const data = parseMovieDetail(json)

    return { success: true, data }
  } catch (error: unknown) {
    // Zod 검증 에러 또는 기타 에러 처리
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "알 수 없는 오류가 발생했습니다" }
  }
}

