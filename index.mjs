import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 1. 프론트엔드 코드(getS3FileURL)에 명시된 버킷명과 리전 사용
const BUCKET_NAME = process.env.BUCKET_NAME || "dgucaps-bucket";
const REGION = "ap-northeast-2";

const s3Client = new S3Client({ region: REGION });

export const handler = async (event) => {
  // CORS 헤더 설정
  const headers = {
    "Access-Control-Allow-Origin": "https://dgucaps.kr",
    "Access-Control-Allow-Methods": "OPTIONS, POST, DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // HTTP 메서드 감지
  const method = event.requestContext?.http?.method || event.httpMethod;

  try {
    // === [OPTIONS] Preflight 요청 처리 ===
    // axios가 본 요청 전에 보내는 예비 요청입니다.
    if (method === "OPTIONS") {
      return { statusCode: 200, headers, body: "" };
    }

    // === [POST] 업로드용 Presigned URL 발급 ===
    // 매핑 함수: getPresignedUploadURL(fileName, fileType)
    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const { fileName, fileType } = body;

      // 유효성 검사
      if (!fileName) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "fileName is required" }) };
      }

      // S3 명령 생성
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        ContentType: fileType || "image/jpeg",
        // ACL: "public-read" // 필요 시 주석 해제 (버킷 ACL 활성화 필요)
      });

      // 5분(300초) 유효 URL 생성
      const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 300 });

      // 프론트엔드가 기대하는 응답 형식: { uploadURL, fileName }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ uploadURL, fileName })
      };
    }

    // === [DELETE] 파일 삭제 ===
    // 매핑 함수: deleteFileFromS3(fileKey) -> query param 'key' 사용
    if (method === "DELETE") {
      const queryString = event.queryStringParameters || {};
      const key = queryString.key;

      if (!key) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Key parameter is required" }) };
      }

      // URL 디코딩 (한글 파일명 등 특수문자 처리)
      const decodedKey = decodeURIComponent(key);

      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: decodedKey
      });

      await s3Client.send(command);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "File deleted successfully", deletedKey: decodedKey })
      };
    }

    // 지원하지 않는 메서드
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };

  } catch (error) {
    console.error("Internal Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};