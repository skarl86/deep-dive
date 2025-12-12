# 🎬 Movie Database - Next.js 학습 프로젝트

> **Next.js 16 + React 19**를 활용한 영화 데이터베이스 애플리케이션
> GitHub 이슈 기반 체계적 학습 로드맵으로 프론트엔드 개발 역량 강화

이 프로젝트는 [The Movie Database (TMDB) API](https://www.themoviedb.org/)를 활용하여 Next.js의 최신 기능들을 단계적으로 학습하고 실무에 적용하는 것을 목표로 합니다.

## 📚 학습 목표

- ✨ **Next.js 15+ App Router** 완벽 마스터
- 🔄 **Server/Client Component** 전략적 활용
- ⚡ **React 19** 새로운 기능 학습 및 적용
- 🧪 **E2E 테스트 (Playwright)** 시스템 구축
- ♿ **웹 접근성(A11y)** WCAG 2.1 AA 준수
- 🚀 **성능 최적화** 및 캐싱 전략 실습
- 🎨 **모던 UI/UX** 구현 (다크모드, 무한 스크롤 등)

---

## 🛠 기술 스택

### Core

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)

### Styling

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-3.5.1-000000)
![CVA](https://img.shields.io/badge/CVA-0.7.1-purple)
![next-themes](https://img.shields.io/badge/next--themes-0.4.6-lightgrey)

### Data & Validation

![Zod](https://img.shields.io/badge/Zod-4.1.13-3E67B1?logo=zod&logoColor=white)

### Testing

![Playwright](https://img.shields.io/badge/Playwright-1.57.0-2EAD33?logo=playwright&logoColor=white)
![axe-core](https://img.shields.io/badge/axe--core-4.11.0-6D40A8)

### Code Quality

![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.7.4-F7B93E?logo=prettier&logoColor=white)

---

## 📖 주요 학습 내용

### 1. 📦 프로젝트 설계 및 아키텍처

- Next.js 16 프로젝트 환경 설정
- TypeScript 절대 경로 임포트 (`@/` alias)
- Route Groups를 활용한 파일 구조 설계
- 레이아웃 분리 및 컴포넌트 응집도 관리

### 2. 🔐 타입 안전성 및 데이터 검증

- Zod를 활용한 런타임 타입 검증
- Server Actions와 `ActionResult` 패턴
- 외부 API 응답의 안전한 처리 (`safeParse`)
- TypeScript `unknown` 타입과 타입 가드 활용

### 3. ⚛️ Server/Client Component 전략

- Server Component 기본 원칙 및 활용
- `"use client"` 디렉티브 사용 시점
- next-themes를 활용한 다크모드 구현
- 클라이언트 상태 관리 (Context API)

### 4. 🌊 데이터 페칭 및 스트리밍

- Server Actions로 데이터 페칭
- React Suspense를 활용한 점진적 렌더링
- Error Boundary로 에러 핸들링
- Next.js Data Cache 전략 (revalidate, tags)

### 5. 🛣️ 라우팅 및 네비게이션

- Dynamic Routes (`[id]` 패턴)
- `generateStaticParams`로 정적 생성
- Parallel Data Fetching 최적화
- URL Search Params와 필터링

### 6. 🎨 UI/UX 최적화

- `next/image`를 활용한 이미지 최적화
- 무한 스크롤 (IntersectionObserver)
- 실시간 검색 및 디바운싱
- 반응형 디자인 및 모바일 최적화

### 7. ♿ 접근성 및 SEO

- 시맨틱 HTML 구조화
- ARIA 속성 및 키보드 네비게이션
- Metadata API를 활용한 동적 SEO
- Sitemap 및 robots.txt 생성

### 8. 🧪 E2E 테스트 시스템

- Playwright 설정 및 크로스 브라우저 테스트
- 시각적 회귀 테스트 (Visual Regression)
- 접근성 자동화 테스트 (axe-core)
- CI/CD 파이프라인 통합

---

## 🗺️ 학습 로드맵

### ✅ 완료된 학습 (8개)

| 이슈                                                  | 주제                                    | 핵심 학습 내용                                         |
| ----------------------------------------------------- | --------------------------------------- | ------------------------------------------------------ |
| [#1](https://github.com/skarl86/deep-dive/issues/1)   | Next.js 16 프로젝트 환경 설정           | TypeScript, Tailwind CSS 4, shadcn/ui 통합             |
| [#2](https://github.com/skarl86/deep-dive/issues/2)   | Server Actions와 타입 안전성            | Zod 검증, ActionResult 패턴, 도메인 중심 구조          |
| [#3](https://github.com/skarl86/deep-dive/issues/3)   | 클라이언트 컴포넌트와 테마 시스템       | Server/Client 구분, next-themes, 폰트 최적화           |
| [#4](https://github.com/skarl86/deep-dive/issues/4)   | 데이터 페칭과 Suspense                  | Server Component 데이터 페칭, Suspense 스트리밍        |
| [#5](https://github.com/skarl86/deep-dive/issues/5)   | Dynamic Routes와 Parallel Data Fetching | `[id]` 라우트, `generateStaticParams`, 동적 메타데이터 |
| [#17](https://github.com/skarl86/deep-dive/issues/17) | Route Groups와 파일 구조 설계           | Route Groups, 컴포넌트 응집도 설계                     |
| [#19](https://github.com/skarl86/deep-dive/issues/19) | 레이아웃 분리와 Suspense 스트리밍       | 레이아웃 구조화, 점진적 렌더링                         |
| [#25](https://github.com/skarl86/deep-dive/issues/25) | E2E 테스트 시스템 구축 (Playwright)     | 크로스 브라우저 테스트, 시각적 회귀, 접근성 자동화     |

### 🔄 진행 중 / 예정 (9개)

| 이슈                                                  | 주제                             | 예상 학습 내용                                   |
| ----------------------------------------------------- | -------------------------------- | ------------------------------------------------ |
| [#6](https://github.com/skarl86/deep-dive/issues/6)   | Server Actions로 검색 기능 구현  | Form Actions, `useFormState`, 디바운싱           |
| [#7](https://github.com/skarl86/deep-dive/issues/7)   | URL Search Params와 필터링       | `useSearchParams`, Shallow Routing               |
| [#8](https://github.com/skarl86/deep-dive/issues/8)   | Client-side 상태 관리            | Context API, Local Storage, Optimistic UI        |
| [#9](https://github.com/skarl86/deep-dive/issues/9)   | Image Optimization과 성능        | `next/image`, Priority Loading, Blur Placeholder |
| [#11](https://github.com/skarl86/deep-dive/issues/11) | Route Handlers (API Routes)      | GET/POST 요청, Edge Runtime, CORS                |
| [#12](https://github.com/skarl86/deep-dive/issues/12) | Middleware와 Request/Response    | URL 리다이렉트, 요청 가로채기, Edge 실행         |
| [#13](https://github.com/skarl86/deep-dive/issues/13) | 캐싱 전략 심화                   | Data Cache, Full Route Cache, ISR                |
| [#14](https://github.com/skarl86/deep-dive/issues/14) | 접근성(A11y)과 SEO 최적화        | WCAG 2.1 AA, Metadata, Sitemap, JSON-LD          |
| [#20](https://github.com/skarl86/deep-dive/issues/20) | 실시간 검색과 사용자 경험 최적화 | 오토컴플릿, 최근 검색어, URL 상태 관리           |

---

## 🚀 시작하기

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 TMDB API 토큰을 추가하세요:

```bash
TMDB_API_READ_ACCESS_TOKEN=your_tmdb_api_token_here
```

> TMDB API 토큰은 [TMDB 웹사이트](https://www.themoviedb.org/settings/api)에서 발급받을 수 있습니다.

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 4. E2E 테스트 실행

```bash
# Playwright 브라우저 설치 (최초 1회)
pnpm exec playwright install --with-deps

# E2E 테스트 실행
pnpm test:e2e

# UI 모드로 테스트 (디버깅)
pnpm test:e2e:ui
```

### 5. 코드 포맷팅

```bash
# 코드 포맷팅
pnpm format

# 포맷팅 검사
pnpm format:check
```

---

## 📚 학습 자료

### 공식 문서

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [Playwright 공식 문서](https://playwright.dev)

### API 문서

- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [Zod Documentation](https://zod.dev)

### 접근성 및 테스트

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)

---

## 🤝 기여

이 프로젝트는 개인 학습 목적으로 제작되었습니다. 피드백이나 제안 사항이 있으시면 이슈를 생성해 주세요!

---

## 📝 라이선스

This project is licensed under the MIT License.

---

## 🤖 개발 방식

이 프로젝트는 **Cursor AI Agent**를 활용하여 개발되었습니다.

- 🎯 GitHub 이슈 기반 체계적 학습 계획 수립
- 🤝 AI 페어 프로그래밍을 통한 코드 작성 및 리뷰
- 📝 자동화된 문서화 및 테스트 코드 생성
- 🔄 지속적인 리팩토링과 코드 품질 개선

> **학습 포인트**: AI 도구를 활용한 효율적인 학습 방법론과 개발 프로세스 실험

---

## 🙏 감사의 말

- [The Movie Database (TMDB)](https://www.themoviedb.org/) - 영화 데이터 API 제공
- [Vercel](https://vercel.com/) - Next.js 프레임워크 개발 및 호스팅
- [shadcn](https://ui.shadcn.com) - 아름다운 UI 컴포넌트 라이브러리
- [Cursor](https://cursor.sh/) - AI 기반 코드 에디터 및 페어 프로그래밍 도구

---

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**
