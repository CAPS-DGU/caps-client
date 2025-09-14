import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function generateReverseYearArray() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 0부터 시작하므로 +1

  // 기본 종료 값 (현재 연도 - 1986)
  let endNumber = currentYear - 1986;

  // 9월(9) 이후면 0.5 추가
  if (currentMonth >= 9) {
    endNumber += 0.5;
  }

  const result: string[] = [];

  // 역순으로 값 추가
  for (let i = endNumber; i >= 1; i -= 0.5) {
    result.push(i.toString());
  }

  return result;
}


export default function OnBoarding() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [generation, setGeneration] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);

  const generations = generateReverseYearArray();

  const validate = () => /^(19|20)\d{8}$/.test(studentId);
  const validatePhone = () => /^\d{10,11}$/.test(phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setError(true);
      return;
    }
    setError(false);
    axios.patch(import.meta.env.VITE_API_HOST + "/api/v1/auth/complete-registration", {
      studentNumber: studentId,
      grade: generation,
      phoneNumber: phone,
    }, {
      withCredentials: true,
    })
      .then((res) => {
        console.log(res.data);
        alert("가입이 완료되었습니다.");
        navigate("/"); // 가입 완료 후 메인 페이지로 이동
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
    // 가입 완료 처리
  };

  return (
    <form
      className="bg-white p-8 rounded-xl shadow max-w-sm mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="font-bold text-2xl mb-4 text-blue-900">CAPS</div>
      <div className="mb-4 text-gray-800 font-semibold">
        정확한 정보 기록을 위해<br />
        학번, 기수를 입력해주세요.
      </div>
      <label className="block mb-2 text-gray-700">학번</label>
      <input
        type="text"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        placeholder="ex. 2025110000"
        className={`w-full p-2 border rounded mb-2 ${!validate() ? "border-red-500" : "border-gray-300"
          }`}
      />
      {!validate() && (
        <div className="text-red-500 text-sm mb-2">
          학번을 정확히 입력해주세요.
        </div>
      )}
      <label className="block mb-2 text-gray-700">전화번호</label>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="ex. 01012345678"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      {!validatePhone() && (
        <div className="text-red-500 text-sm mb-2">
          전화번호를 정확히 입력해주세요.
        </div>
      )}
      <label className="block mb-2 text-gray-700">기수</label>
      <select
        value={generation}
        onChange={(e) => setGeneration(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        disabled={error}
      >
        <option value="">기수를 선택하세요.</option>
        {generations.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className={`w-full p-2 rounded text-white font-bold ${validate() && validatePhone() && generation
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-gray-400 cursor-not-allowed"
          }`}
        disabled={!(validate() && validatePhone() && generation)}
      >
        가입 완료하기
      </button>
    </form>
  );
}
