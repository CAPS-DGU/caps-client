import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StudyData } from "../types/pages";
import { User } from "../types/common";

interface StudyManagerPageProps {}

const StudyManagerPage: React.FC<StudyManagerPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [study, setStudy] = useState<StudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const response = await axios.get<StudyData>(`/api/study/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudy(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            err.response.data.message ||
              "스터디 정보를 불러오는데 실패했습니다."
          );
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudy();
  }, [id]);

  const handleKickUser = async (userId: string) => {
    if (!window.confirm("정말로 이 사용자를 강퇴하시겠습니까?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await axios.post(
        `/api/study/${id}/kick/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("사용자가 강퇴되었습니다.");
        // 스터디 정보 다시 불러오기
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message || "사용자 강퇴에 실패했습니다.");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

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

  if (!study) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 text-gray-500 bg-gray-100 rounded-lg">
          스터디를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-center">
          {study.title} 관리
        </h1>

        <div className="p-4 mb-4 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-semibold">참여자 관리</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-100">
                  <th className="p-2">이름</th>
                  <th className="p-2">기수</th>
                  <th className="p-2">이메일</th>
                  <th className="p-2">관리</th>
                </tr>
              </thead>
              <tbody>
                {study.participants.map((participant) => (
                  <tr key={participant.id} className="border-b">
                    <td className="p-2">{participant.name}</td>
                    <td className="p-2">{participant.grade}</td>
                    <td className="p-2">{participant.email}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleKickUser(participant.id)}
                        className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        강퇴
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/study/${id}`)}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyManagerPage;
