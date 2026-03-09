import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { StudyData } from "../types/pages";

const StudyPage: React.FC = () => {
  const [studies, setStudies] = useState<StudyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        const response = await axios.get<StudyData[]>("/api/study", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudies(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(
            err.response.data.message ||
              "스터디 목록을 불러오는데 실패했습니다."
          );
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
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
      <div className="w-full max-w-4xl">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">스터디 목록</h1>
          <Link
            to="/study/create"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            스터디 생성
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <Link
              key={study.id}
              to={`/study/${study.id}`}
              className="p-4 transition-transform duration-200 transform bg-white rounded-lg shadow hover:scale-105"
            >
              <h2 className="mb-2 text-xl font-semibold">{study.title}</h2>
              <p className="mb-2 text-gray-600">{study.category}</p>
              <p className="mb-2 text-sm text-gray-500">
                {study.day} / {study.type} / {study.location}
              </p>
              <p className="text-sm text-gray-500">
                참여자: {study.participants.length} / {study.maxParticipants}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyPage;
