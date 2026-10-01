import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const names = ['한글 사진.png', '행사 영상.mp4', '정산 자료.xlsx'];
for (const section of ['blog', 'ledger']) {
  test(`${section}: image, video and spreadsheet attachments download with original filenames`, async ({ page, context }) => {
    await page.goto(`/${section}/1`);
    for (const name of names) {
      const presign = page.waitForRequest(request => request.url().includes('/presigned-url?') && new URL(request.url()).searchParams.get('download') === 'true');
      const pending = page.waitForEvent('download');
      await page.getByRole('button', { name, exact: true }).click();
      const request = await presign;
      expect(new URL(request.url()).pathname).toBe(section === 'blog' ? '/api/v1/files/blog/presigned-url' : '/api/v1/files/presigned-url');
      expect(new URL(request.url()).searchParams.get('key')).toContain(name);
      const download = await pending;
      expect(download.suggestedFilename()).toBe(name);
      expect(await download.failure()).toBeNull();
      const bytes = await readFile((await download.path())!);
      if (name.endsWith('.png')) expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      else expect(bytes.toString()).toBe('attachment-test-bytes');
      await expect.poll(() => context.pages().length).toBe(1);
      await expect(page).toHaveURL(`/${section}/1`);
    }
  });
}

test('blog thumbnail and body images remain inline', async ({ page }) => {
  const presigns: URL[] = [];
  page.on('request', request => {
    if (request.url().includes('/files/blog/presigned-url?')) presigns.push(new URL(request.url()));
  });
  await page.goto('/blog');
  await expect.poll(async () => page.locator('img[src*="/objects?"]').evaluateAll(images => images.filter(image => (image as HTMLImageElement).naturalWidth > 0).length)).toBeGreaterThanOrEqual(1);
  await page.goto('/blog/1');
  await expect.poll(async () => page.locator('img[src*="/objects?"]').evaluateAll(images => images.filter(image => (image as HTMLImageElement).naturalWidth > 0).length)).toBeGreaterThanOrEqual(1);
  for (const key of ['blog/images/thumbnail.png', 'blog/images/body.png']) {
    const request = presigns.find(url => url.searchParams.get('key') === key);
    expect(request).toBeDefined();
    expect(request!.searchParams.has('download')).toBe(false);
  }
});

test('failed URL issuance shows an error and allows retry', async ({ page }) => {
  await page.goto('/blog/1');
  await page.route('**/files/blog/presigned-url?**', async route => {
    if (new URL(route.request().url()).searchParams.has('download')) await route.fulfill({ status: 500, json: {} });
    else await route.continue();
  });
  const dialog = page.waitForEvent('dialog');
  const button = page.getByRole('button', { name: names[0], exact: true });
  await button.click();
  const error = await dialog;
  expect(error.message()).toBe('파일 다운로드에 실패했습니다.');
  await error.accept();
  await expect(button).toBeEnabled();
  await page.unroute('**/files/blog/presigned-url?**');
  const pending = page.waitForEvent('download');
  await button.click();
  expect((await pending).suggestedFilename()).toBe(names[0]);
});
