import { getMovieDetail, getPopularMovies } from "@/actions/tmdb/movie"
import { MovieDetail } from "@/app/movie/_components/movie-detail"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface MoviePageProps {
  params: Promise<{ id: string }>
}

/**
 * 영화 상세 페이지
 *
 * 동적 라우트를 통해 영화 ID를 받아 상세 정보를 표시합니다.
 * - generateStaticParams로 인기 영화 20개를 빌드 타임에 정적 생성
 * - generateMetadata로 동적 SEO 메타데이터 생성
 * - ISR 적용 (24시간 캐시)
 */
export default async function MoviePage({ params }: MoviePageProps) {
  // 1. params를 Promise로 받아서 await
  const { id } = await params
  const movieId = parseInt(id, 10)

  // 2. movieId 유효성 검증
  if (isNaN(movieId) || movieId <= 0) {
    notFound()
  }

  // 3. 영화 상세 정보 조회
  const result = await getMovieDetail({ movieId })

  // 4. 에러 처리
  if (!result.success) {
    // API 에러 또는 존재하지 않는 영화
    notFound()
  }

  // 5. 성공 - 상세 정보 컴포넌트 렌더링
  return <MovieDetail movie={result.data} />
}

/**
 * 동적 메타데이터 생성
 *
 * 영화 정보를 기반으로 SEO 최적화된 메타데이터를 생성합니다.
 */
export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params
  const movieId = parseInt(id, 10)

  if (isNaN(movieId) || movieId <= 0) {
    return {
      title: "영화를 찾을 수 없습니다 | Movie App",
    }
  }

  const result = await getMovieDetail({ movieId })

  if (!result.success) {
    return {
      title: "영화를 찾을 수 없습니다 | Movie App",
    }
  }

  const movie = result.data

  // 줄거리 요약 (150자)
  const description =
    movie.overview.length > 150
      ? `${movie.overview.slice(0, 150)}...`
      : movie.overview

  // OpenGraph 이미지 (백드롭 우선, 없으면 포스터)
  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : undefined

  return {
    title: `${movie.title} | Movie App`,
    description,
    openGraph: {
      title: movie.title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: "video.movie",
    },
    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

/**
 * 정적 경로 생성
 *
 * 인기 영화 20개를 빌드 타임에 미리 생성하여 성능을 최적화합니다.
 */
export async function generateStaticParams() {
  const result = await getPopularMovies({ page: 1 })

  if (!result.success) {
    return []
  }

  // 인기 영화 상위 20개의 ID를 정적 경로로 생성
  return result.data.results.slice(0, 20).map((movie) => ({
    id: movie.id.toString(),
  }))
}
