import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const pushPinIcon = new URL("../../assets/PushPin.svg", import.meta.url).href;
const attachFileIcon = new URL("../../assets/attach_file.svg", import.meta.url)
  .href;
const editIcon = new URL("../../assets/edit.svg", import.meta.url).href;

export interface LedgerEntry {
  id: number;
  author: string;
  term: string;
  date: string;
  title: string;
  hasAttachment: boolean;
  isBookmarked?: boolean;
}

const LedgerBoard: React.FC = () => {
  const navigate = useNavigate();
  // 샘플 데이터 생성
  const generateSampleData = (): LedgerEntry[] => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      author: "김캡스",
      term: "39.5기",
      date: "2025. 01. 01",
      title: i === 0 ? "1월 정기회의록" : `장부 기록 ${i + 1}`,
      hasAttachment: i % 3 === 0, // 일부 항목만 첨부파일 있음
      isBookmarked: i === 0, // 첫 번째 항목만 북마크
    }));
  };

  const [entries, setEntries] = useState<LedgerEntry[]>(generateSampleData());
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // 페이지네이션: 고정된 개수의 페이지 번호만 노출
  const pageWindowSize = 5;
  const halfWindow = Math.floor(pageWindowSize / 2);
  let startPage = Math.max(1, currentPage - halfWindow);
  let endPage = startPage + pageWindowSize - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - pageWindowSize + 1);
  }

  const handlePinToggle = (id: number) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id
          ? { ...entry, isBookmarked: !entry.isBookmarked }
          : entry
      )
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col px-4 py-10 mx-auto max-w-5xl">
      {/* 헤더 섹션 */}
      <div className="w-full">
        <div className="mx-auto max-w-[1440px] px-[15px] py-[15px]">
          <div className="flex gap-4 justify-between items-center">
            <div className="flex flex-col gap-[10px]">
              <h1 className="text-[38px] font-extrabold text-black tracking-[1.9px]">
                장부게시판
              </h1>
              <p className="md:text-[24px] text-[12px] font-bold text-gray-700 tracking-[1.2px]">
                장부 기록를 작성하고 확인할 수 있는 공간입니다
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/ledger/edit")}
              className="px-6 py-4 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0079ebcc] transition-colors flex items-center gap-2"
            >
              <img src={editIcon} alt="작성하기" className="w-6 h-6" />
              <span className="hidden md:inline">작성하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 w-full pt-[15px]">
        <div className="mx-auto max-w-[1440px]">
          {/* 리스트 항목들 */}
          <div className="space-y-0">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                onClick={() => navigate(`/ledger/${entry.id}`)}
                className={`cursor-pointer border-b border-gray-200 px-[15px] py-3 md:py-4 ${
                  index === 0 ? "border-t border-gray-200" : ""
                }`}
              >
                {/* 상단: 작성자 + 날짜 (한 줄), 우측에 핀 */}
                <div className="flex gap-2 justify-between items-center">
                  <p className="flex-1 min-w-0 text-[13px] md:text-[14px] font-semibold text-gray-700 tracking-[0.3px] truncate">
                    {entry.author} [{entry.term}]{" "}
                    <span className="text-[12px] md:text-[14px] font-semibold text-gray-700 tracking-[0.3px] ml-2">
                      {entry.date}
                    </span>
                  </p>
                  {entry.isBookmarked && (
                    <button className="flex justify-center items-center w-8 h-8 transition-opacity cursor-pointer hover:opacity-70 transform translate-y-[14px] md:translate-y-[18px]">
                      <img
                        src={pushPinIcon}
                        alt="고정"
                        className="w-full h-full"
                      />
                    </button>
                  )}
                </div>

                {/* 하단: 제목 + 첨부 아이콘 (진짜 바로 옆에) */}
                <p className="mt-1 min-w-0 text-[14px] md:text-[16px] font-semibold text-black tracking-[0.3px]">
                  <span className="inline-flex items-center max-w-full align-middle">
                    <span className="max-w-full truncate">
                      {entry.title || "제목을 입력하세요"}
                    </span>
                    {entry.hasAttachment && (
                      <img
                        src={attachFileIcon}
                        alt="첨부파일"
                        className="inline-block flex-shrink-0 ml-2 w-4 h-4 align-middle md:w-5 md:h-5"
                      />
                    )}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center py-6 border-t border-gray-200">
        <div className="flex gap-1 items-center">
          {/* 첫 페이지로 */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm text-gray-700 md:text-base disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-800"
          >
            &lt;&lt;
          </button>

          {/* 이전 페이지 */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm text-gray-700 md:text-base disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-800"
          >
            &lt;
          </button>

          {/* 페이지 번호들: 항상 일정 개수만 노출 */}
          <div className="flex gap-1 items-center">
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i
            ).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-2 md:px-3 py-1 text-xs md:text-sm font-semibold tracking-[2px] ${
                  currentPage === page
                    ? "text-gray-400"
                    : "text-gray-700 hover:text-gray-800"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* 다음 페이지 */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm text-gray-700 md:text-base disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-800"
          >
            &gt;
          </button>

          {/* 마지막 페이지로 */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm text-gray-700 md:text-base disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-800"
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default LedgerBoard;
