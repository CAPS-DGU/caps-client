import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from '../assets/logo-bright.png';
import { Link } from "react-router-dom";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, completeRegistration, isLoggedIn, isLoading, error, checkLoginStatus, manualLogout } = useAuth();

  useEffect(() => {
    if (!completeRegistration && isLoggedIn) {
      navigate("/onboarding")
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

  return (
    <nav className="p-4 bg-black">
      <div className="container mx-auto">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/" className="block">
            <img
              src={logo}
              alt="Logo"
              className="h-12 mx-auto"
            />
          </Link>
        </div>

        {/* Menu Items for Desktop */}
        <div className="justify-center mt-4 space-x-6 flex">
          <div className="relative">
            <Link to="/wiki" className="text-white hover:text-gray-400">
              캡스위키
            </Link>
          </div>

          {/*로그인*/}
          <div className="relative">
            {isLoggedIn ? (
              <Link
                to="/mypage"
                className="text-white hover:text-gray-400"
                onMouseEnter={() => toggleDropdown(4)}
              >
                {user &&
                  <>{user.member.grade}기 {user.member.name}님 환영합니다!</>
                }
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-gray-400"
              >
                LOGIN
              </Link>
            )}
            {dropdownOpen === 4 && (
              <div className="absolute z-50 w-40 py-2 mt-2 bg-white rounded-lg shadow-xl">
                <Link
                  to="#"
                  className="block px-4 py-2 text-xs text-gray-800 hover:bg-gray-200"
                  onClick={Logout}
                >
                  LOGOUT
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
