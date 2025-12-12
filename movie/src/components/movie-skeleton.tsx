/**
 * 영화 카드 로딩 스켈레톤 컴포넌트
 *
 * MovieCard와 정확히 동일한 DOM 구조와 높이를 사용하여
 * 레이아웃 Shift(CLS)를 방지합니다.
 */

interface MovieSkeletonProps {
  /**
   * 표시할 스켈레톤 개수
   * @default 20 (TMDB API 페이지당 기본 개수)
   */
  count?: number
}

export function MovieSkeleton({ count = 20 }: MovieSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="flex flex-col gap-2" aria-hidden="true">
          {/* 포스터 이미지 영역 - MovieCard와 동일한 aspect ratio */}
          <div className="relative aspect-[2/3] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />

          {/* 제목 영역 - line-clamp-2 텍스트 2줄 높이와 일치 */}
          <div className="h-10 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

          {/* 평점 영역 - MovieCard 평점 섹션과 동일한 높이 */}
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </article>
      ))}
    </>
  )
}
