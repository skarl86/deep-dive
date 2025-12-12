import { test as base } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * 접근성 검증을 위한 커스텀 픽스처
 * axe-core를 통합하여 WCAG 2.1 AA 준수 확인
 */
export const test = base.extend<{
  makeAxeBuilder: () => AxeBuilder
}>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    await use(makeAxeBuilder)
  },
})

export { expect } from "@playwright/test"

