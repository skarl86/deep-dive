import { z } from "zod"

/**
 * 장르 스키마
 */
export const GenreSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
})

export type Genre = z.infer<typeof GenreSchema>

/**
 * 제작사 스키마
 */
export const ProductionCompanySchema = z.object({
  id: z.number().int().positive(),
  logo_path: z.string().nullable(),
  name: z.string(),
  origin_country: z.string(),
})

export type ProductionCompany = z.infer<typeof ProductionCompanySchema>

/**
 * 제작 국가 스키마
 */
export const ProductionCountrySchema = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
})

export type ProductionCountry = z.infer<typeof ProductionCountrySchema>

/**
 * 사용 언어 스키마
 */
export const SpokenLanguageSchema = z.object({
  english_name: z.string(),
  iso_639_1: z.string(),
  name: z.string(),
})

export type SpokenLanguage = z.infer<typeof SpokenLanguageSchema>

/**
 * 영화 컬렉션 스키마
 */
export const CollectionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
})

export type Collection = z.infer<typeof CollectionSchema>

