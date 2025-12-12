import React, { useState } from "react";
import axios from "axios";

interface LoginErrors {
  id?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  const loginFunction = async () => {
    try {
      const response = await axios.post("/api/auth/login", {
        userId: id,
        password: password,
      });
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        window.location.href = "/";
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.details);
      }
      throw err;
    }
  };

  const validateForm = () => {
    const newErrors: LoginErrors = {};

    // 아이디 유효성 검사
    if (!id) {
      newErrors.id = "아이디를 입력해주세요.";
    }

    // 비밀번호 유효성 검사
    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      loginFunction();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="mb-6 text-2xl font-bold">로그인</h2>

        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="id"
          >
            아이디
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="id"
            type="text"
            placeholder="아이디를 입력하세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          {errors.id && (
            <p className="text-xs italic text-red-500">{errors.id}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="password"
          >
            비밀번호
          </label>
          <input
            className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-xs italic text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="w-full h-10 text-white bg-gray-600 rounded-md shadow-md cursor-pointer md:h-12 md:text-lg hover:underline hover:bg-gray-700"
            type="submit"
          >
            로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
