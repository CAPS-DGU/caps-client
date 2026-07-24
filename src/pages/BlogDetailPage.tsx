import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { match } from "ts-pattern";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import BlogImage from "../components/Blog/BlogImage";
import { useAuth } from "../hooks/useAuth";
import { resolveBlogFileUrl, blogFileName } from "../utils/blogFiles";
import {
  useGetBlog,
  useDeleteBlog,
  getGetBlogsQueryKey,
  BlogDetailResponse,
} from "../api/generated/capsApi";

const CATEGORY_LABEL: Record<string, string> = {
  EVENTS: "행사",
  ACADEMIC: "학술",
  TECH: "기술",
};

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
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
      <div className="pt-20 max-w-3xl mx-auto px-4 pb-20">
        <button
          onClick={() => navigate("/blog")}
          className="mt-6 mb-8 text-sm font-semibold text-gray-500 transition-colors hover:text-blue-600"
        >
          ← 목록으로
        </button>

        {isLoading ? (
          <p className="text-center text-gray-500 py-20">로딩 중...</p>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="mb-6 text-gray-500">{errorMessageOf(error)}</p>
            <button
              onClick={() => navigate("/blog")}
              className="rounded-full bg-[#007AEB] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0079ebcc]"
            >
              블로그로 돌아가기
            </button>
          </div>
        ) : post ? (
          <article>
            <div className="mb-4 flex items-start justify-between gap-4">
              <span className="inline-block rounded-full bg-blue-500 px-3 py-0.5 text-xs font-semibold text-white">
                {CATEGORY_LABEL[post.category ?? ""] ?? post.category}
              </span>
              {match(user?.role)
                .with("ADMIN", "COUNCIL", "PRESIDENT", () => (
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      onClick={() => navigate(`/blog/${id}/edit`)}
                      className="text-sm font-semibold text-gray-600 transition-colors hover:text-blue-600"
                    >
                      수정
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-sm font-semibold text-gray-600 transition-colors hover:text-red-600 disabled:text-gray-300"
                    >
                      {isDeleting ? "삭제 중..." : "삭제"}
                    </button>
                  </div>
                ))
                .otherwise(() => null)}
            </div>

            <h1 className="mb-3 text-2xl md:text-3xl font-bold text-black">{post.title}</h1>
            {post.subtitle && <p className="mb-4 text-lg text-gray-600">{post.subtitle}</p>}
            <div className="mb-8 flex items-center gap-2 border-b border-gray-200 pb-6 text-sm text-gray-400">
              <span>
                {post.writerName}
                {post.writerGrade ? ` · ${post.writerGrade}기` : ""}
              </span>
              <span>·</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.isPrivate && (
                <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                  비공개
                </span>
              )}
            </div>

            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="mb-8 flex flex-col gap-4">
                {post.imageUrls.map((url, i) => (
                  <BlogImage
                    key={i}
                    src={url}
                    alt={`${post.title} 이미지 ${i + 1}`}
                    className="w-full rounded-lg"
                  />
                ))}
              </div>
            )}

            <div className="whitespace-pre-wrap leading-relaxed text-gray-800">{post.content}</div>

            {post.fileUrls && post.fileUrls.length > 0 && (
              <div className="mt-10 border-t border-gray-200 pt-6">
                <p className="mb-3 text-sm font-semibold text-gray-700">첨부파일</p>
                <ul className="flex flex-col gap-2">
                  {post.fileUrls.map((url, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        onClick={(e) => handleFileClick(url, e)}
                        className="break-all text-sm text-blue-600 hover:underline"
                      >
                        {loadingFile === url
                          ? "불러오는 중..."
                          : blogFileName(url) || `첨부파일 ${i + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
