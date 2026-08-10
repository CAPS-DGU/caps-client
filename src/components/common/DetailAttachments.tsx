import React, { useState } from "react";

const attachFileIcon = new URL("../../assets/attach_file.svg", import.meta.url).href;

export interface DetailAttachment {
  url: string;
  name: string;
}

interface DetailAttachmentsProps {
  files: DetailAttachment[];
  /** 클릭 시 다운로드 URL 반환. mock 등은 reject 하면 된다. */
  onResolveUrl: (file: DetailAttachment) => Promise<string>;
  className?: string;
}

/** 장부·블로그 상세 공유 첨부 목록 (아이콘 + 파란 링크, 박스 없음) */
const DetailAttachments: React.FC<DetailAttachmentsProps> = ({
  files,
  onResolveUrl,
  className = "",
}) => {
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);

  if (!files.length) return null;

  const handleClick = async (file: DetailAttachment) => {
    if (loadingUrl === file.url) return;
    try {
      setLoadingUrl(file.url);
      const downloadUrl = await onResolveUrl(file);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.name;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("파일 다운로드 실패:", error);
      alert("파일 다운로드에 실패했습니다.");
    } finally {
      setLoadingUrl(null);
    }
  };

  return (
    <ul className={`space-y-2 ${className}`}>
      {files.map((file, index) => {
        const isLoading = loadingUrl === file.url;
        return (
          <li key={`${file.url}-${index}`} className="flex items-center gap-2 text-sm text-gray-600">
            <img src={attachFileIcon} alt="" className="h-4 w-4 shrink-0" />
            <button
              type="button"
              onClick={() => handleClick(file)}
              disabled={isLoading}
              className={`text-left font-medium text-[#007AEB] hover:underline disabled:cursor-wait disabled:opacity-50 ${
                isLoading ? "" : "cursor-pointer"
              }`}
            >
              {isLoading ? "다운로드 중..." : file.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default DetailAttachments;
