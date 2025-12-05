import { MovieList } from "@/components/movie-list"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Movie App
          </h1>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main>
          <MovieList />
        </main>
      </div>
    </div>
  )
}
