---
name: git-pr
description: 현재 브랜치의 커밋을 push하고 Pull Request를 생성합니다. GitHub CLI를 사용하여 상세한 PR을 자동으로 생성합니다. PR을 만들 때, pull request 생성 요청 시 이 스킬을 사용하세요.
allowed-tools: [Run, Read, Grep]
---

# Git Pull Request Skill

이 스킬은 Git 브랜치를 push하고 GitHub Pull Request를 자동으로 생성합니다.

## 사용 시기

- 사용자가 PR을 생성하고 싶을 때
- "PR 만들어줘", "pull request", "풀 리퀘스트 생성" 등의 요청이 있을 때
- 브랜치 작업을 완료하고 main/develop 브랜치로 머지하고 싶을 때

## 전제조건

### GitHub CLI 설치 및 인증

이 스킬은 GitHub CLI (`gh`)를 사용합니다. 다음 명령어로 설치 및 인증 상태를 확인하세요:

```bash
# 설치 확인
gh --version

# 인증 상태 확인
gh auth status

# 인증이 안 되어 있다면
gh auth login
```

## 워크플로우

### 1. 현재 상태 확인

먼저 현재 브랜치와 커밋 상태를 확인합니다:

```bash
# 현재 브랜치 확인
git branch --show-current

# 푸시되지 않은 커밋 확인
git log origin/main..HEAD --oneline

# 또는 origin에 없는 커밋 확인
git log @{u}.. --oneline 2>/dev/null || git log --oneline
```

### 2. PR 템플릿 읽기

[templates/pr_template.md](templates/pr_template.md) 파일을 읽어 PR 본문 구조를 확인합니다.

### 3. 커밋 히스토리 분석

최근 커밋들을 분석하여 PR 제목과 본문을 작성합니다:

```bash
# 커밋 목록 가져오기
git log origin/main..HEAD --oneline

# 변경된 파일 목록
git diff --name-status origin/main..HEAD
```

### 4. PR 본문 작성

템플릿을 기반으로 다음 섹션들을 채웁니다:

#### 자동 생성 섹션

**커밋 목록**:
```bash
git log origin/main..HEAD --oneline
```

**변경된 파일**:
```bash
git diff --name-status origin/main..HEAD
```

#### Claude가 작성할 섹션

**PR 제목** (한국어):
- 주요 변경사항을 한 문장으로 요약
- 예: "영화 검색 기능 추가 및 상세 페이지 구현"

**변경사항 요약**:
- 커밋 메시지들을 분석하여 주요 변경사항 정리
- 추가된 기능, 수정된 버그, 개선된 부분 등

**주요 기능** (체크박스):
- 새로 추가된 기능 목록
- 예:
  - [x] TMDB API 통합
  - [x] 영화 검색 UI 구현
  - [x] 상세 페이지 라우팅

**테스트**:
- 수행한 테스트 항목 체크
- 예:
  - [x] 로컬 개발 환경에서 테스트 완료
  - [x] 수동 테스트 시나리오 검증

#### 사용자 입력 섹션

**스크린샷**:
- UI 변경이 있는 경우 사용자에게 스크린샷 첨부 요청
- 없으면 "해당 없음" 또는 섹션 제거

**관련 이슈**:
- 사용자가 이슈 번호를 제공하면 추가
- 형식: `Closes #123` 또는 `Fixes #456`

### 5. PR 생성 실행

임시 파일에 PR 본문을 저장하고 스크립트를 실행합니다:

```bash
# PR 본문을 임시 파일에 저장
echo "본문 내용" > /tmp/pr_body.md

# PR 생성 스크립트 실행
python scripts/create_pr.py --base main --title "PR 제목" --body-file /tmp/pr_body.md
```

## PR 본문 템플릿 구조

템플릿은 다음 섹션들로 구성됩니다:

1. **변경사항**: 주요 변경사항 요약 + 커밋 목록 + 주요 기능
2. **변경 이유**: 이 PR이 필요한 이유
3. **테스트**: 수행한 테스트 항목 체크리스트
4. **스크린샷**: UI 변경사항 (있는 경우)
5. **체크리스트**: 코드 리뷰 전 확인사항
6. **관련 이슈**: 관련 이슈 번호

자세한 템플릿 내용은 [templates/pr_template.md](templates/pr_template.md)를 참조하세요.

## 기본 base 브랜치

base 브랜치가 지정되지 않으면 기본값은 `main`입니다. 다른 브랜치를 사용하려면 명시적으로 지정하세요:

- `main`: 메인 브랜치 (기본값)
- `develop`: 개발 브랜치
- `staging`: 스테이징 브랜치

## 좋은 PR 제목 예시

✅ **좋은 예시** (한국어, 구체적):
```
영화 검색 기능 추가 및 상세 페이지 구현
사용자 인증 버그 수정 및 세션 관리 개선
TMDB API 통합 및 데이터 캐싱 구현
```

❌ **나쁜 예시** (너무 간단하거나 영어):
```
Update code
Bug fix
Add feature
기능 추가
```

## 주의사항

1. **브랜치 확인**: 올바른 브랜치에서 작업하고 있는지 확인
2. **커밋 정리**: PR 전에 커밋이 논리적으로 정리되어 있는지 확인
3. **테스트 완료**: 로컬에서 충분히 테스트한 후 PR 생성
4. **체크리스트 확인**: PR 본문의 체크리스트를 모두 확인
5. **리뷰어 지정**: PR 생성 후 적절한 리뷰어 지정 필요

## 스크립트 사용법

### create_pr.py

현재 브랜치를 push하고 GitHub PR을 생성합니다.

**인자**:
- `--base`: 대상 브랜치 (기본값: main)
- `--title`: PR 제목 (한국어)
- `--body-file`: PR 본문이 저장된 파일 경로

**예시**:
```bash
python scripts/create_pr.py \
  --base main \
  --title "영화 검색 기능 추가" \
  --body-file /tmp/pr_body.md
```

## 문제 해결

### GitHub CLI 인증 오류

```bash
# 인증 상태 확인
gh auth status

# 재인증
gh auth login
```

### 브랜치가 이미 push되어 있는 경우

스크립트는 자동으로 force push를 하지 않습니다. 필요하다면 수동으로:

```bash
git push --force-with-lease origin <branch-name>
```

### PR이 이미 존재하는 경우

GitHub CLI는 기존 PR이 있으면 오류를 반환합니다. 기존 PR을 업데이트하려면:

```bash
# PR 목록 확인
gh pr list

# PR 업데이트 (추가 커밋 후 push만 하면 됨)
git push origin <branch-name>
```

