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
  const lambdaUrl = (import.meta as any).env?.VITE_LAMBDA_URL || '';
  
  if (!lambdaUrl) {
    throw new Error('Lambda URL이 설정되지 않았습니다. VITE_LAMBDA_URL 환경변수를 확인하세요.');
  }

  // Lambda Function URL에 직접 요청 (CORS 처리됨)
  const response = await axios.post(lambdaUrl, {
    fileName,
    fileType,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
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
  const lambdaUrl = (import.meta as any).env?.VITE_LAMBDA_URL || '';
  
  if (!lambdaUrl) {
    throw new Error('Lambda URL이 설정되지 않았습니다. VITE_LAMBDA_URL 환경변수를 확인하세요.');
  }

  // Lambda 함수에 DELETE 요청 (query parameter로 key 전달)
  const url = new URL(lambdaUrl);
  url.searchParams.append('key', fileKey);

  const response = await axios.delete(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error(`파일 삭제 실패: ${response.statusText}`);
  }
}

/**
 * S3 파일 URL 생성 (조회용)
 * @param fileKey - S3에 저장된 파일의 키 (경로)
 * @returns S3 파일의 공개 URL
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

