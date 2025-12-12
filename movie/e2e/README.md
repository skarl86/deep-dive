# E2E 테스트 가이드

이 디렉토리는 Playwright를 사용한 End-to-End 테스트를 포함합니다.

## 사전 준비

### 1. 환경 변수 설정

`.env.local` 파일에 TMDB API 토큰이 설정되어 있는지 확인하세요:

```env
TMDB_API_READ_ACCESS_TOKEN=your_tmdb_token_here
```

### 2. Playwright 브라우저 설치

처음 실행 시 다음 명령어로 브라우저를 설치하세요:

```bash
pnpm exec playwright install --with-deps
```

## 테스트 실행

### 기본 실행 (헤드리스 모드)

```bash
pnpm run test:e2e
```

### UI 모드로 실행 (디버깅에 유용)

```bash
pnpm run test:e2e:ui
```

### 헤드 모드로 실행 (브라우저 표시)

```bash
pnpm run test:e2e:headed
```

### 디버그 모드

```bash
pnpm run test:e2e:debug
```

### 특정 테스트 파일만 실행

```bash
pnpm exec playwright test home.spec.ts
```

### 특정 브라우저만 실행

```bash
# Chromium만
pnpm exec playwright test --project=chromium

# Firefox만
pnpm exec playwright test --project=firefox

# 모바일만
pnpm exec playwright test --project=mobile-chrome
```

## 테스트 리포트 확인

테스트 실행 후 HTML 리포트를 확인하려면:

```bash
pnpm run test:e2e:report
```

## 테스트 구조

```
e2e/
├── fixtures/              # 커스텀 픽스처 (접근성 도구)
├── helpers/               # 헬퍼 유틸리티
├── specs/                 # 테스트 스펙
│   ├── home.spec.ts       # 홈페이지 테스트
│   ├── infinite-scroll.spec.ts  # 무한 스크롤
│   ├── theme.spec.ts      # 다크모드 전환
│   ├── accessibility.spec.ts    # 접근성 (WCAG 2.1 AA)
│   └── responsive.spec.ts # 시각적 회귀 테스트
└── visual-snapshots/      # 스크린샷 베이스라인
```

## 주요 테스트 항목

### 1. 홈페이지 테스트 (`home.spec.ts`)
- 페이지 렌더링 확인
- 영화 목록 로드 검증
- 이미지 지연 로딩
- 페이지 성능 측정

### 2. 무한 스크롤 (`infinite-scroll.spec.ts`)
- 스크롤 시 추가 영화 로드
- 여러 번 스크롤 테스트
- 중복 제거 확인

### 3. 다크모드 (`theme.spec.ts`)
- 테마 토글 동작 확인
- 테마 설정 유지
- 시각적 차이 검증

### 4. 접근성 (`accessibility.spec.ts`)
- WCAG 2.1 AA 준수 확인
- 키보드 네비게이션
- 이미지 alt 텍스트
- Heading 계층 구조
- 색상 대비

### 5. 시각적 회귀 (`responsive.spec.ts`)
- 모바일/태블릿/데스크톱 스크린샷
- 다크모드 스크린샷
- 반응형 레이아웃 검증

## 문제 해결

### 포트 충돌

개발 서버가 이미 실행 중이면 테스트가 기존 서버를 재사용합니다.
포트를 변경하려면 `playwright.config.ts`의 `webServer.url`을 수정하세요.

### 스크린샷 업데이트

시각적 회귀 테스트의 베이스라인을 업데이트하려면:

```bash
pnpm exec playwright test --update-snapshots
```

### CI/CD 실패

GitHub Actions에서 테스트가 실패하면:
1. 아티팩트에서 스크린샷과 비디오 확인
2. 리포트 다운로드하여 상세 분석
3. 로컬에서 동일한 브라우저 프로젝트로 재현

## 새로운 테스트 추가

1. `e2e/specs/` 디렉토리에 `*.spec.ts` 파일 생성
2. `test` 함수를 import하여 테스트 작성
3. 접근성 테스트의 경우 `test-fixture.ts`에서 import

예시:

```typescript
import { test, expect } from "@playwright/test"

test.describe("새 기능 테스트", () => {
  test("기본 동작 확인", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toBeVisible()
  })
})
```

## 모범 사례

1. **data-testid 사용**: 안정적인 선택자를 위해 `data-testid` 속성 활용
2. **대기 전략**: `waitForTimeout` 대신 `waitForSelector` 사용
3. **테스트 격리**: 각 테스트는 독립적으로 실행 가능해야 함
4. **명확한 설명**: 테스트 이름은 무엇을 검증하는지 명확히 표현
5. **접근성 우선**: 새 기능 추가 시 항상 접근성 테스트 포함

## CI/CD

GitHub Actions에서 자동으로 실행됩니다:
- PR 생성 시
- main/develop 브랜치에 push 시

테스트 결과와 리포트는 아티팩트로 저장됩니다.

