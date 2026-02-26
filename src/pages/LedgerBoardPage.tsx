import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import LedgerBoard from "../components/LedgerBoard/LedgerBoard";
import { useAuth } from "../hooks/useAuth";

const LedgerBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth();

  // 회원이 아니면 접근 차단
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/");
    }
  }, [isLoading, isLoggedIn, navigate]);

  // 로딩 중이거나 로그인하지 않은 경우 아무것도 렌더링하지 않음
  if (isLoading || !isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 mt-20 bg-transparent">
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mt-20">
        <LedgerBoard />
      </main>
      <Footer />
    </div>
  );
};

export default LedgerBoardPage;
