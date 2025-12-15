export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:ring-2 focus:ring-zinc-950 focus:outline-none dark:focus:bg-zinc-50 dark:focus:text-zinc-900 dark:focus:ring-zinc-300"
    >
      본문으로 건너뛰기
    </a>
  )
}
