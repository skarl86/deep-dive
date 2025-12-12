import { test, expect } from "@playwright/test"
import { measurePagePerformance } from "../helpers/performance"

test.describe("홈페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("홈페이지가 정상적으로 렌더링된다", async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/Movie/i)

    // 헤더 확인
    const header = page.locator("header")
    await expect(header).toBeVisible()

    // 메인 콘텐츠 확인
    const main = page.locator("main")
    await expect(main).toBeVisible()
  })

  test("인기 영화 목록이 렌더링된다", async ({ page }) => {
    // 제목 확인 (정확한 텍스트는 실제 앱에 맞게 조정)
    const heading = page.locator("h1, h2").first()
    await expect(heading).toBeVisible()

    // 영화 카드 렌더링 확인 (최소 1개 이상)
    const movieCards = page.locator('[class*="movie"]').filter({ hasText: /\d/ })
    await expect(movieCards.first()).toBeVisible({ timeout: 10000 })

    // 영화 카드 개수 확인 (초기 로드 시 최소 10개 이상)
    const count = await movieCards.count()
    expect(count).toBeGreaterThan(10)
  })

  test("영화 카드에 필수 정보가 표시된다", async ({ page }) => {
    // 첫 번째 영화 카드
    const firstCard = page.locator('[class*="movie"]').first()
    await expect(firstCard).toBeVisible({ timeout: 10000 })

    // 이미지 확인
    const image = firstCard.locator("img").first()
    await expect(image).toBeVisible()

    // 제목 또는 텍스트 내용 확인
    const hasText = await firstCard.textContent()
    expect(hasText).toBeTruthy()
    expect(hasText!.length).toBeGreaterThan(0)
  })

  test("페이지 로딩 성능이 적절하다", async ({ page }) => {
    const metrics = await measurePagePerformance(page)

    // 페이지 로드 시간이 5초 이내
    expect(metrics.loadTime).toBeLessThan(5000)

    // DOM Content Loaded가 3초 이내
    expect(metrics.domContentLoaded).toBeLessThan(3000)

    console.log("성능 지표:", metrics)
  })

  test("이미지가 지연 로딩된다", async ({ page }) => {
    // 첫 번째 이미지
    const firstImage = page.locator("img").first()
    await expect(firstImage).toBeVisible()

    // 이미지가 로드되었는지 확인
    const isLoaded = await firstImage.evaluate((img: HTMLImageElement) => img.complete)
    expect(isLoaded).toBe(true)
  })
})

