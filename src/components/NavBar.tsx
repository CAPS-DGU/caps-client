import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const logoBright = new URL("../assets/logo-bright.png", import.meta.url).href;
const logo = new URL("../assets/logo.png", import.meta.url).href;
import { Link } from "react-router-dom";
import LoginModal from "./Login/LoginModal";
import {
  BookOpen,
  Users,
  HelpCircle,
  History as HistoryIcon,
  LogIn,
  User as UserIcon,
  FileText,
  FileWarning,
} from "lucide-react";

interface NavbarProps {
  isTransparent?: boolean;
}

function Navbar({ isTransparent = false }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    user,
    completeRegistration,
    isLoggedIn,
    isLoading,
    error,
    checkLoginStatus,
    manualLogout,
  } = useAuth();

  useEffect(() => {
    if (!completeRegistration && isLoggedIn) {
      navigate("/onboarding");
    }
  }, [user]);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };
  const Logout = () => {
    manualLogout(); // useAuth 훅에서 제공하는 로그아웃 함수 호출
    window.location.reload(); // 페이지를 새로고침
  };
  const closeDropdown = () => {
    setDropdownOpen(null);
  };

  const loginSession = () => {
    const prev_redirect = localStorage.getItem("redirectAfterLogin");

    if (!prev_redirect) {
      const redirectUrl = window.location.pathname; // 현재 URL 저장
      console.log(redirectUrl);
      redirectUrl === "/login"
        ? localStorage.setItem("redirectAfterLogin", "/event")
        : localStorage.setItem("redirectAfterLogin", redirectUrl); // 로컬 스토리지에 저장
    }
  };
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileDropdown = (index) => {
    setMobileDropdownOpen(mobileDropdownOpen === index ? null : index);
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoginModalOpen(true);
  };

  const API_HOST = (import.meta as any).env.VITE_API_HOST as string;
  const handleKakaoLogin = () => {
    window.location.href = `${API_HOST}/oauth2/authorization/kakao`;
  };

  const menuColor = isTransparent
    ? "text-gray-200 hover:text-blue-300"
    : "text-gray-800 hover:text-blue-600";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-30 flex items-center justify-between px-4 md:px-12 py-3 md:py-4 ${
          isTransparent ? "bg-transparent" : "bg-[#FAFAFA]"
        }`}
      >
        {/* 왼쪽: 로고 및 메뉴 */}
        <div className="flex gap-4 items-center md:gap-10">
          <Link to="/">
            <img
              src={isTransparent ? logoBright : logo}
              alt="CAPS Logo"
              className="mr-2 w-12 md:w-16"
            />
          </Link>
          <Link
            to="/wiki"
            className={`flex items-center text-base font-semibold transition ${menuColor}`}
          >
            <span className="hidden md:inline">캡스위키</span>
            <BookOpen className="inline-block md:hidden" size={20} />
          </Link>
          <Link
            to="/aboutus"
            className={`flex items-center text-base font-semibold transition ${menuColor}`}
          >
            <span className="hidden md:inline">집행부 소개</span>
            <Users className="inline-block md:hidden" size={20} />
          </Link>
          <Link
            to="/faq"
            className={`flex items-center text-base font-semibold transition ${menuColor}`}
          >
            <span className="hidden md:inline">FAQ</span>
            <HelpCircle className="inline-block md:hidden" size={20} />
          </Link>
          <Link
            to="/caps-history"
            className={`flex items-center text-base font-semibold transition ${menuColor}`}
          >
            <span className="hidden md:inline">연혁</span>
            <HistoryIcon className="inline-block md:hidden" size={20} />
          </Link>
          {isLoggedIn && (
            <Link
              to="/ledger"
              className={`flex items-center text-base font-semibold transition ${menuColor}`}
            >
              <span className="hidden md:inline">장부게시판</span>
              <FileText className="inline-block md:hidden" size={20} />
            </Link>
          )}
        </div>
        {/* 오른쪽: 로그인/신고/프로필 */}
        <div className="flex gap-4 items-center md:gap-8">
          {isLoggedIn ? (
            <>
              
              {/* 프로필 드롭다운 */}
              <div className="relative">
                <Link
                  to="#"
                  className={`flex items-center text-base font-semibold transition ${menuColor}`}
                  onClick={() => {
                    dropdownOpen == null ? toggleDropdown(4) : closeDropdown();
                  }}
                >
                  <span className="hidden md:inline">
                    {user && (
                      <>
                        {user.grade}기 {user.name}님 환영합니다!
                      </>
                    )}
                  </span>
                  <UserIcon className="inline-block md:hidden" size={22} />
                </Link>
                {dropdownOpen === 4 && (
                  <div className="absolute right-0 z-50 py-2 mt-2 w-40 bg-white rounded-lg shadow-xl">
                    <Link
                      to="#"
                      className="block px-4 py-2 text-xs text-gray-800 hover:bg-gray-200"
                      onClick={Logout}
                    >
                      로그아웃
                    </Link>
                    <Link
                      to="/mypage"
                      className="block px-4 py-2 text-xs text-gray-800 hover:bg-gray-200"
                    >
                      마이페이지
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className={`flex items-center text-base font-semibold transition ${menuColor}`}
                onClick={handleLoginClick}
              >
                <span className="hidden md:inline">로그인</span>
                <LogIn className="inline-block md:hidden" size={22} />
              </button>
              <LoginModal
                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onKakaoLogin={handleKakaoLogin}
              />
            </>
          )}
          {/* 신고 버튼 (로그인 시에만 표시) */}
              <Link
                to="/report"
                className={`flex items-center justify-center w-9 h-9 transition ${menuColor}`}
                title="문의 / 신고"
              >
                <FileWarning size={18} />
              </Link>

        </div>
      </nav>
    </>
  );
}

export default Navbar;
