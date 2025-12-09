import { BLUR_DATA_URL, TMDB_IMAGE_BASE_URL } from "@/actions/tmdb/utils/config"
import type { MovieListItem } from "@/schemas"
import Image from "next/image"

interface MovieCardProps {
  movie: MovieListItem
}

/**
 * 개별 영화 카드 컴포넌트
 * 영화 포스터, 제목, 평점을 표시합니다.
 */
export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : null

  return (
    <article className="flex flex-col gap-2">
      {/* 포스터 이미지 - CLS 방지를 위한 aspect ratio 고정 */}
      {posterUrl ? (
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12vw"
            className="object-cover rounded-lg"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
      ) : (
        <div className="relative aspect-[2/3] w-full bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm">No Image</span>
        </div>
      )}

      {/* 제목 - 2줄 말줄임 */}
      <h3 className="text-sm font-semibold line-clamp-2" title={movie.title}>
        {movie.title}
      </h3>

      {/* 평점 */}
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <span aria-label={`평점 ${movie.vote_average.toFixed(1)}점`}>
          ⭐ {movie.vote_average.toFixed(1)}
        </span>
      </div>
    </article>
  )
}

