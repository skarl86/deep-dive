import type { MovieDetail } from "@/schemas"
import { TMDB_IMAGE_BASE_URL } from "@/actions/tmdb/utils/config"

interface MovieSchemaProps {
  movie: MovieDetail
}

export function MovieSchema({ movie }: MovieSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : undefined,
    datePublished: movie.release_date,
    genre: movie.genres.map((g) => g.name),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: movie.vote_average,
      ratingCount: movie.vote_count,
      bestRating: 10,
      worstRating: 0,
    },
    duration: `PT${movie.runtime}M`,
    ...(movie.tagline && { slogan: movie.tagline }),
    productionCompany: movie.production_companies.map((company) => ({
      "@type": "Organization",
      name: company.name,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
