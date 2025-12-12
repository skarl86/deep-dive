# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드를 작업할 때 참고하는 가이드를 제공합니다.

## 프로젝트 개요

TypeScript, React 19, Tailwind CSS 4로 구축된 Next.js 16 영화 탐색 애플리케이션입니다. TMDB (The Movie Database) API에서 데이터를 가져와 무한 스크롤로 인기 영화를 표시합니다. 모바일 우선 디자인 원칙을 따르며 다크 모드를 지원합니다.

## 개발 명령어

### 개발 서버 시작
```bash
cd movie
npm run dev
```
개발 서버는 http://localhost:3000 에서 실행됩니다

### 프로덕션 빌드
```bash
cd movie
npm run build
```

### 프로덕션 서버 시작
```bash
cd movie
npm run start
```

### 린팅
```bash
cd movie
npm run lint
```

### 포매팅
```bash
cd movie
# 포매팅 확인
npm run format:check

# 포매팅 수정
npm run format
```

## 환경 설정

`/movie` 디렉토리에 `.env.local` 파일을 생성하세요:

```env
TMDB_API_READ_ACCESS_TOKEN=your_tmdb_bearer_token_here
```

토큰은 [TMDB API 설정](https://www.themoviedb.org/settings/api)에서 발급받을 수 있습니다.

## 아키텍처

### 디렉토리 구조

```
movie/src/
├── actions/           # Next.js Server Actions
│   └── tmdb/         # TMDB API 통합
│       ├── movie.ts  # 영화 관련 액션
│       ├── types.ts  # 액션 파라미터 스키마
│       └── utils/    # 인증, 에러 처리, 설정
├── app/              # Next.js App Router
│   ├── (main)/       # 메인 레이아웃을 위한 라우트 그룹
│   │   ├── _components/  # 라우트 전용 컴포넌트
│   │   └── page.tsx
│   ├── layout.tsx    # 테마 프로바이더가 포함된 루트 레이아웃
│   └── globals.css   # Tailwind + CSS 변수
├── components/       # 공유 UI 컴포넌트
├── hooks/            # 커스텀 React 훅
├── lib/              # 유틸리티 함수 (예: cn)
├── schemas/          # API 검증을 위한 Zod 스키마
└── utils/            # 헬퍼 함수
```

### 주요 아키텍처 패턴

#### Server Actions 패턴
모든 API 호출은 타입 안전한 에러 처리를 갖춘 Next.js Server Actions를 사용합니다:
- `src/actions/tmdb/`에 위치
- `ActionResult<T>` 유니온 타입 반환: `{ success: true; data: T } | { success: false; error: string }`
- 파라미터와 API 응답 모두에 대한 Zod 검증 포함
- 예시: `getPopularMovies()`, `getMovieDetail()`

#### 스키마 검증
모든 TMDB API 응답은 Zod 스키마를 사용하여 검증됩니다:
- 스키마는 `src/schemas/`에 정의
- 각 스키마는 Zod 스키마와 TypeScript 타입을 모두 export
- Safe parsing 헬퍼는 런타임 에러를 방지: `safeParseMoviePopularResponse()`, `safeParseMovieDetail()`

#### ISR + 클라이언트 사이드 무한 스크롤 하이브리드
앱은 2단계 렌더링 전략을 사용합니다:
1. **서버 사이드 (ISR)**: Next.js 캐시 재검증을 통한 초기 페이지 사전 렌더링
   - 인기 영화: 1시간 캐시 (`revalidate: 3600`)
   - 영화 상세: 24시간 캐시 (`revalidate: 86400`)
   - 캐시 태그: `['movies', 'popular']`, `['movies', 'movie-{id}']`

2. **클라이언트 사이드**: 무한 스크롤을 통한 추가 페이지 동적 로딩
   - IntersectionObserver 사용 (`useInfiniteScroll` 훅 활용)
   - 스크롤 80% 지점에서 프리페치 (threshold: 0.8)
   - ID로 영화 중복 제거

#### 컴포넌트 구조
- **라우트 컴포넌트** (`_components/`): 특정 라우트에만 사용, 공유되지 않음
- **공유 컴포넌트** (`components/`): 라우트 간 재사용 가능
- 예시: `_components/`의 `InfiniteMovieList` vs `components/`의 `MovieCard`

## 필수 코드 표준

### 1. Import 규칙 - 항상 절대 경로 Import 사용

**절대 상대 경로 import (`../`, `./`)를 사용하지 마세요. 항상 `@/` alias를 사용하세요.**

```typescript
// ❌ 잘못된 방식
import { helper } from "../utils/helper"
import { Button } from "./components/Button"

// ✅ 올바른 방식
import { helper } from "@/utils/helper"
import { Button } from "@/components/Button"
```

경로 alias는 `tsconfig.json`에 설정됨: `"@/*": ["./src/*"]`

### 2. 모듈 시스템 - ES6 Import만 사용

**절대 `require()`를 사용하지 마세요. 항상 ES6 `import` 구문을 사용하세요.**

```typescript
// ❌ 잘못된 방식
const { helper } = require("@/utils/helper")

// ✅ 올바른 방식
import { helper } from "@/utils/helper"
```

### 3. 스타일링 - 컴포넌트 변형에 CVA 사용

컴포넌트 스타일 변형에는 `class-variance-authority` (CVA)를 사용하세요:

```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium transition-colors",
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-transparent hover:bg-accent",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  }
)
```

### 4. 모바일 우선 반응형 디자인

**항상 모바일(375×667)부터 시작하여 `sm:` 브레이크포인트(640px+)를 사용해 큰 화면으로 확장하세요.**

```typescript
// ✅ 올바른 방식: 모바일 우선 접근
<div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between">
  <h4 className="text-sm sm:text-base">Title</h4>
</div>

// 그리드 레이아웃
<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">

// ❌ 잘못된 방식: 데스크톱 우선 또는 일관되지 않은 브레이크포인트
<div className="flex justify-between md:flex-col">  // md: 사용 금지
<div className="text-base sm:text-sm">            // 역방향 스케일링
```

**브레이크포인트 계층:**
- Default: 모바일 (375px 폭 기준)
- `sm:`: 640px+ (태블릿 및 데스크톱)
- 코드베이스의 기존 패턴을 따를 때만 `lg:` 및 `xl:` 사용

**텍스트 오버플로우 방지:**
```typescript
className="break-all"        // 통화/긴 숫자용
className="break-words"      // 일반 텍스트용
className="flex-shrink-0"    // 아이콘/레이블용
className="min-w-0 flex-1"   // 유연한 텍스트 컨테이너용
```

### 5. 언어 응답 규칙

**항상 사용자 쿼리와 동일한 언어로 응답하세요.**

- 한글 쿼리 (한글 포함) → 한글 응답 (100% 한글)
- 영어 쿼리 → 영어 응답
- 모든 설명, 에러 메시지, 기술 설명은 사용자의 언어와 일치해야 함
- 코드는 영어로 유지하되, 코드에 대한 설명은 사용자의 언어로 작성

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **런타임 검증**: Zod 4
- **스타일링**: Tailwind CSS 4 with CVA
- **UI 컴포넌트**: Lucide 아이콘을 사용한 커스텀 컴포넌트
- **상태 관리**: React 19 훅 (외부 상태 라이브러리 없음)
- **테마**: 다크 모드를 위한 next-themes
- **타입 안전성**: strict 모드의 TypeScript 5

## 일반적인 패턴

### 새로운 Server Action 생성

1. `actions/tmdb/types.ts`에 파라미터 스키마 정의:
```typescript
export const GetSomethingParamsSchema = z.object({
  id: z.number().int().positive(),
})
export type GetSomethingParams = z.infer<typeof GetSomethingParamsSchema>
```

2. `schemas/`에 응답을 위한 Zod 스키마 생성:
```typescript
export const SomethingSchema = z.object({ /* ... */ })
export type Something = z.infer<typeof SomethingSchema>
export const safeParseSomething = (data: unknown) => SomethingSchema.safeParse(data)
```

3. `actions/tmdb/`에 액션 구현:
```typescript
export async function getSomething(
  params: GetSomethingParams
): Promise<ActionResult<Something>> {
  try {
    const validated = GetSomethingParamsSchema.parse(params)
    const headers = createAuthHeaders()
    if (!headers) {
      return { success: false, error: "TMDB API 토큰이 설정되지 않았습니다" }
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600, tags: ["something"] }
    })

    if (!response.ok) {
      const errorMessage = await handleTMDBError(response)
      return { success: false, error: errorMessage }
    }

    const json = await response.json()
    const result = safeParseSomething(json)

    if (!result.success) {
      return { success: false, error: `응답 데이터 검증 실패: ${result.error.message}` }
    }

    return { success: true, data: result.data }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "알 수 없는 오류가 발생했습니다" }
  }
}
```

### 컴포넌트에서 Server Actions 사용

```typescript
const result = await getSomething({ id: 123 })

if (result.success) {
  // result.data 사용 (타입 안전)
  console.log(result.data)
} else {
  // 에러 처리
  console.error(result.error)
}
```

### 무한 스크롤 구현

IntersectionObserver와 함께 `useInfiniteScroll` 훅 사용:

```typescript
const loadMoreRef = useInfiniteScroll({
  onIntersect: loadNextPage,
  enabled: hasNextPage && !isLoading,
  threshold: 0.8, // 80% 보일 때 프리페치
})

return (
  <>
    {items.map(item => <Item key={item.id} item={item} />)}
    <div ref={loadMoreRef} /> {/* Sentinel 요소 */}
  </>
)
```

## 이미지 최적화

적절한 설정으로 Next.js Image 컴포넌트 사용:

```typescript
import Image from "next/image"
import { TMDB_IMAGE_BASE_URL, BLUR_DATA_URL } from "@/actions/tmdb/utils/config"

<Image
  src={`${TMDB_IMAGE_BASE_URL}${poster_path}`}
  alt="영화 포스터"
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
  className="object-cover rounded-lg"
  placeholder="blur"
  blurDataURL={BLUR_DATA_URL}
/>
```

`image.tmdb.org`에 대한 원격 패턴이 `next.config.ts`에 설정되어 있습니다.

## 모바일 반응성 테스트

UI 컴포넌트를 구현하거나 수정할 때:

1. 375×667 (모바일)에서 테스트
   - 가로 스크롤 없음
   - 줌 없이 텍스트 읽기 가능
   - 터치 타겟 ≥ 44px
   - 콘텐츠 오버플로우 없음

2. 1024×768+ (데스크톱)에서 테스트
   - 레이아웃이 디자인과 일치
   - 시각적 퇴행 없음
   - 적절한 정렬

3. ~640px (sm: 브레이크포인트)에서 전환 테스트
   - 부드러운 레이아웃 변경
   - 점프나 깜빡임 없음
