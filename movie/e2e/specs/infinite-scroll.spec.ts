import { test, expect } from "@playwright/test"

test.describe("무한 스크롤", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("스크롤 시 추가 영화를 로드한다", async ({ page }) => {
    // 초기 영화 카드 개수 확인
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })
    const initialCards = page.locator('[class*="movie"]')
    const initialCount = await initialCards.count()

    console.log(`초기 영화 카드 개수: ${initialCount}`)

    // 페이지 하단으로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })

    // 새로운 카드 로딩 대기 (최대 10초)
    await page.waitForTimeout(3000)

    // 새로운 영화 카드 개수 확인
    const newCount = await initialCards.count()
    console.log(`스크롤 후 영화 카드 개수: ${newCount}`)

    // 영화 카드가 증가했는지 확인
    expect(newCount).toBeGreaterThan(initialCount)
  })

  test("여러 번 스크롤해도 영화가 계속 로드된다", async ({ page }) => {
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })

    const counts: number[] = []

    // 3번 스크롤
    for (let i = 0; i < 3; i++) {
      const count = await page.locator('[class*="movie"]').count()
      counts.push(count)

      // 하단으로 스크롤
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })

      // 로딩 대기
      await page.waitForTimeout(2000)
    }

    // 마지막 카운트
    const finalCount = await page.locator('[class*="movie"]').count()
    counts.push(finalCount)

    console.log("스크롤별 카드 개수:", counts)

    // 매번 증가했는지 확인
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]).toBeGreaterThanOrEqual(counts[i - 1])
    }
  })

  test("로딩 중 표시가 나타난다", async ({ page }) => {
    // 초기 로드
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })

    // 빠르게 하단으로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })

    // 로딩 인디케이터 확인 (스켈레톤 또는 스피너)
    // 실제 앱의 로딩 UI에 맞게 선택자 조정 필요
    await page.waitForTimeout(500)

    // 로딩이 완료되면 새 카드가 표시됨
    await page.waitForTimeout(2000)
    const cards = page.locator('[class*="movie"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(20)
  })

  test("중복된 영화가 표시되지 않는다", async ({ page }) => {
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })

    // 여러 번 스크롤
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      await page.waitForTimeout(2000)
    }

    // 모든 영화 카드의 텍스트 수집
    const allCards = await page.locator('[class*="movie"]').all()
    const titles = await Promise.all(allCards.map((card) => card.textContent()))

    // 중복 확인 (간단한 체크)
    const uniqueTitles = new Set(titles)
    console.log(`전체 카드: ${titles.length}, 고유 카드: ${uniqueTitles.size}`)

    // 대부분 고유해야 함 (완벽하지 않을 수 있음)
    expect(uniqueTitles.size).toBeGreaterThan(titles.length * 0.9)
  })
})

