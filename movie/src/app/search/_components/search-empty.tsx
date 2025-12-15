import { Search } from "lucide-react"

interface SearchEmptyProps {
  /**
   * 검색한 쿼리
   */
  query: string
}

/**
 * 검색 결과가 없을 때 표시되는 빈 상태 UI
 */
export function SearchEmpty({ query }: SearchEmptyProps) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <Search
          className="h-10 w-10 text-zinc-400 dark:text-zinc-600"
          aria-hidden="true"
        />
      </div>

      <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        결과를 찾을 수 없습니다
      </h2>

      <p className="mb-6 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        <span className="font-medium">&quot;{query}&quot;</span>에 대한 검색
        결과가 없습니다.
        <br />
        다른 검색어로 다시 시도해보세요.
      </p>

      <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          💡 검색 팁:
        </p>
        <ul className="mt-2 space-y-1 text-left text-sm text-zinc-600 dark:text-zinc-400">
          <li>• 영화 제목의 철자를 확인해보세요</li>
          <li>• 더 간단한 검색어를 사용해보세요</li>
          <li>• 영어 제목으로 검색해보세요</li>
        </ul>
      </div>
    </div>
  )
}

