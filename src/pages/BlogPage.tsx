import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import { apiGet } from "../utils/Api";

interface BlogListItem {
  id: number;
  title: string;
  subtitle: string;
  thumbnailUrl: string | null;
  category: string;
  isPrivate: boolean;
  writerGrade: number;
  writerName: string;
  createdAt: string;
}

const CATEGORIES = [
  { key: "ALL", label: "전체" },
  { key: "EVENTS", label: "행사" },
  { key: "ACADEMIC", label: "학술" },
  { key: "TECH", label: "기술" },
] as const;

const CATEGORY_LABEL: Record<string, string> = {
  EVENTS: "행사",
  ACADEMIC: "학술",
  TECH: "기술",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [category, setCategory] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    const fetchPosts = async () => {
      setLoading(true);
      setError(false);
      try {
        const query = new URLSearchParams();
        query.set("page", String(page));
        if (category !== "ALL") query.set("category", category);
        const res = await apiGet(`/api/v1/blogs?${query.toString()}`);
        if (ignore) return;
        const body = res.data?.data;
        setPosts(body?.content ?? []);
        setTotalPages(body?.totalPages && body.totalPages > 0 ? body.totalPages : 1);
      } catch (e) {
        if (ignore) return;
        console.error("블로그 목록 조회 실패:", e);
        setError(true);
        setPosts([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchPosts();
    return () => {
      ignore = true;
    };
  }, [category, page]);

  const handleCategory = (key: string) => {
    setCategory(key);
    setPage(1);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Navbar />
      <div className="pt-20 max-w-5xl mx-auto px-4 pb-20">
        {/* 타이틀 */}
        <div className="pt-8 pb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">블로그</h1>
          <p className="text-gray-500">CAPS의 활동과 소식을 전합니다.</p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((c) => {
            const active = category === c.key;
            return (
              <button
                key={c.key}
                onClick={() => handleCategory(c.key)}
                className={`whitespace-nowrap px-4 md:px-5 py-2 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 border ${
                  active
                    ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                    : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* 목록 */}
        {loading ? (
          <p className="text-center text-gray-500 py-20">로딩 중...</p>
        ) : error ? (
          <p className="text-center text-gray-500 py-20">
            게시물을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400 py-20">아직 등록된 게시물이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blog/${post.id}`)}
                className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="h-44 w-full overflow-hidden bg-gray-100">
                  {post.thumbnailUrl ? (
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm tracking-widest text-gray-300">
                      CAPS
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <span className="mb-2 inline-block rounded-full bg-blue-500 px-3 py-0.5 text-xs font-semibold text-white">
                    {CATEGORY_LABEL[post.category] ?? post.category}
                  </span>
                  <h3 className="truncate text-base font-semibold text-black">{post.title}</h3>
                  {post.subtitle && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{post.subtitle}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span className="truncate">
                      {post.writerName}
                      {post.writerGrade ? ` · ${post.writerGrade}기` : ""}
                    </span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900 disabled:text-gray-300"
            >
              이전
            </button>
            <div className="flex items-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`text-sm font-semibold transition-colors ${
                    p === page ? "text-blue-500" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900 disabled:text-gray-300"
            >
              다음
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
