import React from "react";
import { getPresignedDownloadURL } from "../../utils/s3Upload";
import DetailAttachments from "../common/DetailAttachments";

// 공통 아이콘 리소스
export const pushPinIcon = new URL(
  "../../assets/push_pin_rotate.svg",
  import.meta.url
).href;

export const attachFileIcon = new URL(
  "../../assets/attach_file.svg",
  import.meta.url
).href;

/* =====================
 * 상세 페이지용 컴포넌트
 * ===================== */

export interface LedgerDetailHeaderProps {
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const LedgerDetailHeader: React.FC<LedgerDetailHeaderProps> = ({
  title,
  onEdit,
  onDelete,
}) => (
  <header className="mb-6">
    <div className="flex gap-4 justify-between items-start">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl md:text-2xl font-extrabold leading-snug text-black break-words">
          {title}
        </h1>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex flex-shrink-0 gap-2 items-center">
          {onEdit && (
            <button
              type="button"
              className="rounded-full bg-[#007AEB] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0069cc] whitespace-nowrap"
              onClick={onEdit}
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-bold text-gray-600 transition-colors hover:border-red-400 hover:text-red-500 whitespace-nowrap"
              onClick={onDelete}
            >
              삭제
            </button>
          )}
        </div>
      )}
    </div>
  </header>
);

export interface LedgerDetailMetaProps {
  author: string;
  term: string;
  date: string;
  /** 첨부 없을 때 본문과 구분할 하단 선 */
  showBottomBorder?: boolean;
}

export const LedgerDetailMeta: React.FC<LedgerDetailMetaProps> = ({
  author,
  term,
  date,
  showBottomBorder = false,
}) => (
  <div
    className={`mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-400 ${
      showBottomBorder ? "border-b border-gray-200 pb-6" : ""
    }`}
  >
    <span className="font-medium text-gray-500">
      {term ? `${term} ` : ""}
      {author}
    </span>
    {date && (
      <>
        <span>·</span>
        <span>{date}</span>
      </>
    )}
  </div>
);

export interface LedgerDetailFilesProps {
  fileUrls?: string[];
}

export const LedgerDetailFiles: React.FC<LedgerDetailFilesProps> = ({
  fileUrls = [],
}) => {
  if (fileUrls.length === 0) return null;

  const files = fileUrls.map((url) => {
    const fullFileName = url.split("/").pop() || "첨부파일";
    const name = fullFileName.replace(/^\d+_\d+_/, "");
    return { url, name };
  });

  return (
    <div className="mt-4 border-b border-gray-200 pb-6">
      <DetailAttachments
        files={files}
        onResolveUrl={async (file) => getPresignedDownloadURL(file.url)}
      />
    </div>
  );
};

export interface LedgerDetailContentProps {
  content: string;
}

export const LedgerDetailContent: React.FC<LedgerDetailContentProps> = ({
  content,
}) => (
  <div className="mt-8">
    <p className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap break-words">
      {content}
    </p>
  </div>
);

export interface LedgerDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LedgerDeleteModal: React.FC<LedgerDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
      <div className="px-6 py-6 w-full max-w-md bg-white rounded-2xl shadow-lg md:px-8 md:py-7">
        <h2 className="mb-3 text-lg font-bold text-gray-900 md:text-xl">
          장부 기록을 삭제하시겠습니까?
        </h2>
        <p className="mb-6 text-sm text-gray-600 md:text-base">
          삭제된 장부 기록은 되돌릴 수 없습니다.{" "}
          <br className="hidden md:block" />
          정말로 삭제를 진행하시려면 아래 삭제 버튼을 눌러 주세요.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0066c7] transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

/* =====================
 * 수정 페이지용 컴포넌트
 * ===================== */

export interface PinToggleProps {
  isPinned: boolean;
  onToggle: () => void;
}

export const PinToggle: React.FC<PinToggleProps> = ({ isPinned, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex gap-2 text-white items-center px-3 py-2 text-sm font-semibold bg-[#007AEB] rounded-full border border-gray-300 shadow-sm transition-colors"
  >
    <img src={pushPinIcon} alt="상단 고정" className="w-6 h-6" />
    <span className="hidden md:inline">상단 고정</span>
    <div
      className={`flex items-center w-9 h-5 rounded-full px-1 transition-colors ${
        isPinned ? "bg-[#007AEB]" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-3 h-3 bg-white rounded-full transform transition-transform ${
          isPinned ? "translate-x-3" : ""}`}
      />
    </div>
  </button>
);

export interface TitleInputProps {
  title: string;
  onChange: (value: string) => void;
}

export const LedgerTitleInput: React.FC<TitleInputProps> = ({
  title,
  onChange,
}) => (
  <div className="pb-4 mb-2 border-b border-gray-200">
    <input
      type="text"
      value={title}
      onChange={(e) => onChange(e.target.value)}
      placeholder="제목을 입력하세요."
      className="w-full text-xl font-extrabold placeholder-gray-400 text-black bg-transparent md:text-2xl focus:outline-none"
    />
  </div>
);

export interface TopActionsProps {
  isPinned: boolean;
  onTogglePin: () => void;
  onCancel: () => void;
  submitLabel?: string;
}

export const LedgerTopActions: React.FC<TopActionsProps> = ({
  isPinned,
  onTogglePin,
  onCancel,
  submitLabel = "등록",
}) => (
  <div className="flex gap-3 items-center">
    <PinToggle isPinned={isPinned} onToggle={onTogglePin} />
    <button
      type="submit"
      className="px-7 py-3 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0066c7] transition-colors"
    >
      {submitLabel}
    </button>
  </div>
);

export interface BottomActionsProps {
  onCancel: () => void;
}

export const LedgerBottomActions: React.FC<BottomActionsProps> = ({
  onCancel,
}) => (
  <div className="flex justify-start pt-4">
    <button
      type="button"
      onClick={onCancel}
      className="px-7 py-3 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0066c7] transition-colors"
    >
      목록
    </button>
  </div>
);

export interface LedgerFileItem {
  id: number;
  file: File;
}

export interface ContentSectionProps {
  content: string;
  onChange: (value: string) => void;
}

export const LedgerContentSection: React.FC<ContentSectionProps> = ({
  content,
  onChange,
}) => (
  <section>
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder="장부 내용을 입력하세요."
      className="w-full h-64 p-4 text-sm leading-relaxed border border-gray-200 rounded-[15px] resize-vertical focus:outline-none focus:ring-2 focus:ring-[#007AEB] focus:border-transparent"
    />
  </section>
);
