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

// TODO: getPopularMovies() 구현
// TODO: getMovieDetail() 구현

