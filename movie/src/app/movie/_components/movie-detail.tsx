import { BLUR_DATA_URL, TMDB_IMAGE_BASE_URL } from "@/actions/tmdb/utils/config"
import type { MovieDetail as MovieDetailType } from "@/schemas"
import { Calendar, Clock, Star } from "lucide-react"
import Image from "next/image"

interface MovieDetailProps {
  movie: MovieDetailType
}

/**
 * 영화 상세 정보 컴포넌트
 * 
 * Netflix 스타일의 현대적인 디자인으로 영화 정보를 표시합니다.
 * - Hero 섹션: 백드롭 이미지 + 그라데이션 오버레이
 * - 메타 정보: 평점, 개봉일, 러닝타임, 장르
 * - 줄거리 섹션
 * - 제작 정보 섹션
 */
export function MovieDetail({ movie }: MovieDetailProps) {
  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`
    : null

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : null

  // 러닝타임을 시간과 분으로 변환
  const hours = Math.floor(movie.runtime / 60)
  const minutes = movie.runtime % 60
  const runtimeText = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`

  // 개봉일 포맷팅
  const releaseDate = new Date(movie.release_date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="min-h-screen">
      {/* Hero 섹션 - 백드롭 이미지 + 그라데이션 오버레이 */}
      <section className="relative w-full" aria-label="영화 정보">
        {/* 백드롭 이미지 */}
        <div className="relative h-[50vh] w-full sm:h-[60vh] lg:h-[70vh]">
          {backdropUrl ? (
            <Image
              src={backdropUrl}
              alt={`${movie.title} 백드롭`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
          )}

          {/* 그라데이션 오버레이 (하단) */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/60 to-transparent dark:from-zinc-950 dark:via-zinc-950/60" />

          {/* 타이틀 & 태그라인 오버레이 */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* 평점 배지 */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-lg bg-yellow-500/90 px-3 py-1.5 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-white text-white sm:h-5 sm:w-5" />
                    <span className="text-sm font-bold text-white sm:text-base">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
                    ({movie.vote_count.toLocaleString()}명 평가)
                  </span>
                </div>

                {/* 타이틀 */}
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
                  {movie.title}
                </h1>

                {/* 태그라인 */}
                {movie.tagline && (
                  <p className="text-base italic text-zinc-700 dark:text-zinc-300 sm:text-lg lg:text-xl">
                    {movie.tagline}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 컨텐츠 영역 */}
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* 왼쪽: 포스터 (데스크톱에서만 표시) */}
          <aside className="hidden lg:block">
            {posterUrl ? (
              <div className="sticky top-24">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-2xl">
                  <Image
                    src={posterUrl}
                    alt={`${movie.title} 포스터`}
                    fill
                    sizes="(min-width: 1024px) 33vw, 0vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
              </div>
            ) : (
              <div className="relative aspect-[2/3] w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            )}
          </aside>

          {/* 오른쪽: 상세 정보 */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-6 sm:gap-8">
              {/* 메타 정보 그리드 */}
              <section aria-label="영화 메타 정보">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {/* 개봉일 */}
                  <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 sm:p-4">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs font-medium sm:text-sm">개봉일</span>
                    </div>
                    <p className="mt-2 break-words text-sm font-semibold text-zinc-900 dark:text-zinc-50 sm:text-base">
                      {releaseDate}
                    </p>
                  </div>

                  {/* 러닝타임 */}
                  <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 sm:p-4">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs font-medium sm:text-sm">러닝타임</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50 sm:text-base">
                      {runtimeText}
                    </p>
                  </div>

                  {/* 상태 */}
                  <div className="col-span-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 sm:col-span-1 sm:p-4">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <span className="text-xs font-medium sm:text-sm">상태</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50 sm:text-base">
                      {movie.status === "Released" ? "개봉" : movie.status}
                    </p>
                  </div>
                </div>

                {/* 장르 */}
                {movie.genres.length > 0 && (
                  <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 sm:p-4">
                    <h3 className="text-xs font-medium text-zinc-600 dark:text-zinc-400 sm:text-sm">
                      장르
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400 sm:text-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 줄거리 */}
              <section aria-label="줄거리">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
                  줄거리
                </h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:mt-4 sm:text-base sm:leading-relaxed">
                  {movie.overview || "줄거리 정보가 없습니다."}
                </p>
              </section>

              {/* 제작 정보 */}
              <section
                aria-label="제작 정보"
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6"
              >
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
                  제작 정보
                </h2>

                <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
                  {/* 제작사 */}
                  {movie.production_companies.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 sm:text-base">
                        제작사
                      </h3>
                      <ul className="mt-2 space-y-1">
                        {movie.production_companies.map((company) => (
                          <li
                            key={company.id}
                            className="text-sm text-zinc-700 dark:text-zinc-300"
                          >
                            {company.name}
                            {company.origin_country && (
                              <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-500">
                                ({company.origin_country})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 제작 국가 */}
                  {movie.production_countries.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 sm:text-base">
                        제작 국가
                      </h3>
                      <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                        {movie.production_countries.map((c) => c.name).join(", ")}
                      </p>
                    </div>
                  )}

                  {/* 언어 */}
                  {movie.spoken_languages.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 sm:text-base">
                        사용 언어
                      </h3>
                      <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                        {movie.spoken_languages.map((l) => l.english_name).join(", ")}
                      </p>
                    </div>
                  )}

                  {/* 예산 & 수익 */}
                  {(movie.budget > 0 || movie.revenue > 0) && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {movie.budget > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 sm:text-base">
                            예산
                          </h3>
                          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                            ${movie.budget.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {movie.revenue > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 sm:text-base">
                            수익
                          </h3>
                          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                            ${movie.revenue.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

