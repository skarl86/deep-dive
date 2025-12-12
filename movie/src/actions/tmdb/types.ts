import { z } from "zod"

/**
 * Server Action 결과 타입
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * 인기 영화 목록 조회 파라미터 스키마
 */
export const GetPopularMoviesParamsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
})

export type GetPopularMoviesParams = z.infer<
  typeof GetPopularMoviesParamsSchema
>

/**
 * 영화 상세 정보 조회 파라미터 스키마
 */
export const GetMovieDetailParamsSchema = z.object({
  movieId: z.number().int().positive(),
})

export type GetMovieDetailParams = z.infer<typeof GetMovieDetailParamsSchema>
