import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StudyData } from "../types/pages";

interface StudyFormData {
  title: string;
  category: string;
  description: string;
  day:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  location: string;
  type: "ONLINE" | "OFFLINE";
  maxParticipants: number;
}

interface StudyFormErrors {
  title?: string;
  category?: string;
  description?: string;
  day?: string;
  location?: string;
  type?: string;
  maxParticipants?: string;
}

const StudyEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudyFormData>({
    title: "",
    category: "",
    description: "",
    day: "MONDAY",
    location: "",
    type: "OFFLINE",
    maxParticipants: 1,
  });
  const [errors, setErrors] = useState<StudyFormErrors>({});
  const [loading, setLoading] = useState(true);

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

        const study = response.data;
        setFormData({
          title: study.title,
          category: study.category,
          description: study.description,
          day: study.day,
          location: study.location,
          type: study.type,
          maxParticipants: study.maxParticipants,
        });
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          alert(
            err.response.data.message ||
              "스터디 정보를 불러오는데 실패했습니다."
          );
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
        }
        navigate("/study");
      } finally {
        setLoading(false);
      }
    };

    fetchStudy();
  }, [id, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxParticipants" ? parseInt(value) : value,
    }));
  };

  const validateForm = () => {
    const newErrors: StudyFormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "스터디 제목을 입력해주세요.";
    }

    if (!formData.category.trim()) {
      newErrors.category = "카테고리를 입력해주세요.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "스터디 설명을 입력해주세요.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "장소를 입력해주세요.";
    }

    if (formData.maxParticipants < 1) {
      newErrors.maxParticipants = "최대 참여 인원은 1명 이상이어야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await axios.put<StudyData>(
        `/api/study/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("스터디가 수정되었습니다.");
        navigate(`/study/${id}`);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message || "스터디 수정에 실패했습니다.");
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

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-center">스터디 수정</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">스터디 제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">카테고리</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">스터디 설명</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">요일</label>
            <select
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="MONDAY">월요일</option>
              <option value="TUESDAY">화요일</option>
              <option value="WEDNESDAY">수요일</option>
              <option value="THURSDAY">목요일</option>
              <option value="FRIDAY">금요일</option>
              <option value="SATURDAY">토요일</option>
              <option value="SUNDAY">일요일</option>
            </select>
            {errors.day && <p className="text-sm text-red-500">{errors.day}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">장소</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">유형</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="OFFLINE">오프라인</option>
              <option value="ONLINE">온라인</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">최대 참여 인원</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              min="1"
              className="w-full p-2 border rounded"
            />
            {errors.maxParticipants && (
              <p className="text-sm text-red-500">{errors.maxParticipants}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            수정 완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudyEditPage;
