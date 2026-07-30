import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { match } from "ts-pattern";
import axios from "axios";
import { ChevronLeft, Lock } from "lucide-react";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import BlogImage from "../components/Blog/BlogImage";
import MarkdownView from "../components/Blog/MarkdownView";
import AttachmentList from "../components/common/AttachmentList";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import { BLOG_CATEGORY_MAP, blogCategoryLabel } from "../components/Blog/categories";
import { useAuth } from "../hooks/useAuth";
import { resolveBlogFileUrl, blogFileName } from "../utils/blogFiles";
import {
  useGetBlog,
  useDeleteBlog,
  getGetBlogsQueryKey,
  BlogDetailResponse,
} from "../api/generated/capsApi";

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}. ${m}. ${day}`;
}

function errorMessageOf(error: unknown): string {
  if (axios.isAxiosError(error) && error.response) {
    if (error.response.status === 403) return "비공개 처리된 게시물입니다.";
    if (error.response.status === 404) return "존재하지 않는 게시물입니다.";
  }
  return "게시물을 불러오지 못했습니다.";
}

const BlogDetailPage: React.FC = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const id = Number(blogId);
  const { data, isLoading, isError, error } = useGetBlog(id, {
    query: { enabled: Number.isFinite(id) },
  });
  const { mutateAsync: removeBlog, isPending: isDeleting } = useDeleteBlog();
  const [loadingFile, setLoadingFile] = useState<string | null>(null);

  const post = data?.data as BlogDetailResponse | undefined;
  const cat = post?.category ? BLOG_CATEGORY_MAP[post.category] : undefined;
  // 본문 마크다운에 이미 인라인으로 들어간 이미지는 하단 갤러리에서 제외(중복 방지)
  const leftoverImages = (post?.imageUrls ?? []).filter(
    (u) => !(post?.content ?? "").includes(u)
  );

  // 첨부는 저장된 값이 S3 key 일 수 있어 클릭 시점에 열 수 있는 주소로 바꿔서 내려받는다
  const handleFileClick = async (fileUrl: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (loadingFile === fileUrl) return;
    try {
      setLoadingFile(fileUrl);
      const url = await resolveBlogFileUrl(fileUrl);
      const link = document.createElement("a");
      link.href = url;
      link.download = blogFileName(fileUrl);
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("파일 다운로드 실패:", error);
      alert("파일 다운로드에 실패했습니다.");
    } finally {
      setLoadingFile(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("이 게시물을 삭제할까요? 되돌릴 수 없습니다.")) return;
    try {
      await removeBlog({ blogId: id });
      await queryClient.invalidateQueries({ queryKey: getGetBlogsQueryKey() });
      navigate("/blog");
    } catch (e) {
      console.error("블로그 삭제 실패:", e);
      alert(
        axios.isAxiosError(e) && e.response?.status === 403
          ? "게시물을 삭제할 권한이 없습니다."
          : "게시물 삭제에 실패했습니다."
      );
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Navbar />
      <div className="pt-20 max-w-3xl mx-auto px-4 md:px-6 pb-24">
        <button
          onClick={() => navigate("/blog")}
          className="mt-8 mb-8 inline-flex items-center gap-1 text-sm font-semibold text-gray-500 transition-colors hover:text-[#007AEB]"
        >
          <ChevronLeft className="h-4 w-4" />
          목록으로
        </button>

        {isLoading ? (
          <p className="text-center text-gray-500 py-20">로딩 중...</p>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="mb-6 text-gray-500">{errorMessageOf(error)}</p>
            <button
              onClick={() => navigate("/blog")}
              className="rounded-full bg-[#007AEB] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0069cc]"
            >
              블로그로 돌아가기
            </button>
          </div>
        ) : post ? (
          <article>
            {/* 카테고리 + 수정/삭제 */}
            <div className="mb-5 flex items-center justify-between gap-4">
              {cat ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#007AEB]/10 px-3.5 py-1.5 text-sm font-bold text-[#007AEB]">
                  <cat.Icon className="h-4 w-4" strokeWidth={2} />
                  {cat.label}
                </span>
              ) : (
                <span className="inline-block rounded-lg bg-[#007AEB]/10 px-3.5 py-1.5 text-sm font-bold text-[#007AEB]">
                  {blogCategoryLabel(post.category)}
                </span>
              )}
              {match(user?.role)
                .with("ADMIN", "COUNCIL", "PRESIDENT", () => (
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => navigate(`/blog/${id}/edit`)}
                      className="rounded-full bg-[#007AEB] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0069cc]"
                    >
                      수정
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="rounded-full border border-gray-300 px-5 py-2 text-sm font-bold text-gray-600 transition-colors hover:border-red-400 hover:text-red-500 disabled:opacity-50"
                    >
                      {isDeleting ? "삭제 중..." : "삭제"}
                    </button>
                  </div>
                ))
                .otherwise(() => null)}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold leading-snug text-black">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="mt-3 text-lg font-medium text-[#374151]">{post.subtitle}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-6 text-sm text-gray-400">
              <span className="font-medium text-gray-500">
                {post.writerGrade ? `${post.writerGrade}기 ` : ""}
                {post.writerName}
              </span>
              <span>·</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.isPrivate && (
                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                  <Lock className="h-3 w-3" strokeWidth={2.2} />
                  비공개
                </span>
              )}
            </div>

            {/* 본문: 마크다운 렌더 (인라인 이미지는 삽입 위치에 그대로 표시) */}
            <MarkdownView content={post.content ?? ""} className="mt-8" />

            {/* 본문에 인라인으로 포함되지 않은 이미지(레거시 게시물 보강)만 하단에 렌더 */}
            {leftoverImages.length > 0 && (
              <div className="mt-8 flex flex-col gap-4">
                {leftoverImages.map((url, i) => (
                  <BlogImage
                    key={i}
                    src={url}
                    alt={`${post.title} 이미지 ${i + 1}`}
                    className="w-full rounded-xl"
                  />
                ))}
              </div>
            )}

            {post.fileUrls && post.fileUrls.length > 0 && (
              <div className="mt-10 border-t border-gray-200 pt-6">
                <section className="w-full rounded-xl border border-gray-200 bg-white p-4 lg:max-w-[348px]">
                  <p className="text-sm font-bold text-gray-700">첨부파일</p>
                  <AttachmentList
                    className="mt-3"
                    items={post.fileUrls.map((url, i) => ({
                      id: `${url}-${i}`,
                      name: blogFileName(url) || `첨부파일 ${i + 1}`,
                      loading: loadingFile === url,
                      onClick: (e) => handleFileClick(url, e),
                    }))}
                  />
                </section>
              </div>
            )}
          </article>
        ) : null}
      </div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default BlogDetailPage;
