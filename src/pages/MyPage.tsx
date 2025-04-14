import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../types/common";

interface MyPageProps {}

const MyPage: React.FC<MyPageProps> = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const response = await axios.get<User>("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            err.response.data.message ||
              "사용자 정보를 불러오는데 실패했습니다."
          );
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 text-gray-500 bg-gray-100 rounded-lg">
          사용자 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">마이페이지</h1>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            이름
          </label>
          <p className="p-2 bg-gray-100 rounded">{user.name}</p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            아이디
          </label>
          <p className="p-2 bg-gray-100 rounded">{user.id}</p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            이메일
          </label>
          <p className="p-2 bg-gray-100 rounded">{user.email}</p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            기수
          </label>
          <p className="p-2 bg-gray-100 rounded">{user.grade}</p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            역할
          </label>
          <p className="p-2 bg-gray-100 rounded">{user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
