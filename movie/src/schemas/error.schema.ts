import { z } from "zod"

/**
 * TMDB API 에러 코드 열거형
 * https://developer.themoviedb.org/docs/errors
 */
export const TMDBErrorCode = {
  SUCCESS: 1,
  INVALID_SERVICE: 2,
  AUTHENTICATION_FAILED: 3,
  INVALID_FORMAT: 4,
  INVALID_PARAMETERS: 5,
  INVALID_ID: 6,
  INVALID_API_KEY: 7,
  DUPLICATE_ENTRY: 8,
  SERVICE_OFFLINE: 9,
  SUSPENDED_API_KEY: 10,
  INTERNAL_ERROR: 11,
  ITEM_UPDATED_SUCCESSFULLY: 12,
  ITEM_DELETED_SUCCESSFULLY: 13,
  AUTHENTICATION_FAILED_ALT: 14,
  FAILED: 15,
  DEVICE_DENIED: 16,
  SESSION_DENIED: 17,
  VALIDATION_FAILED: 18,
  INVALID_ACCEPT_HEADER: 19,
  INVALID_DATE_RANGE: 20,
  ENTRY_NOT_FOUND: 21,
  INVALID_PAGE: 22,
  INVALID_DATE: 23,
  REQUEST_TIMEOUT: 24,
  RATE_LIMIT_EXCEEDED: 25,
  USERNAME_PASSWORD_REQUIRED: 26,
  TOO_MANY_APPEND_TO_RESPONSE: 27,
  INVALID_TIMEZONE: 28,
  CONFIRM_ACTION_REQUIRED: 29,
  INVALID_CREDENTIALS: 30,
  ACCOUNT_DISABLED: 31,
  EMAIL_NOT_VERIFIED: 32,
  INVALID_REQUEST_TOKEN: 33,
  RESOURCE_NOT_FOUND: 34,
  INVALID_TOKEN: 35,
  TOKEN_NOT_GRANTED_WRITE_PERMISSION: 36,
  SESSION_NOT_FOUND: 37,
  NO_PERMISSION_TO_EDIT: 38,
  RESOURCE_PRIVATE: 39,
  NOTHING_TO_UPDATE: 40,
  REQUEST_TOKEN_NOT_APPROVED: 41,
  REQUEST_METHOD_NOT_SUPPORTED: 42,
  BACKEND_CONNECTION_FAILED: 43,
  INVALID_ID_ALT: 44,
  USER_SUSPENDED: 45,
  API_MAINTENANCE: 46,
  INVALID_INPUT: 47,
} as const

export type TMDBErrorCodeType =
  (typeof TMDBErrorCode)[keyof typeof TMDBErrorCode]

/**
 * TMDB API 에러 응답 스키마
 */
export const TMDBErrorSchema = z.object({
  status_code: z.number().int().min(1).max(47),
  status_message: z.string(),
  success: z.boolean(),
})

export type TMDBError = z.infer<typeof TMDBErrorSchema>

/**
 * TMDB API 에러 파싱 헬퍼
 */
export const parseTMDBError = (data: unknown): TMDBError => {
  return TMDBErrorSchema.parse(data)
}

/**
 * TMDB API 에러 안전 파싱 헬퍼
 */
export const safeParseTMDBError = (data: unknown) => {
  return TMDBErrorSchema.safeParse(data)
}

/**
 * 에러 코드 검증 헬퍼
 */
export const isRateLimitError = (error: TMDBError): boolean => {
  return error.status_code === TMDBErrorCode.RATE_LIMIT_EXCEEDED
}

export const isAuthenticationError = (error: TMDBError): boolean => {
  return (
    error.status_code === TMDBErrorCode.INVALID_API_KEY ||
    error.status_code === TMDBErrorCode.AUTHENTICATION_FAILED ||
    error.status_code === TMDBErrorCode.AUTHENTICATION_FAILED_ALT ||
    error.status_code === TMDBErrorCode.SUSPENDED_API_KEY
  )
}

export const isNotFoundError = (error: TMDBError): boolean => {
  return (
    error.status_code === TMDBErrorCode.INVALID_ID ||
    error.status_code === TMDBErrorCode.RESOURCE_NOT_FOUND ||
    error.status_code === TMDBErrorCode.ENTRY_NOT_FOUND
  )
}
