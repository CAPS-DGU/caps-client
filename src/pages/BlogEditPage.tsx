import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Lock, Trash2, Paperclip, ImagePlus } from "lucide-react";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import { BLOG_CATEGORIES, BLOG_CATEGORY_MAP } from "../components/Blog/categories";
import { useAuth } from "../hooks/useAuth";
import { uploadFileToS3, uploadMultipleFilesToS3 } from "../utils/s3Upload";
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

/** 업로드 대기 중인 파일 (선택 시점엔 올리지 않고 저장할 때 한 번에 올린다) */
interface PendingFile {
  id: number;
  file: File;
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

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<PendingFile[]>([]);
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
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
    const post = detail?.data as BlogDetailResponse | undefined;
    if (!post) return;
    setTitle(post.title ?? "");
    setSubtitle(post.subtitle ?? "");
    setContent(post.content ?? "");
    setCategory(post.category ?? CreateOrModifyBlogRequestCategory.EVENTS);
    setIsPrivate(!!post.isPrivate);
    setExistingImageUrls(post.imageUrls ?? []);
    setExistingFileUrls(post.fileUrls ?? []);
  }, [detail]);

  const addPending = (
    setter: React.Dispatch<React.SetStateAction<PendingFile[]>>,
    selected: File[]
  ) => {
    setter((prev) => [
      ...prev,
      ...selected.map((file, index) => ({ id: Date.now() + index, file })),
    ]);
  };

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
      // 새로 고른 파일들만 업로드하고, 기존 항목은 그대로 유지한다
      const uploadedImages = images.length
        ? await uploadMultipleFilesToS3(
            images.map((item) => item.file),
            "blog"
          )
        : [];
      const uploadedFiles = files.length
        ? await uploadMultipleFilesToS3(
            files.map((item) => item.file),
            "blog"
          )
        : [];
      const uploadedThumbnail = thumbnail
        ? await uploadFileToS3(thumbnail, `blog/${Date.now()}_0_${thumbnail.name}`)
        : null;

      const payload: Record<string, unknown> = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        content: content.trim(),
        category,
        isPrivate,
        writerGrade: Number(user?.grade) || 0,
        writerName: user?.name ?? "",
        imageUrls: [...existingImageUrls, ...uploadedImages],
        fileUrls: [...existingFileUrls, ...uploadedFiles],
      };
      // 수정 모드에서 썸네일을 새로 고르지 않았다면 기존 값을 건드리지 않는다
      if (uploadedThumbnail) payload.thumbnailUrl = uploadedThumbnail;

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
  const totalImages = existingImageUrls.length + images.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />
      <main className="flex-1 pt-20">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-5xl px-4 md:px-6 py-10 space-y-6"
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

          {/* 내용 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요."
            className="min-h-[20rem] w-full resize-y rounded-xl border border-gray-200 bg-white p-4 text-[15px] leading-8 text-gray-800 placeholder-gray-400 focus:border-[#007AEB] focus:outline-none focus:ring-2 focus:ring-[#007AEB]/20"
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              {/* 대표 이미지 */}
              <section>
                <h2 className="mb-2 text-sm font-bold text-gray-700">대표 이미지 (선택)</h2>
                {thumbnailPreview ? (
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="aspect-[16/9] w-full">
                      <img
                        src={thumbnailPreview}
                        alt="대표 이미지 미리보기"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                      <span className="truncate text-sm text-gray-600">{thumbnail?.name}</span>
                      <div className="flex shrink-0 items-center gap-1">
                        <label className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-[#007AEB] hover:text-[#007AEB]">
                          이미지 변경
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setThumbnail(null)}
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
                    <span className="text-sm font-medium">
                      {isEdit ? "변경할 대표 이미지 선택" : "대표 이미지 선택"}
                    </span>
                    {isEdit && (
                      <span className="text-xs text-gray-400">선택하지 않으면 기존 이미지가 유지됩니다</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                    />
                  </label>
                )}
              </section>

              {/* 본문 이미지 */}
              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm font-bold text-[#007AEB]">본문 이미지 추가</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                    <ImagePlus className="h-4 w-4" />
                    {totalImages > 0 ? `${totalImages}개` : "선택"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => addPending(setImages, Array.from(e.target.files ?? []))}
                  />
                </label>
                {(existingImageUrls.length > 0 || images.length > 0) && (
                  <ul className="mt-3 space-y-1.5">
                    {existingImageUrls.map((url, index) => (
                      <li key={url} className="flex items-center justify-between text-sm text-gray-600">
                        <span className="truncate">{blogFileName(url)}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setExistingImageUrls((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="ml-3 shrink-0 text-xs text-gray-400 hover:text-red-500"
                        >
                          제거
                        </button>
                      </li>
                    ))}
                    {images.map((item) => (
                      <li key={item.id} className="flex items-center justify-between text-sm text-gray-600">
                        <span className="truncate">{item.file.name}</span>
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((f) => f.id !== item.id))}
                          className="ml-3 shrink-0 text-xs text-gray-400 hover:text-red-500"
                        >
                          제거
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* 파일 업로드 */}
              <section className="rounded-xl border border-gray-200 bg-white p-4">
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
                    onChange={(e) => addPending(setFiles, Array.from(e.target.files ?? []))}
                  />
                </label>
                {(existingFileUrls.length > 0 || files.length > 0) && (
                  <ul className="mt-3 space-y-1.5">
                    {existingFileUrls.map((url, index) => (
                      <li key={url} className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <Paperclip className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          <span className="truncate">{blogFileName(url)}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setExistingFileUrls((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="ml-3 shrink-0 text-xs text-gray-400 hover:text-red-500"
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                    {files.map((item) => (
                      <li key={item.id} className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <Paperclip className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          <span className="truncate">{item.file.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setFiles((prev) => prev.filter((f) => f.id !== item.id))}
                          className="ml-3 shrink-0 text-xs text-gray-400 hover:text-red-500"
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* 블로그 카드 미리보기 */}
            <section>
              <h2 className="mb-2 text-sm font-bold text-gray-700">블로그 카드 미리보기</h2>
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="카드 미리보기 썸네일"
                      className="h-full w-full object-cover"
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
