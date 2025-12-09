import type { MovieListItem } from "@/schemas"

/**
 * ID 기반으로 영화 배열에서 중복 제거
 * 
 * TMDB API는 페이지 간 데이터가 겹칠 수 있으므로
 * ID 기반으로 고유한 영화만 유지합니다.
 * 
 * @param movies - 영화 목록
 * @returns 중복이 제거된 영화 목록
 * 
 * @example
 * ```typescript
 * const movies = [
 *   { id: 1, title: "Movie 1" },
 *   { id: 2, title: "Movie 2" },
 *   { id: 1, title: "Movie 1" }, // 중복
 * ]
 * 
 * const unique = uniqueMoviesById(movies)
 * // [{ id: 1, title: "Movie 1" }, { id: 2, title: "Movie 2" }]
 * ```
 */
export function uniqueMoviesById(movies: MovieListItem[]): MovieListItem[] {
  const seen = new Map<number, MovieListItem>()
  
  for (const movie of movies) {
    if (!seen.has(movie.id)) {
      seen.set(movie.id, movie)
    }
  }
  
  return Array.from(seen.values())
}

