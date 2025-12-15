---
name: git-commit
description: Git 변경사항을 한국어 컨벤셔널 커밋 형식으로 커밋합니다. 각 파일의 내용과 역할을 분석하여 논리적 단위로 세분화하고, 의미있는 커밋으로 나눕니다. 커밋할 때, commit 명령어 사용 시 이 스킬을 사용하세요.
allowed-tools: [Run, Read, Grep]
---

# Git Commit Skill

이 스킬은 Git 변경사항을 분석하고 한국어 컨벤셔널 커밋 형식에 맞춰 자동으로 커밋합니다.

## 사용 시기

- 사용자가 변경사항을 커밋하고 싶을 때
- "커밋해줘", "commit", "변경사항 저장" 등의 요청이 있을 때
- 작업 내용을 논리적 단위로 나눠 여러 커밋으로 분리하고 싶을 때

## 워크플로우

### 1. 변경사항 확인

먼저 현재 Git 상태를 확인합니다:

```bash
git status
git diff
```

### 2. 파일 내용 분석 (중요!)

**각 변경된 파일의 전체 내용을 Read 도구로 읽어서** 다음을 파악합니다:

1. **파일의 역할과 책임**: 이 파일이 무엇을 담당하는가?

   - 컴포넌트인가? 유틸리티인가? API 핸들러인가?
   - 어떤 도메인/기능에 속하는가?

2. **파일 간의 관계**:

   - 함께 변경된 파일들이 서로 의존하는가?
   - 같은 기능/모듈에 속하는가?

3. **변경의 본질**:
   - 새로운 기능을 추가한 것인가?
   - 기존 버그를 수정한 것인가?
   - 코드 구조만 개선한 것인가?

**예시**:

```bash
# 변경된 각 파일 읽기
Read src/components/SearchBar.tsx
Read src/api/search.ts
Read src/types/movie.ts

# 파일 구조 파악
Grep "export" src/components/SearchBar.tsx
Grep "import" src/api/search.ts
```

### 3. 변경사항 그룹화

파일 내용 분석을 바탕으로 논리적 단위로 그룹화합니다:

- **기능 추가** (feat): 새로운 기능과 관련된 파일들
  - 예: 검색 컴포넌트 + 검색 API + 타입 정의
- **버그 수정** (fix): 버그 수정과 관련된 파일들

  - 예: 인증 로직 + 에러 핸들링

- **문서화** (docs): README, 주석, 문서 파일들

  - 예: README.md + API 문서

- **리팩토링** (refactor): 기능 변경 없이 코드 개선

  - 예: 유틸리티 함수 분리 + 타입 개선

- **스타일** (style): 포맷팅, 린트 수정

  - 예: import 정렬 + 세미콜론 추가

- **테스트** (test): 테스트 코드 추가/수정
  - 예: 컴포넌트 테스트 + API 테스트

**그룹화 기준**:

1. **도메인 응집성**: 같은 기능/도메인에 속하는 파일끼리 묶기
2. **의존 관계**: 서로 의존하는 파일들을 같은 커밋에 포함
3. **변경 목적**: 같은 목적(기능 추가, 버그 수정 등)을 가진 변경끼리 묶기
4. **최소 단위**: 각 커밋이 독립적으로 의미가 있어야 함

### 4. 커밋 메시지 생성

파일 분석 결과를 바탕으로 각 그룹에 대해 **구체적이고 명확한** 한국어 커밋 메시지를 생성합니다.

**필수 형식**: `<type>[optional scope]: <Korean description>`

**커밋 타입** (영어):

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경 (포맷팅, 세미콜론 등)
- `refactor`: 코드 리팩토링
- `perf`: 성능 개선
- `test`: 테스트 추가 또는 수정
- `chore`: 빌드 프로세스 또는 보조 도구 변경

**스코프 결정 방법**:
파일 분석을 통해 파악한 도메인/기능명을 스코프로 사용:

- 컴포넌트: `(SearchBar)`, `(MovieCard)`, `(Header)`
- 기능: `(search)`, `(auth)`, `(payment)`
- 모듈: `(api)`, `(utils)`, `(hooks)`
- 페이지: `(home)`, `(detail)`, `(mypage)`

**좋은 예시** (파일 분석 기반):

```
# SearchBar.tsx, SearchInput.tsx, useSearch.ts 변경
feat(search): 영화 제목으로 실시간 검색 기능 추가

# api/auth.ts, hooks/useAuth.ts 변경
fix(auth): 토큰 만료 시 자동 갱신 로직 수정

# README.md, docs/api.md 변경
docs(api): TMDB API 연동 가이드 및 사용 예시 추가

# utils/date.ts 변경
refactor(utils): 날짜 포맷 함수를 순수 함수로 분리

# components/Button.tsx, Input.tsx 변경 (스타일만)
style(ui): Tailwind CSS 클래스 정렬 및 포맷팅
```

**나쁜 예시** (파일 분석 없이 작성):

```
❌ feat: update component (너무 모호함)
❌ fix: fix bug (무엇을 고쳤는지 불명확)
❌ refactor: 개선 (무엇을 개선했는지 불명확)
❌ chore: 수정함 (변경 내용 불명확)
```

