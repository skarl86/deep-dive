---
name: git-commit
description: Git 변경사항을 한국어 컨벤셔널 커밋 형식으로 커밋합니다. 작업 내용을 세분화하여 여러 개의 의미있는 커밋으로 나눕니다. 커밋할 때, commit 명령어 사용 시 이 스킬을 사용하세요.
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

### 2. 변경사항 분석 및 그룹화

변경된 파일들을 분석하여 논리적 단위로 그룹화합니다:

- **기능 추가**: 새로운 기능과 관련된 파일들
- **버그 수정**: 버그 수정과 관련된 파일들
- **문서화**: README, 주석, 문서 파일들
- **리팩토링**: 기능 변경 없이 코드 개선
- **스타일**: 포맷팅, 린트 수정
- **테스트**: 테스트 코드 추가/수정

### 3. 커밋 메시지 생성

각 그룹에 대해 한국어 컨벤셔널 커밋 형식으로 메시지를 생성합니다.

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

**좋은 예시**:
```
feat(search): TMDB API를 활용한 영화 검색 기능 추가
fix(auth): 로그인 시 토큰 만료 처리 로직 수정
docs(readme): 프로젝트 설치 가이드 및 사용법 추가
refactor(utils): 날짜 포맷 함수를 순수 함수로 리팩토링
```

**나쁜 예시**:
```
❌ update component
❌ fix bug
❌ 개선
❌ 수정함
```

### 4. 커밋 실행

각 그룹별로 `scripts/commit.py` 스크립트를 사용하여 커밋합니다:

```bash
python scripts/commit.py --files "file1.ts file2.ts" --message "feat(api): TMDB 검색 API 엔드포인트 추가"
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

1. **항상 변경사항을 먼저 검토하세요**: `git diff`로 무엇이 변경되었는지 확인
2. **논리적 단위로 나누세요**: 하나의 커밋은 하나의 목적만 가져야 함
3. **의미있는 메시지를 작성하세요**: 나중에 히스토리를 볼 때 이해할 수 있어야 함
4. **스코프를 적절히 사용하세요**: 변경된 모듈이나 컴포넌트를 명시

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

