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

  if (isLoading || !isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="flex-1 pt-20">
        <LedgerBoard />
      </main>
      <Footer />
    </div>
  );
};

export default LedgerBoardPage;
