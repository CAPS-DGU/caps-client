import { getBlogPresignedDownloadUrl } from "../api/generated/capsApi";

/**
 * 블로그의 thumbnailUrl / imageUrls / fileUrls 에는 S3 key 가 그대로 저장된다.
 * (caps-server 는 요청값을 가공 없이 저장·반환하고, 교체/삭제 시 같은 값을 S3 key 로 넘긴다)
 * 따라서 화면에 보여줄 때는 presigned URL 로 바꿔줘야 한다.
 *
 * 단, http(s) 외에 blob:/data: 도 이미 브라우저가 직접 열 수 있는 값이므로 S3 key 로
 * 오인해 presign 요청을 보내면 안 된다. (아직 제출 전, 로컬 미리보기 중인 본문 이미지가 blob: 을 씀)
 */
export function isAbsoluteUrl(value?: string | null): boolean {
  return !!value && /^(https?:|blob:|data:)/i.test(value);
}

function pickDownloadUrl(response: unknown, fallback: string): string {
  const data = (response as any)?.data;
  if (typeof data === "string") return data;
  return data?.downloadURL ?? data?.downloadUrl ?? data?.url ?? fallback;
}

// presign 요청 전에 한 번 디코딩해 S3 key 원문으로 되돌린다.
function toStoredFileKey(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// 저장된 key 를 실제로 열 수 있는 URL 로 바꾼다.
export async function resolveBlogFileUrl(value: string): Promise<string> {
  if (isAbsoluteUrl(value)) return value;

  const key = toStoredFileKey(value);
  return pickDownloadUrl(await getBlogPresignedDownloadUrl({ key }), key);
}

/** key 에서 사람이 읽을 파일명만 뽑는다. 업로드 시 붙는 `{timestamp}_{index}_` 접두사는 제거. */
export function blogFileName(value: string): string {
  const last = value.split("?")[0].split("/").pop() ?? value;
  return last.replace(/^\d+_\d+_/, "");
}
