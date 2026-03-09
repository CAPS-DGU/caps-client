import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn, isLoading } = useAuth();

  // 아직 로그인 체크 중이면 아무 것도 렌더링하지 않음
  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    alert("잘못된 접근입니다.");
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

