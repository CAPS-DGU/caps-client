import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Lock, Trash2, Paperclip, ImagePlus } from "lucide-react";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import { BLOG_CATEGORIES, BLOG_CATEGORY_MAP } from "../components/Blog/categories";
import MarkdownEditor from "../components/Blog/MarkdownEditor";
import BlogImage from "../components/Blog/BlogImage";
import AttachmentList from "../components/common/AttachmentList";
import { useAuth } from "../hooks/useAuth";
import { uploadFileToS3, uploadMultipleFilesToS3, sanitizeFileName } from "../utils/s3Upload";
import { blogFileName } from "../utils/blogFiles";
import {
  useGetBlog,
  useCreateBlog,
  useModifyBlog,
  getGetBlogsQueryKey,
  getGetBlogQueryKey,
  CreateOrModifyBlogRequestCategory,
  BlogDetailResponse,
} from "../api/generated/capsApi";

const WRITE_ROLES = ["ADMIN", "COUNCIL", "PRESIDENT"];

const TITLE_MAX = 50;
const SUBTITLE_MAX = 50;

/** 백엔드는 상세 응답에 thumbnailUrl 을 추가했지만 생성된 타입엔 아직 없어 확장해서 읽는다. */
type BlogDetail = BlogDetailResponse & { thumbnailUrl?: string };

/** 업로드 대기 중인 파일 (선택 시점엔 올리지 않고 저장할 때 한 번에 올린다) */
interface PendingFile {
  id: number;
  file: File;
}

/**
 * 본문 마크다운에서 우리 S3 key 로 삽입된 이미지 키만 뽑는다 (외부 URL 은 제외).
 * alt 부분은 `\]`, `\[` 처럼 이스케이프된 대괄호를 포함할 수 있으므로(escapeMarkdownLabel 참고)
 * `(?:\\.|[^\]\\])*` 로 이스케이프 시퀀스를 하나의 단위로 건너뛰어 조기 종료를 막는다.
 * CommonMark 문법상 dest 에 공백이 있으면 `<...>` 로 감싸야 하므로 그 형태도 지원하고,
 * `![alt](dest "title")` 처럼 title 이 붙는 경우 dest 뒤에서 정확히 멈추도록 한다.
 */
function extractContentImageKeys(md: string): string[] {
  const re = /!\[(?:\\.|[^\]\\])*\]\(\s*(?:<([^>]*)>|([^)\s]+))(?:\s+"[^"]*")?\s*\)/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    const url = (m[1] ?? m[2] ?? "").trim();
    if (url && !/^https?:\/\//i.test(url) && !url.startsWith("data:") && !url.startsWith("blob:"))
      out.push(url);
  }
  return Array.from(new Set(out));
}

