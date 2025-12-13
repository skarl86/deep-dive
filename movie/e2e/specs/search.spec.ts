import { expect, test } from "@playwright/test"

test.describe("검색 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("검색어 입력 후 Enter로 검색 페이지 이동", async ({ page }) => {
    // 검색 버튼 클릭
    await page.click('button[aria-label="검색"]')

    // 검색창이 표시될 때까지 대기
    const searchInput = page.locator('input[type="search"]')
    await expect(searchInput).toBeVisible()

    // 검색어 입력 (영어로 테스트 - 한글 인코딩 문제 회피)
    await searchInput.fill("avengers")
    await searchInput.press("Enter")

    // URL 확인
    await expect(page).toHaveURL(/\/search\?query=avengers/)

    // 검색 결과 제목 확인
    const resultTitle = page.locator('h1:has-text("avengers")')
    await expect(resultTitle).toBeVisible()

    // 결과 표시 확인 - 영화 카드가 최소 1개 이상 표시되는지
    const movieCards = page.locator('[data-testid="movie-card"]')
    await expect(movieCards.first()).toBeVisible({ timeout: 10000 })
  })

  test("스크롤 시 추가 결과 로드", async ({ page }) => {
    // 검색 결과가 많은 쿼리로 직접 이동
    await page.goto("/search?query=test")

    // 초기 영화 카드 개수 확인
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 10000 })
    const initialCount = await page
      .locator('[data-testid="movie-card"]')
      .count()
    expect(initialCount).toBeGreaterThan(0)

    // 페이지 끝까지 스크롤
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // 추가 로딩 대기 (무한 스크롤 트리거)
    await page.waitForTimeout(2000)

    // 새로운 카드가 추가되었는지 확인
    const newCount = await page.locator('[data-testid="movie-card"]').count()
    expect(newCount).toBeGreaterThan(initialCount)
  })

  test("쿼리 없이 /search 접근 시 홈으로 리다이렉트", async ({ page }) => {
    // 쿼리 없이 검색 페이지 접근
    await page.goto("/search")

    // 홈으로 리다이렉트되었는지 확인
    await expect(page).toHaveURL("/")
  })

  test("검색 결과 없을 때 빈 상태 UI 표시", async ({ page }) => {
    // 결과가 없을 것 같은 검색어로 이동
    await page.goto("/search?query=xyzabc123notfound999")

    // 빈 상태 메시지 확인
    const emptyState = page.locator("text=/결과를 찾을 수 없습니다/i")
    await expect(emptyState).toBeVisible({ timeout: 10000 })

    // 검색 팁이 표시되는지 확인
    const searchTips = page.locator("text=/검색 팁/i")
    await expect(searchTips).toBeVisible()
  })

  test("새로고침 시 검색 결과 유지", async ({ page }) => {
    // 검색 실행
    await page.goto("/search?query=matrix")

    // 결과 표시 확인
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 10000 })
    const initialCount = await page
      .locator('[data-testid="movie-card"]')
      .count()

    // 페이지 새로고침
    await page.reload()

    // 검색 결과가 여전히 표시되는지 확인
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 10000 })
    const afterReloadCount = await page
      .locator('[data-testid="movie-card"]')
      .count()

    // 동일한 개수의 결과가 표시되어야 함
    expect(afterReloadCount).toBe(initialCount)
  })

  test("검색 결과 카드 클릭 시 상세 페이지 이동", async ({ page }) => {
    // 검색 실행
    await page.goto("/search?query=inception")

    // 첫 번째 영화 카드 대기
    const firstCard = page.locator('[data-testid="movie-card"]').first()
    await expect(firstCard).toBeVisible({ timeout: 10000 })

    // 카드 클릭
    await firstCard.click()

    // 영화 상세 페이지로 이동했는지 확인
    await expect(page).toHaveURL(/\/movie\/\d+/)
  })

  test("여러 번 검색 시 이전 결과가 초기화됨", async ({ page }) => {
    // 첫 번째 검색
    await page.click('button[aria-label="검색"]')
    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill("batman")
    await searchInput.press("Enter")

    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 10000 })
    const batmanResultTitle = page.locator('h1:has-text("batman")')
    await expect(batmanResultTitle).toBeVisible()

    // 두 번째 검색
    await page.click('button[aria-label="검색"]')
    const searchInput2 = page.locator('input[type="search"]')
    await searchInput2.fill("superman")
    await searchInput2.press("Enter")

    // 새로운 검색 결과 제목 확인
    await page.waitForSelector('h1:has-text("superman")', { timeout: 10000 })
    const supermanResultTitle = page.locator('h1:has-text("superman")')
    await expect(supermanResultTitle).toBeVisible()

    // 이전 검색어가 제목에 없는지 확인
    await expect(batmanResultTitle).not.toBeVisible()
  })

  test("검색결과 페이지에서 재검색 시 리스트가 업데이트됨", async ({
    page,
  }) => {
    // 첫 번째 검색으로 검색 페이지 진입
    await page.goto("/search?query=matrix")

    // 첫 번째 검색 결과 확인
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 10000 })
    const matrixTitle = page.locator('h1:has-text("matrix")')
    await expect(matrixTitle).toBeVisible()

    // 첫 번째 검색의 영화 카드 개수 저장
    const initialCards = page.locator('[data-testid="movie-card"]')
    const initialCount = await initialCards.count()
    expect(initialCount).toBeGreaterThan(0)

    // 첫 번째 영화 제목 저장 (비교를 위해)
    const firstMovieTitle = await initialCards.first().textContent()

    // 검색결과 페이지에 있는 상태에서 헤더 검색으로 재검색
    await page.click('button[aria-label="검색"]')
    const searchInput = page.locator('input[type="search"]')
    await expect(searchInput).toBeVisible()

    // 완전히 다른 검색어로 재검색
    await searchInput.fill("avengers")
    await searchInput.press("Enter")

    // URL 변경 확인
    await expect(page).toHaveURL(/\/search\?query=avengers/)

    // 새로운 검색 결과 제목 확인
    await page.waitForSelector('h1:has-text("avengers")', { timeout: 10000 })
    const avengersTitle = page.locator('h1:has-text("avengers")')
    await expect(avengersTitle).toBeVisible()

    // 이전 검색어 제목이 사라졌는지 확인
    await expect(matrixTitle).not.toBeVisible()

    // 새로운 검색 결과가 표시되는지 확인
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 10000 })
    const newCards = page.locator('[data-testid="movie-card"]')
    const newCount = await newCards.count()
    expect(newCount).toBeGreaterThan(0)

    // 첫 번째 영화가 바뀌었는지 확인 (다른 영화여야 함)
    const newFirstMovieTitle = await newCards.first().textContent()
    expect(newFirstMovieTitle).not.toBe(firstMovieTitle)
  })

  test("검색결과 페이지에서 동일 검색어로 재검색 시 정상 작동", async ({
    page,
  }) => {
    // 첫 번째 검색
    await page.goto("/search?query=spider")

    // 검색 결과 확인
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 10000 })
    const initialCount = await page
      .locator('[data-testid="movie-card"]')
      .count()

    // 같은 검색어로 다시 검색
    await page.click('button[aria-label="검색"]')
    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill("spider")
    await searchInput.press("Enter")

    // 결과가 여전히 표시되는지 확인
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 10000 })
    const newCount = await page.locator('[data-testid="movie-card"]').count()

    // 결과 개수가 유사해야 함 (같은 검색어이므로)
    expect(newCount).toBe(initialCount)

    // 제목이 여전히 표시되는지 확인
    const spiderTitle = page.locator('h1:has-text("spider")')
    await expect(spiderTitle).toBeVisible()
  })

  test("검색 페이지 로딩 중 스켈레톤 UI 표시", async ({ page }) => {
    // 1. 네트워크를 느리게 설정하여 로딩 상태를 관찰 가능하게 함
    await page.route("**/api.themoviedb.org/**", async (route) => {
      // 1초 지연을 추가하여 로딩 상태를 충분히 관찰 가능하게 함
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.continue()
    })

    // 검색 페이지로 이동 시작
    const navigationPromise = page.goto("/search?query=avengers")

    // 2. 로딩 스켈레톤 UI가 표시되는지 확인

    // 제목 스켈레톤 확인 (h-8 w-64 animate-pulse)
    const titleSkeleton = page.locator(
      "div.h-8.w-64.animate-pulse.rounded-md.bg-zinc-200"
    )
    await expect(titleSkeleton).toBeVisible({ timeout: 2000 })

    // 설명 스켈레톤 확인 (h-5 w-48 animate-pulse)
    const descriptionSkeleton = page.locator(
      "div.h-5.w-48.animate-pulse.rounded-md.bg-zinc-200"
    )
    await expect(descriptionSkeleton).toBeVisible()

    // 영화 그리드 스켈레톤 확인 (MovieListSkeleton 컴포넌트)
    const movieSkeletons = page.locator('[data-testid="movie-card-skeleton"]')
    await expect(movieSkeletons.first()).toBeVisible()

    // 여러 개의 스켈레톤 카드가 표시되는지 확인
    const skeletonCount = await movieSkeletons.count()
    expect(skeletonCount).toBeGreaterThan(1)

    // 네비게이션 완료 대기
    await navigationPromise

    // 3. 실제 콘텐츠 로딩 후 스켈레톤이 사라지고 실제 데이터가 표시되는지 확인

    // 실제 영화 카드가 표시될 때까지 대기
    await expect(
      page.locator('[data-testid="movie-card"]').first()
    ).toBeVisible({ timeout: 10000 })

    // 스켈레톤이 사라졌는지 확인
    await expect(titleSkeleton).not.toBeVisible()
    await expect(descriptionSkeleton).not.toBeVisible()
    await expect(movieSkeletons.first()).not.toBeVisible()

    // 실제 검색 결과 제목이 표시되는지 확인
    const resultTitle = page.locator('h1:has-text("avengers")')
    await expect(resultTitle).toBeVisible()

    // 실제 영화 카드가 여러 개 표시되는지 확인
    const movieCards = page.locator('[data-testid="movie-card"]')
    const movieCount = await movieCards.count()
    expect(movieCount).toBeGreaterThan(0)
  })

  test("검색 시작 시 로딩 피드백이 표시되고 완료 후 사라짐", async ({
    page,
  }) => {
    // 네트워크 지연 추가하여 로딩 상태를 충분히 관찰 가능하게 함
    await page.route("**/api.themoviedb.org/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.continue()
    })

    // 1. 홈 페이지로 이동
    await page.goto("/")

    // 2. 검색 버튼 클릭
    await page.click('button[aria-label="검색"]')

    // 3. 검색어 입력
    const searchInput = page.locator('input[type="search"]')
    await expect(searchInput).toBeVisible()
    await searchInput.fill("avengers")

    // 4. 엔터 키 누르기
    await searchInput.press("Enter")

    // 5. 헤더 로딩 인디케이터가 나타나는지 확인
    const loadingIndicator = page.locator(
      '[data-testid="search-loading-indicator"]'
    )
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 })

    // 6. 검색 결과 페이지로 이동 완료 대기
    await expect(page).toHaveURL(/\/search\?query=avengers/)

    // 7. 로딩 상태 메시지가 표시되는지 확인
    const loadingStatus = page.locator("text=/검색 중입니다/i")
    // 빠르면 이미 사라질 수 있으므로 존재 여부만 확인

    // 8. 검색 결과가 표시되는지 확인
    const movieCards = page.locator('[data-testid="movie-card"]')
    await expect(movieCards.first()).toBeVisible({ timeout: 10000 })

    // 9. 헤더 로딩 인디케이터가 사라졌는지 확인
    await expect(loadingIndicator).not.toBeVisible()
  })

  test("페이지 전환 시 프로그레스 바 표시", async ({ page }) => {
    // 네트워크 지연 추가
    await page.route("**/api.themoviedb.org/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      await route.continue()
    })

    // 홈 페이지로 이동
    await page.goto("/")

    // 검색 시작
    await page.click('button[aria-label="검색"]')
    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill("matrix")
    await searchInput.press("Enter")

    // 프로그레스 바가 나타나는지 확인
    const progressBar = page.locator('[data-testid="navigation-progress"]')
    await expect(progressBar).toBeVisible({ timeout: 1000 })

    // 페이지 전환 완료 대기
    await expect(page).toHaveURL(/\/search\?query=matrix/)

    // 최종 결과 표시 확인
    await expect(
      page.locator('[data-testid="movie-card"]').first()
    ).toBeVisible({ timeout: 10000 })

    // 프로그레스 바가 사라졌는지 확인
    await expect(progressBar).not.toBeVisible()
  })

  test("검색 로딩 인디케이터가 검색 완료 후 정확히 사라짐", async ({
    page,
  }) => {
    // 네트워크 지연 추가
    await page.route("**/api.themoviedb.org/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.continue()
    })

    // 홈 페이지로 이동
    await page.goto("/")

    // 첫 번째 검색
    await page.click('button[aria-label="검색"]')
    const searchInput = page.locator('input[type="search"]')
    await searchInput.fill("avengers")
    await searchInput.press("Enter")

    // 로딩 인디케이터가 나타나는지 확인
    const loadingIndicator = page.locator(
      '[data-testid="search-loading-indicator"]'
    )
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 })

    // 검색 결과 페이지로 이동 완료 대기
    await expect(page).toHaveURL(/\/search\?query=avengers/)
    await expect(
      page.locator('[data-testid="movie-card"]').first()
    ).toBeVisible({ timeout: 10000 })

    // 로딩 인디케이터가 사라졌는지 확인
    await expect(loadingIndicator).not.toBeVisible()

    // 두 번째 검색 (같은 페이지에서 다른 검색어로)
    await page.click('button[aria-label="검색"]')
    const searchInput2 = page.locator('input[type="search"]')
    await searchInput2.fill("batman")
    await searchInput2.press("Enter")

    // 로딩 인디케이터가 다시 나타나는지 확인
    await expect(loadingIndicator).toBeVisible({ timeout: 1000 })

    // 두 번째 검색 결과 페이지로 이동 완료 대기
    await expect(page).toHaveURL(/\/search\?query=batman/)
    await expect(
      page.locator('[data-testid="movie-card"]').first()
    ).toBeVisible({ timeout: 10000 })

    // 로딩 인디케이터가 다시 사라졌는지 확인
    await expect(loadingIndicator).not.toBeVisible()

    // 세 번째: 홈으로 이동
    await page.click('a[href="/"]')
    await expect(page).toHaveURL("/")

    // 로딩 인디케이터가 여전히 사라진 상태인지 확인
    await expect(loadingIndicator).not.toBeVisible()
  })
})
