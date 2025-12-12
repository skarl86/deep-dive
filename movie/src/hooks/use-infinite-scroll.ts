import { useEffect, useRef } from "react"

interface UseInfiniteScrollOptions {
  /**
   * 스크롤 끝에 도달했을 때 호출될 콜백
   */
  onIntersect: () => void

  /**
   * 무한 스크롤을 활성화할지 여부
   * @default true
   */
  enabled?: boolean

  /**
   * IntersectionObserver threshold
   * 0.0 ~ 1.0 사이 값, 1.0은 요소가 100% 보일 때 트리거
   * @default 0.8 (80% 보일 때 트리거 - prefetching 효과)
   */
  threshold?: number

  /**
   * rootMargin - 교차 영역을 확장/축소
   * 예: "100px"는 뷰포트를 100px 확장
   * @default "0px"
   */
  rootMargin?: string
}

/**
 * IntersectionObserver 기반 무한 스크롤 훅
 *
 * 스크롤 끝에 sentinel 엘리먼트를 배치하고,
 * 해당 엘리먼트가 뷰포트에 들어오면 onIntersect 콜백을 호출합니다.
 *
 * @example
 * ```tsx
 * const loadMoreRef = useInfiniteScroll({
 *   onIntersect: loadNextPage,
 *   enabled: hasNextPage && !isLoading
 * })
 *
 * return (
 *   <>
 *     {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
 *     <div ref={loadMoreRef} />
 *   </>
 * )
 * ```
 */
export function useInfiniteScroll({
  onIntersect,
  enabled = true,
  threshold = 0.8,
  rootMargin = "0px",
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // enabled가 false면 observer 생성하지 않음
    if (!enabled) {
      return
    }

    // IntersectionObserver 콜백
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const [entry] = entries

      // 요소가 화면에 보이면 콜백 실행
      if (entry?.isIntersecting) {
        onIntersect()
      }
    }

    // IntersectionObserver 생성
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null, // viewport를 root로 사용
      rootMargin,
      threshold,
    })

    // sentinel 요소 관찰 시작
    const currentElement = elementRef.current
    if (currentElement) {
      observerRef.current.observe(currentElement)
    }

    // cleanup: observer 해제
    return () => {
      if (observerRef.current && currentElement) {
        observerRef.current.unobserve(currentElement)
        observerRef.current.disconnect()
      }
    }
  }, [enabled, onIntersect, threshold, rootMargin])

  return elementRef
}
