import { test, expect } from "@playwright/test"

test.describe("시각적 회귀 테스트", () => {
  test("모바일 뷰포트 스크린샷", async ({ page }) => {
    // 모바일 뷰포트 설정 (375×667)
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")

    // 페이지 로딩 대기
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })
    await page.waitForTimeout(1000) // 레이아웃 안정화

    // 전체 페이지 스크린샷 (첫 실행 시 베이스라인 생성)
    await expect(page).toHaveScreenshot("home-mobile.png", {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test("데스크톱 뷰포트 스크린샷", async ({ page }) => {
    // 데스크톱 뷰포트 설정 (1920×1080)
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto("/")

    // 페이지 로딩 대기
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })
    await page.waitForTimeout(1000)

    // 전체 페이지 스크린샷
    await expect(page).toHaveScreenshot("home-desktop.png", {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test("태블릿 뷰포트 스크린샷", async ({ page }) => {
    // 태블릿 뷰포트 설정 (768×1024)
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/")

    // 페이지 로딩 대기
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })
    await page.waitForTimeout(1000)

    // 전체 페이지 스크린샷
    await expect(page).toHaveScreenshot("home-tablet.png", {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test("다크모드 스크린샷", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto("/")

    // 페이지 로딩 대기
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })

    // 다크모드로 전환
    const themeButton = page
      .locator("button")
      .filter({ has: page.locator('svg, [class*="theme"], [class*="dark"], [class*="light"]') })
      .first()
    await themeButton.click()
    await page.waitForTimeout(1000)

    // 다크모드 스크린샷
    await expect(page).toHaveScreenshot("home-dark-mode.png", {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test("스크롤 후 스크린샷", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto("/")

    // 페이지 로딩 대기
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })

    // 중간까지 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2)
    })
    await page.waitForTimeout(1000)

    // 스크린샷
    await expect(page).toHaveScreenshot("home-scrolled.png", {
      fullPage: false, // 현재 뷰포트만
      maxDiffPixels: 100,
    })
  })
})

test.describe("반응형 레이아웃", () => {
  test("모바일에서 레이아웃이 깨지지 않는다", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")

    // 페이지 로딩 대기
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })

    // 가로 스크롤 확인
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })

    // 가로 스크롤이 없어야 함
    expect(hasHorizontalScroll).toBe(false)
  })

  test("태블릿에서 레이아웃이 적절히 조정된다", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/")

    // 페이지 로딩 대기
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })

    // 영화 카드 그리드 확인
    const firstCard = page.locator('[class*="movie"]').first()
    await expect(firstCard).toBeVisible()

    // 너비가 적절한지 확인
    const cardWidth = await firstCard.evaluate((el) => el.getBoundingClientRect().width)
    expect(cardWidth).toBeGreaterThan(100)
    expect(cardWidth).toBeLessThan(400)
  })

  test("데스크톱에서 최대 폭이 적절히 제한된다", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto("/")

    // 페이지 로딩 대기
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })

    // 컨테이너 너비 확인
    const containerWidth = await page.evaluate(() => {
      const main = document.querySelector("main")
      return main ? main.getBoundingClientRect().width : 0
    })

    console.log(`컨테이너 너비: ${containerWidth}px`)

    // 너비가 뷰포트보다 작거나 같아야 함
    expect(containerWidth).toBeLessThanOrEqual(1920)
  })

  test("뷰포트 변경 시 레이아웃이 반응한다", async ({ page }) => {
    await page.goto("/")

    // 모바일로 시작
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForSelector('[class*="movie"]', { timeout: 10000 })
    await page.waitForTimeout(500)

    // 데스크톱으로 변경
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForTimeout(500)

    // 레이아웃이 여전히 정상인지 확인
    const cards = page.locator('[class*="movie"]')
    await expect(cards.first()).toBeVisible()

    const count = await cards.count()
    expect(count).toBeGreaterThan(10)
  })

  test("이미지가 반응형으로 조정된다", async ({ page }) => {
    await page.goto("/")
    await page.waitForSelector("img", { timeout: 10000 })

    // 모바일
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)

    const mobileImgWidth = await page.locator("img").first().evaluate((img) => {
      return img.getBoundingClientRect().width
    })

    // 데스크톱
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForTimeout(500)

    const desktopImgWidth = await page.locator("img").first().evaluate((img) => {
      return img.getBoundingClientRect().width
    })

    console.log(`이미지 너비 - 모바일: ${mobileImgWidth}px, 데스크톱: ${desktopImgWidth}px`)

    // 데스크톱에서 이미지가 더 크거나 같아야 함
    expect(desktopImgWidth).toBeGreaterThanOrEqual(mobileImgWidth)
  })
})

