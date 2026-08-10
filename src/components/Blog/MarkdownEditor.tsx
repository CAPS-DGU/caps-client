import React, { useRef, useState } from "react";
import {
  Heading1,
  Heading2,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  Link2,
  ImagePlus,
  Table as TableIcon,
} from "lucide-react";
import MarkdownView from "./MarkdownView";

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  /** 본문에 바로 넣을 수 있는 값(로컬 blob URL 이거나 S3 key/URL)을 돌려준다. 실패 시 null. */
  onImageUpload: (file: File) => Promise<string | null>;
  placeholder?: string;
}

type Mode = "edit" | "preview";

/** 파일명을 이미지 alt 텍스트(`[...]`)에 그대로 넣을 수 있도록 CommonMark 특수문자를 이스케이프한다. */
function escapeMarkdownLabel(text: string): string {
  return text.replace(/[\\[\]]/g, "\\$&");
}

const TABLE_TEMPLATE = "| 헤더1 | 헤더2 | 헤더3 |\n| --- | --- | --- |\n| 내용 | 내용 | 내용 |\n";

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onImageUpload,
  placeholder,
}) => {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("edit");
  const [uploading, setUploading] = useState(false);

  /** 선택 영역을 before/after 로 감싸거나, 없으면 placeholder 를 넣는다. block=줄 시작 보장 */
  const wrap = (before: string, after = "", ph = "", block = false) => {
    const ta = taRef.current;
    const start = ta?.selectionStart ?? value.length;
    const end = ta?.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || ph;
    let prefix = value.slice(0, start);
    let lead = "";
    if (block && prefix.length > 0 && !prefix.endsWith("\n")) lead = "\n";
    const next = prefix + lead + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta?.focus();
      const from = prefix.length + lead.length + before.length;
      ta?.setSelectionRange(from, from + selected.length);
    });
  };

  /** 커서 위치에 그대로 삽입 (줄 시작 보장) */
  const insertBlock = (text: string) => {
    const ta = taRef.current;
    const start = ta?.selectionStart ?? value.length;
    const end = ta?.selectionEnd ?? value.length;
    const prefix = value.slice(0, start);
    const lead = prefix.length > 0 && !prefix.endsWith("\n") ? "\n" : "";
    const ins = lead + text;
    const next = prefix + ins + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta?.focus();
      const pos = prefix.length + ins.length;
      ta?.setSelectionRange(pos, pos);
    });
  };

  const handleImageFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const key = await onImageUpload(file);
      if (key) insertBlock(`![${escapeMarkdownLabel(file.name)}](${key})\n`);
      else alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      if (imgInputRef.current) imgInputRef.current.value = "";
    }
  };

  const tools = [
    { key: "h1", Icon: Heading1, label: "제목 1", run: () => wrap("# ", "", "제목", true) },
    { key: "h2", Icon: Heading2, label: "제목 2", run: () => wrap("## ", "", "제목", true) },
    { key: "b", Icon: Bold, label: "굵게", run: () => wrap("**", "**", "굵게") },
    { key: "i", Icon: Italic, label: "기울임", run: () => wrap("*", "*", "기울임") },
    { key: "ul", Icon: List, label: "목록", run: () => wrap("- ", "", "항목", true) },
    { key: "quote", Icon: Quote, label: "인용", run: () => wrap("> ", "", "인용", true) },
    { key: "code", Icon: Code, label: "코드", run: () => wrap("`", "`", "코드") },
    { key: "link", Icon: Link2, label: "링크", run: () => wrap("[", "](https://)", "링크 텍스트") },
    { key: "table", Icon: TableIcon, label: "표", run: () => insertBlock(TABLE_TEMPLATE) },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-[#007AEB] focus-within:ring-2 focus-within:ring-[#007AEB]/20">
      {/* 툴바 */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-0.5">
          {tools.map((t) => (
            <button
              key={t.key}
              type="button"
              title={t.label}
              aria-label={t.label}
              onClick={t.run}
              disabled={mode === "preview"}
              className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 disabled:opacity-40"
            >
              <t.Icon className="h-4 w-4" strokeWidth={2} />
            </button>
          ))}
          <button
            type="button"
            title="이미지 삽입"
            aria-label="이미지 삽입"
            onClick={() => imgInputRef.current?.click()}
            disabled={mode === "preview" || uploading}
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 disabled:opacity-40"
          >
            <ImagePlus className="h-4 w-4" strokeWidth={2} />
          </button>
          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageFile(e.target.files?.[0])}
          />
          {uploading && <span className="ml-1 text-xs text-gray-400">업로드 중…</span>}
        </div>

        {/* Edit / Preview 토글 */}
        <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={`rounded-md px-3 py-1 transition-colors ${
              mode === "edit" ? "bg-[#007AEB] text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`rounded-md px-3 py-1 transition-colors ${
              mode === "preview" ? "bg-[#007AEB] text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {mode === "edit" ? (
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block min-h-[36rem] w-full resize-y bg-white p-4 font-mono text-[14px] leading-7 text-gray-800 placeholder-gray-400 focus:outline-none"
        />
      ) : (
        <div className="min-h-[36rem] p-4">
          {value.trim() ? (
            <MarkdownView content={value} />
          ) : (
            <p className="text-sm text-gray-400">미리볼 내용이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
