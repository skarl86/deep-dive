import type { Page } from "@playwright/test"

/**
 * 페이지 성능 측정 헬퍼
 */
export interface PerformanceMetrics {
  loadTime: number
  domContentLoaded: number
  firstPaint: number | undefined
}

export async function measurePagePerformance(page: Page): Promise<PerformanceMetrics> {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
    const paintEntries = performance.getEntriesByType("paint")

    return {
      loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
      domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
      firstPaint: paintEntries[0] ? Math.round(paintEntries[0].startTime) : undefined,
    }
  })

  return metrics
}

/**
 * Core Web Vitals 측정
 */
export interface CoreWebVitals {
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
}

export async function measureCoreWebVitals(page: Page): Promise<CoreWebVitals> {
  return page.evaluate(() => {
    return new Promise<CoreWebVitals>((resolve) => {
      const vitals: CoreWebVitals = {}

      // LCP 측정
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry
        vitals.lcp = Math.round(lastEntry.startTime)
      }).observe({ type: "largest-contentful-paint", buffered: true })

      // CLS 측정
      let clsValue = 0
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        vitals.cls = Math.round(clsValue * 1000) / 1000
      }).observe({ type: "layout-shift", buffered: true })

      // 1초 후 결과 반환
      setTimeout(() => resolve(vitals), 1000)
    })
  })
}