**커밋 메시지 작성 체크리스트**:

- [ ] 파일 내용을 실제로 읽고 분석했는가?
- [ ] 스코프가 파일의 도메인/기능을 정확히 반영하는가?
- [ ] 설명이 "무엇을" 변경했는지 명확한가?
- [ ] 한국어 문법이 자연스러운가?
- [ ] 50자 이내인가?

### 5. 커밋 실행

각 그룹별로 `scripts/commit.py` 스크립트를 사용하여 커밋합니다:

```bash
python scripts/commit.py --files "file1.ts file2.ts" --message "feat(api): TMDB 검색 API 엔드포인트 추가"
```

## 실제 워크플로우 예시

### 상황: 3개 파일이 변경됨

```bash
# 1. 변경사항 확인
git status
# 출력:
# modified: src/components/SearchBar.tsx
# modified: src/api/tmdb.ts
# modified: README.md
```

### 분석 과정

```bash
# 2. 각 파일 내용 읽기 (중요!)
Read src/components/SearchBar.tsx
# → React 컴포넌트, 영화 검색 UI 담당
# → useState, useEffect로 검색 로직 구현
# → tmdb.ts의 searchMovies 함수 호출

Read src/api/tmdb.ts
# → TMDB API 호출 함수 모음
# → searchMovies 함수가 새로 추가됨
# → axios로 HTTP 요청 처리

Read README.md
# → 프로젝트 문서
# → "영화 검색" 섹션이 새로 추가됨
# → API 사용법 설명

# 3. git diff로 변경 내용 확인
git diff src/components/SearchBar.tsx
git diff src/api/tmdb.ts
git diff README.md
```

### 논리적 그룹화

**분석 결과**:

- `SearchBar.tsx`와 `tmdb.ts`는 **같은 기능**(영화 검색)에 속함
- 서로 **의존 관계**가 있음 (SearchBar가 tmdb.ts 사용)
- `README.md`는 **문서**이므로 별도 커밋

**그룹 결정**:

1. **그룹 1** (feat): SearchBar.tsx + tmdb.ts
2. **그룹 2** (docs): README.md

### 커밋 실행

```bash
# 첫 번째 커밋: 기능 추가
python scripts/commit.py \
  --files "src/components/SearchBar.tsx src/api/tmdb.ts" \
  --message "feat(search): TMDB API를 활용한 영화 검색 기능 추가"

# 두 번째 커밋: 문서화
python scripts/commit.py \
  --files "README.md" \
  --message "docs(readme): 영화 검색 기능 사용법 추가"
```

### 결과

```
✅ 커밋 완료! (해시: a1b2c3d)
   메시지: feat(search): TMDB API를 활용한 영화 검색 기능 추가

✅ 커밋 완료! (해시: e4f5g6h)
   메시지: docs(readme): 영화 검색 기능 사용법 추가
```

## 커밋 메시지 작성 규칙

### 제목 (필수)

- 50자 이내로 작성
- 명확하고 구체적인 한국어 설명
- 동사로 시작 (추가, 수정, 제거, 개선 등)

### 본문 (선택, 복잡한 변경사항인 경우)

- 72자마다 줄바꿈
- 무엇을, 왜 변경했는지 설명
- 어떻게 변경했는지는 코드에서 확인 가능하므로 생략 가능

### Breaking Changes

- 타입 뒤에 `!` 추가: `feat(api)!: 사용자 인증 API 구조 변경`
- 푸터에 `BREAKING CHANGE:` 추가

## 참고 문서

한국어 컨벤셔널 커밋 규칙에 대한 자세한 내용은 프로젝트의 [`.cursor/rules/korean-conventional-commits.mdc`](../../.cursor/rules/korean-conventional-commits.mdc) 파일을 참조하세요.

## 주의사항

1. **반드시 파일 내용을 읽으세요**: `git diff`만으로는 부족합니다!

   - Read 도구로 변경된 각 파일의 전체 내용 확인
   - 파일의 역할, 책임, 도메인을 파악
   - 파일 간의 의존 관계 분석

2. **논리적 단위로 나누세요**:

   - 하나의 커밋은 하나의 목적만 가져야 함
   - 같은 기능/도메인에 속하는 파일끼리 묶기
   - 의존 관계가 있는 파일들을 함께 커밋

3. **구체적인 메시지를 작성하세요**:

   - 파일 분석 결과를 바탕으로 작성
   - "무엇을" 변경했는지 명확히 표현
   - 스코프에 파일의 도메인/기능 반영

4. **검증하세요**:
   - 각 커밋이 독립적으로 의미가 있는가?
   - 커밋 메시지만 보고 변경 내용을 이해할 수 있는가?
   - 나중에 히스토리를 볼 때 도움이 되는가?

## 스크립트 사용법

### commit.py

변경사항을 스테이징하고 커밋합니다.

**인자**:

- `--files`: 커밋할 파일 목록 (공백으로 구분)
- `--message`: 커밋 메시지

**예시**:

```bash
python scripts/commit.py --files "src/app/page.tsx" --message "feat(home): 메인 페이지 레이아웃 개선"
```
