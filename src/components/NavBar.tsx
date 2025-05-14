import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [profileName, setProfileName] = useState(""); // 프로필 이름 관리
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // localStorage에서 로그인 상태 확인
    const token = localStorage.getItem("accessToken");
    const name = localStorage.getItem("profilename");

    if (token && name) {
      setIsLoggedIn(true);
      setProfileName(name);
    } else {
      setIsLoggedIn(false); // 토큰이 없으면 로그인 상태를 false로 설정
    }
  }, [location]); // location을 의존성 배열에 추가
  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };
  const Logout = () => {
    localStorage.clear();
    setIsLoggedIn(false); // 로그인 상태를 false로 업데이트
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
        <div className="justify-center hidden mt-4 space-x-6 md:flex">
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
                {profileName}님 환영합니다!
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

        <div className="flex flex-col items-center mt-4 space-y-2 md:hidden">
          <div className="relative">
            <a href="/wiki" className="text-white hover:text-gray-400">
              캡스위키
            </a>
          </div>
          <div className="relative">
            {isLoggedIn ? (
              <a href="/mypage" className="text-white hover:text-gray-400">
                {profileName}님 환영합니다!
              </a>
            ) : (
              <a
                href="/login"
                onClick={loginSession}
                className="text-white hover:text-gray-400"
              >
                LOGIN
              </a>
            )}
          </div>
          <div className="relative">
            {isLoggedIn ? (
              <a
                href="#"
                className="text-white hover:text-gray-400"
                onClick={Logout}
              >
                LOGOUT
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
