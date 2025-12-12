/**
 * 테스트용 목 데이터
 */

export const mockMovie = {
  id: 123,
  title: "테스트 영화",
  overview: "테스트 영화 개요",
  poster_path: "/test-poster.jpg",
  vote_average: 8.5,
  release_date: "2024-01-01",
}

export const mockMovieList = Array.from({ length: 20 }, (_, i) => ({
  ...mockMovie,
  id: i + 1,
  title: `테스트 영화 ${i + 1}`,
}))

