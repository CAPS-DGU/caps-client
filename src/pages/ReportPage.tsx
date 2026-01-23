import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreateReportRequest,
  CreateReportRequestCategory,
  useCreateReport,
  useGetPresignedUrl,
  PresignedUrlRequest,
} from "../api/generated/capsApi";

// 카테고리 한글 매핑
const categoryLabels: Record<CreateReportRequestCategory, string> = {
  INFO_ERROR: "정보 오류",
  ACCOUNT_MANAGEMENT: "계정 관리",
  SUGGESTION: "건의사항",
  USER_REPORT_AND_SECURITY_REPORT: "사용자 신고 및 보안 신고",
  ETC: "기타",
};

const categoryOptions = Object.values(CreateReportRequestCategory);

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CreateReportRequestCategory | "">(
    ""
  );
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    mutateAsync: submitReport,
    isPending,
    isSuccess,
  } = useCreateReport();
  
  const {
    mutateAsync: getPresignedUrl,
  } = useGetPresignedUrl();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File): Promise<string> => {
    // presigned URL 요청
    const presignedRequest: PresignedUrlRequest = {
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
    };

    const presignedResponse = await getPresignedUrl({
      data: presignedRequest as any,
    });

    // presigned URL 추출
    // 실제 응답 예:
    // { status: 200, message: "...", data: { fileName: string, uploadURL: string } }
    let uploadURL: string = "";

    try {
      // orvalClient가 이미 response.data를 반환하므로, 실제 응답 구조 확인 필요
      const responseData = presignedResponse as any;
      
      if (typeof responseData === "string") {
        uploadURL = responseData;
      } else if (responseData?.uploadURL) {
        uploadURL = responseData.uploadURL;
      } else if (responseData?.data?.uploadURL) {
        uploadURL = responseData.data.uploadURL;
      } else if (responseData?.data?.presignedUrl) {
        // 혹시 서버가 다른 키로 내려주는 경우 대비
        uploadURL = responseData.data.presignedUrl;
      }

      if (!uploadURL) {
        console.error("Presigned URL 응답 구조:", responseData);
        throw new Error("Presigned URL을 받지 못했습니다. 응답 구조를 확인해주세요.");
      }

      // 파일을 presigned URL로 업로드
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`파일 업로드 실패: ${uploadResponse.statusText}`);
      }

      // 신고 API에는 쿼리스트링 없는 "파일 URL"을 넣어주는 게 일반적
      // (uploadURL은 presigned query가 포함되어 있으므로 제거)
      return uploadURL.split("?")[0];
    } catch (error) {
      console.error("파일 업로드 중 오류:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !content.trim()) {
      alert("카테고리와 내용을 모두 입력해주세요.");
      return;
    }

    try {
      // 파일 업로드
      let fileUrls: string[] = [];
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
            const uploadedUrl = await uploadFile(file);
            fileUrls.push(uploadedUrl);
          } catch (error) {
            console.error(`파일 ${file.name} 업로드 실패:`, error);
            alert(`파일 ${file.name} 업로드에 실패했습니다.`);
            return;
          }
        }
      }

      const payload: CreateReportRequest = {
        category,
        content: content.trim(),
        fileUrls: fileUrls.length > 0 ? fileUrls : undefined,
      };

      // Blob 대신 객체를 직접 전달 (orvalClient에서 JSON.stringify 처리)
      await submitReport({ data: payload as any });
      alert("문의/신고가 정상적으로 접수되었습니다.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("문의/신고 접수 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CAPS 문의 · 신고
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            사이트 이용 중 불편한 점이나 수정이 필요한 정보를 알려주세요.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            카테고리
          </label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as CreateReportRequestCategory | "")
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">카테고리를 선택하세요</option>
            {categoryOptions.map((value) => (
              <option key={value} value={value}>
                {categoryLabels[value]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-40 resize-none"
            placeholder="상세한 내용을 적어주세요."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            첨부 파일 (선택)
          </label>
          <div className="space-y-2">
            <input
              type="file"
              id="file-input"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-input"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              파일 선택
            </label>
            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <span className="text-sm text-gray-700 truncate flex-1">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => navigate(-1)}
            disabled={isPending}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={`px-4 py-2 rounded-md text-sm font-semibold text-white ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isPending ? "전송 중..." : "제출하기"}
          </button>
        </div>

        {isSuccess && (
          <p className="text-xs text-green-600">
            이미 접수된 문의/신고입니다. 추가로 전달할 내용이 있다면 다시
            작성해주세요.
          </p>
        )}
      </form>
    </div>
  );
};

export default ReportPage;


