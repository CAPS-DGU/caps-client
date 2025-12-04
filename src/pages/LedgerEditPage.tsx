import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import {
  LedgerTitleInput,
  LedgerTopActions,
  LedgerFileSection,
  LedgerContentSection,
  LedgerFileItem,
} from "../components/Ledger/LedgerComponents";
import {
  apiGetWithToken,
  apiPatchWithToken,
  apiPostWithToken,
} from "../utils/Api";

interface LedgerEditResponse {
  status: number;
  message: string;
  data: {
    id: number;
    title: string;
    content: string;
    fileUrl: string | null;
    isPinned: boolean;
  };
}

const LedgerEditPage: React.FC = () => {
  const { ledgerId } = useParams<{ ledgerId?: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [files, setFiles] = useState<LedgerFileItem[]>([]);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

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
        setFileUrl(body.data.fileUrl);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }

    try {
      const payload = {
        title,
        content,
        fileUrl, // 파일 업로드 연동 전이라면 서버에 기존 값이나 null 전달
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
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mt-20">
        <form
          onSubmit={handleSubmit}
          className="px-4 py-10 mx-auto space-y-6 max-w-4xl"
        >
          {/* 상단 타이틀 + 상단고정/등록 버튼 (한 줄) */}
          <div className="flex justify-between items-end pb-4 mb-2 border-b border-gray-200">
            <h1 className="text-2xl font-extrabold text-black tracking-[1.9px]">
              장부게시판
            </h1>
            <LedgerTopActions
              isPinned={isPinned}
              onTogglePin={() => setIsPinned((prev) => !prev)}
              onCancel={() => navigate(-1)}
            />
          </div>

          {/* 제목 */}
          <LedgerTitleInput title={title} onChange={setTitle} />

          {/* 내용 입력 */}
          <LedgerContentSection content={content} onChange={setContent} />
          {/* 파일 업로드 */}
          <LedgerFileSection
            files={files}
            onFilesChange={handleFilesChange}
            onRemoveFile={handleRemoveFile}
          />
          {/* 하단 목록 버튼 */}
          <div className="flex justify-start pt-4">
            <button
              type="button"
              className="px-7 py-3 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0066c7] transition-colors"
              onClick={() => navigate("/ledger")}
            >
              목록
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default LedgerEditPage;
