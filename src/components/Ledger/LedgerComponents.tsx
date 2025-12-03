import React from "react";

// 공통 아이콘 리소스
export const pushPinIcon = new URL(
  "../../assets/push_pin_rotate.svg",
  import.meta.url
).href;

export const attachFileIcon = new URL(
  "../../assets/attach_file.svg",
  import.meta.url
).href;

export const attachFileUploadIcon = new URL(
  "../../assets/attach_file_upload.svg",
  import.meta.url
).href;

export const imageFileIcon = new URL(
  "../../assets/image_file.svg",
  import.meta.url
).href;

export const defaultFileIcon = new URL(
  "../../assets/default_file.svg",
  import.meta.url
).href;

/* =====================
 * 상세 페이지용 컴포넌트
 * ===================== */

export interface LedgerDetailHeaderProps {
  ledgerId?: string;
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const LedgerDetailHeader: React.FC<LedgerDetailHeaderProps> = ({
  ledgerId,
  title,
  onEdit,
  onDelete,
}) => (
  <header className="pb-6 mb-8 border-b border-gray-200">
    <div className="flex gap-4 justify-between items-end">
      <div>
        <h1 className="mb-2 text-2xl font-extrabold text-black tracking-[1.9px]">
          {title}
        </h1>
        <p className="text-sm text-gray-500">
          글 번호{" "}
          <span className="font-semibold text-gray-700">{ledgerId}</span>
        </p>
      </div>
      <div className="flex gap-3 items-center">
        <button
          type="button"
          className="px-7 py-3 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0066c7] transition-colors"
          onClick={onEdit}
        >
          수정
        </button>
        <button
          type="button"
          className="px-7 py-3 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0066c7] transition-colors"
          onClick={onDelete}
        >
          삭제
        </button>
      </div>
    </div>
  </header>
);

export interface LedgerDetailMetaProps {
  author: string;
  term: string;
  date: string;
  fileName?: string;
}

export const LedgerDetailMeta: React.FC<LedgerDetailMetaProps> = ({
  author,
  term,
  date,
  fileName,
}) => (
  <div className="px-4 py-4 space-y-2 bg-white border border-gray-200 rounded-[15px] shadow-md md:px-6 md:py-5">
    <div className="flex flex-wrap justify-between items-center text-sm text-gray-700 md:text-base">
      <div>
        <span className="font-semibold">작성자</span>{" "}
        <span>
          {author} [{term}]
        </span>
      </div>
      <div>
        <span className="font-semibold">작성일자</span> <span>{date}</span>
      </div>
    </div>

    {fileName && (
      <div className="flex gap-2 items-center pt-2 text-sm text-gray-700 md:text-base">
        <img
          src={attachFileIcon}
          alt="첨부파일"
          className="w-5 h-5 md:w-6 md:h-6"
        />
        <span className="font-semibold">{fileName}</span>
      </div>
    )}
  </div>
);

export const LedgerDetailContent: React.FC = () => (
  <div className="p-6 mt-4 bg-white border border-gray-200 rounded-[15px] shadow-md">
    <p className="text-sm leading-relaxed text-gray-700">
      이 영역에 선택한 장부 기록의 상세 내용이 들어갈 예정입니다.
      <br />
      백엔드 API 연동 후 실제 데이터(제목, 금액, 내역 등)를 표시하도록 변경할 수
      있습니다.
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
}

export const LedgerTopActions: React.FC<TopActionsProps> = ({
  isPinned,
  onTogglePin,
  onCancel,
}) => (
  <div className="flex gap-3 items-center">
    <PinToggle isPinned={isPinned} onToggle={onTogglePin} />
    <button
      type="submit"
      className="px-7 py-3 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0066c7] transition-colors"
    >
      등록
    </button>
  </div>
);

export interface LedgerFileItem {
  id: number;
  file: File;
}

export interface FileSectionProps {
  files: LedgerFileItem[];
  onFilesChange: (files: File[]) => void;
  onRemoveFile: (id: number) => void;
}

export const LedgerFileSection: React.FC<FileSectionProps> = ({
  files,
  onFilesChange,
  onRemoveFile,
}) => (
  <section
    className={`space-y-2 bg-white p-2 rounded-lg border border-gray-200 ${
      files.length > 0 ? "w-[15rem]" : "w-[11rem]"
    }`}
  >
    {/* 상단 파일 업로드 헤더 (아이콘 + 텍스트) */}
    <label className="flex justify-between items-center px-2 py-1 cursor-pointer select-none">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#007AEB]">
        <img src={attachFileUploadIcon} alt="파일 업로드" className="w-4 h-4" />
        <span>파일 업로드</span>
      </div>
      <input
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          const fileList = e.target.files ? Array.from(e.target.files) : [];
          onFilesChange(fileList);
        }}
      />
    </label>

    {/* 구분선 (파일이 있을 때만 표시) */}
    {files.length > 0 && <div className="border-b border-gray-200" />}

    {/* 첨부파일 목록 */}
    {files.length > 0 && (
      <ul className="space-y-1 text-sm text-gray-800">
        {files.map(({ id, file }) => (
          <li
            key={id}
            className="flex justify-between items-center px-2 py-1 h-8"
          >
            <div className="flex flex-1 gap-2 items-center min-w-0">
              <img
                src={
                  file.type.startsWith("image/") ||
                  /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(file.name)
                    ? imageFileIcon
                    : defaultFileIcon
                }
                alt="첨부"
                className="flex-shrink-0 w-4 h-4"
              />
              <span
                className="truncate max-w-[10rem] md:max-w-[14rem]"
                title={file.name}
              >
                {file.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemoveFile(id)}
              className="ml-2 flex-shrink-0 w-12 md:w-16 text-xs font-semibold text-[#007AEB] text-right hover:underline"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
);

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
