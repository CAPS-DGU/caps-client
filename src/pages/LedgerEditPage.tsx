import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Paperclip } from "lucide-react";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import AttachmentList from "../components/common/AttachmentList";
import {
  LedgerTitleInput,
  LedgerTopActions,
  LedgerBottomActions,
  LedgerContentSection,
  LedgerFileItem,
} from "../components/Ledger/LedgerComponents";
import {
  apiGetWithToken,
  apiPatchWithToken,
  apiPostWithToken,
} from "../utils/Api";
import { useAuth } from "../hooks/useAuth";
import { useConfirmLeaveOnUnload } from "../hooks/useConfirmLeaveOnUnload";
import {
  uploadFileToS3,
  uploadMultipleFilesToS3,
  deleteFileFromS3,
} from "../utils/s3Upload";
import { confirmLeave } from "../utils/confirmLeave";

interface LedgerEditResponse {
  status: number;
  message: string;
  data: {
    id: number;
    title: string;
    content: string;
    fileUrls: string[] | null;
    isPinned: boolean;
  };
}

const LedgerEditPage: React.FC = () => {
  const { ledgerId } = useParams<{ ledgerId?: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth();

  useConfirmLeaveOnUnload();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [files, setFiles] = useState<LedgerFileItem[]>([]);
  const [existingFileUrls, setExistingFileUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  // 회원이 아니면 접근 차단
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/");
    }
  }, [isLoading, isLoggedIn, navigate]);

  // 편집 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    const fetchLedger = async () => {
      if (!ledgerId) return;
      try {
        const res = await apiGetWithToken(
          `/api/v1/ledgers/${ledgerId}`,
          navigate
        );
        const body = res.data as LedgerEditResponse;
        setTitle(body.data.title);
        setContent(body.data.content);
        setIsPinned(body.data.isPinned);
        setExistingFileUrls(body.data.fileUrls || []); // 기존 파일 URL 저장 (삭제용)
      } catch (error) {
        console.error("장부 조회(수정용) 실패:", error);
      }
    };

    fetchLedger();
  }, [ledgerId, navigate]);

  const handleFilesChange = (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;

    setFiles((prev) => [
      ...prev,
      ...selectedFiles.map((file, index) => ({
        id: Date.now() + index,
        file,
      })),
    ]);
  };

  const handleRemoveFile = (id: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // 기존 파일 삭제 (수정 모드에서 파일을 제거할 때)
  const handleRemoveExistingFile = async (fileUrl: string) => {
    try {
      // S3에서 파일 삭제
      await deleteFileFromS3(fileUrl);
      setExistingFileUrls((prev) => prev.filter((url) => url !== fileUrl));
    } catch (error) {
      console.error("파일 삭제 실패:", error);
      alert("파일 삭제에 실패했습니다.");
    }
  };

  const handleListClick = () => {
    if (confirmLeave()) {
      navigate("/ledger");
    }
  };

  const handleCancelClick = () => {
    if (confirmLeave()) {
      navigate(-1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }

    try {
      setUploading(true);
      let finalFileUrls: string[] = [];

      // 새로 선택한 파일들을 S3에 업로드
      if (files.length > 0) {
        try {
          const fileObjects = files.map((item) => item.file);
          const basePath = "ledger";

          // 여러 파일 업로드
          const paths = await uploadMultipleFilesToS3(fileObjects, basePath);
          finalFileUrls.push(...paths);
        } catch (uploadError) {
          console.error("파일 업로드 실패:", uploadError);
          alert("파일 업로드에 실패했습니다. 다시 시도해주세요.");
          setUploading(false);
          return;
        }
      }

      // 기존 파일 URL 추가
      finalFileUrls.push(...existingFileUrls);

      // DB에 저장
      const payload = {
        title,
        content,
        fileUrls: finalFileUrls.length > 0 ? finalFileUrls : null,
        isPinned,
      };

      if (ledgerId) {
        // 수정(PATCH) 요청: /api/v1/ledgers/{ledgerId}
        const res = await apiPatchWithToken(
          `/api/v1/ledgers/${ledgerId}`,
          payload,
          navigate
        );
        const body = res.data as LedgerEditResponse;
        alert("장부가 수정되었습니다.");
        navigate(`/ledger/${body.data.id}`);
      } else {
        // 신규 등록(POST) 요청: /api/v1/ledgers
        const res = await apiPostWithToken(
          "/api/v1/ledgers",
          payload,
          navigate
        );
        const body = res.data as LedgerEditResponse;
        alert("장부가 등록되었습니다.");
        navigate(`/ledger/${body.data.id}`);
      }
    } catch (error) {
      console.error("장부 저장 실패:", error);
      alert("장부 저장 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // 로딩 중이거나 로그인하지 않은 경우 아무것도 렌더링하지 않음
  if (isLoading || !isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 mt-20 bg-transparent">
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mt-20">
        <form
          onSubmit={handleSubmit}
          className="px-4 py-10 mx-auto space-y-6 max-w-4xl"
        >
          {/* 상단 타이틀 + 상단고정 토글 */}
          <div className="flex justify-between items-end pb-4 mb-2 border-b border-gray-200">
            <h1 className="text-2xl font-extrabold text-black tracking-[1.9px]">
              장부게시판
            </h1>
            <LedgerTopActions
              isPinned={isPinned}
              onTogglePin={() => setIsPinned((prev) => !prev)}
              onCancel={handleCancelClick}
              submitLabel={ledgerId ? "수정" : "등록"}
            />
          </div>

          {/* 제목 */}
          <LedgerTitleInput title={title} onChange={setTitle} />

          {/* 내용 입력 */}
          <LedgerContentSection content={content} onChange={setContent} />
          {/* 파일 업로드 (블로그 작성/수정 페이지의 파일 업로드 리스트와 가로 길이를 맞춘다) */}
          <section className="w-full rounded-xl border border-gray-200 bg-white p-4 lg:max-w-[348px]">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-bold text-[#007AEB]">파일 업로드</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                <Paperclip className="h-4 w-4" />
                추가
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFilesChange(Array.from(e.target.files ?? []))}
              />
            </label>
            <AttachmentList
              className="mt-3"
              items={[
                ...existingFileUrls.map((url) => ({
                  id: `existing-${url}`,
                  name: url.split("/").pop()?.replace(/^\d+_\d+_/, "") || "첨부파일",
                  onRemove: () => handleRemoveExistingFile(url),
                })),
                ...files.map((item) => ({
                  id: item.id,
                  name: item.file.name,
                  onRemove: () => handleRemoveFile(item.id),
                })),
              ]}
            />
            {uploading && <p className="mt-3 text-sm font-medium text-[#007AEB]">업로드 중...</p>}
          </section>
          {/* 하단 목록 버튼 */}
          <LedgerBottomActions onCancel={handleListClick} />
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default LedgerEditPage;
