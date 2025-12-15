export function OrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Movie App",
    url: baseUrl,
    description: "최신 인기 영화를 확인하고 검색할 수 있는 영화 정보 플랫폼",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
