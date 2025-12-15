#!/usr/bin/env python3
"""
Git Pull Request Creation Script

이 스크립트는 현재 브랜치를 push하고 GitHub CLI를 사용하여 Pull Request를 생성합니다.

사용법:
    python create_pr.py --base main --title "기능 추가" --body-file /tmp/pr_body.md
"""

import argparse
import subprocess
import sys
from pathlib import Path
from typing import Optional


def run_command(command: list[str], description: str, capture_output: bool = True) -> tuple[bool, str]:
    """
    쉘 명령어를 실행하고 결과를 반환합니다.
    
    Args:
        command: 실행할 명령어 리스트
        description: 명령어 설명 (로깅용)
        capture_output: 출력을 캡처할지 여부
    
    Returns:
        (성공 여부, 출력 메시지) 튜플
    """
    try:
        print(f"🔄 {description}...")
        result = subprocess.run(
            command,
            capture_output=capture_output,
            text=True,
            check=True
        )
        output = result.stdout.strip() if capture_output else ""
        if result.stderr:
            output += f"\n{result.stderr.strip()}"
        print(f"✅ {description} 완료")
        if output and capture_output:
            print(f"   {output}")
        return True, output
    except subprocess.CalledProcessError as e:
        error_msg = ""
        if capture_output:
            error_msg = e.stderr.strip() or e.stdout.strip()
        print(f"❌ {description} 실패: {error_msg}", file=sys.stderr)
        return False, error_msg
    except Exception as e:
        print(f"❌ 예상치 못한 오류: {str(e)}", file=sys.stderr)
        return False, str(e)


def get_current_branch() -> Optional[str]:
    """
    현재 Git 브랜치 이름을 반환합니다.
    
    Returns:
        브랜치 이름 또는 None (실패 시)
    """
    success, output = run_command(
        ['git', 'branch', '--show-current'],
        "현재 브랜치 확인"
    )
    return output if success else None


def check_gh_auth() -> bool:
    """
    GitHub CLI 인증 상태를 확인합니다.
    
    Returns:
        인증되어 있으면 True, 아니면 False
    """
    success, _ = run_command(
        ['gh', 'auth', 'status'],
        "GitHub CLI 인증 상태 확인"
    )
    return success


def git_push(branch: str, force: bool = False) -> bool:
    """
    현재 브랜치를 원격 저장소에 push합니다.
    
    Args:
        branch: push할 브랜치 이름
        force: force push 여부
    
    Returns:
        성공 여부
    """
    command = ['git', 'push', 'origin', branch]
    if force:
        command.append('--force-with-lease')
    
    # 브랜치가 원격에 없을 수 있으므로 upstream 설정
    command.extend(['--set-upstream', 'origin', branch])
    
    success, _ = run_command(
        command,
        f"브랜치 '{branch}' push"
    )
    return success


def create_pr(base: str, title: str, body: str, draft: bool = False) -> tuple[bool, str]:
    """
    GitHub CLI를 사용하여 Pull Request를 생성합니다.
    
    Args:
        base: 대상 브랜치 (예: main, develop)
        title: PR 제목
        body: PR 본문
        draft: 드래프트 PR로 생성할지 여부
    
    Returns:
        (성공 여부, PR URL) 튜플
    """
    command = [
        'gh', 'pr', 'create',
        '--base', base,
        '--title', title,
        '--body', body
    ]
    
    if draft:
        command.append('--draft')
    
    success, output = run_command(
        command,
        "Pull Request 생성",
        capture_output=True
    )
    
    # gh pr create는 PR URL을 출력함
    pr_url = output.strip() if success else ""
    return success, pr_url


def read_body_file(body_file: str) -> Optional[str]:
    """
    PR 본문 파일을 읽습니다.
    
    Args:
        body_file: PR 본문이 저장된 파일 경로
    
    Returns:
        파일 내용 또는 None (실패 시)
    """
    try:
        path = Path(body_file)
        if not path.exists():
            print(f"❌ 파일을 찾을 수 없습니다: {body_file}", file=sys.stderr)
            return None
        
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
        
        if not content:
            print(f"⚠️  경고: PR 본문 파일이 비어있습니다.", file=sys.stderr)
        
        return content
    except Exception as e:
        print(f"❌ 파일 읽기 실패: {str(e)}", file=sys.stderr)
        return None


def validate_inputs(title: str, body: str) -> bool:
    """
    입력값들을 검증합니다.
    
    Args:
        title: PR 제목
        body: PR 본문
    
    Returns:
        유효하면 True, 아니면 False
    """
    if not title or not title.strip():
        print("❌ PR 제목이 비어있습니다.", file=sys.stderr)
        return False
    
    if len(title) > 200:
        print(f"⚠️  경고: PR 제목이 너무 깁니다 ({len(title)}자). 200자 이내를 권장합니다.", file=sys.stderr)
    
    # 한글이 포함되어 있는지 확인
    has_korean = any('\uac00' <= char <= '\ud7a3' for char in title)
    if not has_korean:
        print(f"⚠️  경고: PR 제목이 한국어로 작성되지 않았습니다.", file=sys.stderr)
    
    if not body or not body.strip():
        print("⚠️  경고: PR 본문이 비어있습니다.", file=sys.stderr)
        # 본문이 비어있어도 계속 진행 (경고만)
    
    return True


