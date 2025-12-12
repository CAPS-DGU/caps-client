import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../types/common";

interface RankingUser extends User {
  score: number;
  rank: number;
}

const RankingPage: React.FC = () => {
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const response = await axios.get<RankingUser[]>("/api/ranking", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            err.response.data.message || "랭킹 정보를 불러오는데 실패했습니다."
          );
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
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

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="mb-6 text-2xl font-bold">랭킹</h1>
      <div className="w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="text-sm font-medium text-left text-gray-700 bg-gray-100">
              <th className="px-6 py-4">순위</th>
              <th className="px-6 py-4">이름</th>
              <th className="px-6 py-4">기수</th>
              <th className="px-6 py-4">점수</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user.id} className="text-gray-600">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.grade}</td>
                <td className="px-6 py-4">{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingPage;
