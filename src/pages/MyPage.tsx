import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../contexts/UserContext";
import NavBar from "../components/NavBar";

interface MyPageProps { }

const MyPage: React.FC<MyPageProps> = () => {
  const { user, isLoading} = useUser();


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
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
      <NavBar />
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
            기수
          </label>
          <p className="p-2 bg-gray-100 rounded">{user.grade}</p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            이메일
          </label>
          <p className="p-2 bg-gray-100 rounded">{user.email}</p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            전화번호
          </label>
          <p className="p-2 bg-gray-100 rounded">{user.phoneNumber}</p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            학번
          </label>
          <p className="p-2 bg-gray-100 rounded">{user.studentNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
