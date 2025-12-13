import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { match } from "ts-pattern";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import {
  LedgerDetailHeader,
  LedgerDetailMeta,
  LedgerDetailContent,
  LedgerDeleteModal,
} from "../components/Ledger/LedgerComponents";
import { apiDeleteWithToken, apiGetWithToken } from "../utils/Api";
import { useAuth } from "../hooks/useAuth";

interface LedgerMember {
  id: number;
  name: string;
  profileImageUrl: string;
  grade: number;
}

interface LedgerDetailData {
  id: number;
  title: string;
  content: string;
  fileUrl: string | null;
  member: LedgerMember;
  createdAt: string;
  isPinned: boolean;
}

interface LedgerDetailResponse {
  status: number;
  message: string;
  data: LedgerDetailData;
}

interface JwtPayload {
  role?: string;
  [key: string]: any;
}

const LedgerDetailPage: React.FC = () => {
  const { ledgerId } = useParams<{ ledgerId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [ledger, setLedger] = useState<LedgerDetailData | null>(null);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}. ${month}. ${day} ${hours}:${minutes}`;
  };

  const parseJwt = (token: string | null): JwtPayload | null => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid JWT", error);
      return null;
    }
  };

  // 회원이 아니면 접근 차단
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/");
    }
  }, [isLoading, isLoggedIn, navigate]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const decoded = parseJwt(accessToken);
    if (decoded && decoded.role) {
      setUserRole(decoded.role);
    }
  }, []);

  useEffect(() => {
    const fetchLedgerDetail = async () => {
      if (!ledgerId) return;
      try {
        const res = await apiGetWithToken(
          `/api/v1/ledgers/${ledgerId}`,
          navigate
        );
        const body = res.data as LedgerDetailResponse;
        setLedger(body.data);
      } catch (error) {
        console.error("장부 상세 조회 실패:", error);
      }
    };

    fetchLedgerDetail();
  }, [ledgerId, navigate]);

  const handleDeleteConfirm = async () => {
    if (!ledgerId) return;

    try {
      await apiDeleteWithToken(`/api/v1/ledgers/${ledgerId}`, navigate);
      setIsDeleteOpen(false);
      setIsDeleteSuccessOpen(true);
    } catch (error) {
      console.error("장부 삭제 실패:", error);
      alert("장부 삭제 중 오류가 발생했습니다.");
    }
  };

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
      <main className="flex-1 mt-20 bg-transparent">
        <div className="px-4 py-10 mx-auto max-w-4xl">
          <LedgerDetailHeader
            ledgerId={ledgerId}
            title={ledger?.title ?? "장부 제목"}
            onEdit={match(userRole)
              .with("ADMIN", "COUNCIL", "PRESIDENT", () => () => {
                navigate(`/ledger/${ledgerId}/edit`);
              })
              .otherwise(() => undefined)}
            onDelete={match(userRole)
              .with(
                "ADMIN",
                "COUNCIL",
                "PRESIDENT",
                () => () => setIsDeleteOpen(true)
              )
              .otherwise(() => undefined)}
          />

          {/* 본문 영역 */}
          <section className="space-y-4">
            <LedgerDetailMeta
              author={ledger?.member.name ?? ""}
              term={ledger?.member.grade ? `${ledger.member.grade}기` : ""}
              date={ledger ? formatDateTime(ledger.createdAt) : ""}
              fileName={ledger?.fileUrl ?? undefined}
            />
            <LedgerDetailContent content={ledger?.content ?? ""} />
          </section>

          {/* 하단 목록 버튼 */}
          <div className="flex justify-start mt-8">
            <button
              type="button"
              className="px-7 py-3 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0066c7] transition-colors"
              onClick={() => navigate("/ledger")}
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
      {isDeleteSuccessOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
          <div className="px-6 py-6 space-y-6 w-full max-w-md text-center bg-white rounded-2xl shadow-lg md:px-8 md:py-7">
            <h2 className="text-xl font-extrabold text-gray-900">
              장부가 삭제되었습니다.
            </h2>
            <p className="text-sm text-gray-600">
              확인을 누르면 장부 목록으로 이동합니다.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsDeleteSuccessOpen(false);
                navigate("/ledger");
              }}
              className="px-7 py-3 text-sm font-semibold text-white bg-[#007AEB] rounded-full hover:bg-[#0066c7] transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LedgerDetailPage;
