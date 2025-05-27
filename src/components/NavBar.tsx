import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);
  const [profileName, setProfileName] = useState(""); // 프로필 이름 관리
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isLoggedIn, isLoading, error, checkLoginStatus, manualLogout } = useAuth();

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
  const login = () => {
    navigate("/login", { state: { from: location } });
  };
  return (
    <nav className="p-4 bg-black">
      <div className="container mx-auto">
        {/* Logo */}
        <div className="flex justify-center">
          <a href="/wiki" className="block">
            <img
              src="/new-club-logo-white-small.png"
              alt="Logo"
              className="h-12 mx-auto"
            />
          </a>
        </div>

        {/* Menu Items for Desktop */}
        <div className="justify-center mt-4 space-x-6 flex">
          <div className="relative">
            <a href="/wiki" className="text-white hover:text-gray-400">
              캡스위키
            </a>
          </div>

          {/*로그인*/}
          <div className="relative">
            {isLoggedIn ? (
              <a
                href="/mypage"
                className="text-white hover:text-gray-400"
                onMouseEnter={() => toggleDropdown(4)}
              >
                {user &&
                  <>{user.member.grade}기 {user.member.name}님 환영합니다!</>
                }
              </a>
            ) : (
              <a
                href="#"
                onClick={login}
                className="text-white hover:text-gray-400"
              >
                LOGIN
              </a>
            )}
            {dropdownOpen === 4 && (
              <div className="absolute z-50 w-40 py-2 mt-2 bg-white rounded-lg shadow-xl">
                <a
                  href="#"
                  className="block px-4 py-2 text-xs text-gray-800 hover:bg-gray-200"
                  onClick={Logout}
                >
                  LOGOUT
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
