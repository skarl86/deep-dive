import type { MovieListItem } from "@/schemas"
import { TMDB_IMAGE_BASE_URL } from "@/actions/tmdb/utils/config"

interface SearchResultsSchemaProps {
  query: string
  movies: MovieListItem[]
  totalResults: number
}

export function SearchResultsSchema({
  query,
  movies,
  totalResults,
}: SearchResultsSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  const schema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `"${query}" 검색 결과`,
    description: `"${query}"에 대한 영화 검색 결과 ${totalResults}건`,
    url: `${baseUrl}/search?query=${encodeURIComponent(query)}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalResults,
      itemListElement: movies.slice(0, 10).map((movie, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Movie",
          name: movie.title,
          url: `${baseUrl}/movie/${movie.id}`,
          image: movie.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
            : undefined,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: movie.vote_average,
            ratingCount: movie.vote_count,
          },
        },
      })),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
