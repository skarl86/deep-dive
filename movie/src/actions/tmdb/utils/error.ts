import {
  isAuthenticationError,
  isNotFoundError,
  isRateLimitError,
  safeParseTMDBError,
} from "@/schemas"

/**
 * TMDB API 에러 처리
 */
export async function handleTMDBError(response: Response): Promise<string> {
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
