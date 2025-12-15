#!/usr/bin/env python3
"""
Git Commit Script

이 스크립트는 지정된 파일들을 스테이징하고 한국어 컨벤셔널 커밋 메시지로 커밋합니다.

사용법:
    python commit.py --files "file1.ts file2.ts" --message "feat(api): API 엔드포인트 추가"
"""

import argparse
import subprocess
import sys
from typing import List


def run_command(command: List[str], description: str) -> tuple[bool, str]:
    """
    쉘 명령어를 실행하고 결과를 반환합니다.
    
    Args:
        command: 실행할 명령어 리스트
        description: 명령어 설명 (로깅용)
    
    Returns:
        (성공 여부, 출력 메시지) 튜플
    """
    try:
        print(f"🔄 {description}...")
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )
        output = result.stdout.strip() or result.stderr.strip()
        print(f"✅ {description} 완료")
        if output:
            print(f"   {output}")
        return True, output
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.strip() or e.stdout.strip()
        print(f"❌ {description} 실패: {error_msg}", file=sys.stderr)
        return False, error_msg
    except Exception as e:
        print(f"❌ 예상치 못한 오류: {str(e)}", file=sys.stderr)
        return False, str(e)


def validate_commit_message(message: str) -> bool:
    """
    커밋 메시지가 한국어 컨벤셔널 커밋 형식인지 검증합니다.
    
    형식: <type>[optional scope]: <Korean description>
    
    Args:
        message: 검증할 커밋 메시지
    
    Returns:
        유효한 형식이면 True, 아니면 False
    """
    valid_types = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore']
    
    # 기본 형식 검증: type(scope): 또는 type:
    if ':' not in message:
        print(f"⚠️  경고: 커밋 메시지에 ':' 가 없습니다.", file=sys.stderr)
        return False
    
    # type 추출
    type_part = message.split(':')[0].split('(')[0].strip()
    
    if type_part not in valid_types:
        print(f"⚠️  경고: '{type_part}'는 유효한 커밋 타입이 아닙니다.", file=sys.stderr)
        print(f"   유효한 타입: {', '.join(valid_types)}", file=sys.stderr)
        return False
    
    # 설명 부분 검증
    description = message.split(':', 1)[1].strip()
    if not description:
        print(f"⚠️  경고: 커밋 메시지 설명이 비어있습니다.", file=sys.stderr)
        return False
    
    # 한글이 포함되어 있는지 확인
    has_korean = any('\uac00' <= char <= '\ud7a3' for char in description)
    if not has_korean:
        print(f"⚠️  경고: 커밋 메시지 설명이 한국어로 작성되지 않았습니다.", file=sys.stderr)
        return False
    
    return True


def git_add_files(files: List[str]) -> bool:
    """
    파일들을 Git 스테이징 영역에 추가합니다.
    
    Args:
        files: 추가할 파일 경로 리스트
    
    Returns:
        성공 여부
    """
    success, _ = run_command(
        ['git', 'add'] + files,
        f"{len(files)}개 파일 스테이징"
    )
    return success


def git_commit(message: str) -> bool:
    """
    스테이징된 변경사항을 커밋합니다.
    
    Args:
        message: 커밋 메시지
    
    Returns:
        성공 여부
    """
    success, output = run_command(
        ['git', 'commit', '-m', message],
        "변경사항 커밋"
    )
    
    if success:
        # 커밋 해시 추출 및 출력
        commit_hash = subprocess.run(
            ['git', 'rev-parse', '--short', 'HEAD'],
            capture_output=True,
            text=True
        ).stdout.strip()
        print(f"\n✨ 커밋 완료! (해시: {commit_hash})")
        print(f"   메시지: {message}")
    
    return success


def main():
    parser = argparse.ArgumentParser(
        description='Git 파일을 스테이징하고 한국어 컨벤셔널 커밋을 수행합니다.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
예시:
  python commit.py --files "src/app.ts" --message "feat(app): 앱 초기화 로직 추가"
  python commit.py --files "src/a.ts src/b.ts" --message "fix(api): API 호출 오류 수정"
        """
    )
    
    parser.add_argument(
        '--files',
        type=str,
        required=True,
        help='커밋할 파일 경로 (공백으로 구분)'
    )
    
    parser.add_argument(
        '--message',
        type=str,
        required=True,
        help='커밋 메시지 (한국어 컨벤셔널 커밋 형식)'
    )
    
    parser.add_argument(
        '--skip-validation',
        action='store_true',
        help='커밋 메시지 검증 건너뛰기'
    )
    
    args = parser.parse_args()
    
    # 파일 리스트 파싱
    files = args.files.split()
    
    print(f"\n📝 Git 커밋 시작")
    print(f"   파일: {', '.join(files)}")
    print(f"   메시지: {args.message}\n")
    
    # 커밋 메시지 검증
    if not args.skip_validation:
        if not validate_commit_message(args.message):
            print("\n⚠️  커밋 메시지가 한국어 컨벤셔널 커밋 형식을 따르지 않습니다.")
            print("   계속하시려면 --skip-validation 옵션을 사용하세요.")
            sys.exit(1)
    
    # 파일 스테이징
    if not git_add_files(files):
        print("\n❌ 파일 스테이징 실패")
        sys.exit(1)
    
    # 커밋 실행
    if not git_commit(args.message):
        print("\n❌ 커밋 실패")
        sys.exit(1)
    
    print("\n🎉 모든 작업이 성공적으로 완료되었습니다!\n")
    sys.exit(0)


if __name__ == '__main__':
    main()

