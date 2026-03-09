import axios from 'axios';

/**
 * S3 파일 업로드를 위한 Presigned URL 요청
 * @param fileName - 업로드할 파일명 (경로 포함 가능)
 * @param fileType - 파일 MIME 타입 (예: 'image/jpeg', 'application/pdf')
 * @returns { uploadURL: string, fileName: string }
 */
export async function getPresignedUploadURL(
  fileName: string,
  fileType: string = 'image/jpeg'
): Promise<{ uploadURL: string; fileName: string }> {
  const apiHost = (import.meta as any).env.VITE_API_HOST as string;
  
  if (!apiHost) {
    throw new Error('API 호스트가 설정되지 않았습니다. VITE_API_HOST 환경변수를 확인하세요.');
  }

  // Spring Boot API에 요청 (인증 토큰 포함)
  const response = await axios.post(
    `${apiHost}/api/v1/files/presigned-url`,
    {
      fileName,
      fileType,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // 쿠키(인증 토큰) 포함
    }
  );

  return response.data.data; // SuccessResponse 래핑 제거
}

/**
 * Presigned URL을 사용하여 S3에 파일 업로드
 * @param file - 업로드할 File 객체
 * @param fileName - S3에 저장할 파일명 (경로 포함 가능, 예: 'board/123/image.jpg')
 * @param fileType - 파일 MIME 타입
 * @returns 업로드된 파일의 S3 경로 (fileName)
 */
export async function uploadFileToS3(
  file: File,
  fileName?: string,
  fileType?: string
): Promise<string> {
  // fileName이 제공되지 않으면 파일명 기반으로 생성
  const finalFileName = fileName || `uploads/${Date.now()}_${file.name}`;
  const finalFileType = fileType || file.type || 'application/octet-stream';

  // 1. Lambda에 Presigned URL 요청
  const { uploadURL } = await getPresignedUploadURL(finalFileName, finalFileType);

  // 2. Presigned URL로 파일 업로드
  const uploadResponse = await fetch(uploadURL, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': finalFileType,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`S3 업로드 실패: ${uploadResponse.statusText}`);
  }

  return finalFileName;
}

/**
 * S3에서 파일 삭제
 * @param fileKey - 삭제할 파일의 S3 키 (경로)
 */
export async function deleteFileFromS3(fileKey: string): Promise<void> {
  const apiHost = (import.meta as any).env.VITE_API_HOST as string;
  
  if (!apiHost) {
    throw new Error('API 호스트가 설정되지 않았습니다. VITE_API_HOST 환경변수를 확인하세요.');
  }

  // Spring Boot API에 DELETE 요청 (query parameter로 key 전달)
  const url = new URL(`${apiHost}/api/v1/files`);
  url.searchParams.append('key', fileKey);

  const response = await axios.delete(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // 쿠키(인증 토큰) 포함
  });

  if (response.status !== 200 && response.status !== 204) {
    throw new Error(`파일 삭제 실패: ${response.statusText}`);
  }
}

/**
 * S3 파일 다운로드용 Presigned URL 요청
 * @param fileKey - S3에 저장된 파일의 키 (경로)
 * @returns Presigned URL
 */
export async function getPresignedDownloadURL(fileKey: string): Promise<string> {
  const apiHost = (import.meta as any).env.VITE_API_HOST as string;
  
  if (!apiHost) {
    throw new Error('API 호스트가 설정되지 않았습니다. VITE_API_HOST 환경변수를 확인하세요.');
  }

  // Spring Boot API에 요청 (인증 토큰 포함)
  const url = new URL(`${apiHost}/api/v1/files/presigned-url`);
  url.searchParams.append('key', fileKey);

  const response = await axios.get(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // 쿠키(인증 토큰) 포함
  });

  return response.data.data.downloadURL; // SuccessResponse 래핑 제거
}

/**
 * S3 파일 URL 생성 (조회용) - Deprecated: Presigned URL 사용 권장
 * @param fileKey - S3에 저장된 파일의 키 (경로)
 * @returns S3 파일의 공개 URL (퍼블릭 액세스 차단 시 사용 불가)
 * @deprecated getPresignedDownloadURL 사용 권장
 */
export function getS3FileURL(fileKey: string): string {
  const bucketName = 'www.dgucaps.kr';
  const region = 'ap-northeast-2';
  
  // S3 공개 URL 형식: https://{bucket}.s3.{region}.amazonaws.com/{key}
  return `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
}

/**
 * 여러 파일을 한 번에 업로드
 * @param files - 업로드할 File 객체 배열
 * @param basePath - 파일 경로의 기본 경로 (예: 'board/123')
 * @returns 업로드된 파일들의 S3 경로 배열
 */
export async function uploadMultipleFilesToS3(
  files: File[],
  basePath?: string
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const fileName = basePath
      ? `${basePath}/${Date.now()}_${index}_${file.name}`
      : undefined;
    return uploadFileToS3(file, fileName);
  });

  return Promise.all(uploadPromises);
}

