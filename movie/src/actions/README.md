# TMDB Movie Server Actions

TMDB API를 호출하여 영화 데이터를 가져오는 타입 안전한 Next.js Server Actions입니다.

## 환경 설정

### 1. TMDB API 토큰 발급

1. [TMDB 웹사이트](https://www.themoviedb.org/)에 가입
2. [API 설정 페이지](https://www.themoviedb.org/settings/api)에서 API Read Access Token 발급
3. Bearer Token 형식의 토큰을 복사

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
# TMDB API Configuration
TMDB_API_READ_ACCESS_TOKEN=your_tmdb_bearer_token_here
```

⚠️ **주의**: `.env.local` 파일은 Git에 커밋되지 않습니다. 실제 토큰을 입력하세요.

## 사용 가능한 Server Actions

### 1. `getPopularMovies(params?: { page?: number })`

인기 영화 목록을 조회합니다.

**파라미터:**
- `page` (선택): 페이지 번호 (기본값: 1, 양의 정수)

**캐시 전략:**
- Revalidate: 3600초 (1시간)
- Tags: `['movies', 'popular']`

**사용 예시:**

```typescript
import { getPopularMovies } from "@/actions/movie"

// 첫 페이지 조회
const result1 = await getPopularMovies()

// 특정 페이지 조회
const result2 = await getPopularMovies({ page: 2 })

// 결과 처리
if (result1.success) {
  console.log(`총 ${result1.data.total_results}개의 영화`)
  result1.data.results.forEach((movie) => {
    console.log(`${movie.title} (평점: ${movie.vote_average})`)
  })
} else {
  console.error(result1.error)
}
```

### 2. `getMovieDetail({ movieId: number })`

특정 영화의 상세 정보를 조회합니다.

**파라미터:**
- `movieId` (필수): 영화 ID (양의 정수)

**캐시 전략:**
- Revalidate: 86400초 (24시간)
- Tags: `['movies', 'movie-{id}']`

**사용 예시:**

```typescript
import { getMovieDetail } from "@/actions/movie"

// 영화 상세 조회
const result = await getMovieDetail({ movieId: 1084242 })

// 결과 처리
if (result.success) {
  const movie = result.data
  console.log(`제목: ${movie.title}`)
  console.log(`원제: ${movie.original_title}`)
  console.log(`개봉일: ${movie.release_date}`)
  console.log(`러닝타임: ${movie.runtime}분`)
  console.log(`평점: ${movie.vote_average}/10`)
  console.log(`줄거리: ${movie.overview}`)
  console.log(`장르: ${movie.genres.map((g) => g.name).join(", ")}`)
} else {
  console.error(result.error)
}
```

## 에러 처리

모든 Server Actions는 `ActionResult<T>` 타입을 반환합니다:

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

### 에러 타입별 처리

```typescript
const result = await getPopularMovies()

if (!result.success) {
  // 에러 메시지는 error.schema.ts의 헬퍼 함수로 분류됩니다
  switch (result.error) {
    case "TMDB API 토큰이 설정되지 않았습니다":
      // 환경 변수 미설정
      break
    case "인증 실패: API 키를 확인해주세요":
      // API 키 오류
      break
    case "요청한 리소스를 찾을 수 없습니다":
      // 존재하지 않는 영화 ID
      break
    case "API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요":
      // Rate Limit 초과
      break
    default:
      // 기타 에러
      console.error(result.error)
  }
}
```

## 캐시 무효화

필요 시 특정 캐시를 무효화할 수 있습니다:

```typescript
import { revalidateTag } from "next/cache"

// 모든 영화 관련 캐시 무효화
revalidateTag("movies")

// 인기 영화 목록만 무효화
revalidateTag("popular")

// 특정 영화 상세만 무효화
revalidateTag("movie-1084242")
```

## 기술 스택

- **Next.js 16**: Server Actions + Data Cache
- **Zod**: 파라미터 및 응답 런타임 검증
- **TypeScript**: 완전한 타입 안전성
- **TMDB API v3**: 영화 데이터베이스

## 타입 정의

모든 타입은 `@/schemas`에서 export됩니다:

```typescript
import type {
  MoviePopularResponse,
  MovieListItem,
  MovieDetail,
} from "@/schemas"
```

자세한 타입 정의는 다음 파일을 참조하세요:
- `src/schemas/movie-popular.schema.ts`
- `src/schemas/movie-detail.schema.ts`
- `src/schemas/error.schema.ts`

