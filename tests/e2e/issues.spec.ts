import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/members/me")) {
      await route.fulfill({
        json: {
          data: {
            id: 1,
            name: "테스트",
            grade: "40",
            role: "MEMBER",
            registrationComplete: true,
          },
        },
      });
    } else if (path.includes("/wikis/")) {
      await route.fulfill({
        json: {
          data: {
            title: "CAPS",
            content: "== 소개 ==\n||CAPS|| 문서입니다. {{각주 설명}}",
          },
        },
      });
    } else {
      await route.fulfill({ json: { data: [] } });
    }
  });
});

test("introduction includes latest-first history and preserves the old history URL", async ({
  page,
}, testInfo) => {
  await page.goto("/aboutus");
  await expect(page.getByRole("heading", { name: "CAPS 소개" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "블로그", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#history .text-2xl").nth(1)).toHaveText("2026");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  await page.screenshot({ path: testInfo.outputPath("introduction.png") });
  await page.goto("/caps-history");
  await expect(page).toHaveURL(/\/aboutus#history$/);
  await expect(
    page.getByRole("heading", { name: "연혁", exact: true }),
  ).toBeInViewport();
});

test("wiki preview layout and footnotes work with real mouse and touch events", async ({
  page,
  isMobile,
}, testInfo) => {
  await page.goto("/wiki/edit/CAPS");
  const editor = page.getByRole("textbox", { name: "위키 내용" });
  await expect(editor).toBeVisible();
  await editor.fill("== 제목 ==\n||수정한 문서|| {{각주 설명}}");
  const preview = page.getByRole("region", { name: "미리보기" });
  await expect(preview.getByText("수정한 문서", { exact: true })).toBeVisible();
  const editorBox = await editor.boundingBox();
  const previewBox = await preview.boundingBox();
  if (isMobile)
    expect(previewBox!.y).toBeGreaterThan(editorBox!.y + editorBox!.height);
  else expect(previewBox!.x).toBeGreaterThan(editorBox!.x + editorBox!.width);
  const footnote = preview
    .getByRole("link", { name: "[1]", exact: true })
    .first();
  if (isMobile) {
    await footnote.tap();
    await expect(page.getByRole("tooltip")).toHaveText("각주 설명");
    expect(new URL(page.url()).hash).toBe("");
    await footnote.tap();
    await expect(page).toHaveURL(/#preview-comment-1$/);
  } else {
    await footnote.hover();
    await expect(page.getByRole("tooltip")).toHaveText("각주 설명");
    await footnote.click();
    await expect(page).toHaveURL(/#preview-comment-1$/);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({
    path: testInfo.outputPath("wiki-preview.png"),
    fullPage: true,
  });
});
