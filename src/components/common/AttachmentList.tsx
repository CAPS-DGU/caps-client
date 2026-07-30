import React from "react";
import { Paperclip, Image as ImageIcon } from "lucide-react";

export interface AttachmentListItem {
  id: string | number;
  name: string;
  loading?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onRemove?: () => void;
}

interface AttachmentListProps {
  items: AttachmentListItem[];
  className?: string;
}

const isImageName = (name: string) => /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(name);

/** 블로그 상세/작성 및 장부게시판 작성 페이지가 공유하는 첨부파일 목록 UI. */
const AttachmentList: React.FC<AttachmentListProps> = ({ items, className = "" }) => {
  if (items.length === 0) return null;

  return (
    <ul
      className={`divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}
    >
      {items.map((item) => {
        const Icon = isImageName(item.name) ? ImageIcon : Paperclip;
        const label = (
          <span className="flex min-w-0 items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-[#007AEB]" strokeWidth={2} />
            <span className="truncate">{item.loading ? "불러오는 중..." : item.name}</span>
          </span>
        );

        return (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm text-gray-700"
          >
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="flex min-w-0 flex-1 items-center gap-2 text-left transition-colors hover:text-[#007AEB]"
              >
                {label}
              </button>
            ) : (
              label
            )}
            {item.onRemove && (
              <button
                type="button"
                onClick={item.onRemove}
                className="shrink-0 text-xs font-semibold text-[#007AEB] hover:underline"
              >
                삭제
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default AttachmentList;
