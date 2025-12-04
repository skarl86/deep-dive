import { z } from "zod"
import {
  CollectionSchema,
  GenreSchema,
  ProductionCompanySchema,
  ProductionCountrySchema,
  SpokenLanguageSchema,
} from "./common.schema"

/**
 * 영화 상세 정보 스키마
 * GET /movie/{id} API 응답 구조
 */
export const MovieDetailSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  belongs_to_collection: CollectionSchema.nullable(),
  budget: z.number().int().nonnegative(),
  genres: z.array(GenreSchema),
  homepage: z.string(),
  id: z.number().int().positive(),
  imdb_id: z.string(),
  origin_country: z.array(z.string()),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number().nonnegative(),
  poster_path: z.string().nullable(),
  production_companies: z.array(ProductionCompanySchema),
  production_countries: z.array(ProductionCountrySchema),
  release_date: z.string(),
  revenue: z.number().int().nonnegative(),
  runtime: z.number().int().nonnegative(),
  spoken_languages: z.array(SpokenLanguageSchema),
  status: z.string(),
  tagline: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number().nonnegative(),
  vote_count: z.number().int().nonnegative(),
})

export type MovieDetail = z.infer<typeof MovieDetailSchema>

/**
 * 영화 상세 정보 파싱 헬퍼
 */
export const parseMovieDetail = (data: unknown): MovieDetail => {
  return MovieDetailSchema.parse(data)
}

/**
 * 영화 상세 정보 안전 파싱 헬퍼
 */
export const safeParseMovieDetail = (data: unknown) => {
  return MovieDetailSchema.safeParse(data)
}
