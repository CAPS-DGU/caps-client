import axios from "axios";
import { getBlogPresignedDownloadUrl, getPresignedDownloadUrl } from "../api/generated/capsApi";

/**
 * 블로그의 thumbnailUrl / imageUrls / fileUrls 에는 S3 key 가 그대로 저장된다.
 * (caps-server 는 요청값을 가공 없이 저장·반환하고, 교체/삭제 시 같은 값을 S3 key 로 넘긴다)
 * 따라서 화면에 보여줄 때는 presigned URL 로 바꿔줘야 한다.
 */
export function isAbsoluteUrl(value?: string | null): boolean {
  return !!value && /^https?:\/\//i.test(value);
}

function pickDownloadUrl(response: unknown, fallback: string): string {
  const data = (response as any)?.data;
  if (typeof data === "string") return data;
  return data?.downloadURL ?? data?.downloadUrl ?? data?.url ?? fallback;
}

/**
 * 저장된 key 를 실제로 열 수 있는 URL 로 바꾼다.
 *
 * 공개 엔드포인트(GET /api/v1/files/blog/presigned-url)는 비로그인도 호출할 수 있지만
 * 서버가 blog_file(첨부파일) 키만 허용한다. 본문 이미지와 썸네일은 각각 blog_image /
 * blog_post 에 있어 403 이 나므로, 그때만 로그인 회원용 범용 엔드포인트로 다시 시도한다.
 * (즉 현재는 비로그인 사용자에게 이미지·썸네일이 보이지 않는다 — 서버 수정 필요)
 */
export async function resolveBlogFileUrl(value: string): Promise<string> {
  if (isAbsoluteUrl(value)) return value;

  try {
    return pickDownloadUrl(await getBlogPresignedDownloadUrl({ key: value }), value);
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 403) throw error;
    return pickDownloadUrl(await getPresignedDownloadUrl({ key: value }), value);
  }
}

/** key 에서 사람이 읽을 파일명만 뽑는다. 업로드 시 붙는 `{timestamp}_{index}_` 접두사는 제거. */
export function blogFileName(value: string): string {
  const last = value.split("?")[0].split("/").pop() ?? value;
  return last.replace(/^\d+_\d+_/, "");
}
