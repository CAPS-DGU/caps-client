import React, { useState } from "react";
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

const LedgerEditPage: React.FC = () => {
  const { ledgerId } = useParams<{ ledgerId?: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [files, setFiles] = useState<LedgerFileItem[]>([]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 API 연동 후 저장 처리
    // 임시로 저장 후 상세 페이지로 이동
    if (ledgerId) {
      navigate(`/ledger/${ledgerId}`);
    } else {
      navigate("/ledger");
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
