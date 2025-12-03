import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import LedgerBoard from "../components/LedgerBoard/LedgerBoard";

const LedgerBoardPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <main className="flex-1 mt-20">
        <LedgerBoard />
      </main>
      <Footer />
    </div>
  );
};

export default LedgerBoardPage;
