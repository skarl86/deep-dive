/**
 * TMDB API Base URL
 */
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3"

/**
 * TMDB 이미지 Base URL
 * 이미지 크기 옵션:
 * - w200: 작은 썸네일
 * - w500: 중간 크기 (권장)
 * - original: 원본 크기
 */
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

/**
 * Next.js Image placeholder용 Blur Data URL
 * 중립적인 회색 1x1 픽셀 이미지 (Base64)
 * RGB(128, 128, 128) - 라이트/다크 모드 모두 자연스러운 중간 회색
 */
export const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwABBAEAW9DULQAAAABJRU5ErkJggg=="