def check_uncommitted_changes() -> bool:
    """
    커밋되지 않은 변경사항이 있는지 확인합니다.
    
    Returns:
        변경사항이 있으면 True
    """
    result = subprocess.run(
        ['git', 'status', '--porcelain'],
        capture_output=True,
        text=True
    )
    return bool(result.stdout.strip())


def main():
    parser = argparse.ArgumentParser(
        description='현재 Git 브랜치를 push하고 GitHub Pull Request를 생성합니다.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
예시:
  # 파일에서 본문 읽기
  python create_pr.py --base main --title "영화 검색 기능 추가" --body-file /tmp/pr_body.md
  
  # 직접 본문 입력
  python create_pr.py --base develop --title "버그 수정" --body "로그인 버그를 수정했습니다."
  
  # 드래프트 PR 생성
  python create_pr.py --base main --title "WIP: 새 기능" --body-file pr.md --draft
        """
    )
    
    parser.add_argument(
        '--base',
        type=str,
        default='main',
        help='대상 브랜치 (기본값: main)'
    )
    
    parser.add_argument(
        '--title',
        type=str,
        required=True,
        help='PR 제목 (한국어 권장)'
    )
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        '--body-file',
        type=str,
        help='PR 본문이 저장된 파일 경로'
    )
    group.add_argument(
        '--body',
        type=str,
        help='PR 본문 (직접 입력)'
    )
    
    parser.add_argument(
        '--draft',
        action='store_true',
        help='드래프트 PR로 생성'
    )
    
    parser.add_argument(
        '--force-push',
        action='store_true',
        help='Force push 사용 (--force-with-lease)'
    )
    
    parser.add_argument(
        '--skip-push',
        action='store_true',
        help='Push를 건너뛰고 PR만 생성'
    )
    
    args = parser.parse_args()
    
    print("\n📝 GitHub Pull Request 생성 시작\n")
    
    # 1. 현재 브랜치 확인
    current_branch = get_current_branch()
    if not current_branch:
        print("❌ 현재 브랜치를 확인할 수 없습니다.")
        sys.exit(1)
    
    print(f"   현재 브랜치: {current_branch}")
    print(f"   대상 브랜치: {args.base}")
    print(f"   PR 제목: {args.title}\n")
    
    # base 브랜치와 같은지 확인
    if current_branch == args.base:
        print(f"❌ 현재 브랜치가 대상 브랜치({args.base})와 같습니다.")
        print(f"   다른 브랜치에서 작업해주세요.")
        sys.exit(1)
    
    # 2. 커밋되지 않은 변경사항 확인
    if check_uncommitted_changes():
        print("⚠️  경고: 커밋되지 않은 변경사항이 있습니다.")
        print("   모든 변경사항을 커밋한 후 PR을 생성하는 것을 권장합니다.\n")
    
    # 3. GitHub CLI 인증 확인
    if not check_gh_auth():
        print("\n❌ GitHub CLI 인증이 필요합니다.")
        print("   다음 명령어로 인증하세요: gh auth login")
        sys.exit(1)
    
    # 4. PR 본문 읽기
    if args.body_file:
        body = read_body_file(args.body_file)
        if body is None:
            sys.exit(1)
    else:
        body = args.body
    
    # 5. 입력값 검증
    if not validate_inputs(args.title, body):
        sys.exit(1)
    
    # 6. Git push
    if not args.skip_push:
        if not git_push(current_branch, force=args.force_push):
            print("\n❌ Push 실패")
            sys.exit(1)
    else:
        print("⏭️  Push 건너뛰기")
    
    # 7. PR 생성
    print()
    success, pr_url = create_pr(args.base, args.title, body, draft=args.draft)
    
    if not success:
        print("\n❌ Pull Request 생성 실패")
        print("\n다음을 확인해주세요:")
        print("  1. GitHub CLI가 올바르게 인증되었는지 (gh auth status)")
        print("  2. 원격 저장소가 설정되었는지 (git remote -v)")
        print("  3. 동일한 브랜치로 이미 PR이 열려있지 않은지 (gh pr list)")
        sys.exit(1)
    
    # 8. 성공!
    print(f"\n✨ Pull Request가 성공적으로 생성되었습니다!")
    print(f"\n📎 PR URL: {pr_url}")
    print(f"\n다음 단계:")
    print(f"  1. PR을 확인하고 필요한 경우 수정하세요")
    print(f"  2. 적절한 리뷰어를 지정하세요")
    print(f"  3. 라벨과 마일스톤을 추가하세요 (선택)\n")
    
    sys.exit(0)


if __name__ == '__main__':
    main()

