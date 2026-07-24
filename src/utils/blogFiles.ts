import { getBlogPresignedDownloadUrl } from "../api/generated/capsApi";

/**
 * 블로그의 thumbnailUrl / imageUrls / fileUrls 에 무엇이 저장되는지가 레포 안에서 갈린다.
 * - 장부(ledger): S3 key 를 저장하고, 볼 때 presigned download URL 을 받아온다.
 * - 신고(report): 완전한 URL 을 저장한다.
 * 블로그는 전용 presign 엔드포인트(/api/v1/files/blog/presigned-url?key=)가 있으므로 key 저장을 전제하되,
 * 완전한 URL 이 내려오는 경우에도 깨지지 않도록 두 경우를 모두 처리한다.
 */
export function isAbsoluteUrl(value?: string | null): boolean {
  return !!value && /^https?:\/\//i.test(value);
}

/** 저장된 값(key 또는 URL)을 실제로 열 수 있는 URL 로 변환한다. */
export async function resolveBlogFileUrl(value: string): Promise<string> {
  if (isAbsoluteUrl(value)) return value;

  const response = (await getBlogPresignedDownloadUrl({ key: value })) as any;
  const data = response?.data;

  if (typeof data === "string") return data;
  return data?.downloadURL ?? data?.downloadUrl ?? data?.url ?? value;
}

/** key/URL 에서 사람이 읽을 파일명만 뽑는다. 업로드 시 붙는 `{timestamp}_{index}_` 접두사는 제거. */
export function blogFileName(value: string): string {
  const last = value.split("?")[0].split("/").pop() ?? value;
  return last.replace(/^\d+_\d+_/, "");
}
