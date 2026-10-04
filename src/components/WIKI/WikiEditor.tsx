import React, { useState } from "react";
import WikiDocument from "./WikiDocument";

const WikiEditor = ({ initialContent, onSave }) => {
  const [content, setContent] = useState(initialContent.content);

  // 텍스트 변경 시 상태 업데이트
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  // 저장 버튼 클릭 시 호출
  const handleSave = () => {
    // 금지어 / 금지 태그 검사 (iframe, onerror 등)
    const forbiddenPatterns = [
      /<iframe\b/i,
      /\sonerror\s*=/i,
      /\sonevent\s*=/i,
    ];

    const hasForbidden = forbiddenPatterns.some((re) => re.test(content));

    if (hasForbidden) {
      alert(
        "보안상의 이유로 iframe / onerror 등의 태그 또는 속성은 사용할 수 없습니다.\n해당 내용을 제거한 뒤 다시 시도해 주세요.",
      );
      return;
    }

    onSave(content);
  };

  return (
    <div className="max-w-7xl p-4 md:p-6 mx-auto">
      <div
        className="sticky top-20 z-20 flex justify-end gap-3 mb-4 py-3 bg-gray-50 lg:static"
        role="group"
        aria-label="위키 편집 작업"
      >
        {/* 도움말 링크 */}
        <a
          href="/wiki/도움말" // 도움말 링크
          className="px-4 py-2 text-white bg-gray-600 rounded-md shadow-md hover:underline hover:bg-gray-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          도움말
        </a>
        {/* 저장 버튼 */}
        <button
          type="button"
          className="px-4 py-2 text-white bg-gray-600 rounded-md shadow-md hover:underline hover:bg-gray-700"
          onClick={handleSave}
        >
          수정
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 원문 편집 영역 (박스 없음) */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">원문</h2>
          <textarea
            aria-label="위키 내용"
            className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={handleChange}
          />
        </div>

        {/* 미리보기: '미리보기' 제목은 박스 밖 상단, 내용만 상세 페이지처럼 카드(박스) 안에 */}
        <section aria-labelledby="wiki-preview-title" className="min-w-0">
          <h2
            id="wiki-preview-title"
            className="mb-4 text-2xl font-semibold text-gray-700"
          >
            미리보기
          </h2>
          <div className="break-words overflow-x-auto bg-white rounded-md shadow-md p-4 sm:p-6">
            <WikiDocument content={content} idPrefix="preview-" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default WikiEditor;
