import type { Page, Locator } from "@playwright/test"

/**
 * 시각적 회귀 테스트 헬퍼 함수들
 */

export interface ScreenshotOptions {
  fullPage?: boolean
  maxDiffPixels?: number
  threshold?: number
}

/**
 * 반응형 스크린샷 촬영
 */
export async function takeResponsiveScreenshots(
  page: Page,
  name: string,
  viewports: Array<{ width: number; height: number; name: string }>
): Promise<void> {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.waitForTimeout(500) // 레이아웃 안정화 대기
    // 스크린샷은 테스트에서 expect().toHaveScreenshot()으로 수행
  }
}

/**
 * 특정 요소의 스크린샷 촬영
 */
export async function captureElementScreenshot(
  locator: Locator,
  name: string,
  options?: ScreenshotOptions
): Promise<void> {
  // 테스트에서 expect(locator).toHaveScreenshot()으로 수행
}

/**
 * 스크롤 후 스크린샷
 */
export async function captureAfterScroll(page: Page, scrollAmount: number): Promise<void> {
  await page.evaluate((amount) => window.scrollBy(0, amount), scrollAmount)
  await page.waitForTimeout(500) // 스크롤 안정화 대기
}

