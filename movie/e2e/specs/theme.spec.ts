import { test, expect } from "@playwright/test"

test.describe("다크모드 테마", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("테마 토글 버튼이 존재한다", async ({ page }) => {
    // 테마 토글 버튼 찾기 (아이콘 또는 버튼)
    // 실제 앱의 선택자에 맞게 조정 필요
    const themeButton = page
      .locator("button")
      .filter({ has: page.locator('svg, [class*="theme"], [class*="dark"], [class*="light"]') })
      .first()

    await expect(themeButton).toBeVisible()
  })

  test("테마 전환이 작동한다", async ({ page }) => {
    // 초기 테마 확인
    const htmlElement = page.locator("html")
    const initialClass = await htmlElement.getAttribute("class")

    console.log("초기 테마 클래스:", initialClass)

    // 테마 버튼 찾기
    const themeButton = page
      .locator("button")
      .filter({ has: page.locator('svg, [class*="theme"], [class*="dark"], [class*="light"]') })
      .first()

    // 테마 토글 클릭
    await themeButton.click()
    await page.waitForTimeout(500) // 전환 애니메이션 대기

    // 변경된 테마 확인
    const newClass = await htmlElement.getAttribute("class")
    console.log("변경된 테마 클래스:", newClass)

    // 테마가 변경되었는지 확인
    expect(newClass).not.toBe(initialClass)
  })

  test("다크모드에서 라이트모드로 전환된다", async ({ page }) => {
    const htmlElement = page.locator("html")

    // 다크모드인지 확인
    let htmlClass = await htmlElement.getAttribute("class")

    // 다크모드가 아니면 토글
    if (!htmlClass?.includes("dark")) {
      const themeButton = page
        .locator("button")
        .filter({ has: page.locator('svg, [class*="theme"], [class*="dark"], [class*="light"]') })
        .first()
      await themeButton.click()
      await page.waitForTimeout(500)
    }

    // 다시 확인
    htmlClass = await htmlElement.getAttribute("class")
    expect(htmlClass).toContain("dark")

    // 라이트모드로 전환
    const themeButton = page
      .locator("button")
      .filter({ has: page.locator('svg, [class*="theme"], [class*="dark"], [class*="light"]') })
      .first()
    await themeButton.click()
    await page.waitForTimeout(500)

    // 라이트모드 확인
    htmlClass = await htmlElement.getAttribute("class")
    expect(htmlClass).not.toContain("dark")
  })

  test("테마 설정이 유지된다", async ({ page, context }) => {
    const htmlElement = page.locator("html")

    // 테마 토글
    const themeButton = page
      .locator("button")
      .filter({ has: page.locator('svg, [class*="theme"], [class*="dark"], [class*="light"]') })
      .first()
    await themeButton.click()
    await page.waitForTimeout(500)

    const themeAfterToggle = await htmlElement.getAttribute("class")

    // 새 페이지 열기
    const newPage = await context.newPage()
    await newPage.goto("/")
    await newPage.waitForTimeout(500)

    // 테마가 유지되는지 확인
    const newHtmlElement = newPage.locator("html")
    const newTheme = await newHtmlElement.getAttribute("class")

    expect(newTheme).toBe(themeAfterToggle)

    await newPage.close()
  })

  test("다크모드에서 시각적 차이가 있다", async ({ page }) => {
    const htmlElement = page.locator("html")

    // 라이트모드 배경색
    const lightBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    // 다크모드로 전환
    const themeButton = page
      .locator("button")
      .filter({ has: page.locator('svg, [class*="theme"], [class*="dark"], [class*="light"]') })
      .first()
    await themeButton.click()
    await page.waitForTimeout(500)

    // 다크모드 배경색
    const darkBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    console.log("라이트모드 배경:", lightBg)
    console.log("다크모드 배경:", darkBg)

    // 배경색이 달라야 함
    expect(lightBg).not.toBe(darkBg)
  })
})

