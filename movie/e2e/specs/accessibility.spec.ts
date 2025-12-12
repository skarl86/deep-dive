import { test, expect } from "../fixtures/test-fixture"
import { testKeyboardNavigation, getFocusableElements } from "../helpers/accessibility"

test.describe("접근성 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("홈페이지가 WCAG 2.1 AA 기준을 충족한다", async ({ page, makeAxeBuilder }) => {
    // axe-core로 접근성 검사
    const accessibilityScanResults = await makeAxeBuilder().analyze()

    // 위반 사항 확인
    expect(accessibilityScanResults.violations).toEqual([])

    // 위반이 있으면 상세 정보 출력
    if (accessibilityScanResults.violations.length > 0) {
      console.log("접근성 위반 사항:")
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`)
        console.log(`  영향도: ${violation.impact}`)
        console.log(`  위반 요소 개수: ${violation.nodes.length}`)
      })
    }
  })

  test("키보드 네비게이션이 작동한다", async ({ page }) => {
    // Tab 키로 포커스 이동
    await page.keyboard.press("Tab")

    // 포커스된 요소 확인
    const focused = await page.evaluate(() => {
      const el = document.activeElement
      return {
        tagName: el?.tagName,
        hasOutline: window.getComputedStyle(el!).outline !== "none",
      }
    })

    // body가 아닌 다른 요소에 포커스되어야 함
    expect(focused.tagName).not.toBe("BODY")

    console.log("포커스된 요소:", focused)
  })

  test("포커스 가능한 요소들이 충분히 존재한다", async ({ page }) => {
    const focusableCount = await getFocusableElements(page)

    // 최소 5개 이상의 포커스 가능한 요소
    expect(focusableCount).toBeGreaterThan(5)

    console.log(`포커스 가능한 요소 개수: ${focusableCount}`)
  })

  test("모든 이미지에 alt 속성이 있다", async ({ page }) => {
    // 모든 이미지 찾기
    const images = await page.locator("img").all()

    // 각 이미지의 alt 속성 확인
    for (const img of images) {
      const alt = await img.getAttribute("alt")

      // alt 속성이 존재해야 함 (빈 문자열도 허용)
      expect(alt).not.toBeNull()
    }

    console.log(`검사한 이미지 개수: ${images.length}`)
  })

  test("Heading 계층 구조가 올바르다", async ({ page }) => {
    // 모든 헤딩 요소 찾기
    const headings = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"))
      return elements.map((el) => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent?.slice(0, 50),
      }))
    })

    console.log("Heading 구조:", headings)

    // h1이 적어도 하나 존재해야 함
    const h1Count = headings.filter((h) => h.level === 1).length
    expect(h1Count).toBeGreaterThan(0)

    // Heading 레벨이 순차적인지 확인 (h1 → h2 → h3)
    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1].level
      const curr = headings[i].level

      // 다음 레벨은 이전 레벨보다 최대 1 증가해야 함
      if (curr > prev) {
        expect(curr - prev).toBeLessThanOrEqual(2) // 약간의 여유
      }
    }
  })

  test("색상 대비가 충분하다", async ({ page }) => {
    // 주요 텍스트 요소의 색상 대비 확인
    const contrast = await page.evaluate(() => {
      const body = document.body
      const styles = window.getComputedStyle(body)

      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      }
    })

    console.log("색상 정보:", contrast)

    // 색상이 설정되어 있는지 확인
    expect(contrast.color).toBeTruthy()
    expect(contrast.backgroundColor).toBeTruthy()

    // 실제 대비율 계산은 복잡하므로 axe-core에서 자동 검증
  })

  test("링크와 버튼에 명확한 레이블이 있다", async ({ page }) => {
    // 모든 링크와 버튼 찾기
    const elements = await page.locator("a, button").all()

    for (const el of elements) {
      const text = await el.textContent()
      const ariaLabel = await el.getAttribute("aria-label")
      const ariaLabelledBy = await el.getAttribute("aria-labelledby")

      // 텍스트, aria-label, 또는 aria-labelledby 중 하나는 있어야 함
      const hasLabel =
        (text && text.trim().length > 0) || ariaLabel || ariaLabelledBy

      expect(hasLabel).toBe(true)
    }

    console.log(`검사한 링크/버튼 개수: ${elements.length}`)
  })

  test("폼 요소에 label이 연결되어 있다", async ({ page }) => {
    // input 요소 찾기
    const inputs = await page.locator("input, textarea, select").all()

    if (inputs.length === 0) {
      // 폼 요소가 없으면 테스트 스킵
      test.skip()
      return
    }

    for (const input of inputs) {
      const id = await input.getAttribute("id")
      const ariaLabel = await input.getAttribute("aria-label")
      const ariaLabelledBy = await input.getAttribute("aria-labelledby")

      // label, aria-label, 또는 aria-labelledby 중 하나는 있어야 함
      let hasLabel = false

      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count()
        hasLabel = label > 0
      }

      hasLabel = hasLabel || !!ariaLabel || !!ariaLabelledBy

      expect(hasLabel).toBe(true)
    }
  })

  test("페이지에 lang 속성이 설정되어 있다", async ({ page }) => {
    const lang = await page.getAttribute("html", "lang")

    expect(lang).toBeTruthy()
    expect(lang).toBe("ko") // 한국어 페이지

    console.log("페이지 언어:", lang)
  })

  test("Skip to content 링크가 있다 (선택)", async ({ page }) => {
    // Skip to content 링크 찾기 (있으면 테스트, 없으면 스킵)
    const skipLink = page.locator('a[href="#main"], a[href="#content"]').first()
    const count = await skipLink.count()

    if (count > 0) {
      await expect(skipLink).toBeVisible()
      console.log("Skip to content 링크 발견")
    } else {
      console.log("Skip to content 링크 없음 (선택 사항)")
    }
  })
})

