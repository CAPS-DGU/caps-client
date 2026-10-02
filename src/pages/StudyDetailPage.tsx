import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StudyData } from "../types/pages";

const StudyDetailPage: React.FC = () => {
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

  const handleJoin = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await axios.post(
        `/api/study/${id}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("스터디 참여가 완료되었습니다.");
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message || "스터디 참여에 실패했습니다.");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/study/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 스터디를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await axios.delete(`/api/study/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("스터디가 삭제되었습니다.");
        navigate("/study");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message || "스터디 삭제에 실패했습니다.");
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
        <h1 className="mb-6 text-2xl font-bold">{study.title}</h1>

        <div className="p-4 mb-4 bg-white rounded-lg shadow">
          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">카테고리</h2>
            <p>{study.category}</p>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">설명</h2>
            <p className="whitespace-pre-wrap">{study.description}</p>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">요일</h2>
            <p>{study.day}</p>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">장소</h2>
            <p>{study.location}</p>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">유형</h2>
            <p>{study.type}</p>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">참여자</h2>
            <p>
              {study.participants.length} / {study.maxParticipants}
            </p>
            <ul className="mt-2 space-y-1">
              {study.participants.map((participant) => (
                <li key={participant.id}>
                  {participant.name} ({participant.grade}기)
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleJoin}
            className="flex-1 p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            disabled={study.participants.length >= study.maxParticipants}
          >
            참여하기
          </button>
          <button
            onClick={handleEdit}
            className="flex-1 p-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            수정하기
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 p-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyDetailPage;
