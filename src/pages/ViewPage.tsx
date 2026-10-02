import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BoardPost } from "../types/pages";

const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BoardPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const response = await axios.get<BoardPost>(`/api/board/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPost(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            err.response.data.message || "게시글을 불러오는데 실패했습니다."
          );
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 text-gray-500 bg-gray-100 rounded-lg">
          게시글을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="mb-4 text-2xl font-bold">{post.title}</h1>

          <div className="flex items-center justify-between mb-6 text-gray-600">
            <div>
              <span>작성자: {post.writer.name}</span>
              <span className="mx-2">|</span>
              <span>조회수: {post.hit}</span>
              <span className="mx-2">|</span>
              <span>좋아요: {post.like}</span>
            </div>
            <div>{post.time}</div>
          </div>

          <div className="mb-8 prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {post.files.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-2 text-lg font-semibold">첨부 파일</h2>
              <ul className="space-y-1">
                {post.files.map((file) => (
                  <li key={file.fileId}>
                    <a
                      href={`/api/file/${file.fileId}`}
                      className="text-blue-500 hover:underline"
                      download
                    >
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {post.comment.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold">댓글</h2>
              <div className="space-y-4">
                {post.comment.map((comment) => (
                  <div key={comment.id} className="p-4 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">작성자 {comment.userId}</div>
                      <div className="text-sm text-gray-500">
                        {comment.time}
                      </div>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
