import { z } from "zod"

/**
 * 영화 목록 개별 항목 스키마
 */
export const MovieListItemSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number().int()),
  id: z.number().int().positive(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number().nonnegative(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number().nonnegative(),
  vote_count: z.number().int().nonnegative(),
})

export type MovieListItem = z.infer<typeof MovieListItemSchema>

/**
 * 인기 영화 목록 응답 스키마
 * GET /movie/popular API 응답 구조
 */
export const MoviePopularResponseSchema = z.object({
  page: z.number().int().positive(),
  results: z.array(MovieListItemSchema),
  total_pages: z.number().int().nonnegative(),
  total_results: z.number().int().nonnegative(),
})

export type MoviePopularResponse = z.infer<typeof MoviePopularResponseSchema>

/**
 * 인기 영화 목록 파싱 헬퍼
 */
export const parseMoviePopularResponse = (
  data: unknown
): MoviePopularResponse => {
  return MoviePopularResponseSchema.parse(data)
}

/**
 * 인기 영화 목록 안전 파싱 헬퍼
 */
export const safeParseMoviePopularResponse = (data: unknown) => {
  return MoviePopularResponseSchema.safeParse(data)
}

