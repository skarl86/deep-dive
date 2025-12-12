import type { Page } from "@playwright/test"

/**
 * 접근성 검증 헬퍼 함수들
 */

/**
 * 키보드 네비게이션 테스트
 */
export async function testKeyboardNavigation(page: Page): Promise<void> {
  // Tab 키로 포커스 이동
  await page.keyboard.press("Tab")

  // 현재 포커스된 요소 확인
  const focusedElement = await page.evaluate(() => {
    const el = document.activeElement
    return {
      tagName: el?.tagName,
      id: el?.id,
      className: el?.className,
    }
  })

  return focusedElement as any
}

/**
 * 포커스 가능한 요소들 확인
 */
export async function getFocusableElements(page: Page): Promise<number> {
  return page.evaluate(() => {
    const focusableSelectors = [
      'a[href]:not([disabled])',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ]

    const elements = document.querySelectorAll(focusableSelectors.join(","))
    return elements.length
  })
}

/**
 * 색상 대비 확인 (간단한 버전)
 */
export async function checkColorContrast(page: Page, selector: string): Promise<any> {
  return page.evaluate((sel) => {
    const element = document.querySelector(sel)
    if (!element) return null

    const styles = window.getComputedStyle(element)
    return {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontSize: styles.fontSize,
    }
  }, selector)
}

