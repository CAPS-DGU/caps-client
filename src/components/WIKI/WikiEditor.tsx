import React, { useState } from 'react';

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
      alert('보안상의 이유로 iframe / onerror 등의 태그 또는 속성은 사용할 수 없습니다.\n해당 내용을 제거한 뒤 다시 시도해 주세요.');
      return;
    }

    onSave(content);
  };

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
      {/* 에디터 영역 */}
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">위키 수정</h2>
        <textarea
          className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-4">
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
          className="px-4 py-2 text-white bg-gray-600 rounded-md shadow-md hover:underline hover:bg-gray-700"
          onClick={handleSave}
        >
          수정
        </button>


      </div>
    </div>
  );
};

export default WikiEditor;
