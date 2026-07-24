import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
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

const CATEGORY_OPTIONS = [
  { key: CreateOrModifyBlogRequestCategory.EVENTS, label: "행사" },
  { key: CreateOrModifyBlogRequestCategory.ACADEMIC, label: "학술" },
  { key: CreateOrModifyBlogRequestCategory.TECH, label: "기술" },
];

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mt-20">
        <form onSubmit={handleSubmit} className="px-4 py-10 mx-auto space-y-6 max-w-4xl">
          <div className="pb-4 mb-2 border-b border-gray-200">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full text-xl font-extrabold placeholder-gray-400 text-black bg-transparent md:text-2xl focus:outline-none"
            />
          </div>

          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="부제목 (선택)"
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#007AEB] focus:border-transparent"
          />

          {/* 카테고리 / 공개여부 */}
          <div className="flex flex-wrap items-center gap-3">
            {CATEGORY_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setCategory(option.key)}
                className={`whitespace-nowrap px-4 md:px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 border ${
                  category === option.key
                    ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                    : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                }`}
              >
                {option.label}
              </button>
            ))}
            <label className="flex items-center gap-2 ml-auto text-sm font-semibold text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 accent-[#007AEB]"
              />
              비공개
            </label>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            className="w-full h-64 p-4 text-sm leading-relaxed border border-gray-200 rounded-[15px] resize-vertical focus:outline-none focus:ring-2 focus:ring-[#007AEB] focus:border-transparent"
          />

          {/* 썸네일 */}
          <div className="border border-gray-200 rounded-[15px] p-4">
            <label className="flex justify-between items-center cursor-pointer select-none">
              <span className="text-sm font-semibold text-[#007AEB]">썸네일 이미지</span>
              <span className="text-sm text-gray-500">
                {thumbnail ? thumbnail.name : "선택 안 함"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {/* 본문 이미지 */}
          <div className="border border-gray-200 rounded-[15px] p-4 space-y-2">
            <label className="flex justify-between items-center cursor-pointer select-none">
              <span className="text-sm font-semibold text-[#007AEB]">본문 이미지 추가</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addPending(setImages, Array.from(e.target.files ?? []))}
              />
            </label>
            {existingImageUrls.map((url, index) => (
              <div key={url} className="flex items-center justify-between text-sm text-gray-600">
                <span className="truncate">{blogFileName(url)}</span>
                <button
                  type="button"
                  onClick={() =>
                    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="ml-3 text-xs text-gray-400 hover:text-red-500"
                >
                  제거
                </button>
              </div>
            ))}
            {images.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm text-gray-600">
                <span className="truncate">{item.file.name}</span>
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((f) => f.id !== item.id))}
                  className="ml-3 text-xs text-gray-400 hover:text-red-500"
                >
                  제거
                </button>
              </div>
            ))}
          </div>

          {/* 첨부파일 */}
          <div className="border border-gray-200 rounded-[15px] p-4 space-y-2">
            <label className="flex justify-between items-center cursor-pointer select-none">
              <span className="text-sm font-semibold text-[#007AEB]">첨부파일 추가</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => addPending(setFiles, Array.from(e.target.files ?? []))}
              />
            </label>
            {existingFileUrls.map((url, index) => (
              <div key={url} className="flex items-center justify-between text-sm text-gray-600">
                <span className="truncate">{blogFileName(url)}</span>
                <button
                  type="button"
                  onClick={() => setExistingFileUrls((prev) => prev.filter((_, i) => i !== index))}
                  className="ml-3 text-xs text-gray-400 hover:text-red-500"
                >
                  제거
                </button>
              </div>
            ))}
            {files.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm text-gray-600">
                <span className="truncate">{item.file.name}</span>
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((f) => f.id !== item.id))}
                  className="ml-3 text-xs text-gray-400 hover:text-red-500"
                >
                  제거
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(isEdit ? `/blog/${id}` : "/blog")}
              className="px-7 py-3 text-sm font-semibold text-gray-600 transition-colors rounded-full hover:text-gray-900"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0066c7] transition-colors disabled:bg-gray-300"
            >
              {submitting ? "저장 중..." : isEdit ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default BlogEditPage;
