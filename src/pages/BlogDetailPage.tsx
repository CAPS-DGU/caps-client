import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import { apiGet } from "../utils/Api";

interface BlogDetail {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  isPrivate: boolean;
  writerGrade: number;
  writerName: string;
  createdAt: string;
  fileUrls: string[];
  imageUrls: string[];
}

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

const BlogDetailPage: React.FC = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let ignore = false;
    const fetchPost = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await apiGet(`/api/v1/blogs/${blogId}`);
        if (ignore) return;
        setPost(res.data?.data ?? null);
      } catch (e) {
        if (ignore) return;
        console.error("블로그 상세 조회 실패:", e);
        let msg = "게시물을 불러오지 못했습니다.";
        if (axios.isAxiosError(e) && e.response) {
          if (e.response.status === 403) msg = "비공개 처리된 게시물입니다.";
          else if (e.response.status === 404) msg = "존재하지 않는 게시물입니다.";
        }
        setErrorMsg(msg);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchPost();
    return () => {
      ignore = true;
    };
  }, [blogId]);

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

        {loading ? (
          <p className="text-center text-gray-500 py-20">로딩 중...</p>
        ) : errorMsg ? (
          <div className="text-center py-20">
            <p className="mb-6 text-gray-500">{errorMsg}</p>
            <button
              onClick={() => navigate("/blog")}
              className="rounded-full bg-[#007AEB] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0079ebcc]"
            >
              블로그로 돌아가기
            </button>
          </div>
        ) : post ? (
          <article>
            <span className="mb-4 inline-block rounded-full bg-blue-500 px-3 py-0.5 text-xs font-semibold text-white">
              {CATEGORY_LABEL[post.category] ?? post.category}
            </span>
            <h1 className="mb-3 text-2xl md:text-3xl font-bold text-black">{post.title}</h1>
            {post.subtitle && <p className="mb-4 text-lg text-gray-600">{post.subtitle}</p>}
            <div className="mb-8 flex items-center gap-2 border-b border-gray-200 pb-6 text-sm text-gray-400">
              <span>
                {post.writerName}
                {post.writerGrade ? ` · ${post.writerGrade}기` : ""}
              </span>
              <span>·</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>

            {post.imageUrls?.length > 0 && (
              <div className="mb-8 flex flex-col gap-4">
                {post.imageUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${post.title} 이미지 ${i + 1}`}
                    className="w-full rounded-lg"
                  />
                ))}
              </div>
            )}

            <div className="whitespace-pre-wrap leading-relaxed text-gray-800">{post.content}</div>

            {post.fileUrls?.length > 0 && (
              <div className="mt-10 border-t border-gray-200 pt-6">
                <p className="mb-3 text-sm font-semibold text-gray-700">첨부파일</p>
                <ul className="flex flex-col gap-2">
                  {post.fileUrls.map((url, i) => (
                    <li key={i}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-sm text-blue-600 hover:underline"
                      >
                        {url.split("/").pop() || `첨부파일 ${i + 1}`}
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
