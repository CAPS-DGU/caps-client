import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import {
  LedgerDetailHeader,
  LedgerDetailMeta,
  LedgerDetailContent,
  LedgerDeleteModal,
} from "../components/Ledger/LedgerComponents";

const LedgerDetailPage: React.FC = () => {
  const { ledgerId } = useParams<{ ledgerId: string }>();
  const navigate = useNavigate();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteConfirm = () => {
    // TODO: 실제 삭제 API 연동 후 성공 시 목록으로 이동
    setIsDeleteOpen(false);
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 mt-20">
        <div className="px-4 py-10 mx-auto max-w-4xl">
          <LedgerDetailHeader
            ledgerId={ledgerId}
            title="장부 제목"
            onEdit={() => {
              navigate(`/ledger/${ledgerId}/edit`);
            }}
            onDelete={() => setIsDeleteOpen(true)}
          />

          {/* 본문 영역 */}
          <section className="space-y-4">
            <LedgerDetailMeta
              author="김캡스"
              term="39.5기"
              date="2025. 01. 01 18:00"
              fileName="CAPS.pdf"
            />
            <LedgerDetailContent />
          </section>

          {/* 하단 목록 버튼 */}
          <div className="flex justify-start mt-8">
            <button
              type="button"
              className="px-7 py-3 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0066c7] transition-colors"
              onClick={() => navigate(-1)}
            >
              목록
            </button>
          </div>
        </div>
      </main>
      <Footer />

      <LedgerDeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default LedgerDetailPage;
