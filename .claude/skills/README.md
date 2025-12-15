# Claude Agent Skills

이 디렉토리에는 Claude Code에서 사용할 수 있는 Agent Skills가 포함되어 있습니다.

## 설치된 Skills

### 1. git-commit

Git 변경사항을 한국어 컨벤셔널 커밋 형식으로 자동 커밋합니다.

**사용 시기**:

- "변경사항을 커밋해줘"
- "commit 해줘"
- 여러 파일을 논리적 단위로 나눠 커밋하고 싶을 때

**주요 기능**:

- 변경사항을 자동으로 논리적 단위로 그룹화
- 한국어 컨벤셔널 커밋 형식 준수
- 커밋 메시지 자동 생성 및 검증

**관련 파일**:

- `git-commit/SKILL.md`: 스킬 설명 및 사용법
- `git-commit/scripts/commit.py`: 커밋 실행 스크립트

### 2. git-pr

현재 브랜치를 push하고 GitHub Pull Request를 자동 생성합니다.

**사용 시기**:

- "PR 만들어줘"
- "pull request 생성해줘"
- main 브랜치로 머지하고 싶을 때

**주요 기능**:

- 자동 push 및 PR 생성
- 상세한 PR 본문 템플릿 활용
- 커밋 히스토리 분석 및 변경사항 요약
- GitHub CLI 통합

**관련 파일**:

- `git-pr/SKILL.md`: 스킬 설명 및 사용법
- `git-pr/scripts/create_pr.py`: PR 생성 스크립트
- `git-pr/templates/pr_template.md`: PR 본문 템플릿

## 전제조건

### Python 3.x

두 스킬 모두 Python 3.x가 필요합니다.

```bash
python3 --version
```

### GitHub CLI (git-pr 스킬용)

PR 생성을 위해 GitHub CLI가 필요합니다.

```bash
# 설치 확인
gh --version

# 인증
gh auth login

# 인증 상태 확인
gh auth status
```

## 사용 예시

### git-commit 스킬

```
사용자: "변경사항을 커밋해줘"

Claude:
1. git diff 분석
2. 변경사항을 3개 그룹으로 분류:
   - feat(api): TMDB 검색 API 엔드포인트 추가
   - feat(ui): 영화 검색 컴포넌트 구현
   - docs(readme): API 사용법 문서 추가
3. 각 그룹별로 커밋 실행
```

### git-pr 스킬

```
사용자: "main 브랜치에 PR 생성해줘"

Claude:
1. 커밋 히스토리 분석
2. PR 템플릿 읽기
3. 템플릿 채우기:
   - 제목: "영화 검색 기능 추가 및 상세 페이지 구현"
   - 커밋 목록: (자동 생성)
   - 주요 기능: TMDB API 통합, 검색 UI 등
   - 테스트 체크리스트
4. push 및 PR 생성
5. PR URL 출력
```

## 커밋 컨벤션

한국어 컨벤셔널 커밋 형식을 따릅니다:

```
<type>[optional scope]: <Korean description>
```

**타입**:

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경
- `refactor`: 코드 리팩토링
- `perf`: 성능 개선
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스 또는 보조 도구 변경

**예시**:

```
feat(search): TMDB API를 활용한 영화 검색 기능 추가
fix(auth): 로그인 시 토큰 만료 처리 로직 수정
docs(readme): 프로젝트 설치 가이드 및 사용법 추가
```

자세한 내용은 [`.cursor/rules/korean-conventional-commits.mdc`](../.cursor/rules/korean-conventional-commits.mdc)를 참조하세요.

## 스크립트 직접 사용

Claude 없이 스크립트를 직접 실행할 수도 있습니다.

### commit.py

```bash
python3 .claude/skills/git-commit/scripts/commit.py \
  --files "src/app.ts src/utils.ts" \
  --message "feat(app): 앱 초기화 로직 추가"
```

### create_pr.py

```bash
python3 .claude/skills/git-pr/scripts/create_pr.py \
  --base main \
  --title "영화 검색 기능 추가" \
  --body "TMDB API를 통합하여 영화 검색 기능을 구현했습니다."
```

## 문제 해결

### 스킬이 인식되지 않음

Claude Code를 재시작하거나 다음을 확인하세요:

- SKILL.md 파일이 올바른 위치에 있는지
- YAML 프론트매터 형식이 올바른지

### Python 스크립트 실행 권한 오류

```bash
chmod +x .claude/skills/git-commit/scripts/commit.py
chmod +x .claude/skills/git-pr/scripts/create_pr.py
```

### GitHub CLI 인증 오류

```bash
gh auth logout
gh auth login
```

## 참고 자료

- [Claude Agent Skills 문서](https://code.claude.com/docs/ko/skills)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI 문서](https://cli.github.com/manual/)