const BlogEditPage: React.FC = () => {
  const { blogId } = useParams<{ blogId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoggedIn, isLoading: isAuthLoading } = useAuth();

  const isEdit = !!blogId;
  const id = Number(blogId);

  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>(CreateOrModifyBlogRequestCategory.EVENTS);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  // 대표 이미지: 새로 고른 파일 / 기존 값(key) / 기존 값 제거 여부
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
  const [removedThumbnail, setRemovedThumbnail] = useState<boolean>(false);

  const [files, setFiles] = useState<PendingFile[]>([]);
  const [existingFileUrls, setExistingFileUrls] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState<boolean>(false);

  const { data: detail } = useGetBlog(id, { query: { enabled: isEdit && Number.isFinite(id) } });
  const { mutateAsync: createBlog } = useCreateBlog();
  const { mutateAsync: modifyBlog } = useModifyBlog();

  const canWrite = WRITE_ROLES.includes(user?.role ?? "");

  // 새로 고른 썸네일 미리보기 (URL 은 언마운트/교체 시 해제한다)
  const thumbnailPreview = useMemo(
    () => (thumbnail ? URL.createObjectURL(thumbnail) : null),
    [thumbnail]
  );
  useEffect(
    () => () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    },
    [thumbnailPreview]
  );

  // 로그인/권한이 없으면 되돌려보낸다
  useEffect(() => {
    if (isAuthLoading) return;
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    if (user && !canWrite) {
      alert("게시물을 작성할 권한이 없습니다.");
      navigate("/blog");
    }
  }, [isAuthLoading, isLoggedIn, user, canWrite, navigate]);

  // 수정 모드일 때만 기존 값 채우기
  useEffect(() => {
    const post = detail?.data as BlogDetail | undefined;
    if (!post) return;
    setTitle(post.title ?? "");
    setSubtitle(post.subtitle ?? "");
    setContent(post.content ?? "");
    setCategory(post.category ?? CreateOrModifyBlogRequestCategory.EVENTS);
    setIsPrivate(!!post.isPrivate);
    setExistingThumbnailUrl(post.thumbnailUrl ?? null);
    setRemovedThumbnail(false);
    setExistingFileUrls(post.fileUrls ?? []);
  }, [detail]);

  const addFiles = (selected: File[]) => {
    setFiles((prev) => [...prev, ...selected.map((file, index) => ({ id: Date.now() + index, file }))]);
  };

  // 본문 인라인 이미지: 삽입 시점엔 로컬 blob URL 로만 미리보기(Preview 에서도 그대로 보임)하고,
  // 실제 S3 업로드는 저장(발행/수정) 시 한 번에 처리한다.
  const pendingInlineImagesRef = useRef<Map<string, File>>(new Map());
  useEffect(() => {
    const pending = pendingInlineImagesRef.current;
    return () => {
      pending.forEach((_file, blobUrl) => URL.revokeObjectURL(blobUrl));
      pending.clear();
    };
  }, []);

  const handleInlineImageUpload = async (file: File): Promise<string | null> => {
    const blobUrl = URL.createObjectURL(file);
    pendingInlineImagesRef.current.set(blobUrl, file);
    return blobUrl;
  };

  const showThumbnailPreview = thumbnailPreview
    ? thumbnailPreview
    : existingThumbnailUrl && !removedThumbnail
      ? existingThumbnailUrl
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    setSubmitting(true);
    try {
      // 본문에 여전히 남아있는 로컬 미리보기(blob URL)만 이 시점에 S3 로 업로드하고 실제 key 로 치환한다.
      // 제출 전에 지운 이미지는 그대로 두면 blob URL 만 사라질 뿐 S3 에는 올라가지 않는다.
      let finalContent = content.trim();
      let inlineIndex = 0;
      for (const [blobUrl, file] of pendingInlineImagesRef.current) {
        if (!finalContent.includes(blobUrl)) continue;
        const key = await uploadFileToS3(
          file,
          `blog/${Date.now()}_${inlineIndex++}_${sanitizeFileName(file.name)}`
        );
        finalContent = finalContent.split(blobUrl).join(key);
      }

      // 새 첨부만 업로드, 기존 첨부는 유지
      const uploadedFiles = files.length
        ? await uploadMultipleFilesToS3(
            files.map((item) => item.file),
            "blog"
          )
        : [];
      const uploadedThumbnail = thumbnail
        ? await uploadFileToS3(thumbnail, `blog/${Date.now()}_0_${sanitizeFileName(thumbnail.name)}`)
        : null;

      // 썸네일: 새로 고르면 교체 / 명시적으로 지우면 null / 그대로면 기존 값 유지(항상 전송)
      let thumbnailUrl: string | null;
      if (uploadedThumbnail) thumbnailUrl = uploadedThumbnail;
      else if (removedThumbnail) thumbnailUrl = null;
      else thumbnailUrl = existingThumbnailUrl ?? null;

      const payload: Record<string, unknown> = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        content: finalContent,
        thumbnailUrl,
        category,
        isPrivate,
        writerGrade: Number(user?.grade) || 0,
        writerName: user?.name ?? "",
        // 본문에 삽입된 이미지 key 를 imageUrls 로 함께 보내 S3 수명주기(교체/삭제 정리)를 맞춘다
        imageUrls: extractContentImageKeys(finalContent),
        fileUrls: [...existingFileUrls, ...uploadedFiles],
      };

      if (isEdit) {
        await modifyBlog({ blogId: id, data: payload as any });
        await queryClient.invalidateQueries({ queryKey: getGetBlogQueryKey(id) });
        await queryClient.invalidateQueries({ queryKey: getGetBlogsQueryKey() });
        alert("게시물이 수정되었습니다.");
        navigate(`/blog/${id}`);
      } else {
        const created = (await createBlog({ data: payload as any })) as any;
        await queryClient.invalidateQueries({ queryKey: getGetBlogsQueryKey() });
        alert("게시물이 등록되었습니다.");
        const newId = created?.data?.id;
        navigate(newId ? `/blog/${newId}` : "/blog");
      }
    } catch (error) {
      console.error("블로그 저장 실패:", error);
      alert(
        axios.isAxiosError(error) && error.response?.status === 403
          ? "게시물을 저장할 권한이 없습니다."
          : "게시물 저장에 실패했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const previewCat = BLOG_CATEGORY_MAP[category];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />
      <main className="flex-1 pt-20">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl px-4 md:px-6 py-10 space-y-6"
        >
          {/* 헤더: 제목 + 비공개 토글 + 취소/발행 */}
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black">블로그</h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsPrivate((v) => !v)}
                aria-pressed={isPrivate}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  isPrivate
                    ? "border-[#007AEB] bg-[#007AEB]/10 text-[#007AEB]"
                    : "border-gray-300 bg-white text-gray-500"
                }`}
              >
                <Lock className="h-4 w-4" strokeWidth={2.2} />
                비공개
                <span
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    isPrivate ? "bg-[#007AEB]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                      isPrivate ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate(isEdit ? `/blog/${id}` : "/blog")}
                className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:text-gray-900"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-[#007AEB] px-7 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0069cc] disabled:bg-gray-300"
              >
                {submitting ? "저장 중..." : isEdit ? "수정" : "발행"}
              </button>
            </div>
          </div>

          {/* 제목 */}
          <div className="relative">
            <input
              type="text"
              value={title}
              maxLength={TITLE_MAX}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 pr-16 text-lg font-bold text-black placeholder-gray-400 focus:border-[#007AEB] focus:outline-none focus:ring-2 focus:ring-[#007AEB]/20"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {title.length}/{TITLE_MAX}
            </span>
          </div>

          {/* 부제목 */}
          <div className="relative">
            <input
              type="text"
              value={subtitle}
              maxLength={SUBTITLE_MAX}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="부제목을 입력하세요. (선택)"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-16 text-sm text-gray-800 placeholder-gray-400 focus:border-[#007AEB] focus:outline-none focus:ring-2 focus:ring-[#007AEB]/20"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {subtitle.length}/{SUBTITLE_MAX}
            </span>
          </div>

          {/* 카테고리 선택 */}
          <div className="flex flex-wrap gap-2.5">
            {BLOG_CATEGORIES.map((c) => {
              const active = category === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
                    active
                      ? "border-[#007AEB] bg-[#007AEB] text-white"
                      : "border-[#bcbcbc] bg-white text-[#4e4e4e] hover:border-[#007AEB] hover:text-[#007AEB]"
                  }`}
                >
                  <c.Icon className="h-4 w-4" strokeWidth={2} />
                  {c.label}
                  <span className={`text-xs font-medium ${active ? "text-white/80" : "text-gray-400"}`}>
                    ({c.hint})
                  </span>
                </button>
              );
            })}
          </div>

          {/* 내용 — 마크다운 에디터 (툴바 + Edit/Preview 토글, 이미지는 본문에 인라인 삽입) */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700">내용</h2>
              <span className="text-xs text-gray-400">마크다운 문법으로 작성하고 Preview 로 확인하세요</span>
            </div>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              onImageUpload={handleInlineImageUpload}
              placeholder="내용을 입력하세요. (마크다운 지원 · 툴바의 이미지 버튼으로 본문에 이미지를 삽입할 수 있어요)"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 [grid-template-areas:'thumb'_'preview'_'files'] lg:grid-cols-2 lg:[grid-template-areas:'thumb_preview'_'files_preview']">
            {/* 대표 이미지 */}
            <section className="[grid-area:thumb]">
              <h2 className="mb-2 text-sm font-bold text-gray-700">대표 이미지 (선택)</h2>
              {showThumbnailPreview ? (
                <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="aspect-[16/9] w-full">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="대표 이미지 미리보기"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <BlogImage
                        src={showThumbnailPreview}
                        alt="현재 대표 이미지"
                        className="h-full w-full object-cover"
                        fallback={
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-2xl font-black tracking-widest text-slate-300">
                            CAPS
                          </div>
                        }
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 py-2">
                    <span className="truncate text-sm text-gray-600">
                      {thumbnail ? thumbnail.name : "현재 대표 이미지"}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <label className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-[#007AEB] hover:text-[#007AEB]">
                        이미지 변경
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            setThumbnail(e.target.files?.[0] ?? null);
                            setRemovedThumbnail(false);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (thumbnail) setThumbnail(null);
                          else setRemovedThumbnail(true);
                        }}
                        aria-label="대표 이미지 삭제"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white text-gray-400 transition-colors hover:border-[#007AEB] hover:text-[#007AEB]">
                  <ImagePlus className="h-8 w-8" strokeWidth={1.6} />
                  <span className="text-sm font-medium">대표 이미지 선택</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      setThumbnail(e.target.files?.[0] ?? null);
                      setRemovedThumbnail(false);
                    }}
                  />
                </label>
              )}
            </section>

            {/* 파일 업로드 */}
            <section className="[grid-area:files] rounded-xl border border-gray-200 bg-white p-4">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-sm font-bold text-[#007AEB]">파일 업로드</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                  <Paperclip className="h-4 w-4" />
                  추가
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
                />
              </label>
              <AttachmentList
                className="mt-3"
                items={[
                  ...existingFileUrls.map((url, index) => ({
                    id: `existing-${url}`,
                    name: blogFileName(url),
                    onRemove: () =>
                      setExistingFileUrls((prev) => prev.filter((_, i) => i !== index)),
                  })),
                  ...files.map((item) => ({
                    id: item.id,
                    name: item.file.name,
                    onRemove: () => setFiles((prev) => prev.filter((f) => f.id !== item.id)),
                  })),
                ]}
              />
            </section>

            {/* 블로그 카드 미리보기 */}
            <section className="[grid-area:preview]">
              <h2 className="mb-2 text-sm font-bold text-gray-700">블로그 카드 미리보기</h2>
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="카드 미리보기 썸네일"
                      className="h-full w-full object-cover"
                    />
                  ) : showThumbnailPreview ? (
                    <BlogImage
                      src={showThumbnailPreview}
                      alt="카드 미리보기 썸네일"
                      className="h-full w-full object-cover"
                      fallback={
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-2xl font-black tracking-widest text-slate-300">
                          CAPS
                        </div>
                      }
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-2xl font-black tracking-widest text-slate-300">
                      CAPS
                    </div>
                  )}
                  {previewCat && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#007AEB] px-3 py-1 text-xs font-bold text-white shadow-sm">
                      {previewCat.label}
                    </span>
                  )}
                  {isPrivate && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                      <Lock className="h-8 w-8 text-white/90" strokeWidth={2} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="truncate text-lg font-bold text-black">
                    {title || "제목을 입력하세요."}
                  </h3>
                  {subtitle && <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{subtitle}</p>}
                  <div className="mt-4 flex items-center justify-between text-xs text-[#9ca3af]">
                    <span className="truncate">
                      {user?.grade ? `${user.grade}기 ` : ""}
                      {user?.name ?? ""}
                    </span>
                    <span className="shrink-0">
                      {new Date().toLocaleDateString("ko-KR").replace(/\.$/, "")}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default BlogEditPage;
