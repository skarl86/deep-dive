import { Suspense } from "react"
import { MovieListContent } from "@/app/(main)/_components/movie-list-content"
import { MovieListSkeleton } from "@/components/movie-list-skeleton"

/**
 * 홈 페이지
 * 
 * React Suspense를 활용한 스트리밍 렌더링:
 * - Header는 루트 레이아웃에서 즉시 렌더링
 * - MovieListSkeleton이 먼저 표시되어 빠른 First Paint
 * - MovieListContent는 백그라운드에서 데이터 페칭 후 스트리밍
 * 
 * 사용자 경험:
 * - 헤더와 스켈레톤이 즉시 표시되어 로딩 상태 인지
 * - 데이터 준비되는 대로 실제 콘텐츠로 교체
 * - 전체 페이지 블로킹 없이 점진적 렌더링
 */
export default function Home() {
  return (
    <Suspense fallback={<MovieListSkeleton />}>
      <MovieListContent />
    </Suspense>
  )
}

