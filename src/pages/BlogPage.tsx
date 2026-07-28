import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import {
  Pencil,
  Lock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import BlogImage from "../components/Blog/BlogImage";
import logoGradient from "../assets/logo-gradient.png";
import { BLOG_CATEGORIES, blogCategoryLabel } from "../components/Blog/categories";
import { useAuth } from "../hooks/useAuth";
import { useGetBlogs, GetBlogsCategory, BlogListResponse } from "../api/generated/capsApi";

/**
 * 백엔드 OpenAPI 스펙이 목록 응답의 공통 엔벨로프/페이지네이션을 기술하지 않아
 * 생성된 BlogListResponse가 "단일 아이템" 타입으로 나온다.
 * 실제 응답은 { status, message, data: Page<BlogListResponse> } 이므로 여기서 좁혀 쓴다.
 */
interface BlogListPage {
  content?: BlogListResponse[];
  totalPages?: number;
  number?: number;
  totalElements?: number;
}

const FILTERS: { key: "ALL" | GetBlogsCategory; label: string; Icon?: React.ElementType }[] = [
  { key: "ALL", label: "전체" },
  ...BLOG_CATEGORIES.map((c) => ({
    key: c.key as GetBlogsCategory,
    label: c.label,
    Icon: c.Icon,
  })),
];

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}. ${m}. ${day}`;
}

/** 현재 페이지를 중심으로 최대 10개까지만 페이지 번호를 노출한다. */
function pageWindow(current: number, total: number, size = 10): number[] {
  if (total <= size) return Array.from({ length: total }, (_, i) => i + 1);
  let start = Math.max(1, current - Math.floor(size / 2));
  const end = Math.min(total, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [category, setCategory] = useState<"ALL" | GetBlogsCategory>("ALL");
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = useGetBlogs(
    category === "ALL" ? { page } : { page, category }
  );

  const pageData = data?.data as unknown as BlogListPage | undefined;
  const posts = pageData?.content ?? [];
  const totalPages = pageData?.totalPages && pageData.totalPages > 0 ? pageData.totalPages : 1;

  const canWrite = match(user?.role)
    .with("ADMIN", "COUNCIL", "PRESIDENT", () => true)
    .otherwise(() => false);

  const handleCategory = (key: "ALL" | GetBlogsCategory) => {
    setCategory(key);
    setPage(1);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Navbar />
      <div className="pt-20 max-w-3xl mx-auto px-4 md:px-6 pb-24">
        {/* 타이틀 + 작성하기 */}
        <div className="flex flex-col gap-4 pt-10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-black">블로그</h1>
            <p className="mt-3 text-sm md:text-base font-medium text-[#374151]">
              CAPS의 활동과 기술적 인사이트를 텍스트로 기록하고 공유합니다
            </p>
          </div>
          {canWrite && (
            <button
              type="button"
              onClick={() => navigate("/blog/edit")}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[#007AEB] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0069cc] sm:self-auto"
            >
              <Pencil className="h-4 w-4" strokeWidth={2.2} />
              작성하기
            </button>
          )}
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-10 flex flex-nowrap gap-1.5 md:flex-wrap md:gap-2">
          {FILTERS.map((f) => {
            const active = category === f.key;
            return (
              <button
                key={f.key}
                onClick={() => handleCategory(f.key)}
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-bold transition-colors md:gap-1.5 md:px-3.5 md:py-1.5 md:text-sm ${
                  active
                    ? "border-[#007AEB] bg-[#007AEB] text-white"
                    : "border-[#bcbcbc] bg-white text-[#4e4e4e] hover:border-[#007AEB] hover:text-[#007AEB]"
                }`}
              >
                {f.Icon && <f.Icon className="h-3 w-3 md:h-3.5 md:w-3.5" strokeWidth={2} />}
                {f.label}
              </button>
            );
          })}
        </div>

        {/* 목록 */}
        {isLoading ? (
          <p className="text-center text-gray-500 py-20">로딩 중...</p>
        ) : isError ? (
          <p className="text-center text-gray-500 py-20">
            게시물을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : posts.length === 0 ? (
          <p className="py-24 text-center text-lg font-bold tracking-wide text-[#374151]">
            등록된 글이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blog/${post.id}`)}
                className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  post.isPrivate ? "bg-gray-100" : "bg-white"
                }`}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100">
                  <BlogImage
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    fallback={
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <img src={logoGradient} alt="CAPS" className="h-10 w-auto opacity-70" />
                      </div>
                    }
                  />
                  {/* 카테고리 배지 */}
                  <span className="absolute left-3 top-3 rounded-full bg-[#007AEB] px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {blogCategoryLabel(post.category)}
                  </span>
                  {/* 비공개(관리자에게만 노출됨) */}
                  {post.isPrivate && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                      <Lock className="h-8 w-8 text-white/90" strokeWidth={2} />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
                  <div>
                    <h3
                      className={`truncate text-lg font-bold ${
                        post.isPrivate ? "text-gray-600" : "text-black"
                      }`}
                    >
                      {post.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm text-gray-500">
                      {post.subtitle || "\u00A0"}
                    </p>
                  </div>
                  <div
                    className={`mt-auto flex items-center justify-between pt-4 text-xs ${
                      post.isPrivate ? "text-gray-500" : "text-[#9ca3af]"
                    }`}
                  >
                    <span className="truncate">
                      {post.writerGrade ? `${post.writerGrade}기 ` : ""}
                      {post.writerName}
                    </span>
                    <span className="shrink-0">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {!isLoading && !isError && totalPages > 1 && (
          <nav className="mt-14 flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-500">
            <button
              onClick={() => setPage(1)}
              disabled={page <= 1}
              aria-label="첫 페이지"
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:text-gray-300"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="이전 페이지"
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pageWindow(page, totalPages).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-current={p === page ? "page" : undefined}
                className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                  p === page
                    ? "bg-[#007AEB] text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              aria-label="다음 페이지"
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:text-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
              aria-label="마지막 페이지"
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:text-gray-300"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
