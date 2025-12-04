/**
 * Bearer Token 헤더 생성
 */
export function createAuthHeaders(): Record<string, string> | undefined {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN

  if (!token) {
    return undefined
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

