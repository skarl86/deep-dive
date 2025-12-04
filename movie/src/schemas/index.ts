/**
 * TMDB API 스키마 모듈
 *
 * 이 모듈은 TMDB API 응답 데이터에 대한 Zod 스키마와 TypeScript 타입을 제공합니다.
 *
 * @example
 * ```typescript
 * import { MovieDetailSchema, parseMovieDetail } from '@/schemas'
 *
 * const response = await fetch('https://api.themoviedb.org/3/movie/1084242')
 * const data = await response.json()
 * const movieDetail = parseMovieDetail(data)
 * ```
 */

// 공통 스키마 및 타입
export {
  CollectionSchema,
  GenreSchema,
  ProductionCompanySchema,
  ProductionCountrySchema,
  SpokenLanguageSchema,
} from "./common.schema"

export type {
  Collection,
  Genre,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
} from "./common.schema"

// 영화 상세 정보 스키마 및 타입
export {
  MovieDetailSchema,
  safeParseMovieDetail,
} from "./movie-detail.schema"

export type { MovieDetail } from "./movie-detail.schema"

// 인기 영화 목록 스키마 및 타입
export {
  MovieListItemSchema,
  MoviePopularResponseSchema,
  safeParseMoviePopularResponse,
} from "./movie-popular.schema"

export type {
  MovieListItem,
  MoviePopularResponse,
} from "./movie-popular.schema"

// TMDB API 에러 스키마 및 타입
export {
  isAuthenticationError,
  isNotFoundError,
  isRateLimitError,
  parseTMDBError,
  safeParseTMDBError,
  TMDBErrorCode,
  TMDBErrorSchema,
} from "./error.schema"

export type { TMDBError, TMDBErrorCodeType } from "./error.schema"

